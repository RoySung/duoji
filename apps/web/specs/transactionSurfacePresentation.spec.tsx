import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fireEvent, render, screen } from '@testing-library/react'

import TransactionList from '../src/components/transaction/TransactionList'
import type { Transaction } from '../src/entities/transaction'

const transactionModalSource = readFileSync(
  resolve(__dirname, '../src/components/TransactionModal/TransactionModal.tsx'),
  'utf8'
)
const expenseFormSource = readFileSync(
  resolve(__dirname, '../src/components/TransactionModal/ExpenseForm.tsx'),
  'utf8'
)
const categorySelectorSource = readFileSync(
  resolve(__dirname, '../src/components/TransactionModal/CategorySelector.tsx'),
  'utf8'
)
const paidByDetailModalSource = readFileSync(
  resolve(
    __dirname,
    '../src/components/TransactionModal/PaidByDetailModal.tsx'
  ),
  'utf8'
)
const splitDetailModalSource = readFileSync(
  resolve(__dirname, '../src/components/TransactionModal/SplitDetailModal.tsx'),
  'utf8'
)
const amountInputStylesSource = readFileSync(
  resolve(__dirname, '../src/components/TransactionModal/amountInputStyles.ts'),
  'utf8'
)
const missingBookPageSource = readFileSync(
  resolve(__dirname, '../src/pages/account-books/[id]/index.tsx'),
  'utf8'
)

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      'transactions.list.loading': 'Loading transactions…',
      'transactions.list.emptyTitle': 'No transactions yet',
      'transactions.list.emptyDescription': 'Create a transaction to begin.',
      'transactions.list.uncategorized': 'Uncategorized',
      'transactions.list.equalSplit': 'Equal Split',
      'transactions.list.settled': 'Settled',
      'transactionForm.paymentMethods.Cash': 'Cash',
    }

    return messages[key] ?? key
  },
}))

jest.mock('@heroui/react', () => {
  const React = jest.requireActual<typeof import('react')>('react')

  return {
    Avatar: ({ name }: { name: string }) =>
      React.createElement('span', { 'data-name': name }, name),
    AvatarGroup: ({ children }: { children: React.ReactNode }) =>
      React.createElement('span', null, children),
    Chip: ({
      children,
      className,
      startContent,
    }: {
      children: React.ReactNode
      className?: string
      startContent?: React.ReactNode
    }) => React.createElement('span', { className }, startContent, children),
  }
})

jest.mock('../src/stores/category', () => ({
  useCategoryStore: (selector: (state: unknown) => unknown) =>
    selector({
      categories: [
        {
          id: 'category-1',
          name: 'A very long shared dinner category name',
          imageUrl: '/category.webp',
        },
      ],
    }),
}))

jest.mock('../src/stores/user', () => ({
  useUserStore: (selector: (state: unknown) => unknown) =>
    selector({
      allUsers: [
        {
          id: 'user-1',
          name: 'Alexandra With A Long Participant Name',
          avatarUrl: '/alexandra.webp',
        },
      ],
    }),
}))

jest.mock('../src/stores/accountBook', () => ({
  useAccountBookStore: (selector: (state: unknown) => unknown) =>
    selector({
      accountBooks: [
        {
          id: 'book-1',
          name: 'Long summer journey account book',
          currency: 'TWD',
        },
      ],
    }),
}))

const transaction: Transaction = {
  id: 'transaction-1',
  type: 'expense',
  accountBookId: 'book-1',
  categoryId: 'category-1',
  amount: 123456789,
  date: '2026/08/28',
  description: 'A long description that must not cover the amount or actions',
  paymentMethod: 'Cash',
  receivedByUserId: null,
  tags: ['Long shared travel tag'],
  paidByDetail: [
    { userId: 'user-1', userType: 'registered', amount: 123456789 },
  ],
  splitDetail: [
    { userId: 'user-1', userType: 'registered', amount: 123456789 },
  ],
  settlementRecordId: '__unsettled__',
  createdAt: 1,
  updatedAt: 1,
  deletedAt: null,
}

const defaultProps = {
  currency: 'TWD',
  error: null,
  isLoading: false,
  onEditTransaction: jest.fn(),
  showAccountBook: true,
}

