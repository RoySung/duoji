import {
  changeTransactionDraftType,
  createTransactionDraft,
  formatTransactionDateValue,
  parseTransactionDateValue,
} from '../src/utils/transactionUtils'
import { accountBookList } from '../src/mocks/accountBook'
import { userList } from '../src/mocks/user'

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
