import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { HeroUIProvider, addToast } from '@heroui/react'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SettlementPage from '../src/pages/account-books/[id]/settlement'
import SettlementRecordDetailPage from '../src/pages/account-books/[id]/settlement/[recordId]'
import SettlementConfirmModal from '../src/components/settlement/SettlementConfirmModal'
import { AccountBook } from '../src/entities/accountBook'
import { User } from '../src/entities/user'
import {
  Category,
  CategoryBulkCreateResult,
  CategoryBulkDeleteResult,
  CategoryBulkUpdateInput,
  CategoryBulkUpdateResult,
  CategoryRepo,
} from '../src/entities/category'
import {
  Transaction,
  UNSETTLED_SETTLEMENT_RECORD_ID,
} from '../src/entities/transaction'
import { db } from '../src/lib/dexie'
import { userList } from './fixtures'
import SettlementLocalRepo from '../src/repositories/settlementRepo/settlementLocalRepo'
import TransactionLocalRepo from '../src/repositories/transactionRepo/transactionLocalRepo'
import {
  AccountBookStoreProvider,
  createAccountBookStore,
} from '../src/stores/accountBook'
import {
  CategoryStoreProvider,
  createCategoryStore,
} from '../src/stores/category'
import { UserStoreProvider, createUserStore } from '../src/stores/user'
import {
  SettingsStoreProvider,
  createSettingsStore,
} from '../src/stores/settings'
import {
  TransactionModalLauncherProvider,
  useOpenCreateTransaction,
} from '../src/components/TransactionModal/TransactionModalLauncher'
import { transactionRangeQueryKey } from '../src/hooks/transactionQueryUtils'

const FAKE_SETTINGS_REPO = {
  async getSettings() {
    return {
      id: 'app' as const,
      language: 'en-US' as const,
      onboardingCompleted: true,
      updatedAt: 0,
    }
  },
  async upsertSettings(s: any) {
    return s
  },
}

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/utils/genUuid', () => {
  let counter = 0

  return {
    genUuid: jest.fn(() => `settlement-id-${++counter}`),
  }
})

jest.mock('@heroui/react', () => {
  const actual = jest.requireActual('@heroui/react')
  const React = jest.requireActual('react')

  return {
    ...actual,
    addToast: jest.fn(),
    Button: ({
      children,
      disabled,
      disableRipple,
      isIconOnly,
      isDisabled,
      isLoading,
      onClick,
      onPress,
      startContent,
      ...props
    }: any) => {
      void disableRipple
      void isIconOnly

      return (
        <button
          type="button"
          aria-busy={isLoading ? 'true' : undefined}
          disabled={disabled ?? isDisabled}
          onClick={(event) => {
            if (typeof onPress === 'function') {
              onPress(event)
              return
            }

            if (typeof onClick === 'function') {
              onClick(event)
            }
          }}
          {...props}
        >
          {startContent}
          {children}
        </button>
      )
    },
    Modal: ({ children, isOpen }: any) =>
      isOpen ? <div role="dialog">{children}</div> : null,
    ModalContent: ({ children }: any) => <div>{children}</div>,
    ModalHeader: ({ children }: any) => <div>{children}</div>,
    ModalBody: ({ children }: any) => <div>{children}</div>,
    ModalFooter: ({ children }: any) => <div>{children}</div>,
    Tabs: ({ children }: any) => <div>{children}</div>,
    Tab: ({ children, title }: any) => (
      <div>
        <div role="tab">{title}</div>
        {children}
      </div>
    ),
    Avatar: ({ name }: any) => <div>{name}</div>,
    Chip: ({ children }: any) => <span>{children}</span>,
  }
})

const transactionRepo = new TransactionLocalRepo()
const baseTimestamp = 1710000000000
const mockPush = jest.fn()
const mockReplace = jest.fn()
const listRouter = {
  query: { id: 'book-1' },
  push: mockPush,
  replace: mockReplace,
  pathname: '/account-books/[id]/settlement',
}

class InMemoryCategoryRepo implements CategoryRepo {
  constructor(private readonly categories: Category[] = []) {}

