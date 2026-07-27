/// <reference types="jest" />

import { formatAmount } from '../src/utils/amountUtils'
import {
  groupByCurrency,
  groupByCategory,
  groupByMonth,
  summarize,
} from '../src/utils/reportAggregate'
import {
  DefaultPaymentMethod,
  Transaction,
  UNSETTLED_SETTLEMENT_RECORD_ID,
} from '../src/entities/transaction'
import { AccountBook } from '../src/entities/accountBook'
import { Category } from '../src/entities/category'

function makeTx(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 'tx-1',
    type: 'expense',
    accountBookId: 'ab-1',
    categoryId: 'cat-1',
    amount: 100,
    date: '2026/01/15',
    description: '',
    paymentMethod: DefaultPaymentMethod,
    receivedByUserId: null,
    settlementRecordId: UNSETTLED_SETTLEMENT_RECORD_ID,
    tags: [],
    paidByDetail: [],
    splitDetail: [],
    createdAt: 0,
    updatedAt: 0,
    deletedAt: null,
    ...overrides,
  }
}

function makeBook(id: string, currency: 'TWD' | 'JPY' | 'USD'): AccountBook {
  return {
    id,
    name: id,
    currency,
    description: '',
    createdAt: 0,
    updatedAt: 0,
    ownerId: 'u1',
    userIds: ['u1'],
    virtualUsers: [],
  }
}

function makeCategory(id: string, name: string): Category {
  return {
    id,
    name,
    description: '',
    type: 'expense',
    imageUrl: 'https://example.com/category.png',
    parentId: null,
    accountBookId: 'ab-1',
    sortOrder: 0,
  }
}

// ─── formatAmount ─────────────────────────────────────────────────────────────

describe('formatAmount', () => {
  it('rounds to integer when roundMode round is specified', () => {
    expect(formatAmount(1234.7, 'TWD', { roundMode: 'round' })).toBe('1,235 TWD')
  })

  it('returns 0 for zero', () => {
    expect(formatAmount(0, 'TWD')).toBe('0 TWD')
  })
})

// ─── summarize ────────────────────────────────────────────────────────────────

describe('summarize', () => {
  it('sums income and expense, computes net', () => {
    const txs = [
      makeTx({ type: 'income', amount: 500 }),
      makeTx({ type: 'expense', amount: 200 }),
      makeTx({ type: 'expense', amount: 50 }),
    ]
    expect(summarize(txs)).toEqual({ income: 500, expense: 250, net: 250 })
  })

  it('returns zeros for empty list', () => {
    expect(summarize([])).toEqual({ income: 0, expense: 0, net: 0 })
  })

  it('net is negative when expense exceeds income', () => {
    const txs = [
      makeTx({ type: 'income', amount: 100 }),
      makeTx({ type: 'expense', amount: 300 }),
    ]
    expect(summarize(txs).net).toBe(-200)
  })
})

// ─── groupByCategory ──────────────────────────────────────────────────────────

describe('groupByCategory', () => {
  const categories = [
    makeCategory('cat-1', 'Food'),
    makeCategory('cat-2', 'Transport'),
  ]

  it('groups by category id when mergeByName is false', () => {
    const txs = [
      makeTx({ id: 'a', categoryId: 'cat-1', amount: 100 }),
      makeTx({ id: 'b', categoryId: 'cat-1', amount: 50 }),
      makeTx({ id: 'c', categoryId: 'cat-2', amount: 200 }),
    ]
    const result = groupByCategory(txs, categories, 'expense', {
      mergeByName: false,
    })
    expect(result).toHaveLength(2)
    const food = result.find((r) => r.displayName === 'Food')!
    expect(food.totalAmount).toBe(150)
    expect(food.transactionCount).toBe(2)
    expect(food.percentage).toBeCloseTo((150 / 350) * 100)
  })

  it('merges across account books by name when mergeByName is true', () => {
    const categories2 = [
      makeCategory('cat-A', 'Food'),
      makeCategory('cat-B', 'Food'),
    ]
    const txs = [
      makeTx({ id: 'a', categoryId: 'cat-A', amount: 80 }),
      makeTx({ id: 'b', categoryId: 'cat-B', amount: 120 }),
    ]
    const result = groupByCategory(txs, categories2, 'expense', {
      mergeByName: true,
    })
    expect(result).toHaveLength(1)
    expect(result[0].totalAmount).toBe(200)
    expect(result[0].displayName).toBe('Food')
  })

  it('groups unknown categories under Uncategorized separately per id', () => {
    const txs = [
      makeTx({ id: 'a', categoryId: 'unknown-1', amount: 50 }),
      makeTx({ id: 'b', categoryId: 'unknown-2', amount: 60 }),
    ]
    const result = groupByCategory(txs, [], 'expense', { mergeByName: false })
    expect(result).toHaveLength(2)
    result.forEach((r) => expect(r.displayName).toBe('Uncategorized'))
  })

  it('ignores transactions of the wrong type', () => {
    const txs = [
      makeTx({ type: 'income', amount: 1000 }),
      makeTx({ type: 'expense', amount: 200 }),
    ]
    const result = groupByCategory(txs, categories, 'expense', {
      mergeByName: false,
    })
    expect(result).toHaveLength(1)
    expect(result[0].totalAmount).toBe(200)
  })

  it('returns empty array when no matching transactions', () => {
    const result = groupByCategory([], categories, 'expense', {
      mergeByName: false,
    })
    expect(result).toHaveLength(0)
  })

  it('sorts by totalAmount descending', () => {
    const txs = [
      makeTx({ id: 'a', categoryId: 'cat-1', amount: 10 }),
      makeTx({ id: 'b', categoryId: 'cat-2', amount: 500 }),
    ]
    const result = groupByCategory(txs, categories, 'expense', {
      mergeByName: false,
    })
    expect(result[0].displayName).toBe('Transport')
  })
})

