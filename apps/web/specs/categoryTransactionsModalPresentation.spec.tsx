/// <reference types="jest" />

import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import CategoryTransactionsModal from '../src/components/report/CategoryTransactionsModal'
import type { Transaction } from '../src/entities/transaction'
import type { CategorySummary } from '../src/components/report/reportTypes'

jest.mock('@heroui/react', () => ({
  Avatar: ({ name, className }: { name: string; className?: string }) => (
    <span data-avatar={name} className={className} />
  ),
  Drawer: ({
    children,
    isOpen,
    onClose,
  }: {
    children: ReactNode
    isOpen: boolean
    onClose: () => void
  }) =>
    isOpen ? (
      <aside>
        <button type="button" onClick={onClose}>
          Close
        </button>
        {children}
      </aside>
    ) : null,
  DrawerContent: ({
    children,
    className,
  }: {
    children: ReactNode
    className?: string
  }) => (
    <div data-testid="drawer-content" className={className}>
      {children}
    </div>
  ),
  DrawerHeader: ({
    children,
    className,
  }: {
    children: ReactNode
    className?: string
  }) => <header className={className}>{children}</header>,
  DrawerBody: ({
    children,
    className,
  }: {
    children: ReactNode
    className?: string
  }) => (
    <div data-testid="drawer-body" className={className}>
      {children}
    </div>
  ),
}))

jest.mock('../src/stores/category', () => ({
  useCategoryStore: (
    selector: (state: {
      categories: Array<{ id: string; name: string; imageUrl: string }>
    }) => unknown
  ) =>
    selector({
      categories: [
        {
          id: 'cat-food',
          name: 'A deliberately long restaurant category name',
          imageUrl: 'https://example.com/food.png',
        },
      ],
    }),
}))

function makeTransaction(
  id: string,
  date: string,
  amount: number
): Transaction {
  return {
    id,
    type: 'expense',
    accountBookId: 'book-1',
    categoryId: 'cat-food',
    amount,
    date,
    description: `Description for ${id}`,
    paymentMethod: 'Cash',
    receivedByUserId: null,
    settlementRecordId: '__unsettled__',
    tags: [],
    paidByDetail: [],
    splitDetail: [],
    createdAt: 0,
    updatedAt: 0,
    deletedAt: null,
  }
}

describe('CategoryTransactionsModal presentation', () => {
  it('keeps responsive detail rows operable and preserves newest-first navigation', () => {
    const onClose = jest.fn()
    const onTransactionClick = jest.fn()
    const summary: CategorySummary = {
      key: 'id::expense::cat-food',
      displayName: 'A deliberately long restaurant category name',
      imageUrl: null,
      totalAmount: 1123456,
      transactionCount: 2,
      percentage: 100,
      transactions: [
        makeTransaction('older', '2026/08/20', 123456),
        makeTransaction('newer', '2026/08/22', 1000000),
      ],
    }

    render(
      <CategoryTransactionsModal
        summary={summary}
        currency="TWD"
        isOpen
        onClose={onClose}
        onTransactionClick={onTransactionClick}
      />
    )

    expect(screen.getByTestId('drawer-content').className).toContain('bg-card')
    expect(screen.getByTestId('drawer-content').className).toContain(
      'text-card-foreground'
    )
    expect(screen.getByTestId('drawer-body').className).toContain(
      'overflow-y-auto'
    )
    expect(screen.getByTestId('drawer-body').className).toContain('sm:px-4')
    expect(
      screen.getAllByText('A deliberately long restaurant category name')[0]
        .className
    ).toContain('break-words')
    expect(
      screen.getByTestId('drawer-content').querySelector('header')?.textContent
    ).toContain('1,123,456 TWD')

    const dates = screen.getAllByText(/^2026\/08\//)
    expect(dates.map((node) => node.textContent)).toEqual([
      '2026/08/22',
      '2026/08/20',
    ])

    const newestRow = screen.getByText('2026/08/22').closest('button')
    if (!newestRow) {
      throw new Error('Expected the newest transaction row to be interactive')
    }
    expect(newestRow?.className).toContain('min-h-14')
    expect(newestRow?.className).toContain('focus-visible:ring-ring')
    fireEvent.click(newestRow)
    expect(onTransactionClick).toHaveBeenCalledWith('newer')

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
