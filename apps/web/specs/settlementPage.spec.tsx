import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/router'
import SettlementPage from '../src/pages/account-books/[id]/settlement'
import { AccountBook } from '../src/entities/accountBook'
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
      isDisabled,
      isLoading,
      onClick,
      onPress,
      ...props
    }: any) => {
      const {
        onClick: _ignored,
        disableRipple: _ignoredDisableRipple,
        ...restProps
      } = props

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
          {...restProps}
        >
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
    Tab: ({ children }: any) => <div>{children}</div>,
    Avatar: ({ name }: any) => <div>{name}</div>,
    Chip: ({ children }: any) => <span>{children}</span>,
  }
})

const transactionRepo = new TransactionLocalRepo()
const baseTimestamp = 1710000000000

class InMemoryCategoryRepo implements CategoryRepo {
  constructor(private readonly categories: Category[] = []) {}

  async create(category: Category): Promise<Category> {
    this.categories.push(category)
    return category
  }

  async bulkCreate(
    categories: Category[]
  ): Promise<CategoryBulkCreateResult> {
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
    this.categories.splice(0, this.categories.length, ...this.categories.filter(
      (category) => category.id !== id
    ))
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

function renderSettlementPage() {
  const accountBookStore = createAccountBookStore(undefined, {
    accountBooks: [createAccountBookFixture()],
    initialized: true,
  })
  const categoryStore = createCategoryStore(
    new InMemoryCategoryRepo([
      {
        id: '1-1',
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
  const settingsStore = createSettingsStore(FAKE_SETTINGS_REPO, {
    initialized: true,
    onboardingCompleted: true,
  })

  return render(
    <ThemeProvider attribute="class">
      <HeroUIProvider>
        <AccountBookStoreProvider store={accountBookStore}>
          <CategoryStoreProvider store={categoryStore}>
            <UserStoreProvider store={userStore}>
              <SettingsStoreProvider store={settingsStore}>
                <SettlementPage />
              </SettingsStoreProvider>
            </UserStoreProvider>
          </CategoryStoreProvider>
        </AccountBookStoreProvider>
      </HeroUIProvider>
    </ThemeProvider>
  )
}

describe('Settlement page', () => {
  beforeEach(async () => {
    ;(useRouter as jest.Mock).mockReturnValue({
      query: { id: 'book-1' },
      push: jest.fn(),
      pathname: '/account-books/[id]/settlement',
    })

    await db.delete()
    await db.open()
    await transactionRepo.create(createTransactionFixture())
  })

  afterEach(async () => {
    await db.delete()
    jest.clearAllMocks()
  })

  it('refreshes the unsettled list after creating a settlement record', async () => {
    renderSettlementPage()

    expect(await screen.findByText('Breakfast with friends')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Review & settle' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Create settlement record' })
    )

    await waitFor(() => {
      expect(screen.getByText('All settled')).toBeTruthy()
    })
    expect(screen.queryByText('Breakfast with friends')).toBeNull()
  })
})