/// <reference types="jest" />

import { fireEvent, render, screen } from '@testing-library/react'
import ReportCategoryBreakdown from '../src/components/report/ReportCategoryBreakdown'
import type { CategorySummary } from '../src/components/report/reportTypes'

jest.mock('@heroui/react', () => ({
  Avatar: ({ name }: any) => <div>{name}</div>,
  Tabs: ({ children, onSelectionChange, selectedKey }: any) => (
    <div>
      {Array.from(children).map((child: any) => {
        const key = String(child.key ?? '').replace(/^[.$]+/, '')
        return (
          <button
            key={key}
            type="button"
            aria-pressed={selectedKey === key}
            onClick={() => onSelectionChange?.(key)}
          >
            {child.props.title}
          </button>
        )
      })}
    </div>
  ),
  Tab: () => null,
}))

jest.mock('../src/components/report/ReportApexChart', () => ({
  __esModule: true,
  default: () => <div data-testid="apex-chart" />,
}))

jest.mock('../src/components/report/CategoryTransactionsModal', () => ({
  __esModule: true,
  default: ({ summary, isOpen }: any) =>
    isOpen ? <div data-testid="category-modal">{summary?.totalAmount}</div> : null,
}))

describe('ReportCategoryBreakdown', () => {
  it('shows an empty state when every category in the active tab is excluded', () => {
    const expense: CategorySummary[] = [
      {
        key: 'name::expense::Food',
        displayName: 'Food',
        imageUrl: null,
        totalAmount: 300,
        transactionCount: 2,
        percentage: 100,
        transactions: [],
      },
    ]

    render(
      <ReportCategoryBreakdown
        expense={expense}
        income={[]}
        currency="TWD"
        excludedKeys={new Set(['name::expense::Food'])}
        onToggleKey={jest.fn()}
      />
    )

    expect(screen.queryByText('No expense categories in range')).not.toBeNull()
    expect(screen.queryByText('Food')).not.toBeNull()
    expect(screen.queryByTestId('apex-chart')).toBeNull()
  })

  it('renders only the summaries passed from the tag-scoped report dataset', () => {
    const expense: CategorySummary[] = [
      {
        key: 'name::expense::Food',
        displayName: 'Food',
        imageUrl: null,
        totalAmount: 300,
        transactionCount: 2,
        percentage: 75,
        transactions: [],
      },
      {
        key: 'name::expense::Utilities',
        displayName: 'Utilities',
        imageUrl: null,
        totalAmount: 100,
        transactionCount: 1,
        percentage: 25,
        transactions: [],
      },
    ]

    render(
      <ReportCategoryBreakdown
        expense={expense}
        income={[]}
        currency="TWD"
        excludedKeys={new Set()}
        onToggleKey={jest.fn()}
      />
    )

    expect(screen.queryByText('Food')).not.toBeNull()
    expect(screen.queryByText('Utilities')).not.toBeNull()
    expect(screen.queryByText('Transport')).toBeNull()
  })

  it('updates modal content reactively when expense prop updates', () => {
    const initialExpense: CategorySummary[] = [
      {
        key: 'name::expense::Food',
        displayName: 'Food',
        imageUrl: null,
        totalAmount: 300,
        transactionCount: 2,
        percentage: 100,
        transactions: [],
      },
    ]

    const { rerender } = render(
      <ReportCategoryBreakdown
        expense={initialExpense}
        income={[]}
        currency="TWD"
        excludedKeys={new Set()}
        onToggleKey={jest.fn()}
      />
    )

    // Open modal by clicking the view transactions button for Food
    const viewButton = screen.getByRole('button', { name: /view transactions/i })
    fireEvent.click(viewButton)

    expect(screen.getByTestId('category-modal').textContent).toBe('300')

    // Simulate update to expense prop after transaction edit
    const updatedExpense: CategorySummary[] = [
      {
        key: 'name::expense::Food',
        displayName: 'Food',
        imageUrl: null,
        totalAmount: 500,
        transactionCount: 3,
        percentage: 100,
        transactions: [],
      },
    ]

    rerender(
      <ReportCategoryBreakdown
        expense={updatedExpense}
        income={[]}
        currency="TWD"
        excludedKeys={new Set()}
        onToggleKey={jest.fn()}
      />
    )

    expect(screen.getByTestId('category-modal').textContent).toBe('500')
  })
})
