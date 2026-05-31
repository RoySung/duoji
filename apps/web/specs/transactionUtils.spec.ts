import {
  changeTransactionDraftType,
  createTransactionDraft,
  formatTransactionDateValue,
  parseTransactionDateValue,
  resolveIncomeRecipientId,
} from '../src/utils/transactionUtils'
import { UNSETTLED_SETTLEMENT_RECORD_ID } from '../src/entities/transaction'
import { accountBookList } from '../src/mocks/accountBook'
import { userList } from './fixtures'
import { expenseCategoryList, incomeCategoryList } from './fixtures'
import { User, VirtualUser } from '../src/entities/user'

const mockUsers: User[] = userList.map((user) => ({
  ...user,
  type: 'registered' as const,
}))

describe('transactionUtils date helpers', () => {
  it('parses stored transaction dates without using the native Date parser', () => {
    const parsedDate = parseTransactionDateValue('2026/03/18')

    expect(parsedDate.toString()).toBe('2026-03-18')
  })

  it('formats parsed date values back into the stored transaction format', () => {
    const parsedDate = parseTransactionDateValue('2026/03/18')

    expect(
      formatTransactionDateValue(
        parsedDate,
        new Date('2026-03-19T00:00:00.000Z')
      )
    ).toBe('2026/03/18')
  })

  it('uses the provided fallback date when the date picker clears its value', () => {
    expect(
      formatTransactionDateValue(null, new Date('2026-03-19T08:30:00.000Z'))
    ).toBe('2026/03/19')
  })

  it('prefills new income drafts with the first person as the recipient', () => {
    const incomeDraft = createTransactionDraft({
      type: 'income',
      accountBookId: '1',
      accountBooks: accountBookList,
      users: mockUsers,
    })

    expect(incomeDraft.receivedByUserId).toBe(userList[0]!.id)
    expect(incomeDraft.paidByDetail).toEqual([
      {
        userId: userList[0]!.id,
        userType: 'registered',
        amount: 0,
      },
    ])
    expect(incomeDraft.splitDetail).toEqual([
      {
        userId: userList[0]!.id,
        userType: 'registered',
        amount: 0,
      },
    ])
  })

  it('resolves an income recipient when changing an expense draft to income', () => {
    const expenseDraft = createTransactionDraft({
      type: 'expense',
      accountBookId: '2',
      accountBooks: accountBookList,
      users: mockUsers,
    })

    const incomeDraft = changeTransactionDraftType(
      expenseDraft,
      'income',
      accountBookList,
      mockUsers
    )

    expect(incomeDraft.receivedByUserId).toBe(userList[0]!.id)
  })

  it('uses the unsettled sentinel for newly created drafts', () => {
    const expenseDraft = createTransactionDraft({
      type: 'expense',
      accountBookId: '1',
      accountBooks: accountBookList,
      users: mockUsers,
    })

    expect(expenseDraft.settlementRecordId).toBe(UNSETTLED_SETTLEMENT_RECORD_ID)
  })
})