describe('transaction surface presentation', () => {
  beforeEach(() => {
    defaultProps.onEditTransaction.mockClear()
  })

  it('uses the shared surface contract for loading, empty, and error states', () => {
    const { rerender } = render(
      <TransactionList {...defaultProps} isLoading transactions={[]} />
    )

    expect(screen.getByRole('status').getAttribute('data-ui')).toBe(
      'surface-card'
    )
    expect(screen.getByRole('status').classList.contains('mt-6')).toBe(false)
    expect(screen.getByText('Loading transactions…')).toBeTruthy()

    rerender(<TransactionList {...defaultProps} transactions={[]} />)
    expect(
      screen.getByTestId('transaction-history-empty').getAttribute('data-ui')
    ).toBe('surface-card')
    expect(
      screen.getByTestId('transaction-history-empty').classList.contains('mt-6')
    ).toBe(false)

    rerender(
      <TransactionList
        {...defaultProps}
        error="Unable to load transactions"
        transactions={[]}
      />
    )
    expect(screen.getByRole('alert').getAttribute('data-ui')).toBe(
      'surface-card'
    )
    expect(screen.getByRole('alert').classList.contains('mt-6')).toBe(false)
    expect(screen.queryByTestId('transaction-history-empty')).toBeNull()
  })

  it('keeps long participant metadata and the amount inside an actionable card', () => {
    render(<TransactionList {...defaultProps} transactions={[transaction]} />)

    const row = screen.getByTestId('transaction-row-transaction-1')
    expect(
      screen.getByTestId('transaction-list').classList.contains('mt-6')
    ).toBe(false)
    const card = row.closest('[data-ui="surface-card"]')

    expect(card).toBeTruthy()
    expect(
      screen.getAllByText('Alexandra With A Long Participant Name').length
    ).toBeGreaterThan(0)
    expect(screen.getByText('123,456,789 TWD')).toBeTruthy()

    fireEvent.click(row)
    expect(defaultProps.onEditTransaction).toHaveBeenCalledWith('transaction-1')
  })

  it('uses compact semantic roles without shrinking the actionable row', () => {
    const { rerender } = render(
      <TransactionList {...defaultProps} transactions={[]} />
    )

    const emptyTitle = screen.getByText('No transactions yet')
    const emptyDescription = screen.getByText('Create a transaction to begin.')
    const emptyIcon = screen
      .getByTestId('transaction-history-empty')
      .querySelector('svg')

    expect(emptyTitle.classList.contains('text-title')).toBe(true)
    expect(emptyDescription.classList.contains('text-body')).toBe(true)
    expect(emptyIcon?.getAttribute('width')).toBe('18')

    rerender(<TransactionList {...defaultProps} transactions={[transaction]} />)

    const row = screen.getByTestId('transaction-row-transaction-1')
    const category = screen.getByText(
      'A very long shared dinner category name',
      { selector: 'h3' }
    )
    const description = screen.getByText(
      'A long description that must not cover the amount or actions'
    )
    const amount = screen.getByText('123,456,789 TWD')
    const participant = screen
      .getAllByText('Alexandra With A Long Participant Name')
      .at(-1)

    expect(row.classList.contains('min-h-11')).toBe(true)
    expect(category.classList.contains('text-title')).toBe(true)
    expect(description.classList.contains('text-body')).toBe(true)
    expect(amount.classList.contains('text-title')).toBe(true)
    expect(participant?.classList.contains('text-label')).toBe(true)
  })

  it('keeps transaction modal controls at 44px while compacting titles, text, and glyphs', () => {
    expect(transactionModalSource).toContain(
      'text-title font-semibold text-foreground'
    )
    expect(transactionModalSource).toContain('min-h-11 rounded-xl text-body')
    expect(expenseFormSource).toContain('<PiGitBranchBold size={16}')
    expect(categorySelectorSource).toContain('<PiWarning size={14}')
    expect(categorySelectorSource).toContain('<PiPlus size={12}')
    expect(
      categorySelectorSource.match(/classNames={{ img: 'p-0.5' }}/g)
    ).toHaveLength(2)
    expect(paidByDetailModalSource).toContain(
      'text-title font-semibold text-foreground'
    )
    expect(splitDetailModalSource).toContain(
      'text-title font-semibold text-foreground'
    )
    expect(amountInputStylesSource).toContain(
      "'text-right text-xl font-semibold"
    )
    expect(missingBookPageSource).toContain(
      'className="mt-5 text-headline font-semibold'
    )
  })
})
