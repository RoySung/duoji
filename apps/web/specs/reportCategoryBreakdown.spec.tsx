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
  default: ({ options, series, type }: any) => {
    const labels =
      type === 'bar' ? options.xaxis?.categories ?? [] : options.labels ?? []
    const totalLabel = options.plotOptions?.pie?.donut?.labels?.total?.label
    const itemType = type === 'bar' ? 'bar' : 'slice'

    return (
      <div
        data-testid="apex-chart"
        data-chart-type={type}
        data-labels={JSON.stringify(labels)}
        data-series={JSON.stringify(series)}
        data-total-label={totalLabel}
      >
        {labels.map((label: string, index: number) => (
          <button
            key={label}
            type="button"
            aria-label={`Select ${label} chart ${itemType}`}
            onClick={() =>
              options.chart?.events?.dataPointSelection?.(null, null, {
                dataPointIndex: index,
              })
            }
          />
        ))}
      </div>
    )
  },
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
      <div data-testid="category-modal">
        {JSON.stringify({
          key: summary?.key,
          totalAmount: summary?.totalAmount,
          transactionIds: summary?.transactions.map(({ id }) => id),
        })}
      </div>
    ) : null,
}))

function makeSummary(
  overrides: Partial<CategorySummary> = {}
): CategorySummary {
  const summary: CategorySummary = {
    key: 'name::expense::Food',
    displayName: 'Food',
    imageUrl: null,
    totalAmount: 300,
    transactionCount: 1,
    directAmount: 300,
    directTransactionCount: 1,
    directTransactions: [],
    percentage: 100,
    transactions: [],
    children: [],
    ...overrides,
  }

  if (
    overrides.directTransactions === undefined &&
    summary.children.length === 0
  ) {
    summary.directTransactions = summary.transactions
  }

  return summary
}

