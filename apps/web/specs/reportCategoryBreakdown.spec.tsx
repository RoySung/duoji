/// <reference types="jest" />

import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import ReportCategoryBreakdown from '../src/components/report/ReportCategoryBreakdown'
import type { CategorySummary } from '../src/components/report/reportTypes'

jest.mock('@heroui/react', () => ({
  Avatar: ({
    classNames,
    name,
  }: {
    classNames?: { img?: string }
    name: string
  }) => (
    <div data-image-class={classNames?.img} data-testid={`avatar-${name}`} />
  ),
  Tabs: ({
    children,
    onSelectionChange,
    selectedKey,
    className,
    classNames,
  }: {
    children: Array<ReactElement<{ title: ReactNode }>>
    onSelectionChange?: (key: string) => void
    selectedKey: string
    className?: string
    classNames?: { tabList?: string; tab?: string }
  }) => (
    <div data-testid="breakdown-tabs" className={className}>
      <div data-testid="breakdown-tab-list" className={classNames?.tabList}>
        {Array.from(children).map((child) => {
          const key = String(child.key ?? '').replace(/^[.$]+/, '')
          return (
            <button
              key={key}
              type="button"
              aria-pressed={selectedKey === key}
              className={classNames?.tab}
              onClick={() => onSelectionChange?.(key)}
            >
              {child.props.title}
            </button>
          )
        })}
      </div>
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
  default: ({
    summary,
    isOpen,
  }: {
    summary: CategorySummary | null
    isOpen: boolean
  }) =>
    isOpen ? (
      <div data-testid="category-modal">{summary?.totalAmount}</div>
    ) : null,
}))

describe('ReportCategoryBreakdown', () => {
  it('uses the shared compact surface and 44px category actions', () => {
    const expense: CategorySummary[] = [
      {
        key: 'name::expense::Food',
        displayName: 'A very long restaurant category name',
        imageUrl: 'https://example.com/restaurant.svg',
        totalAmount: 1234567,
        transactionCount: 2,
        percentage: 100,
        transactions: [],
      },
      {
        key: 'name::expense::Breakfast',
        displayName: 'Breakfast',
        imageUrl: null,
        totalAmount: 300,
        transactionCount: 1,
        percentage: 20,
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

    expect(
      screen.getByTestId('category-breakdown-surface').getAttribute('data-ui')
    ).toBe('surface-card')
    expect(
      screen.getByRole('heading', { name: 'Category breakdown' }).className
    ).toContain('text-title')
    expect(
      screen.getByText('Click a row to include or exclude').className
    ).toContain('text-body')
    expect(screen.getByTestId('breakdown-tabs').className).toContain('w-full')
    expect(screen.getByTestId('breakdown-tabs').className).toContain(
      'sm:w-auto'
    )
    expect(screen.getByTestId('breakdown-tab-list').className).toContain(
      'grid-cols-2'
    )
    const breakdownLayout = screen.getByTestId('apex-chart').parentElement
    expect(breakdownLayout?.className).toContain('h-[220px]')
    expect(breakdownLayout?.className).toContain('sm:h-[240px]')
    expect(breakdownLayout?.parentElement?.className).toContain(
      'md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]'
    )
    expect(screen.getByRole('button', { name: 'Expense' }).className).toContain(
      'min-h-11'
    )
    const categoryToggleRows = screen.getAllByTitle('Click to exclude')
    expect(categoryToggleRows).toHaveLength(2)
    for (const row of categoryToggleRows) {
      expect(row.className).toContain('min-h-14')
      expect(row.className).toContain('grid-cols-[auto_auto_minmax(0,1fr)]')
    }
    expect(
      screen.getByText('A very long restaurant category name').className
    ).toContain('text-body')
    expect(screen.getByText(/2 records/).className).toContain('text-label')
    expect(screen.getByText('1,234,567 TWD').className).toContain('text-body')
    expect(screen.queryByText('Breakfast')).not.toBeNull()
    expect(
      screen
        .getByTestId('avatar-A very long restaurant category name')
        .getAttribute('data-image-class')
    ).toContain('p-1')
    expect(screen.queryByTestId('avatar-Breakfast')).toBeNull()
    const viewButton = screen.getByRole('button', {
      name: 'View transactions for A very long restaurant category name',
    })
    expect(viewButton.className).toContain('min-h-11')
    expect(viewButton.className).toContain('min-w-11')
  })

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
    const viewButton = screen.getByRole('button', {
      name: /view transactions/i,
    })
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