  async create(category: Category): Promise<Category> {
    this.categories.push(category)
    return category
  }

  async bulkCreate(categories: Category[]): Promise<CategoryBulkCreateResult> {
    this.categories.push(...categories)

    return {
      created: categories,
      failedIds: [],
      errors: [],
    }
  }

  async findById(id: string): Promise<Category | null> {
    return this.categories.find((category) => category.id === id) ?? null
  }

  async findAll(): Promise<Category[]> {
    return [...this.categories]
  }

  async findByParent(parentId: string | null): Promise<Category[]> {
    return this.categories.filter((category) => category.parentId === parentId)
  }

  async findListByType(type: Transaction['type']): Promise<Category[]> {
    return this.categories.filter((category) => category.type === type)
  }

  async findByAccountBookId(accountBookId: string): Promise<Category[]> {
    return this.categories.filter(
      (category) => category.accountBookId === accountBookId
    )
  }

  async update(
    id: string,
    updates: Partial<Category>
  ): Promise<Category | null> {
    const index = this.categories.findIndex((category) => category.id === id)

    if (index === -1) {
      return null
    }

    const updated = {
      ...this.categories[index],
      ...updates,
    }

    this.categories[index] = updated
    return updated
  }

  async bulkUpdate(
    updates: CategoryBulkUpdateInput[]
  ): Promise<CategoryBulkUpdateResult> {
    const updated: Category[] = []

    for (const entry of updates) {
      const category = await this.update(entry.id, entry.changes)
      if (category) {
        updated.push(category)
      }
    }

    return {
      updated,
      failedIds: [],
      errors: [],
    }
  }

  async delete(id: string): Promise<boolean> {
    const nextLength = this.categories.filter(
      (category) => category.id !== id
    ).length
    const deleted = nextLength !== this.categories.length
    this.categories.splice(
      0,
      this.categories.length,
      ...this.categories.filter((category) => category.id !== id)
    )
    return deleted
  }

  async bulkDelete(ids: string[]): Promise<CategoryBulkDeleteResult> {
    this.categories.splice(
      0,
      this.categories.length,
      ...this.categories.filter((category) => !ids.includes(category.id))
    )

    return {
      deletedIds: ids,
      failedIds: [],
      errors: [],
    }
  }

  async clear(): Promise<void> {
    this.categories.splice(0, this.categories.length)
  }
}

function createAccountBookFixture(
  overrides: Partial<AccountBook> = {}
): AccountBook {
  return {
    id: 'book-1',
    name: 'Trip fund',
    currency: 'TWD',
    description: 'Shared spending book',
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    ownerId: userList[0]!.id,
    userIds: userList.slice(0, 2).map((user) => user.id),
    virtualUsers: [],
    ...overrides,
  }
}

function createTransactionFixture(
  overrides: Partial<Transaction> = {}
): Transaction {
  return {
    id: 'tx-1',
    type: 'expense',
    accountBookId: 'book-1',
    categoryId: '1-1',
    amount: 120,
    date: '2026/04/01',
    description: 'Breakfast with friends',
    paymentMethod: 'Cash',
    receivedByUserId: null,
    settlementRecordId: UNSETTLED_SETTLEMENT_RECORD_ID,
    tags: [],
    paidByDetail: [
      {
        userId: userList[0]!.id,
        userType: 'registered',
        amount: 120,
      },
    ],
    splitDetail: [
      {
        userId: userList[0]!.id,
        userType: 'registered',
        amount: 60,
      },
      {
        userId: userList[1]!.id,
        userType: 'registered',
        amount: 60,
      },
    ],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    deletedAt: null,
    ...overrides,
  }
}

function OpenTransactionButton() {
  const openCreateTransaction = useOpenCreateTransaction()

  return (
    <button type="button" onClick={() => openCreateTransaction()}>
      Open transaction
    </button>
  )
}

