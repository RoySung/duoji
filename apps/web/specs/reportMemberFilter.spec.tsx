/// <reference types="jest" />

import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import MemberFilterSelector from '../src/components/report/MemberFilterSelector'
import AccountBookReportPage from '../src/pages/account-books/[id]/report'
import { DefaultPaymentMethod, UNSETTLED_SETTLEMENT_RECORD_ID } from '../src/entities/transaction'
import { User } from '@/entities/user'

const mockUseRouter = jest.fn()
const mockUseTranslations = jest.fn()
const mockUseAccountBookStore = jest.fn()
const mockUseCategoryStore = jest.fn()
const mockUseUserStore = jest.fn()
const mockUseReportTransactions = jest.fn()
const mockUseExportTransactionsCsv = jest.fn()
const mockReportSection = jest.fn()

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
  Avatar: ({ name, src }: any) => <span data-testid={`avatar-${name}`} />,
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
  default: (props: any) => {
    mockReportSection(props)
    return <div data-testid="report-section" />
  },
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
    amount: 1000,
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

const mockUsers: User[] = [
  { id: 'user-a', name: 'User A', avatarUrl: 'http://avatar/a', type: 'registered', email: 'a@test.com', createdAt: 0, updatedAt: 0 },
  { id: 'user-b', name: 'User B', avatarUrl: 'http://avatar/b', type: 'registered', email: 'b@test.com', createdAt: 0, updatedAt: 0 },
  { id: 'user-c', name: 'User C', avatarUrl: 'http://avatar/c', type: 'virtual', accountBookId: 'book-1', createdAt: 0, updatedAt: 0 },
  { id: 'shared-wallet', name: 'Shared Wallet', avatarUrl: 'http://avatar/sw', type: 'virtual', accountBookId: 'book-1', isSharedWallet: true, createdAt: 0, updatedAt: 0 },
]

function setupCommonMocks() {
  mockUseTranslations.mockReturnValue((key: string, params?: any) => {
    const messages: Record<string, string> = {
      'report.label': 'Report',
      'report.exportCsv': 'Export CSV',
      'report.exported': 'Exported!',
      'report.loading': 'Loading report...',
      'report.updating': 'Updating...',
      'report.memberFilter.trigger': 'Filter members',
      'report.memberFilter.triggerSelected': 'Member: {name}',
      'report.memberFilter.title': 'Filter members',
      'report.memberFilter.allMembers': 'All members',
      'report.memberFilter.empty': 'No members in the current report scope.',
      'transactions.allBooks': 'All Books',
      'transactions.fallbackName': 'Fallback',
      'transactions.notFoundTitle': 'Not Found',
      'transactions.notFoundDescription': 'Missing',
    }
    let msg = messages[key] ?? key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        msg = msg.replace(`{${k}}`, String(v))
      })
    }
    return msg
  })

  mockUseAccountBookStore.mockImplementation((selector: any) =>
    selector({
      accountBooks: [
        {
          id: 'book-1',
          name: 'Book 1',
          currency: 'TWD',
          userIds: ['user-a', 'user-b'],
        },
        {
          id: 'book-2',
          name: 'Book 2',
          currency: 'JPY',
          userIds: [],
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
      allUsers: mockUsers,
      activeUsers: mockUsers,
      isLoading: false,
      error: null,
    })
  )

  mockUseExportTransactionsCsv.mockReturnValue({ exportCsv: jest.fn() })
}

describe('MemberFilterSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setupCommonMocks()
  })

  it('shows trigger button, default state, and selects a member', () => {
    function Wrapper() {
      const [selected, setSelected] = useState<string | null>(null)
      return (
        <MemberFilterSelector
          availableMembers={mockUsers}
          selectedMemberId={selected}
          onChange={setSelected}
        />
      )
    }

    render(<Wrapper />)

    // Trigger initially shows default text
    expect(screen.getByText('Filter members')).toBeTruthy()

    // Open Popover
    fireEvent.click(screen.getByText('Filter members'))

    // Expect choices to show
    expect(screen.getByText('All members')).toBeTruthy()
    expect(screen.getByText('User A')).toBeTruthy()
    expect(screen.getByText('User B')).toBeTruthy()

    // Select User B
    fireEvent.click(screen.getByText('User B'))

    // Trigger should update to show User B's selected text
    expect(screen.getByText('Member: User B')).toBeTruthy()
  })
})

