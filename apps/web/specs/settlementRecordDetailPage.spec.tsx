import { render, screen, waitFor } from '@testing-library/react'
import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/router'
import SettlementRecordDetailPage from '../src/pages/account-books/[id]/settlement/[recordId]'
import { AccountBook } from '../src/entities/accountBook'
import {
  Category,
  CategoryBulkCreateResult,
  CategoryBulkDeleteResult,
  CategoryBulkUpdateInput,
  CategoryBulkUpdateResult,
  CategoryRepo,
} from '../src/entities/category'
import { SettlementRecord, SettlementRepo } from '../src/entities/settlement'
import { Transaction, TransactionRepo } from '../src/entities/transaction'
import { userList } from '../src/mocks/user'
import {
  AccountBookStoreProvider,
  createAccountBookStore,
} from '../src/stores/accountBook'
import {
  CategoryStoreProvider,
  createCategoryStore,
} from '../src/stores/category'
import { UserStoreProvider, createUserStore } from '../src/stores/user'

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

let mockTransactionRepo: TransactionRepo

jest.mock('../src/repositories/transactionRepo', () => ({
  TransactionLocalRepo: jest.fn().mockImplementation(() => mockTransactionRepo),
}))

let mockSettlementRepo: SettlementRepo

jest.mock('../src/repositories/settlementRepo', () => ({
  SettlementLocalRepo: jest.fn().mockImplementation(() => mockSettlementRepo),
}))

jest.mock('../src/components/settlement/SettlementRecordDetail', () => ({
  __esModule: true,
  default: function MockSettlementRecordDetail({ transactions }: any) {
    return (
      <div>
        <div data-testid="transaction-count">{transactions.length}</div>
        {transactions.map((transaction: Transaction) => (
          <div key={transaction.id}>{transaction.description}</div>
        ))}
      </div>
    )
  },
}))

jest.mock('../src/components/TransactionModal', () => ({
  __esModule: true,
  TransactionModal: () => null,
}))

jest.mock('@heroui/react', () => {
  const actual = jest.requireActual('@heroui/react')

  return {
    ...actual,
    addToast: jest.fn(),
    Button: ({ children, onClick, onPress, startContent, ...props }: any) => {
      const {
        onClick: _ignoredOnClick,
        startContent: _ignoredStartContent,
        ...restProps
      } = props

      return (
        <button
          type="button"
          onClick={(event) => {
            if (typeof onPress === 'function') {
              onPress(event)
              return
            }

            if (typeof onClick === 'function') {
              onClick(event)
            }
          }}
          {...restProps}
        >
          {startContent}
          {children}
        </button>
      )
    },
  }
})

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
    const nextCategories = this.categories.filter(
      (category) => category.id !== id
    )
    const deleted = nextCategories.length !== this.categories.length
    this.categories.splice(0, this.categories.length, ...nextCategories)
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

class InMemorySettlementRepo implements SettlementRepo {
  constructor(private readonly records: SettlementRecord[]) {}

  async create(record: SettlementRecord): Promise<SettlementRecord> {
    this.records.push(record)
    return record
  }

  async findById(id: string): Promise<SettlementRecord | null> {
    return this.records.find((record) => record.id === id) ?? null
  }

  async findByAccountBookId(
    accountBookId: string
  ): Promise<SettlementRecord[]> {
    return this.records.filter(
      (record) => record.accountBookId === accountBookId
    )
  }

  async update(
    id: string,
    updates: Partial<SettlementRecord>
  ): Promise<SettlementRecord | null> {
    const index = this.records.findIndex((record) => record.id === id)

    if (index === -1) {
      return null
    }

    const updated = {
      ...this.records[index],
      ...updates,
    }

    this.records[index] = updated
    return updated
  }
}

const baseTimestamp = 1710000000000

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
    categoryId: 'category-1',
    amount: 120,
    date: '2026/04/01',
    description: 'Breakfast with friends',
    paymentMethod: 'Cash',
    receivedByUserId: null,
    settlementRecordId: 'record-1',
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

function createSettlementRecordFixture(
  overrides: Partial<SettlementRecord> = {}
): SettlementRecord {
  return {
    id: 'record-1',
    accountBookId: 'book-1',
    memberStatuses: [
      {
        userId: userList[0]!.id,
        paidAmount: 120,
        splitAmount: 60,
        netAmount: 60,
      },
      {
        userId: userList[1]!.id,
        paidAmount: 0,
        splitAmount: 60,
        netAmount: -60,
      },
    ],
    transfers: [
      {
        id: 'transfer-1',
        fromUserId: userList[1]!.id,
        toUserId: userList[0]!.id,
        suggestedAmount: 60,
        actualAmount: null,
        note: '',
        status: 'pending',
        completedAt: null,
      },
    ],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    ...overrides,
  }
}

function createMockTransactionRepo(): TransactionRepo {
  return {
    create: jest.fn(async (transaction: Transaction) => transaction),
    findById: jest.fn(async () => null),
    findAll: jest.fn(async () => []),
    findByAccountBookId: jest.fn(async () => []),
    findUnsettledExpenseByAccountBookId: jest.fn(async () => []),
    findBySettlementRecordId: jest.fn(async () => [createTransactionFixture()]),
    update: jest.fn(async () => null),
    delete: jest.fn(async () => false),
    clear: jest.fn(async () => undefined),
  }
}

function renderPage() {
  const accountBookStore = createAccountBookStore(undefined, {
    accountBooks: [createAccountBookFixture()],
    initialized: true,
  })
  const categoryStore = createCategoryStore(
    new InMemoryCategoryRepo([
      {
        id: 'category-1',
        name: 'Food',
        imageUrl: 'https://example.com/food.png',
        description: 'Food category',
        type: 'expense',
        parentId: null,
        accountBookId: 'book-1',
        sortOrder: 0,
      },
    ])
  )
  const userStore = createUserStore(undefined, undefined, {
    allUsers: userList.slice(0, 2).map((user) => ({
      ...user,
      type: 'registered' as const,
    })),
    activeUsers: userList.slice(0, 2).map((user) => ({
      ...user,
      type: 'registered' as const,
    })),
    scopedAccountBookId: 'book-1',
  })

  return render(
    <ThemeProvider attribute="class">
      <HeroUIProvider>
        <AccountBookStoreProvider store={accountBookStore}>
          <CategoryStoreProvider store={categoryStore}>
            <UserStoreProvider store={userStore}>
                <SettlementRecordDetailPage />
            </UserStoreProvider>
          </CategoryStoreProvider>
        </AccountBookStoreProvider>
      </HeroUIProvider>
    </ThemeProvider>
  )
}

describe('Settlement record detail page', () => {
  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({
      query: { id: 'book-1', recordId: 'record-1' },
      push: jest.fn(),
    })

    mockTransactionRepo = createMockTransactionRepo()
    mockSettlementRepo = new InMemorySettlementRepo([createSettlementRecordFixture()])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('loads only transactions for the settlement record', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByTestId('transaction-count').textContent).toBe('1')
    })

    expect(screen.getByText('Breakfast with friends')).toBeTruthy()
    expect(mockTransactionRepo.findBySettlementRecordId).toHaveBeenCalledWith(
      'record-1'
    )
    expect(mockTransactionRepo.findByAccountBookId).not.toHaveBeenCalled()
  })
})