describe('create vs. edit selector behavior for deleted virtual users', () => {
  const deletedVirtualUser: VirtualUser = {
    id: 'vu-deleted',
    name: 'DeletedMember',
    accountBookId: '1',
    createdAt: 0,
    updatedAt: 1000,
    deletedAt: 1000,
  }
  const deletedUser: User = { ...deletedVirtualUser, type: 'virtual' }
  const activeUser: User = { ...userList[0]!, type: 'registered' }
  const allUsers: User[] = [activeUser, deletedUser]
  const activeUsers: User[] = [activeUser]

  const baseExpenseWithDeletedPayer = {
    id: 'tx-edit',
    type: 'expense' as const,
    amount: 200,
    accountBookId: '1',
    categoryId: '1-1',
    date: '2026/03/24',
    description: '',
    paymentMethod: 'Cash' as const,
    receivedByUserId: null,
    settlementRecordId: UNSETTLED_SETTLEMENT_RECORD_ID,
    tags: [],
    paidByDetail: [
      { userId: 'vu-deleted', userType: 'virtual' as const, amount: 200 },
    ],
    splitDetail: [
      { userId: 'vu-deleted', userType: 'virtual' as const, amount: 200 },
    ],
    createdAt: 0,
    updatedAt: 0,
    deletedAt: null,
  }

  it('create mode draft uses activeUsers — deleted VU paidByDetail is empty for new transaction', () => {
    const draft = createTransactionDraft({
      type: 'expense',
      accountBookId: '1',
      users: activeUsers, // only active users, as used in create mode
    })

    // No deleted person in the draft details
    const hasDeletedUser = draft.paidByDetail.some(
      (d) => d.userId === 'vu-deleted'
    )
    expect(hasDeletedUser).toBe(false)
  })

  it('edit mode draft preserves deleted VU already present on the transaction', () => {
    const draft = createTransactionDraft({
      baseTransaction: baseExpenseWithDeletedPayer,
      users: allUsers, // all users including deleted, as used in edit mode
    })

    // Deleted person should still be in paidByDetail (preserved from original)
    const hasDeletedUser = draft.paidByDetail.some(
      (d) => d.userId === 'vu-deleted'
    )
    expect(hasDeletedUser).toBe(true)
  })

  it('resolveIncomeRecipientId retains deleted recipient when already set', () => {
    const baseIncomeWithDeletedRecipient = {
      id: 'tx-income-deleted',
      type: 'income' as const,
      amount: 500,
      accountBookId: '1',
      categoryId: '101-1',
      date: '2026/03/24',
      description: '',
      paymentMethod: 'Cash' as const,
      receivedByUserId: 'vu-deleted',
      settlementRecordId: UNSETTLED_SETTLEMENT_RECORD_ID,
      tags: [],
      paidByDetail: [
        { userId: 'vu-deleted', userType: 'virtual' as const, amount: 500 },
      ],
      splitDetail: [
        { userId: 'vu-deleted', userType: 'virtual' as const, amount: 500 },
      ],
      createdAt: 0,
      updatedAt: 0,
      deletedAt: null,
    }

    // In edit mode, allUsers is passed — resolveIncomeRecipientId should keep the deleted recipient
    const resolvedId = resolveIncomeRecipientId({
      users: allUsers,
      accountBookId: '1',
      receivedByUserId: baseIncomeWithDeletedRecipient.receivedByUserId,
    })

    expect(resolvedId).toBe('vu-deleted')
  })

  it('resolveIncomeRecipientId falls back to first active user when deleted recipient not in allUsers', () => {
    // If deleted VU is not even in allUsers (edge case), falls back to first user
    const resolvedId = resolveIncomeRecipientId({
      users: activeUsers,
      accountBookId: '1',
      receivedByUserId: 'vu-deleted',
    })

    expect(resolvedId).toBe(activeUser.id)
  })
})

describe('resolveTransactionCategoryId via createTransactionDraft', () => {
  const baseExpenseTransaction = {
    id: 'tx-1',
    type: 'expense' as const,
    amount: 100,
    accountBookId: '1',
    categoryId: '1-1',
    date: '2026/03/24',
    description: '',
    paymentMethod: 'Cash' as const,
    receivedByUserId: null,
    settlementRecordId: UNSETTLED_SETTLEMENT_RECORD_ID,
    tags: [],
    paidByDetail: [
      { userId: userList[0]!.id, userType: 'registered' as const, amount: 100 },
    ],
    splitDetail: [
      { userId: userList[0]!.id, userType: 'registered' as const, amount: 100 },
    ],
    createdAt: 0,
    updatedAt: 0,
    deletedAt: null,
  }

  it('preserves the existing categoryId when it exists in the provided categories', () => {
    const draft = createTransactionDraft({
      baseTransaction: baseExpenseTransaction,
      categories: expenseCategoryList,
    })

    expect(draft.categoryId).toBe('1-1')
  })

  it('returns empty string when the existing categoryId does not exist in the provided categories', () => {
    const draft = createTransactionDraft({
      baseTransaction: {
        ...baseExpenseTransaction,
        categoryId: 'deleted-category-id',
      },
      categories: expenseCategoryList,
    })

    expect(draft.categoryId).toBe('')
  })

  it('returns empty string when categoryId is empty', () => {
    const draft = createTransactionDraft({
      baseTransaction: { ...baseExpenseTransaction, categoryId: '' },
      categories: expenseCategoryList,
    })

    expect(draft.categoryId).toBe('')
  })

  it('falls back to default category when switching from expense to income type', () => {
    const incomeCategory = incomeCategoryList[1]!
    // Verify the income category actually exists in incomeCategoryList
    // When changing type, a valid expense categoryId should resolve to a default income category
    const draft = createTransactionDraft({
      baseTransaction: baseExpenseTransaction,
      type: 'income',
      categories: [...expenseCategoryList, ...incomeCategoryList],
    })

    expect(draft.categoryId).not.toBe('')
    expect(draft.type).toBe('income')
    // The resolved categoryId should be an income category
    const resolvedCategory = incomeCategoryList.find(
      (c) => c.id === draft.categoryId
    )
    expect(resolvedCategory).toBeDefined()
  })
})
