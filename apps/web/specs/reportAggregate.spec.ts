/// <reference types="jest" />

import { formatAmount } from '../src/utils/amountUtils'
import {
  getCategoryDescendantKeysByRoot,
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

function makeCategory(
  id: string,
  name: string,
  overrides: Partial<Category> = {}
): Category {
  return {
    id,
    name,
    description: '',
    type: 'expense',
    imageUrl: 'https://example.com/category.png',
    parentId: null,
    accountBookId: 'ab-1',
    sortOrder: 0,
    ...overrides,
  }
}

// ─── formatAmount ─────────────────────────────────────────────────────────────

describe('formatAmount', () => {
  it('rounds to integer when roundMode round is specified', () => {
    expect(formatAmount(1234.7, 'TWD', { roundMode: 'round' })).toBe(
      '1,235 TWD'
    )
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

  it('rolls direct and child transactions into sorted root summaries', () => {
    const hierarchicalCategories = [
      makeCategory('food', 'Food'),
      makeCategory('dining', 'Dining', { parentId: 'food' }),
      makeCategory('groceries', 'Groceries', { parentId: 'food' }),
      makeCategory('transport', 'Transport'),
      makeCategory('transit', 'Transit', { parentId: 'transport' }),
    ]
    const txs = [
      makeTx({ id: 'food-direct', categoryId: 'food', amount: 120 }),
      makeTx({ id: 'dining', categoryId: 'dining', amount: 300 }),
      makeTx({ id: 'groceries', categoryId: 'groceries', amount: 80 }),
      makeTx({ id: 'transit', categoryId: 'transit', amount: 200 }),
    ]

    const result = groupByCategory(txs, hierarchicalCategories, 'expense', {
      mergeByName: false,
    })

    expect(result.map((summary) => summary.displayName)).toEqual([
      'Food',
      'Transport',
    ])
    const food = result[0]
    expect(food).toMatchObject({
      key: 'id::expense::food',
      totalAmount: 500,
      transactionCount: 3,
      directAmount: 120,
      directTransactionCount: 1,
    })
    expect(food.transactions.map((transaction) => transaction.id)).toEqual([
      'food-direct',
      'dining',
      'groceries',
    ])
    expect(
      food.directTransactions.map((transaction) => transaction.id)
    ).toEqual(['food-direct'])
    expect(food.children.map((child) => child.displayName)).toEqual([
      'Dining',
      'Groceries',
    ])
    expect(food.children[0]).toMatchObject({
      totalAmount: 300,
      transactionCount: 1,
      directAmount: 300,
      directTransactionCount: 1,
      children: [],
    })
    expect(
      food.children[0].directTransactions.map(
        (transaction) => transaction.id
      )
    ).toEqual(['dining'])
    expect(food.percentage).toBeCloseTo((500 / 700) * 100)
    expect(food.children[0].percentage).toBeCloseTo((300 / 700) * 100)
  })

  it('merges all-books children by name only within their merged root', () => {
    const hierarchicalCategories = [
      makeCategory('food-a', 'Food', { accountBookId: 'ab-1' }),
      makeCategory('dining-a', 'Dining', {
        parentId: 'food-a',
        accountBookId: 'ab-1',
      }),
      makeCategory('food-b', 'Food', { accountBookId: 'ab-2' }),
      makeCategory('dining-b', 'Dining', {
        parentId: 'food-b',
        accountBookId: 'ab-2',
      }),
      makeCategory('travel', 'Travel', { accountBookId: 'ab-1' }),
      makeCategory('travel-dining', 'Dining', {
        parentId: 'travel',
        accountBookId: 'ab-1',
      }),
    ]
    const txs = [
      makeTx({ id: 'food-a', categoryId: 'dining-a', amount: 80 }),
      makeTx({ id: 'food-b', categoryId: 'dining-b', amount: 120 }),
      makeTx({ id: 'travel', categoryId: 'travel-dining', amount: 60 }),
    ]

    const result = groupByCategory(txs, hierarchicalCategories, 'expense', {
      mergeByName: true,
    })

    expect(result).toHaveLength(2)
    const food = result.find((summary) => summary.displayName === 'Food')!
    const travel = result.find((summary) => summary.displayName === 'Travel')!
    expect(food.key).toBe('name::expense::Food')
    expect(food.totalAmount).toBe(200)
    expect(food.children).toHaveLength(1)
    expect(food.children[0]).toMatchObject({
      key: 'name::expense::Food::Dining',
      displayName: 'Dining',
      totalAmount: 200,
    })
    expect(travel.children).toHaveLength(1)
    expect(travel.children[0].key).toBe('name::expense::Travel::Dining')
  })

  it('groups all unknown category ids into one Uncategorized root', () => {
    const txs = [
      makeTx({ id: 'a', categoryId: 'unknown-1', amount: 50 }),
      makeTx({ id: 'b', categoryId: 'unknown-2', amount: 60 }),
    ]
    const result = groupByCategory(txs, [], 'expense', { mergeByName: false })
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      key: 'uncategorized::expense',
      displayName: 'Uncategorized',
      totalAmount: 110,
      transactionCount: 2,
      directAmount: 110,
      directTransactionCount: 2,
      children: [],
    })
  })

  it('falls back safely when a known category has a missing or cyclic parent', () => {
    const malformedCategories = [
      makeCategory('orphan', 'Orphan', { parentId: 'missing' }),
      makeCategory('cycle-a', 'Cycle A', { parentId: 'cycle-b' }),
      makeCategory('cycle-b', 'Cycle B', { parentId: 'cycle-a' }),
    ]
    const txs = [
      makeTx({ id: 'orphan-tx', categoryId: 'orphan', amount: 40 }),
      makeTx({ id: 'cycle-tx', categoryId: 'cycle-a', amount: 70 }),
    ]

    const result = groupByCategory(txs, malformedCategories, 'expense', {
      mergeByName: false,
    })

    expect(result.map((summary) => summary.displayName)).toEqual([
      'Cycle A',
      'Orphan',
    ])
    result.forEach((summary) => {
      expect(summary.children).toEqual([])
      expect(summary.directAmount).toBe(summary.totalAmount)
      expect(summary.directTransactionCount).toBe(summary.transactionCount)
    })
  })

  it('keeps malformed categories separate from same-name valid roots', () => {
    const malformedCategories = [
      makeCategory('food', 'Food'),
      makeCategory('orphan-food', 'Food', { parentId: 'missing' }),
    ]
    const txs = [
      makeTx({ id: 'valid', categoryId: 'food', amount: 100 }),
      makeTx({ id: 'orphan', categoryId: 'orphan-food', amount: 50 }),
    ]

    const result = groupByCategory(txs, malformedCategories, 'expense', {
      mergeByName: true,
    })

    expect(result).toHaveLength(2)
    expect(result.map((summary) => summary.key)).toEqual([
      'name::expense::Food',
      'malformed::expense::orphan-food',
    ])
    expect(result.map((summary) => summary.totalAmount)).toEqual([100, 50])
  })

  it('encodes merged hierarchy segments so distinct paths cannot share a key', () => {
    const delimiterCategories = [
      makeCategory('root-a', 'A::B'),
      makeCategory('child-a', 'C', { parentId: 'root-a' }),
      makeCategory('root-b', 'A'),
      makeCategory('child-b', 'B::C', { parentId: 'root-b' }),
    ]
    const txs = [
      makeTx({ id: 'path-a', categoryId: 'child-a', amount: 100 }),
      makeTx({ id: 'path-b', categoryId: 'child-b', amount: 90 }),
    ]

    const result = groupByCategory(txs, delimiterCategories, 'expense', {
      mergeByName: true,
    })
    const childKeys = result.map((summary) => summary.children[0].key)

    expect(childKeys).toEqual([
      'name::expense::A%3A%3AB::C',
      'name::expense::A::B%3A%3AC',
    ])
    expect(new Set(childKeys)).toHaveProperty('size', 2)
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

describe('getCategoryDescendantKeysByRoot', () => {
  it('indexes every valid descendant independently of transaction scope', () => {
    const categories = [
      makeCategory('food', 'Food'),
      makeCategory('dining', 'Dining', { parentId: 'food' }),
      makeCategory('late-night', 'Late Night', { parentId: 'dining' }),
      makeCategory('orphan', 'Orphan', { parentId: 'missing' }),
    ]

    const result = getCategoryDescendantKeysByRoot(categories, false)

    expect(Array.from(result.get('id::expense::food') ?? [])).toEqual([
      'id::expense::dining',
      'id::expense::late-night',
    ])
    expect(result.has('id::expense::orphan')).toBe(false)
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