function renderSettlementPage(page = <SettlementPage />) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const accountBookStore = createAccountBookStore(undefined, {
    accountBooks: [createAccountBookFixture()],
    currentAccountBookId: 'book-1',
    initialized: true,
  })
  const categoryStore = createCategoryStore(
    new InMemoryCategoryRepo([
      {
        id: '1-1',
        name: 'Food',
        icon: { kind: 'custom', url: 'https://example.com/food.png' } as const,
        description: 'Food category',
        type: 'expense',
        parentId: null,
        accountBookId: 'book-1',
        sortOrder: 0,
      },
    ])
  )
  const userStore = createUserStore(undefined, undefined, {
    allUsers: userList.map((user) => ({ ...user, type: 'registered' as const })),
    activeUsers: userList.slice(0, 2).map((user) => ({
      ...user,
      type: 'registered' as const,
    })),
    scopedAccountBookId: 'book-1',
  })
  const settingsStore = createSettingsStore(FAKE_SETTINGS_REPO, {
    initialized: true,
    onboardingCompleted: true,
  })

  const renderResult = render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        <HeroUIProvider>
          <AccountBookStoreProvider store={accountBookStore}>
            <CategoryStoreProvider store={categoryStore}>
              <UserStoreProvider store={userStore}>
                <SettingsStoreProvider store={settingsStore}>
                  <TransactionModalLauncherProvider>
                    {page}
                    <OpenTransactionButton />
                  </TransactionModalLauncherProvider>
                </SettingsStoreProvider>
              </UserStoreProvider>
            </CategoryStoreProvider>
          </AccountBookStoreProvider>
        </HeroUIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )

  return { ...renderResult, queryClient }
}

async function openSettlementReview() {
  const button = await screen.findByRole('button', { name: 'Review & settle' })
  await waitFor(() => expect(button).toHaveProperty('disabled', false))
  fireEvent.click(button)
}

async function openMarkdownDraft(review: ReturnType<typeof within>) {
  fireEvent.click(review.getByRole('button', { name: 'Export draft' }))
  const menu = within(await screen.findByRole('menu', { name: 'Export draft' }))
  expect(menu.getByRole('menuitem', { name: 'Image (PNG)' })).toBeTruthy()
  fireEvent.click(menu.getByRole('menuitem', { name: 'Markdown' }))
  const heading = await screen.findByRole('heading', {
    name: 'Export as Markdown — Settlement draft',
  })
  const dialog = within(heading.closest<HTMLElement>('[role="dialog"]')!)
  const output = dialog.getByText(
    (_, element) => element?.matches('pre') === true
  )
  return { dialog, markdown: output.textContent ?? '' }
}

