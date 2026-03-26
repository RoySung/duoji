import {
  changeTransactionDraftType,
  createTransactionDraft,
  formatTransactionDateValue,
  parseTransactionDateValue,
} from '../src/utils/transactionUtils'
import { accountBookList } from '../src/mocks/accountBook'
import { userList } from '../src/mocks/user'
import { expenseCategoryList, incomeCategoryList } from '../src/mocks'

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

  it('prefills new income drafts with the active account-book owner as the recipient', () => {
    const incomeDraft = createTransactionDraft({
      type: 'income',
      accountBookId: '1',
      accountBooks: accountBookList,
    })

    expect(incomeDraft.receivedByUserId).toBe('1')
    expect(incomeDraft.paidByDetail).toEqual([
      {
        user: userList[0],
        amount: 0,
      },
    ])
    expect(incomeDraft.splitDetail).toEqual([
      {
        user: userList[0],
        amount: 0,
      },
    ])
  })

  it('resolves an income recipient when changing an expense draft to income', () => {
    const expenseDraft = createTransactionDraft({
      type: 'expense',
      accountBookId: '2',
      accountBooks: accountBookList,
    })

    const incomeDraft = changeTransactionDraftType(
      expenseDraft,
      'income',
      accountBookList
    )

    expect(incomeDraft.receivedByUserId).toBe('1')
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
    tags: [],
    paidByDetail: [{ user: userList[0]!, amount: 100 }],
    splitDetail: [{ user: userList[0]!, amount: 100 }],
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
