/// <reference types="jest" />

import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import TagFilterSelector from '../src/components/report/TagFilterSelector'
import AccountBookReportPage from '../src/pages/account-books/[id]/report'
import { DefaultPaymentMethod, UNSETTLED_SETTLEMENT_RECORD_ID } from '../src/entities/transaction'

const mockUseRouter = jest.fn()
const mockUseTranslations = jest.fn()
const mockUseAccountBookStore = jest.fn()
const mockUseCategoryStore = jest.fn()
const mockUseUserStore = jest.fn()
const mockUseReportTransactions = jest.fn()
const mockUseExportTransactionsCsv = jest.fn()

jest.mock('next/router', () => ({
  useRouter: () => mockUseRouter(),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => mockUseTranslations(),
}))

jest.mock('@heroui/react', () => ({
  Button: ({
    children,
    onPress,
    startContent,
    endContent,
    isDisabled,
    ...props
  }: any) => (
    <button type="button" onClick={onPress} disabled={isDisabled} {...props}>
      {startContent}
      {children}
      {endContent}
    </button>
  ),
  Checkbox: ({ isSelected, onValueChange }: any) => (
    <input
      type="checkbox"
      checked={isSelected}
      onChange={() => onValueChange?.(!isSelected)}
    />
  ),
  Chip: ({ children }: any) => <span>{children}</span>,
  Popover: ({ children, isOpen, onOpenChange }: any) => {
    const React = require('react')
    const [trigger, content] = React.Children.toArray(children)
    const triggerElement = React.cloneElement(trigger, {
      children: React.cloneElement((trigger as any).props.children, {
        onPress: () => onOpenChange?.(!isOpen),
      }),
    })

    return (
      <div data-open={isOpen}>
        {triggerElement}
        {isOpen ? content : null}
      </div>
    )
  },
  PopoverTrigger: ({ children }: any) => <>{children}</>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('../src/stores/accountBook', () => ({
  useAccountBookStore: (selector: any) => mockUseAccountBookStore(selector),
}))

jest.mock('../src/stores/category', () => ({
  useCategoryStore: (selector: any) => mockUseCategoryStore(selector),
}))

jest.mock('../src/stores/user', () => ({
  useUserStore: (selector: any) => mockUseUserStore(selector),
}))

jest.mock('../src/hooks/useReportTransactions', () => ({
  useReportTransactions: (...args: any[]) => mockUseReportTransactions(...args),
}))

jest.mock('../src/hooks/useAccountBookTransactions', () => ({
  useAccountBookTransactions: () => ({
    createTransaction: jest.fn(),
    updateTransaction: jest.fn(),
    deleteTransaction: jest.fn(),
    isMutating: false,
  }),
}))

jest.mock('../src/hooks/useExportTransactionsCsv', () => ({
  useExportTransactionsCsv: (...args: any[]) => mockUseExportTransactionsCsv(...args),
}))

jest.mock('../src/components/report/BookFilterSelector', () => ({
  __esModule: true,
  default: ({ onChange }: any) => (
    <button type="button" onClick={() => onChange(new Set(['book-1']))}>
      exclude-book-1
    </button>
  ),
}))

jest.mock('../src/components/report/TimeRangeSelector', () => ({
  __esModule: true,
  default: ({ onChange }: any) => (
    <button
      type="button"
      onClick={() =>
        onChange({
          startDate: '2026/02/01',
          endDate: '2026/02/28',
        })
      }
    >
      change-range
    </button>
  ),
}))

jest.mock('../src/components/report/ReportSection', () => ({
  __esModule: true,
  default: () => <div data-testid="report-section" />,
}))

jest.mock('../src/components/onboarding/ReportTutorial', () => ({
  __esModule: true,
  default: ({ children }: any) => <>{children}</>,
}))

jest.mock('../src/components/TransactionModal', () => ({
  TransactionModal: () => null,
}))


function makeTransaction(overrides: Record<string, unknown> = {}) {
  return {
    id: 'tx-1',
    type: 'expense',
    accountBookId: 'book-1',
    categoryId: 'cat-1',
    amount: 100,
    date: '2026/06/10',
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

function setupCommonMocks() {
  mockUseTranslations.mockReturnValue((key: string) => {
    const messages: Record<string, string> = {
      'report.label': 'Report',
      'report.exportCsv': 'Export CSV',
      'report.exported': 'Exported!',
      'report.loading': 'Loading report...',
      'report.updating': 'Updating...',
      'report.tagFilter.trigger': 'Filter tags',
      'report.tagFilter.title': 'Filter tags',
      'report.tagFilter.empty': 'No tags in the current report scope.',
      'transactions.allBooks': 'All Books',
      'transactions.fallbackName': 'Fallback',
      'transactions.notFoundTitle': 'Not Found',
      'transactions.notFoundDescription': 'Missing',
    }
    return messages[key] ?? key
  })

  mockUseAccountBookStore.mockImplementation((selector: any) =>
    selector({
      accountBooks: [
        {
          id: 'book-1',
          name: 'Book 1',
          currency: 'TWD',
        },
        {
          id: 'book-2',
          name: 'Book 2',
          currency: 'JPY',
        },
      ],
      initialized: true,
    })
  )

  mockUseCategoryStore.mockImplementation((selector: any) =>
    selector({ categories: [] })
  )

  mockUseUserStore.mockImplementation((selector: any) =>
    selector({
      allUsers: [],
      activeUsers: [],
      isLoading: false,
      error: null,
    })
  )

  mockUseExportTransactionsCsv.mockReturnValue({ exportCsv: jest.fn() })
}

describe('TagFilterSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setupCommonMocks()
  })

  it('shows the trigger, selection badge, and toggles tags', () => {
    function Wrapper() {
      const [selectedTags, setSelectedTags] = useState<Set<string>>(() => new Set(['beta']))

      return (
        <TagFilterSelector
          allTags={['alpha', 'beta']}
          selectedTags={selectedTags}
          onChange={setSelectedTags}
        />
      )
    }

    render(<Wrapper />)

    expect(screen.getByText('Filter tags')).toBeTruthy()
    expect(screen.getByText('1')).toBeTruthy()

    fireEvent.click(screen.getByText('Filter tags'))
    fireEvent.click(screen.getAllByRole('checkbox')[0])

    expect(screen.getAllByText('2')).toHaveLength(1)

    fireEvent.click(screen.getAllByRole('checkbox')[0])

    expect(screen.queryByText('2')).toBeNull()
  })
})

describe('AccountBookReportPage tag filter state', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setupCommonMocks()
    mockUseRouter.mockReturnValue({ query: { id: 'all' } })
  })

  it('shows the tag filter in all-books view and updates available tags after book filtering', () => {
    mockUseReportTransactions.mockImplementation((_accountBookId: string, dateRange: any) => {
      if (dateRange?.startDate === '2026/02/01') {
        return {
          transactions: [
            makeTransaction({ id: 'tx-3', accountBookId: 'book-2', tags: ['gamma'] }),
          ],
          isLoading: false,
          isFetching: false,
          error: null,
        }
      }

      return {
        transactions: [
          makeTransaction({ id: 'tx-1', accountBookId: 'book-1', tags: ['alpha'] }),
          makeTransaction({ id: 'tx-2', accountBookId: 'book-2', tags: ['beta'] }),
        ],
        isLoading: false,
        isFetching: false,
        error: null,
      }
    })

    render(<AccountBookReportPage />)

    fireEvent.click(screen.getByText('Filter tags'))
    expect(screen.getByText('alpha')).toBeTruthy()
    expect(screen.getByText('beta')).toBeTruthy()

    fireEvent.click(screen.getAllByRole('checkbox')[0])
    expect(screen.getAllByText('1')).toHaveLength(1)

    fireEvent.click(screen.getByText('exclude-book-1'))

    expect(screen.queryByText('alpha')).toBeNull()
    expect(screen.getByText('beta')).toBeTruthy()
    expect(screen.queryByText('1')).toBeNull()
  })

  it('shows the tag filter in single-book view', () => {
    mockUseRouter.mockReturnValue({ query: { id: 'book-1' } })
    mockUseReportTransactions.mockReturnValue({
      transactions: [makeTransaction({ id: 'tx-1', accountBookId: 'book-1', tags: ['alpha'] })],
      isLoading: false,
      isFetching: false,
      error: null,
    })

    render(<AccountBookReportPage />)

    expect(screen.getByText('Filter tags')).toBeTruthy()
  })

  it('resets selected tags on remount because the state is page-local', () => {
    mockUseReportTransactions.mockReturnValue({
      transactions: [makeTransaction({ id: 'tx-1', tags: ['alpha'] })],
      isLoading: false,
      isFetching: false,
      error: null,
    })

    const { unmount } = render(<AccountBookReportPage />)

    fireEvent.click(screen.getByText('Filter tags'))
    fireEvent.click(screen.getByRole('checkbox'))
    expect(screen.getAllByText('1')).toHaveLength(1)

    unmount()
    render(<AccountBookReportPage />)

    expect(screen.queryByText('1')).toBeNull()
  })

  it('updates available tags when the time range changes', () => {
    mockUseReportTransactions.mockImplementation((_accountBookId: string, dateRange: any) => {
      if (dateRange?.startDate === '2026/02/01') {
        return {
          transactions: [makeTransaction({ id: 'tx-2', tags: ['gamma'] })],
          isLoading: false,
          isFetching: false,
          error: null,
        }
      }

      return {
        transactions: [makeTransaction({ id: 'tx-1', tags: ['alpha'] })],
        isLoading: false,
        isFetching: false,
        error: null,
      }
    })

    render(<AccountBookReportPage />)

    fireEvent.click(screen.getByText('Filter tags'))
    expect(screen.getByText('alpha')).toBeTruthy()

    fireEvent.click(screen.getByText('change-range'))

    expect(screen.queryByText('alpha')).toBeNull()
    expect(screen.getByText('gamma')).toBeTruthy()
  })

  it('keeps CSV export scoped to bookFilteredTransactions when selected tags change', () => {
    mockUseReportTransactions.mockReturnValue({
      transactions: [
        makeTransaction({ id: 'tx-1', accountBookId: 'book-1', tags: ['alpha'] }),
        makeTransaction({ id: 'tx-2', accountBookId: 'book-2', tags: ['beta'] }),
      ],
      isLoading: false,
      isFetching: false,
      error: null,
    })

    render(<AccountBookReportPage />)

    fireEvent.click(screen.getByText('Filter tags'))
    fireEvent.click(screen.getAllByRole('checkbox')[0])

    const lastCall = mockUseExportTransactionsCsv.mock.calls.at(-1)
    expect(lastCall?.[0]).toHaveLength(2)
    expect(lastCall?.[0].map((transaction: any) => transaction.id)).toEqual([
      'tx-1',
      'tx-2',
    ])
  })
})