// ─── groupByMonth ─────────────────────────────────────────────────────────────

describe('groupByMonth', () => {
  it('buckets transactions by YYYY/MM and accumulates income/expense', () => {
    const txs = [
      makeTx({ type: 'income', amount: 1000, date: '2026/01/05' }),
      makeTx({ type: 'expense', amount: 300, date: '2026/01/20' }),
      makeTx({ type: 'expense', amount: 150, date: '2026/02/10' }),
    ]
    const result = groupByMonth(txs)
    expect(result).toHaveLength(2)
    const jan = result.find((r) => r.month === '2026/01')!
    expect(jan.income).toBe(1000)
    expect(jan.expense).toBe(300)
    const feb = result.find((r) => r.month === '2026/02')!
    expect(feb.expense).toBe(150)
    expect(feb.income).toBe(0)
  })

  it('sorts months chronologically', () => {
    const txs = [
      makeTx({ date: '2026/03/01' }),
      makeTx({ date: '2026/01/01' }),
      makeTx({ date: '2026/02/01' }),
    ]
    const months = groupByMonth(txs).map((r) => r.month)
    expect(months).toEqual(['2026/01', '2026/02', '2026/03'])
  })

  it('returns empty array for no transactions', () => {
    expect(groupByMonth([])).toHaveLength(0)
  })
})

// ─── groupByCurrency ──────────────────────────────────────────────────────────

describe('groupByCurrency', () => {
  const books = [makeBook('ab-1', 'TWD'), makeBook('ab-2', 'JPY')]

  it('groups transactions by the currency of their account book', () => {
    const txs = [
      makeTx({ accountBookId: 'ab-1', amount: 100 }),
      makeTx({ accountBookId: 'ab-1', amount: 200 }),
      makeTx({ accountBookId: 'ab-2', amount: 500 }),
    ]
    const result = groupByCurrency(txs, books)
    expect(result).toHaveLength(2)
    const twd = result.find((g) => g.currency === 'TWD')!
    expect(twd.transactions).toHaveLength(2)
    const jpy = result.find((g) => g.currency === 'JPY')!
    expect(jpy.transactions).toHaveLength(1)
  })

  it('silently drops transactions whose accountBookId is not in books', () => {
    const txs = [
      makeTx({ accountBookId: 'unknown', amount: 999 }),
      makeTx({ accountBookId: 'ab-1', amount: 100 }),
    ]
    const result = groupByCurrency(txs, books)
    expect(result).toHaveLength(1)
    expect(result[0].currency).toBe('TWD')
  })

  it('sorts groups by transaction count descending', () => {
    const txs = [
      makeTx({ accountBookId: 'ab-2' }),
      makeTx({ accountBookId: 'ab-1' }),
      makeTx({ accountBookId: 'ab-1' }),
    ]
    const result = groupByCurrency(txs, books)
    expect(result[0].currency).toBe('TWD')
  })

  it('returns empty array for empty inputs', () => {
    expect(groupByCurrency([], books)).toHaveLength(0)
    expect(groupByCurrency([], [])).toHaveLength(0)
  })
})