describe('Settlement page', () => {
  beforeEach(async () => {
    ;(useRouter as jest.Mock).mockReturnValue(listRouter)

    await db.delete()
    await db.open()
    await db.accountBooks.add(createAccountBookFixture())
    await db.users.bulkAdd(userList)
    await transactionRepo.create(createTransactionFixture())
  })

  afterEach(async () => {
    await db.delete()
    jest.clearAllMocks()
  })

  it('disables image draft export while confirmation is submitting', () => {
    const onConfirm = jest.fn(async () => undefined)
    render(
      <SettlementConfirmModal
        isOpen
        isSubmitting
        memberStatuses={[]}
        transferSuggestions={[]}
        transactions={[createTransactionFixture()]}
        users={[]}
        categoryNames={new Map()}
        currency="TWD"
        onConfirm={onConfirm}
        onClose={jest.fn()}
      />
    )
    const action = screen.getByRole('button', { name: 'Export draft' })
    expect(action).toHaveProperty('disabled', true)
    fireEvent.click(action)
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('shows Shared Wallet and rounded results in confirmation and eligible expenses only in the draft', async () => {
    const wallet: User = {
      id: 'review-wallet',
      accountBookId: 'book-1',
      type: 'virtual',
      name: 'Shared travel fund',
      isSharedWallet: true,
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
    }

    await db.accountBooks.update('book-1', { virtualUsers: [wallet] })
    await transactionRepo.update('tx-1', {
      amount: 300.5,
      paidByDetail: [
        { userId: userList[0]!.id, userType: 'registered', amount: 300.5 },
      ],
      splitDetail: userList.slice(0, 2).map(({ id }) => ({
        userId: id,
        userType: 'registered',
        amount: 150.25,
      })),
    })
    for (const overrides of [
      {
        id: 'wallet-meal',
        description: 'Wallet lunch',
        amount: 90,
        paidByDetail: [
          { userId: wallet.id, userType: 'virtual' as const, amount: 90 },
        ],
        splitDetail: userList.slice(0, 2).map(({ id }) => ({
          userId: id,
          userType: 'registered' as const,
          amount: 45,
        })),
      },
      {
        id: 'settled',
        description: 'Settled taxi',
        settlementRecordId: 'record-1',
      },
      { id: 'deleted', description: 'Deleted snack', deletedAt: baseTimestamp },
      {
        id: 'other',
        description: 'Other book hotel',
        accountBookId: 'other-book',
      },
      {
        id: 'income',
        type: 'income' as const,
        description: 'Income adjustment',
        receivedByUserId: userList[0]!.id,
      },
    ]) {
      const transaction = createTransactionFixture(overrides)
      await db.transactions.add(transaction)
    }

    renderSettlementPage()
    expect(await screen.findByText('Breakfast with friends')).toBeTruthy()
    await openSettlementReview()
    const dialog = within(screen.getByRole('dialog'))
    expect(dialog.queryByText('Breakfast with friends')).toBeNull()
    expect(dialog.queryByText('Included expenses (2)')).toBeNull()
    expect(dialog.getByText('Shared Wallet Summary')).toBeTruthy()
    expect(dialog.getByText('45 TWD')).toBeTruthy()
    expect(dialog.getByText('151 TWD')).toBeTruthy()

    fireEvent.click(dialog.getByRole('switch'))
    expect(dialog.getByText('150.25 TWD')).toBeTruthy()

    const { markdown } = await openMarkdownDraft(dialog)
    expect(markdown).toContain('## Included expenses (2)')
    expect(markdown).toContain('2026/04/01 · Breakfast with friends · 300.5 TWD')
    expect(markdown).toContain('2026/04/01 · Wallet lunch · 90 TWD')
    expect(markdown).toContain('Category: Food')
    expect(markdown).toContain(`Paid by: ${userList[0]!.name} 300.5 TWD`)
    expect(markdown).toContain(
      `Split with: ${userList[0]!.name} 150.25 TWD, ${userList[1]!.name} 150.25 TWD`
    )
    expect(markdown).not.toMatch(
      /Settled taxi|Deleted snack|Other book hotel|Income adjustment/
    )
  })

  it('previews and copies rounded and precise drafts without settling expenses', async () => {
    await transactionRepo.update('tx-1', {
      description: '晚餐 | Dinner',
      splitDetail: [
        { userId: userList[0]!.id, userType: 'registered', amount: 59.75 },
        { userId: userList[1]!.id, userType: 'registered', amount: 60.25 },
      ],
    })
    const originalClipboard = Object.getOwnPropertyDescriptor(
      navigator,
      'clipboard'
    )
    const writeText = jest.fn(async (_text: string) => undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    try {
      renderSettlementPage()
      await openSettlementReview()
      const review = within(screen.getByRole('dialog'))

      expect(review.getByText('61 TWD')).toBeTruthy()
      const rounded = await openMarkdownDraft(review)
      expect(rounded.markdown).toMatch(
        /^# Settlement draft\n\nExported at \d{4}-.+Z/m
      )
      expect(rounded.markdown).toContain('_Auto-rounding on_')
      expect(rounded.markdown).toContain('61 TWD')
      expect(rounded.markdown).toContain('## Included expenses (1)')
      expect(rounded.markdown).toContain('晚餐 \\| Dinner')
      fireEvent.click(
        rounded.dialog.getByRole('button', { name: 'Copy markdown' })
      )
      await waitFor(() =>
        expect(writeText).toHaveBeenCalledWith(rounded.markdown)
      )
      fireEvent.click(rounded.dialog.getByRole('button', { name: 'Close' }))

      expect(screen.getAllByRole('dialog')).toHaveLength(1)
      fireEvent.click(review.getByRole('switch'))
      expect(review.getByText('60.25 TWD')).toBeTruthy()
      const precise = await openMarkdownDraft(review)
      expect(precise.markdown).toContain('_Auto-rounding off_')
      expect(precise.markdown).toContain(
        `${userList[1]!.name} → ${userList[0]!.name}: 60.25 TWD`
      )
      expect(await db.settlements.count()).toBe(0)
      expect((await transactionRepo.findById('tx-1'))?.settlementRecordId).toBe(
        UNSETTLED_SETTLEMENT_RECORD_ID
      )

      writeText.mockRejectedValueOnce(new Error('Clipboard unavailable'))
      fireEvent.click(
        precise.dialog.getByRole('button', { name: 'Copy markdown' })
      )
      await waitFor(() =>
        expect(addToast).toHaveBeenCalledWith({
          title: 'Copy failed',
          description: 'Please select and copy the text manually.',
          color: 'danger',
        })
      )
      expect(
        precise.dialog.getByText((_, element) => element?.matches('pre') === true)
          .textContent
      ).toBe(precise.markdown)
      fireEvent.click(precise.dialog.getByRole('button', { name: 'Close' }))

      fireEvent.click(
        review.getByRole('button', { name: 'Create settlement record' })
      )
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
      const [record] = await db.settlements.toArray()
      expect(record?.transfers[0]?.suggestedAmount).toBe(60.25)
    } finally {
      if (originalClipboard) {
        Object.defineProperty(navigator, 'clipboard', originalClipboard)
      } else {
        Reflect.deleteProperty(navigator, 'clipboard')
      }
    }
  })

  it('refreshes a same-count split edit, then saves the newly confirmed precise values', async () => {
    const create = SettlementLocalRepo.prototype.create
    const attemptedSave = jest
      .spyOn(SettlementLocalRepo.prototype, 'create')
      .mockImplementationOnce(async function (
        this: SettlementLocalRepo,
        record,
        reviewed
      ) {
        await transactionRepo.update('tx-1', {
          splitDetail: [
            { userId: userList[0]!.id, userType: 'registered', amount: 79.75 },
            { userId: userList[1]!.id, userType: 'registered', amount: 40.25 },
          ],
        })
        return create.call(this, record, reviewed)
      })

    try {
      renderSettlementPage()
      await openSettlementReview()
      const dialog = within(screen.getByRole('dialog'))
      const submit = dialog.getByRole('button', {
        name: 'Create settlement record',
      })

      expect(dialog.getByText('60 TWD')).toBeTruthy()
      fireEvent.click(submit)

      expect(
        await dialog.findByText(
          'The settlement details changed. Review the updated overview before confirming.'
        )
      ).toBeTruthy()
      expect(await dialog.findByText('41 TWD')).toBeTruthy()
      expect(await db.settlements.count()).toBe(0)
      expect((await transactionRepo.findById('tx-1'))?.settlementRecordId).toBe(
        UNSETTLED_SETTLEMENT_RECORD_ID
      )

      await waitFor(() => expect(submit).toHaveProperty('disabled', false))
      fireEvent.click(submit)
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
      const [record] = await db.settlements.toArray()
      expect(record?.transfers[0]?.suggestedAmount).toBe(40.25)
      expect((await transactionRepo.findById('tx-1'))?.settlementRecordId).toBe(
        record?.id
      )
    } finally {
      attemptedSave.mockRestore()
    }
  })

  it('warns when the live review becomes empty and closes and disables the export menu', async () => {
    renderSettlementPage()
    await openSettlementReview()
    const dialog = within(screen.getByRole('dialog'))
    fireEvent.click(dialog.getByRole('button', { name: 'Export draft' }))
    expect(await screen.findByRole('menu', { name: 'Export draft' })).toBeTruthy()

    await act(async () => {
      await new SettlementLocalRepo().create(
        {
          id: 'record-from-other-view',
          accountBookId: 'book-1',
          memberStatuses: [],
          transfers: [],
          createdAt: baseTimestamp,
          updatedAt: baseTimestamp,
        },
        ['tx-1']
      )
    })

    expect(await dialog.findByText('There are no unsettled transactions.')).toBeTruthy()
    expect(dialog.getByRole('status').textContent).toBe(
      'The settlement details changed. Review the updated overview before confirming.'
    )
    expect(
      dialog.getByRole('button', { name: 'Create settlement record' })
    ).toHaveProperty('disabled', true)
    expect(
      dialog.getByRole('button', { name: 'Export draft' })
    ).toHaveProperty('disabled', true)
    expect(screen.queryByRole('menu', { name: 'Export draft' })).toBeNull()
    expect(await db.settlements.count()).toBe(1)
  })

  it('requires a fresh confirmation when another view adds a member before saving', async () => {
    const wallet = {
      id: 'review-wallet',
      accountBookId: 'book-1',
      name: 'Shared travel fund',
      isSharedWallet: true,
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
    }
    await db.accountBooks.put(
      createAccountBookFixture({ virtualUsers: [wallet] })
    )
    await transactionRepo.update('tx-1', {
      paidByDetail: [{ userId: wallet.id, userType: 'virtual', amount: 120 }],
    })

    const create = SettlementLocalRepo.prototype.create
    const attemptedSave = jest
      .spyOn(SettlementLocalRepo.prototype, 'create')
      .mockImplementationOnce(async function (
        this: SettlementLocalRepo,
        record,
        reviewed
      ) {
        await db.accountBooks.update('book-1', {
          virtualUsers: [
            wallet,
            { ...wallet, id: 'third-member', name: 'Carol', isSharedWallet: false },
          ],
        })
        return create.call(this, record, reviewed)
      })

    try {
      renderSettlementPage()
      await openSettlementReview()
      const dialog = within(screen.getByRole('dialog'))
      expect(dialog.getByText('60 TWD')).toBeTruthy()
      const submit = dialog.getByRole('button', {
        name: 'Create settlement record',
      })
      fireEvent.click(submit)

      expect(await dialog.findByRole('status')).toBeTruthy()
      expect(await dialog.findAllByText('-60 TWD')).toHaveLength(2)
      expect(await db.settlements.count()).toBe(0)
      expect((await db.transactions.get('tx-1'))?.settlementRecordId).toBe(
        UNSETTLED_SETTLEMENT_RECORD_ID
      )

      await waitFor(() => expect(submit).toHaveProperty('disabled', false))
      fireEvent.click(submit)
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
      const [record] = await db.settlements.toArray()
      expect(record?.transfers).toMatchObject(
        userList.map(({ id }) => ({
          fromUserId: id,
          toUserId: wallet.id,
          suggestedAmount: 60,
        }))
      )
      expect((await db.transactions.get('tx-1'))?.settlementRecordId).toBe(
        record?.id
      )
    } finally {
      attemptedSave.mockRestore()
    }
  })

  it('keeps the current review open if writing the record fails', async () => {
    const attemptedSave = jest
      .spyOn(SettlementLocalRepo.prototype, 'create')
      .mockRejectedValueOnce(new Error('Write failed'))

    try {
      renderSettlementPage()
      await openSettlementReview()
      const dialog = within(screen.getByRole('dialog'))
      const submit = dialog.getByRole('button', {
        name: 'Create settlement record',
      })
      fireEvent.click(submit)

      await waitFor(() =>
        expect(addToast).toHaveBeenCalledWith({
          title: 'Unable to create settlement',
          description: 'Please try again.',
          color: 'danger',
        })
      )
      expect(dialog.queryByRole('status')).toBeNull()
      expect(submit).toHaveProperty('disabled', false)
      expect(await db.settlements.count()).toBe(0)
    } finally {
      attemptedSave.mockRestore()
    }
  })

  it('restores expenses and transfer suggestions after canceling a settlement', async () => {
    const originalPage = renderSettlementPage()

    expect(await screen.findByText('Breakfast with friends')).toBeTruthy()
    expect(screen.getByTestId('settlement-page').dataset.ui).toBe(
      'page-scaffold'
    )
    expect(
      screen.getByRole('heading', { name: 'Settlement' }).className
    ).toContain('text-headline')
    expect(screen.getByText('Trip fund').className).toContain('text-body')
    expect(screen.getByTestId('unsettled-summary').dataset.ui).toBe(
      'surface-card'
    )

    await openSettlementReview()
    fireEvent.click(
      screen.getByRole('button', { name: 'Create settlement record' })
    )

    await waitFor(() => {
      expect(screen.getByText('All settled')).toBeTruthy()
    })
    expect(screen.queryByText('Breakfast with friends')).toBeNull()
    expect(addToast).toHaveBeenCalledWith({
      title: 'Settlement record created',
      color: 'success',
    })

    const recordList = await screen.findByTestId('settlement-record-list')
    const recordButton = within(recordList).getByRole('button', {
      name: /Settlement #1/,
    })
    expect(recordButton.className).toContain('min-h-11')
    expect(
      within(recordButton).getByRole('heading', { name: 'Settlement #1' })
        .className
    ).toContain('text-title')
    expect(
      within(recordButton).getByText('0/1 transfers done').className
    ).toContain('text-label')
    fireEvent.click(recordButton)
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringMatching(/^\/account-books\/book-1\/settlement\//)
    )
    const [record] = await db.settlements.toArray()
    originalPage.unmount()
    ;(useRouter as jest.Mock).mockReturnValue({
      ...listRouter,
      query: { id: 'book-1', recordId: record.id },
      pathname: '/account-books/[id]/settlement/[recordId]',
    })
    const detailPage = renderSettlementPage(<SettlementRecordDetailPage />)
    const actionsButton = await screen.findByRole('button', {
      name: 'Settlement actions',
    })
    await waitFor(() => expect(actionsButton).toHaveProperty('disabled', false))
    fireEvent.click(actionsButton)
    fireEvent.click(
      await screen.findByRole('menuitem', { name: 'Cancel settlement' })
    )
    const confirmButton = await screen.findByRole('button', {
      name: 'Confirm cancellation',
    })
    expect(confirmButton.getAttribute('variant')).toBe('solid')
    expect(confirmButton.getAttribute('color')).toBe('danger')
    expect(confirmButton.className).toContain('!text-white')
    fireEvent.click(confirmButton)
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        '/account-books/book-1/settlement'
      )
    })
    detailPage.unmount()
    ;(useRouter as jest.Mock).mockReturnValue(listRouter)
    renderSettlementPage()
    expect(await screen.findByText('Breakfast with friends')).toBeTruthy()
    expect(
      await screen.findByTestId('settlement-records-empty-state')
    ).toBeTruthy()
    await openSettlementReview()
    expect(
      within(screen.getByRole('dialog')).getByText('Suggested transfers')
    ).toBeTruthy()
  })

  it('refreshes the open settlement page when another view cancels a record', async () => {
    renderSettlementPage()
    await openSettlementReview()
    fireEvent.click(
      screen.getByRole('button', { name: 'Create settlement record' })
    )
    await screen.findByText('All settled')
    await screen.findByRole('button', { name: /Settlement #1/ })
    expect(screen.getByRole('tab', { name: 'Settled 1' })).toBeTruthy()

    const [record] = await db.settlements.toArray()
    await act(async () => {
      await new SettlementLocalRepo().cancel(record.accountBookId, record.id)
    })

    await screen.findByText('Breakfast with friends')
    await screen.findByTestId('settlement-records-empty-state')
    expect(screen.getByRole('tab', { name: 'Settled' })).toBeTruthy()
  })

  it('creates a transaction in place and updates transaction query caches', async () => {
    const { queryClient } = renderSettlementPage()
    const rangeKey = transactionRangeQueryKey(
      'book-1',
      '2026/01/01',
      '2026/12/31'
    )
    queryClient.setQueryData<Transaction[]>(rangeKey, [])

    await screen.findByText('Breakfast with friends')
    fireEvent.click(screen.getByRole('button', { name: 'Open transaction' }))
    expect(await screen.findByRole('dialog')).toBeTruthy()

    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '240' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Dinner after settlement' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      expect(queryClient.getQueryData<Transaction[]>(rangeKey)).toEqual([
        expect.objectContaining({
          accountBookId: 'book-1',
          amount: 240,
          description: 'Dinner after settlement',
        }),
      ])
    })

    expect(await screen.findByText('Dinner after settlement')).toBeTruthy()
    expect(mockPush).not.toHaveBeenCalled()
  })
})
