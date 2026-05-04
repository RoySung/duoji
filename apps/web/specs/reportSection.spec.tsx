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
  default: () => <div data-testid="category-breakdown" />,
}))

jest.mock('../src/components/report/ReportMonthlyTrend', () => ({
  __esModule: true,
  default: () => <div data-testid="monthly-trend" />,
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
        excludedKeys={new Set(['name::expense::Food'])}
        onToggleKey={jest.fn()}
      />
    )

    expect(screen.getByTestId('summary-totals').textContent).toContain(
      JSON.stringify({ income: 700, expense: 0, net: 700 })
    )
  })
})