describe('AccountBookReportPage member filter integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setupCommonMocks()
    mockUseRouter.mockReturnValue({ query: { id: 'book-1' } })
  })

  it('populates available members based on transactions in current scope', () => {
    mockUseReportTransactions.mockReturnValue({
      transactions: [
        makeTransaction({
          id: 'tx-1',
          type: 'expense',
          amount: 1000,
          splitDetail: [
            { userId: 'user-a', amount: 400, userType: 'registered' },
            { userId: 'user-b', amount: 600, userType: 'registered' },
          ],
        }),
      ],
      isLoading: false,
      isFetching: false,
      error: null,
    })

    render(<AccountBookReportPage />)

    // Click filter trigger to verify options
    fireEvent.click(screen.getByText('Filter members'))
    expect(screen.getByText('User A')).toBeTruthy()
    expect(screen.getByText('User B')).toBeTruthy()
    expect(screen.queryByText('User C')).toBeNull() // User C has no transaction here
  })

  it('filters and maps amounts to selected member share', () => {
    mockUseReportTransactions.mockReturnValue({
      transactions: [
        makeTransaction({
          id: 'tx-1',
          type: 'expense',
          amount: 1000,
          splitDetail: [
            { userId: 'user-a', amount: 400, userType: 'registered' },
            { userId: 'user-b', amount: 600, userType: 'registered' },
          ],
        }),
        makeTransaction({
          id: 'tx-2',
          type: 'income',
          amount: 500,
          receivedByUserId: 'user-a',
        }),
        makeTransaction({
          id: 'tx-3',
          type: 'income',
          amount: 800,
          receivedByUserId: 'user-b',
        }),
      ],
      isLoading: false,
      isFetching: false,
      error: null,
    })

    render(<AccountBookReportPage />)

    // Initially, ReportSection should receive all transactions unmodified
    const initialCall = mockReportSection.mock.calls.at(-1)[0]
    expect(initialCall.transactions).toHaveLength(3)
    expect(initialCall.transactions[0].amount).toBe(1000)

    // Filter by User A
    fireEvent.click(screen.getByText('Filter members'))
    fireEvent.click(screen.getByText('User A'))

    // ReportSection should receive mapped transactions with User A's share
    const filteredCall = mockReportSection.mock.calls.at(-1)[0]
    expect(filteredCall.transactions).toHaveLength(2) // tx-1 (split) and tx-2 (income)
    
    const tx1Mapped = filteredCall.transactions.find((t: any) => t.id === 'tx-1')
    expect(tx1Mapped.amount).toBe(400) // Adjusted split share

    const tx2Mapped = filteredCall.transactions.find((t: any) => t.id === 'tx-2')
    expect(tx2Mapped.amount).toBe(500) // Full income amount
  })

  it('resets selection if selected member leaves scope', () => {
    mockUseReportTransactions.mockImplementation((_id: string, dateRange: any) => {
      if (dateRange?.startDate === '2026/02/01') {
        // Range change removes User B
        return {
          transactions: [
            makeTransaction({
              id: 'tx-2',
              type: 'income',
              amount: 500,
              receivedByUserId: 'user-a',
            }),
          ],
          isLoading: false,
          isFetching: false,
          error: null,
        }
      }
      return {
        transactions: [
          makeTransaction({
            id: 'tx-1',
            type: 'expense',
            amount: 1000,
            splitDetail: [
              { userId: 'user-b', amount: 1000, userType: 'registered' },
            ],
          }),
        ],
        isLoading: false,
        isFetching: false,
        error: null,
      }
    })

    render(<AccountBookReportPage />)

    // Select User B
    fireEvent.click(screen.getByText('Filter members'))
    fireEvent.click(screen.getByText('User B'))
    expect(screen.getByText('Member: User B')).toBeTruthy()

    // Trigger date range change (which leaves only User A in scope)
    fireEvent.click(screen.getByText('change-range'))

    // Selector should reset to default trigger text since User B is no longer in scope
    expect(screen.getByText('Filter members')).toBeTruthy()
  })

  it('keeps CSV export independent of member filtering', () => {
    mockUseReportTransactions.mockReturnValue({
      transactions: [
        makeTransaction({
          id: 'tx-1',
          type: 'expense',
          amount: 1000,
          splitDetail: [{ userId: 'user-a', amount: 1000, userType: 'registered' }],
        }),
      ],
      isLoading: false,
      isFetching: false,
      error: null,
    })

    render(<AccountBookReportPage />)

    // Select User A
    fireEvent.click(screen.getByText('Filter members'))
    fireEvent.click(screen.getByText('User A'))

    // Mock CSV export function checks
    const exportTransactions = mockUseExportTransactionsCsv.mock.calls.at(-1)[0]
    expect(exportTransactions).toHaveLength(1)
    expect(exportTransactions[0].id).toBe('tx-1')
    expect(exportTransactions[0].amount).toBe(1000) // Amount should NOT be mapped for CSV export
  })

  describe('Shared Wallet behavior', () => {
    it('excludes shared wallet from selectable members', () => {
      mockUseReportTransactions.mockReturnValue({
        transactions: [
          makeTransaction({
            id: 'tx-1',
            type: 'expense',
            amount: 1000,
            splitDetail: [
              { userId: 'user-a', amount: 400, userType: 'registered' },
              { userId: 'shared-wallet', amount: 600, userType: 'virtual' },
            ],
          }),
        ],
        isLoading: false,
        isFetching: false,
        error: null,
      })

      render(<AccountBookReportPage />)

      fireEvent.click(screen.getByText('Filter members'))
      expect(screen.getByText('User A')).toBeTruthy()
      expect(screen.queryByText('Shared Wallet')).toBeNull() // Excluded
    })

    it('distributes shared wallet split proportionally to real members', () => {
      mockUseReportTransactions.mockReturnValue({
        transactions: [
          makeTransaction({
            id: 'tx-1',
            type: 'expense',
            amount: 1500,
            splitDetail: [
              { userId: 'user-a', amount: 500, userType: 'registered' },
              { userId: 'user-b', amount: 400, userType: 'registered' },
              { userId: 'shared-wallet', amount: 600, userType: 'virtual' },
            ],
          }),
          makeTransaction({
            id: 'tx-2',
            type: 'income',
            amount: 900,
            receivedByUserId: 'shared-wallet',
          }),
        ],
        isLoading: false,
        isFetching: false,
        error: null,
      })

      render(<AccountBookReportPage />)

      // Filter by User A
      fireEvent.click(screen.getByText('Filter members'))
      fireEvent.click(screen.getByText('User A'))

      const filteredCall = mockReportSection.mock.calls.at(-1)[0]
      expect(filteredCall.transactions).toHaveLength(2)

      const tx1Mapped = filteredCall.transactions.find((t: any) => t.id === 'tx-1')
      // Real members: User A, User B, User C (from mockUsers). Total 3 real members.
      // Shared wallet share: 600 / 3 = 200
      // User A direct: 500
      // Expected total = 700
      expect(tx1Mapped.amount).toBe(700)

      const tx2Mapped = filteredCall.transactions.find((t: any) => t.id === 'tx-2')
      // Income to shared wallet: 900
      // Shared wallet share: 900 / 3 = 300
      // Expected total = 300
      expect(tx2Mapped.amount).toBe(300)
    })
  })
})