describe('ReportCategoryBreakdown', () => {
  it('does not inspect transaction detail arrays while rendering the root overview', () => {
    let transactionReads = 0
    const food = makeSummary({
      totalAmount: 100,
      directAmount: 100,
      directTransactionCount: 1,
    })
    Object.defineProperty(food, 'transactions', {
      get: () => {
        transactionReads += 1
        return []
      },
    })

    render(
      <ReportCategoryBreakdown
        expense={[food]}
        income={[]}
        activeExpense={[food]}
        activeIncome={[]}
        currency="TWD"
        excludedKeys={new Set()}
        onToggleKey={jest.fn()}
      />
    )

    expect(transactionReads).toBe(0)
  })

  it('uses the shared compact surface and 44px category actions', () => {
    const expense: CategorySummary[] = [
      makeSummary({
        key: 'name::expense::Food',
        displayName: 'A very long restaurant category name',
        imageUrl: 'https://example.com/restaurant.svg',
        totalAmount: 1234567,
        transactionCount: 2,
        directAmount: 1234567,
        directTransactionCount: 2,
        percentage: 100,
      }),
      makeSummary({
        key: 'name::expense::Breakfast',
        displayName: 'Breakfast',
        totalAmount: 300,
        percentage: 20,
      }),
    ]

    render(
      <ReportCategoryBreakdown
        expense={expense}
        income={[]}
        activeExpense={expense}
        activeIncome={[]}
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
      screen.getByText(
        'Select a category or chart segment to view its breakdown'
      ).className
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
    const categoryRows = screen.getAllByRole('button', {
      name: /Open .* transactions/,
    })
    expect(categoryRows).toHaveLength(2)
    for (const row of categoryRows) {
      expect(row.className).toContain('min-h-14')
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
      makeSummary({ transactionCount: 2, directTransactionCount: 2 }),
    ]

    render(
      <ReportCategoryBreakdown
        expense={expense}
        income={[]}
        activeExpense={[]}
        activeIncome={[]}
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
      makeSummary({
        totalAmount: 300,
        transactionCount: 2,
        directAmount: 300,
        directTransactionCount: 2,
        percentage: 75,
      }),
      makeSummary({
        key: 'name::expense::Utilities',
        displayName: 'Utilities',
        totalAmount: 100,
        directAmount: 100,
        percentage: 25,
      }),
    ]

    render(
      <ReportCategoryBreakdown
        expense={expense}
        income={[]}
        activeExpense={expense}
        activeIncome={[]}
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
      makeSummary({ transactionCount: 2, directTransactionCount: 2 }),
    ]

    const { rerender } = render(
      <ReportCategoryBreakdown
        expense={initialExpense}
        income={[]}
        activeExpense={initialExpense}
        activeIncome={[]}
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

    expect(screen.getByTestId('category-modal').textContent).toContain(
      '"totalAmount":300'
    )

    // Simulate update to expense prop after transaction edit
    const updatedExpense: CategorySummary[] = [
      makeSummary({
        totalAmount: 500,
        transactionCount: 3,
        directAmount: 500,
        directTransactionCount: 3,
      }),
    ]

    rerender(
      <ReportCategoryBreakdown
        expense={updatedExpense}
        income={[]}
        activeExpense={updatedExpense}
        activeIncome={[]}
        currency="TWD"
        excludedKeys={new Set()}
        onToggleKey={jest.fn()}
      />
    )

    expect(screen.getByTestId('category-modal').textContent).toContain(
      '"totalAmount":500'
    )
  })

  it('drills into a root from the list and returns through the breadcrumb', () => {
    const dining = makeSummary({
      key: 'name::expense::Food::Dining',
      displayName: 'Dining',
      totalAmount: 300,
      directAmount: 300,
      percentage: 75,
      transactions: [{ id: 'dining-tx' } as any],
    })
    const expense = [
      makeSummary({
        totalAmount: 300,
        transactionCount: 1,
        directAmount: 0,
        directTransactionCount: 0,
        percentage: 75,
        transactions: [{ id: 'dining-tx' } as any],
        children: [dining],
      }),
      makeSummary({
        key: 'name::expense::Transport',
        displayName: 'Transport',
        totalAmount: 100,
        directAmount: 100,
        percentage: 20,
      }),
    ]

    render(
      <ReportCategoryBreakdown
        expense={expense}
        income={[]}
        activeExpense={expense}
        activeIncome={[]}
        currency="TWD"
        excludedKeys={new Set()}
        onToggleKey={jest.fn()}
      />
    )

    const rootIndicator = screen.getByText('All categories')
    expect(rootIndicator.closest('button')).toBeNull()
    expect(screen.queryByText('Dining')).toBeNull()
    const chart = screen.getByTestId('apex-chart')
    expect(chart.getAttribute('data-labels')).toBe(
      JSON.stringify(['Food', 'Transport'])
    )
    expect(chart.getAttribute('data-series')).toBe(JSON.stringify([300, 100]))

    fireEvent.click(screen.getByRole('button', { name: 'View Food breakdown' }))

    expect(screen.queryByText('Dining')).not.toBeNull()
    expect(chart.getAttribute('data-labels')).toBe(JSON.stringify(['Dining']))
    expect(chart.getAttribute('data-series')).toBe(JSON.stringify([300]))
    const focusedBreadcrumb = screen.getByRole('button', {
      name: 'Back to all categories',
    })
    expect(focusedBreadcrumb.textContent).toContain('All categories')
    expect(focusedBreadcrumb.textContent).toContain('Food')
    expect(screen.getByText('All categories').closest('button')).toBe(
      focusedBreadcrumb
    )

    fireEvent.click(focusedBreadcrumb)
    expect(screen.queryByText('Dining')).toBeNull()
    expect(screen.getByText('All categories').closest('button')).toBeNull()
    expect(chart.getAttribute('data-labels')).toBe(
      JSON.stringify(['Food', 'Transport'])
    )
  })

  it('drills into the same root from a matching donut slice', () => {
    const dining = makeSummary({
      key: 'name::expense::Food::Dining',
      displayName: 'Dining',
      totalAmount: 300,
      directAmount: 300,
    })
    const food = makeSummary({
      totalAmount: 300,
      directAmount: 0,
      directTransactionCount: 0,
      children: [dining],
    })

    render(
      <ReportCategoryBreakdown
        expense={[food]}
        income={[]}
        activeExpense={[food]}
        activeIncome={[]}
        currency="TWD"
        excludedKeys={new Set()}
        onToggleKey={jest.fn()}
      />
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Select Food chart slice' })
    )

    expect(screen.queryByText('Dining')).not.toBeNull()
    expect(screen.getByTestId('apex-chart').getAttribute('data-labels')).toBe(
      JSON.stringify(['Dining'])
    )
  })

  it('drills into a root that contains only direct assignments', () => {
    const food = makeSummary({
      totalAmount: 100,
      transactionCount: 1,
      directAmount: 100,
      directTransactionCount: 1,
      transactions: [{ id: 'food-direct' } as any],
      directTransactions: [{ id: 'food-direct' } as any],
    })

    render(
      <ReportCategoryBreakdown
        expense={[food]}
        income={[]}
        activeExpense={[food]}
        activeIncome={[]}
        currency="TWD"
        excludedKeys={new Set()}
        drillableRootKeys={new Set([food.key])}
        onToggleKey={jest.fn()}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'View Food breakdown' }))

    expect(
      screen.getByRole('button', { name: 'Back to all categories' })
    ).not.toBeNull()
    expect(screen.queryByText('Directly in Food')).not.toBeNull()
    expect(screen.getByTestId('apex-chart').getAttribute('data-series')).toBe(
      JSON.stringify([100])
    )
  })

  it('keeps the donut label tied to the current hierarchy context', () => {
    const dining = makeSummary({
      key: 'name::expense::Food::Dining',
      displayName: 'Dining',
      totalAmount: 300,
      directAmount: 300,
      transactions: [{ id: 'dining-tx' } as any],
    })
    const food = makeSummary({
      totalAmount: 400,
      transactionCount: 2,
      directAmount: 100,
      directTransactionCount: 1,
      transactions: [{ id: 'food-direct' } as any, { id: 'dining-tx' } as any],
      directTransactions: [{ id: 'food-direct' } as any],
      children: [dining],
    })
    const { rerender } = render(
      <ReportCategoryBreakdown
        expense={[food]}
        income={[]}
        activeExpense={[food]}
        activeIncome={[]}
        currency="TWD"
        excludedKeys={new Set()}
        drillableRootKeys={new Set([food.key])}
        onToggleKey={jest.fn()}
      />
    )

    const chart = screen.getByTestId('apex-chart')
    expect(chart.getAttribute('data-total-label')).toBe('All categories')

    fireEvent.click(screen.getByRole('button', { name: 'View Food breakdown' }))
    expect(chart.getAttribute('data-total-label')).toBe('Food')

    const activeFoodAfterExcludingDining = makeSummary({
      ...food,
      totalAmount: 100,
      transactionCount: 1,
      directAmount: 100,
      directTransactionCount: 1,
      transactions: [{ id: 'food-direct' } as any],
      directTransactions: [{ id: 'food-direct' } as any],
      children: [],
    })
    rerender(
      <ReportCategoryBreakdown
        expense={[food]}
        income={[]}
        activeExpense={[activeFoodAfterExcludingDining]}
        activeIncome={[]}
        currency="TWD"
        excludedKeys={new Set([dining.key])}
        drillableRootKeys={new Set([food.key])}
        onToggleKey={jest.fn()}
      />
    )
    expect(chart.getAttribute('data-total-label')).toBe('Food')
  })

  it('keeps hierarchy navigation, filtering, and detail actions independent', () => {
    const onToggleKey = jest.fn()
    const dining = makeSummary({
      key: 'name::expense::Food::Dining',
      displayName: 'Dining',
      totalAmount: 200,
      directAmount: 200,
      transactions: [{ id: 'dining-tx' } as any],
    })
    const food = makeSummary({
      totalAmount: 200,
      transactionCount: 1,
      directAmount: 0,
      directTransactionCount: 0,
      transactions: [{ id: 'dining-tx' } as any],
      children: [dining],
    })

    render(
      <ReportCategoryBreakdown
        expense={[food]}
        income={[]}
        activeExpense={[food]}
        activeIncome={[]}
        currency="TWD"
        excludedKeys={new Set()}
        onToggleKey={onToggleKey}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'View Food breakdown' }))
    expect(onToggleKey).not.toHaveBeenCalled()

    fireEvent.click(
      screen.getByRole('button', { name: 'Back to all categories' })
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Exclude Food from report' })
    )
    expect(onToggleKey).toHaveBeenLastCalledWith('name::expense::Food')

    fireEvent.click(
      screen.getByRole('button', { name: 'View transactions for Food' })
    )
    expect(screen.getByTestId('category-modal').textContent).toContain(
      '"transactionIds":["dining-tx"]'
    )

    fireEvent.click(screen.getByRole('button', { name: 'View Food breakdown' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Exclude Dining from report' })
    )
    expect(onToggleKey).toHaveBeenLastCalledWith('name::expense::Food::Dining')

    fireEvent.click(
      screen.getByRole('button', { name: 'Open Dining transactions' })
    )
    expect(screen.getByTestId('category-modal').textContent).toContain(
      '"transactionIds":["dining-tx"]'
    )
  })

  it('reconciles direct root assignments in the focused chart and detail', () => {
    const dining = makeSummary({
      key: 'name::expense::Food::Dining',
      displayName: 'Dining',
      totalAmount: 300,
      transactionCount: 1,
      directAmount: 300,
      directTransactionCount: 1,
      percentage: 60,
      transactions: [{ id: 'dining-tx' } as any],
    })
    const food = makeSummary({
      totalAmount: 400,
      transactionCount: 2,
      directAmount: 100,
      directTransactionCount: 1,
      percentage: 80,
      transactions: [{ id: 'food-direct' } as any, { id: 'dining-tx' } as any],
      directTransactions: [{ id: 'food-direct' } as any],
      children: [dining],
    })

    render(
      <ReportCategoryBreakdown
        expense={[food]}
        income={[]}
        activeExpense={[food]}
        activeIncome={[]}
        currency="TWD"
        excludedKeys={new Set()}
        onToggleKey={jest.fn()}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'View Food breakdown' }))

    const chart = screen.getByTestId('apex-chart')
    expect(chart.getAttribute('data-labels')).toBe(
      JSON.stringify(['Dining', 'Directly in Food'])
    )
    expect(chart.getAttribute('data-series')).toBe(JSON.stringify([300, 100]))
    expect(screen.getByText('1 records · 75.0%')).not.toBeNull()
    expect(screen.getByText('1 records · 25.0%')).not.toBeNull()
    expect(
      screen.queryByRole('button', {
        name: 'Exclude Directly in Food from report',
      })
    ).toBeNull()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'View transactions for Directly in Food',
      })
    )
    expect(screen.getByTestId('category-modal').textContent).toContain(
      '"transactionIds":["food-direct"]'
    )
  })

  it('sorts child and direct assignments together in the focused view', () => {
    const dining = makeSummary({
      key: 'name::expense::Food::Dining',
      displayName: 'Dining',
      totalAmount: 300,
      directAmount: 300,
      transactions: [{ id: 'dining-tx' } as any],
    })
    const groceries = makeSummary({
      key: 'name::expense::Food::Groceries',
      displayName: 'Groceries',
      totalAmount: 80,
      directAmount: 80,
      transactions: [{ id: 'groceries-tx' } as any],
    })
    const food = makeSummary({
      totalAmount: 500,
      transactionCount: 3,
      directAmount: 120,
      directTransactionCount: 1,
      transactions: [
        { id: 'food-direct' } as any,
        { id: 'dining-tx' } as any,
        { id: 'groceries-tx' } as any,
      ],
      directTransactions: [{ id: 'food-direct' } as any],
      children: [dining, groceries],
    })

    render(
      <ReportCategoryBreakdown
        expense={[food]}
        income={[]}
        activeExpense={[food]}
        activeIncome={[]}
        currency="TWD"
        excludedKeys={new Set()}
        onToggleKey={jest.fn()}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'View Food breakdown' }))

    expect(screen.getByTestId('apex-chart').getAttribute('data-labels')).toBe(
      JSON.stringify(['Dining', 'Directly in Food', 'Groceries'])
    )
    expect(screen.getByTestId('apex-chart').getAttribute('data-series')).toBe(
      JSON.stringify([300, 120, 80])
    )
  })

  it('clears excluded descendants outside the current report scope when re-including a root', () => {
    const onToggleKey = jest.fn()
    const diningKey = 'name::expense::Food::Dining'
    const groceries = makeSummary({
      key: 'name::expense::Food::Groceries',
      displayName: 'Groceries',
      totalAmount: 80,
      directAmount: 80,
    })
    const food = makeSummary({
      totalAmount: 100,
      directAmount: 20,
      children: [groceries],
    })

    render(
      <ReportCategoryBreakdown
        expense={[food]}
        income={[]}
        activeExpense={[]}
        activeIncome={[]}
        currency="TWD"
        excludedKeys={new Set([food.key, diningKey])}
        descendantKeysByRoot={
          new Map([[food.key, new Set([diningKey, groceries.key])]])
        }
        onToggleKey={onToggleKey}
      />
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Include Food in report' })
    )

    expect(onToggleKey.mock.calls).toEqual([[food.key], [diningKey]])
  })

  it('shows descendant filters as inherited and disabled while their root is excluded', () => {
    const onToggleKey = jest.fn()
    const dining = makeSummary({
      key: 'name::expense::Food::Dining',
      displayName: 'Dining',
      totalAmount: 200,
      directAmount: 200,
    })
    const food = makeSummary({
      totalAmount: 200,
      directAmount: 0,
      directTransactionCount: 0,
      children: [dining],
    })

    render(
      <ReportCategoryBreakdown
        expense={[food]}
        income={[]}
        activeExpense={[]}
        activeIncome={[]}
        currency="TWD"
        excludedKeys={new Set([food.key])}
        drillableRootKeys={new Set([food.key])}
        onToggleKey={onToggleKey}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'View Food breakdown' }))

    const focusedFilter = screen.getByRole('button', {
      name: 'Dining is excluded because its parent category is excluded',
    })
    expect((focusedFilter as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByText('Dining').className).toContain('line-through')
    fireEvent.click(focusedFilter)
    expect(onToggleKey).not.toHaveBeenCalled()

    fireEvent.click(
      screen.getByRole('button', { name: 'Compare subcategories' })
    )

    const comparisonFilter = screen.getByRole('button', {
      name: 'Food / Dining is excluded because its parent category is excluded',
    })
    expect((comparisonFilter as HTMLButtonElement).disabled).toBe(true)
  })

  it('resets drill-down when tabs change and when the drilled root disappears', () => {
    const child = makeSummary({
      key: 'name::expense::Food::Dining',
      displayName: 'Dining',
    })
    const food = makeSummary({
      directAmount: 0,
      directTransactionCount: 0,
      children: [child],
    })
    const salary = makeSummary({
      key: 'name::income::Salary',
      displayName: 'Salary',
    })
    const { rerender } = render(
      <ReportCategoryBreakdown
        expense={[food]}
        income={[salary]}
        activeExpense={[food]}
        activeIncome={[salary]}
        currency="TWD"
        excludedKeys={new Set()}
        onToggleKey={jest.fn()}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'View Food breakdown' }))
    expect(screen.queryByText('Dining')).not.toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Income' }))
    expect(screen.queryByText('Dining')).toBeNull()
    expect(screen.queryByText('Salary')).not.toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Expense' }))
    expect(screen.queryByText('Food')).not.toBeNull()
    expect(screen.queryByText('Dining')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'View Food breakdown' }))

    rerender(
      <ReportCategoryBreakdown
        expense={[]}
        income={[salary]}
        activeExpense={[]}
        activeIncome={[salary]}
        currency="TWD"
        excludedKeys={new Set()}
        onToggleKey={jest.fn()}
      />
    )

    expect(
      screen.queryByRole('button', { name: 'Back to all categories' })
    ).toBeNull()
    expect(screen.queryByText('Dining')).toBeNull()
  })

  it('compares child and direct assignments across roots with globally sorted full paths', () => {
    const onToggleKey = jest.fn()
    const dining = makeSummary({
      key: 'name::expense::Food::Dining',
      displayName: 'Dining',
      totalAmount: 300,
      transactionCount: 1,
      directAmount: 300,
      directTransactionCount: 1,
      transactions: [{ id: 'dining-tx' } as any],
    })
    const taxi = makeSummary({
      key: 'name::expense::Transport::Taxi',
      displayName: 'Taxi',
      totalAmount: 200,
      transactionCount: 1,
      directAmount: 200,
      directTransactionCount: 1,
      transactions: [{ id: 'taxi-tx' } as any],
    })
    const food = makeSummary({
      totalAmount: 400,
      transactionCount: 2,
      directAmount: 100,
      directTransactionCount: 1,
      percentage: 66.7,
      transactions: [{ id: 'food-direct' } as any, { id: 'dining-tx' } as any],
      directTransactions: [{ id: 'food-direct' } as any],
      children: [dining],
    })
    const transport = makeSummary({
      key: 'name::expense::Transport',
      displayName: 'Transport',
      totalAmount: 200,
      transactionCount: 1,
      directAmount: 0,
      directTransactionCount: 0,
      percentage: 33.3,
      transactions: [{ id: 'taxi-tx' } as any],
      children: [taxi],
    })

    render(
      <ReportCategoryBreakdown
        expense={[food, transport]}
        income={[]}
        activeExpense={[food, transport]}
        activeIncome={[]}
        currency="TWD"
        excludedKeys={new Set()}
        onToggleKey={onToggleKey}
      />
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Compare subcategories' })
    )

    const chart = screen.getByTestId('apex-chart')
    expect(chart.getAttribute('data-chart-type')).toBe('bar')
    expect(chart.getAttribute('data-labels')).toBe(
      JSON.stringify([
        'Food / Dining',
        'Transport / Taxi',
        'Food / Directly in Food',
      ])
    )
    expect(chart.getAttribute('data-series')).toBe(
      JSON.stringify([{ name: 'Amount', data: [300, 200, 100] }])
    )
    expect(screen.queryByText('1 records · 50.0%')).not.toBeNull()
    expect(screen.queryByText('1 records · 33.3%')).not.toBeNull()
    expect(screen.queryByText('1 records · 16.7%')).not.toBeNull()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Select Food / Dining chart bar',
      })
    )
    expect(screen.getByTestId('category-modal').textContent).toContain(
      '"transactionIds":["dining-tx"]'
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Exclude Food / Dining from report',
      })
    )
    expect(onToggleKey).toHaveBeenLastCalledWith('name::expense::Food::Dining')
    expect(
      screen.queryByRole('button', {
        name: 'Exclude Food / Directly in Food from report',
      })
    ).toBeNull()
  })

  it('returns to the root overview when the transaction type tab changes', () => {
    const dining = makeSummary({
      key: 'name::expense::Food::Dining',
      displayName: 'Dining',
      totalAmount: 300,
      directAmount: 300,
    })
    const food = makeSummary({
      totalAmount: 300,
      directAmount: 0,
      directTransactionCount: 0,
      children: [dining],
    })
    const salary = makeSummary({
      key: 'name::income::Salary',
      displayName: 'Salary',
      totalAmount: 500,
      directAmount: 500,
    })

    render(
      <ReportCategoryBreakdown
        expense={[food]}
        income={[salary]}
        activeExpense={[food]}
        activeIncome={[salary]}
        currency="TWD"
        excludedKeys={new Set()}
        onToggleKey={jest.fn()}
      />
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Compare subcategories' })
    )
    expect(
      screen.getByTestId('apex-chart').getAttribute('data-chart-type')
    ).toBe('bar')

    fireEvent.click(screen.getByRole('button', { name: 'Income' }))

    expect(
      screen
        .getByRole('button', { name: 'Category overview' })
        .getAttribute('aria-pressed')
    ).toBe('true')
    expect(
      screen.getByTestId('apex-chart').getAttribute('data-chart-type')
    ).toBe('donut')
    expect(screen.getByTestId('apex-chart').getAttribute('data-labels')).toBe(
      JSON.stringify(['Salary'])
    )
  })
})
