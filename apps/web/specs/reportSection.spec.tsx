/// <reference types="jest" />

import { render, screen } from '@testing-library/react'
import ReportSection from '../src/components/report/ReportSection'
import { Category } from '../src/entities/category'
import {
  DefaultPaymentMethod,
  Transaction,
  UNSETTLED_SETTLEMENT_RECORD_ID,
} from '../src/entities/transaction'

jest.mock('../src/components/report/ReportSummaryCards', () => ({
  __esModule: true,
  default: ({ totals }: any) => (
    <div data-testid="summary-totals">{JSON.stringify(totals)}</div>
  ),
}))

jest.mock('../src/components/report/ReportCategoryBreakdown', () => ({
  __esModule: true,
  default: ({ expense, income }: any) => (
    <div data-testid="category-breakdown">
      {JSON.stringify({
        expense: expense.map((item: any) => item.displayName),
        income: income.map((item: any) => item.displayName),
      })}
    </div>
  ),
}))

jest.mock('../src/components/report/ReportMonthlyTrend', () => ({
  __esModule: true,
  default: ({ points }: any) => (
    <div data-testid="monthly-trend">{JSON.stringify(points)}</div>
  ),
}))

function makeTransaction(overrides: Partial<Transaction>): Transaction {
  return {
    id: 'tx-1',
    type: 'expense',
    accountBookId: 'book-1',
    categoryId: 'cat-expense',
    amount: 100,
    date: '2026/05/01',
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

function makeCategory(overrides: Partial<Category>): Category {
  return {
    id: 'cat-expense',
    name: 'Food',
    description: '',
    type: 'expense',
    imageUrl: 'https://example.com/category.png',
    parentId: null,
    accountBookId: 'book-1',
    sortOrder: 0,
    ...overrides,
  }
}

describe('ReportSection', () => {
  it('does not exclude same-name categories from the other transaction type', () => {
    const categories = [
      makeCategory({ id: 'cat-expense', name: 'Food', type: 'expense' }),
      makeCategory({ id: 'cat-income', name: 'Food', type: 'income' }),
    ]

    const transactions = [
      makeTransaction({
        id: 'tx-expense',
        type: 'expense',
        categoryId: 'cat-expense',
        amount: 200,
      }),
      makeTransaction({
        id: 'tx-income',
        type: 'income',
        categoryId: 'cat-income',
        amount: 700,
      }),
    ]

    render(
      <ReportSection
        transactions={transactions}
        categories={categories}
        mergeByName
        currency="TWD"
        selectedTags={new Set()}
        excludedKeys={new Set(['name::expense::Food'])}
        onToggleKey={jest.fn()}
      />
    )

    expect(screen.getByTestId('summary-totals').textContent).toContain(
      JSON.stringify({ income: 700, expense: 0, net: 700 })
    )
  })

  it('keeps untagged transactions and any matching selected tags in totals', () => {
    const categories = [makeCategory({ id: 'cat-expense', name: 'Food' })]

    const transactions = [
      makeTransaction({
        id: 'tx-alpha',
        amount: 200,
        tags: ['alpha'],
      }),
      makeTransaction({
        id: 'tx-income',
        type: 'income',
        categoryId: 'cat-income',
        amount: 700,
        tags: ['beta'],
      }),
      makeTransaction({
        id: 'tx-untagged',
        amount: 50,
        tags: [],
      }),
    ]

    render(
      <ReportSection
        transactions={transactions}
        categories={categories}
        mergeByName={false}
        currency="TWD"
        selectedTags={new Set(['alpha'])}
        excludedKeys={new Set()}
        onToggleKey={jest.fn()}
      />
    )

    expect(screen.getByTestId('summary-totals').textContent).toContain(
      JSON.stringify({ income: 0, expense: 250, net: -250 })
    )
  })

  it('applies category exclusion after tag filtering', () => {
    const categories = [
      makeCategory({ id: 'cat-food', name: 'Food' }),
      makeCategory({ id: 'cat-transport', name: 'Transport' }),
    ]

    const transactions = [
      makeTransaction({
        id: 'tx-food',
        categoryId: 'cat-food',
        amount: 200,
        tags: ['alpha'],
      }),
      makeTransaction({
        id: 'tx-transport',
        categoryId: 'cat-transport',
        amount: 50,
        tags: ['alpha'],
      }),
      makeTransaction({
        id: 'tx-hidden',
        categoryId: 'cat-food',
        amount: 999,
        tags: ['beta'],
      }),
    ]

    render(
      <ReportSection
        transactions={transactions}
        categories={categories}
        mergeByName={false}
        currency="TWD"
        selectedTags={new Set(['alpha'])}
        excludedKeys={new Set(['id::expense::cat-food'])}
        onToggleKey={jest.fn()}
      />
    )

    expect(screen.getByTestId('summary-totals').textContent).toContain(
      JSON.stringify({ income: 0, expense: 50, net: -50 })
    )
  })

  it('passes only the tag-scoped dataset to the category breakdown', () => {
    const categories = [
      makeCategory({ id: 'cat-food', name: 'Food' }),
      makeCategory({ id: 'cat-transport', name: 'Transport' }),
      makeCategory({ id: 'cat-utilities', name: 'Utilities' }),
    ]

    const transactions = [
      makeTransaction({
        id: 'tx-food',
        categoryId: 'cat-food',
        amount: 200,
        tags: ['alpha'],
      }),
      makeTransaction({
        id: 'tx-transport',
        categoryId: 'cat-transport',
        amount: 50,
        tags: ['beta'],
      }),
      makeTransaction({
        id: 'tx-untagged',
        categoryId: 'cat-utilities',
        amount: 30,
        tags: [],
      }),
    ]

    render(
      <ReportSection
        transactions={transactions}
        categories={categories}
        mergeByName={false}
        currency="TWD"
        selectedTags={new Set(['alpha'])}
        excludedKeys={new Set()}
        onToggleKey={jest.fn()}
      />
    )

    expect(screen.getByTestId('category-breakdown').textContent).toContain(
      JSON.stringify({ expense: ['Food', 'Utilities'], income: [] })
    )
  })

  it('passes only the tag-scoped dataset to the monthly trend', () => {
    const categories = [makeCategory({ id: 'cat-food', name: 'Food' })]

    const transactions = [
      makeTransaction({
        id: 'tx-alpha',
        amount: 200,
        date: '2026/05/01',
        tags: ['alpha'],
      }),
      makeTransaction({
        id: 'tx-beta',
        amount: 999,
        date: '2026/05/02',
        tags: ['beta'],
      }),
      makeTransaction({
        id: 'tx-untagged',
        amount: 50,
        date: '2026/06/01',
        tags: [],
      }),
    ]

    render(
      <ReportSection
        transactions={transactions}
        categories={categories}
        mergeByName={false}
        currency="TWD"
        selectedTags={new Set(['alpha'])}
        excludedKeys={new Set()}
        onToggleKey={jest.fn()}
      />
    )

    expect(screen.getByTestId('monthly-trend').textContent).toContain(
      JSON.stringify([
        { month: '2026/05', income: 0, expense: 200 },
        { month: '2026/06', income: 0, expense: 50 },
      ])
    )
  })
})
