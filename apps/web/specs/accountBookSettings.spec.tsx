import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider } from 'next-themes'
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import Home from '../src/pages/index'
import Settings from '../src/pages/settings'
import AccountBookSettingsRoute from '../src/pages/settings/account-books'
import NewAccountBookRoute from '../src/pages/settings/account-books/new'
import AccountBookDetailsRoute from '../src/pages/settings/account-books/[id]'
import CategorySettingsRoute from '../src/pages/settings/account-books/[id]/categories'
import NavBar from '../src/components/layout/navbar'
import { AccountBook, AccountBookRepo } from '../src/entities/accountBook'
import { Transaction, TransactionRepo } from '../src/entities/transaction'
import {
  AccountBookStoreProvider,
  createAccountBookStore,
} from '../src/stores/accountBook'
import {
  TransactionStoreProvider,
  createTransactionStore,
} from '../src/stores/transaction'
import {
  CategoryStoreProvider,
  createCategoryStore,
} from '../src/stores/category'
import {
  UserStoreProvider,
  createUserStore,
} from '../src/stores/user'
import { THEME_STORAGE_KEY } from '../src/constants/theme'
import {
  Category,
  CategoryBulkDeleteResult,
  CategoryBulkUpdateInput,
  CategoryBulkUpdateResult,
  CategoryRepo,
} from '../src/entities/category'

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@heroui/react', () => {
  const actual = jest.requireActual('@heroui/react')
  const React = jest.requireActual('react')

  function getOptionElements(children: any, items?: any[]) {
    const renderedChildren =
      typeof children === 'function' && items
        ? items.map((item) => children(item))
        : React.Children.toArray(children)

    return React.Children.toArray(renderedChildren)
      .filter(React.isValidElement)
      .map((child: any) => {
        const optionValue = String(child.key ?? '').replace(/^[.$]+/, '')

        return (
          <option key={optionValue} value={optionValue}>
            {child.props.children}
          </option>
        )
      })
  }

  return {
    ...actual,
    addToast: jest.fn(),
    Select: ({
      'aria-label': ariaLabel,
      children,
      'data-testid': dataTestId,
      id,
      isDisabled,
      items,
      label,
      onSelectionChange,
      selectedKeys,
      selectionMode,
    }: any) => {
      const isMultiple = selectionMode === 'multiple'
      const selectedValues = Array.from(selectedKeys ?? [], String)

      return (
        <label>
          {label ? <span>{label}</span> : null}
          <select
            aria-label={ariaLabel ?? label}
            data-testid={dataTestId}
            disabled={isDisabled}
            id={id}
            multiple={isMultiple}
            value={isMultiple ? selectedValues : selectedValues[0] ?? ''}
            onChange={(event) => {
              const nextValues = isMultiple
                ? Array.from(
                    event.currentTarget.selectedOptions,
                    (option) => option.value
                  )
                : [event.currentTarget.value]

              onSelectionChange?.(new Set(nextValues.filter(Boolean)))
            }}
          >
            {getOptionElements(children, items)}
          </select>
        </label>
      )
    },
    SelectItem: () => null,
  }
})

function createAccountBookFixture(
  overrides: Partial<AccountBook> = {}
): AccountBook {
  return {
    id: 'account-book-1',
    name: 'Daily Life',
    currency: 'TWD',
    description: 'Personal daily expenses',
    createdAt: 1710000000000,
    updatedAt: 1710000000000,
    ownerId: '1',
    userIds: ['1'],
    ...overrides,
  }
}

class InMemoryAccountBookRepo implements AccountBookRepo {
  private accountBooks: AccountBook[]

  constructor(accountBooks: AccountBook[] = []) {
    this.accountBooks = [...accountBooks]
  }

  async create(accountBook: AccountBook): Promise<AccountBook> {
    this.accountBooks.push(accountBook)
    return accountBook
  }

  async findById(id: string): Promise<AccountBook | null> {
    return (
      this.accountBooks.find((accountBook) => accountBook.id === id) ?? null
    )
  }

  async findAll(): Promise<AccountBook[]> {
    return [...this.accountBooks]
  }

  async update(
    id: string,
    updates: Partial<AccountBook>
  ): Promise<AccountBook | null> {
    const index = this.accountBooks.findIndex(
      (accountBook) => accountBook.id === id
    )

    if (index === -1) {
      return null
    }

    const updatedAccountBook = {
      ...this.accountBooks[index],
      ...updates,
    }

    this.accountBooks[index] = updatedAccountBook
    return updatedAccountBook
  }

  async delete(id: string): Promise<boolean> {
    const nextAccountBooks = this.accountBooks.filter(
      (accountBook) => accountBook.id !== id
    )
    const deleted = nextAccountBooks.length !== this.accountBooks.length

    this.accountBooks = nextAccountBooks
    return deleted
  }

  async clear(): Promise<void> {
    this.accountBooks = []
  }
}

class InMemoryTransactionRepo implements TransactionRepo {
  async create(transaction: Transaction): Promise<Transaction> {
    return transaction
  }

  async findById(): Promise<Transaction | null> {
    return null
  }

  async findAll(): Promise<Transaction[]> {
    return []
  }

  async findByAccountBookId(): Promise<Transaction[]> {
    return []
  }

  async update(): Promise<Transaction | null> {
    return null
  }

  async delete(): Promise<boolean> {
    return false
  }

  async clear(): Promise<void> {
    return undefined
  }
}

class InMemoryCategoryRepo implements CategoryRepo {
  private categories: Category[] = []

  async create(category: Category): Promise<Category> {
    this.categories.push(category)
    return category
  }
  async bulkCreate(categories: Category[]) {
    const created: Category[] = []
    const failedIds: string[] = []
    const errors: Array<{ id: string; message: string }> = []

    for (const category of categories) {
      if (this.categories.some((existing) => existing.id === category.id)) {
        failedIds.push(category.id)
        errors.push({
          id: category.id,
          message: `Category with ID ${category.id} already exists`,
        })
        continue
      }

      this.categories.push(category)
      created.push(category)
    }

    return { created, failedIds, errors }
  }
  async findById(id: string): Promise<Category | null> {
    return this.categories.find((c) => c.id === id) ?? null
  }
  async findAll(): Promise<Category[]> {
    return [...this.categories]
  }
  async findByParent(parentId: string | null): Promise<Category[]> {
    return this.categories.filter((c) => c.parentId === parentId)
  }
  async findListByType(type: Category['type']): Promise<Category[]> {
    return this.categories.filter((c) => c.type === type)
  }
  async findByAccountBookId(accountBookId: string): Promise<Category[]> {
    return this.categories.filter((c) => c.accountBookId === accountBookId)
  }
  async update(
    id: string,
    updates: Partial<Category>
  ): Promise<Category | null> {
    const index = this.categories.findIndex((c) => c.id === id)
    if (index === -1) return null
    this.categories[index] = { ...this.categories[index], ...updates }
    return this.categories[index]
  }
  async bulkUpdate(
    updates: CategoryBulkUpdateInput[]
  ): Promise<CategoryBulkUpdateResult> {
    const updated: Category[] = []
    const failedIds: string[] = []
    const errors: Array<{ id: string; message: string }> = []

    for (const item of updates) {
      const nextCategory = await this.update(item.id, item.changes)
      if (!nextCategory) {
        failedIds.push(item.id)
        errors.push({
          id: item.id,
          message: `Category with ID ${item.id} not found`,
        })
        continue
      }

      updated.push(nextCategory)
    }

    return { updated, failedIds, errors }
  }
  async delete(id: string): Promise<boolean> {
    const index = this.categories.findIndex((c) => c.id === id)
    if (index === -1) return false
    this.categories.splice(index, 1)
    return true
  }
  async bulkDelete(ids: string[]): Promise<CategoryBulkDeleteResult> {
    const deletedIds: string[] = []
    const failedIds: string[] = []
    const errors: Array<{ id: string; message: string }> = []

    for (const id of ids) {
      const deleted = await this.delete(id)
      if (!deleted) {
        failedIds.push(id)
        errors.push({
          id,
          message: `Category with ID ${id} not found`,
        })
        continue
      }

      deletedIds.push(id)
    }

    return { deletedIds, failedIds, errors }
  }
  async clear(): Promise<void> {
    this.categories = []
  }
}

const mockedUseRouter = useRouter as jest.Mock

type RenderOptions = {
  accountBooks?: AccountBook[]
  currentAccountBookId?: string | null
  pathname?: string
  query?: Record<string, unknown>
}

async function renderWithProviders(ui: ReactNode, options: RenderOptions = {}) {
  const push = jest.fn()
  const back = jest.fn()
  mockedUseRouter.mockReturnValue({
    query: options.query ?? {},
    pathname: options.pathname ?? '/settings',
    push,
    back,
  })

  const store = createAccountBookStore(
    new InMemoryAccountBookRepo(
      options.accountBooks ?? [
        createAccountBookFixture({ id: '1', name: 'Daily Life' }),
        createAccountBookFixture({
          id: '2',
          name: 'Tokyo Trip',
          currency: 'JPY',
          description: 'Travel budget',
        }),
      ]
    )
  )

  await store.getState().initialize()

  if (options.currentAccountBookId !== undefined) {
    store.getState().setCurrentAccountBook(options.currentAccountBookId)
  }

  const transactionStore = createTransactionStore(new InMemoryTransactionRepo())
  await transactionStore
    .getState()
    .initialize(store.getState().currentAccountBookId)

  const categoryStore = createCategoryStore(new InMemoryCategoryRepo())
  const userStore = createUserStore()

  let renderResult: ReturnType<typeof render>

  await act(async () => {
    renderResult = render(
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        storageKey={THEME_STORAGE_KEY}
        themes={['light', 'dark']}
      >
        <HeroUIProvider>
          <AccountBookStoreProvider store={store}>
            <TransactionStoreProvider store={transactionStore}>
              <CategoryStoreProvider store={categoryStore}>
                <UserStoreProvider store={userStore}>
                  {ui}
                </UserStoreProvider>
              </CategoryStoreProvider>
            </TransactionStoreProvider>
          </AccountBookStoreProvider>
        </HeroUIProvider>
      </ThemeProvider>
    )
  })

  return {
    push,
    back,
    store,
    transactionStore,
    ...renderResult!,
  }
}

describe('Account book settings pages', () => {
  beforeEach(() => {
    mockedUseRouter.mockReset()
  })

  it('defaults the home-page selector to the first account book and switches the current selection', async () => {
    const { store } = await renderWithProviders(<Home />, {
      pathname: '/',
    })
    const selector = screen.getByLabelText(
      'Current account book'
    ) as HTMLSelectElement

    expect(store.getState().currentAccountBookId).toBe('1')
    expect(selector.value).toBe('1')

    fireEvent.change(selector, {
      target: { value: '2' },
    })

    await waitFor(() => {
      expect(store.getState().currentAccountBookId).toBe('2')
    })

    expect(selector.value).toBe('2')
    expect(
      (
        screen.getByRole('option', {
          name: 'Tokyo Trip (JPY)',
        }) as HTMLOptionElement
      ).selected
    ).toBe(true)
  })

  it('navigates from the settings landing page to account-book settings', async () => {
    const { push } = await renderWithProviders(<Settings />)

    fireEvent.click(screen.getByRole('button', { name: /Account books/i }))

    expect(push).toHaveBeenCalledWith('/settings/account-books')
  })

  it('keeps the settings navigation active for settings descendant routes', async () => {
    const { container } = await renderWithProviders(<NavBar />, {
      pathname: '/settings/account-books/2',
    })

    const settingsInput = container.querySelector<HTMLInputElement>('#settings')
    const homeInput = container.querySelector<HTMLInputElement>('#home')

    expect(settingsInput?.checked).toBe(true)
    expect(homeInput?.checked).toBe(false)
  })

  it('renders the nested title and back action for account-book settings', async () => {
    const { push } = await renderWithProviders(<AccountBookSettingsRoute />, {
      pathname: '/settings/account-books',
    })

    expect(screen.getByText('Account books')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Go back' }))

    expect(push).toHaveBeenCalledWith('/settings')
  })

  it('shows the current account book on the list page and opens account-book settings from cards', async () => {
    const { push } = await renderWithProviders(<AccountBookSettingsRoute />, {
      pathname: '/settings/account-books',
      currentAccountBookId: '2',
    })

    function getAccountBookCard(accountBookId: string) {
      return screen.getByTestId(`account-book-card-${accountBookId}`)
    }

    expect(
      within(getAccountBookCard('2')).getByText('Current on Home')
    ).toBeTruthy()
    expect(
      screen.queryByRole('button', { name: /Set current|Current now/i })
    ).toBeNull()
    expect(
      screen.queryByRole('button', { name: 'Category Settings' })
    ).toBeNull()

    fireEvent.click(
      within(getAccountBookCard('2')).getByRole('button', {
        name: 'View settings',
      })
    )

    expect(push).toHaveBeenCalledWith('/settings/account-books/2')
  })

  it('renders the new account book page and creates a new account book', async () => {
    const { push, store } = await renderWithProviders(<NewAccountBookRoute />, {
      pathname: '/settings/account-books/new',
    })

    expect(screen.getByText('Create account book')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Go back' }))
    expect(push).toHaveBeenCalledWith('/settings/account-books')

    push.mockClear()

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Weekend Trip' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Short getaway budget' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      expect(
        store
          .getState()
          .accountBooks.some(
            (accountBook) => accountBook.name === 'Weekend Trip'
          )
      ).toBe(true)
    })

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith(
        expect.stringMatching(/^\/settings\/account-books\/.+/)
      )
    })
  })

  it('renders an existing account book settings page and supports update, category navigation, and delete', async () => {
    const { push, store } = await renderWithProviders(
      <AccountBookDetailsRoute />,
      {
        pathname: '/settings/account-books/2',
        query: { id: '2' },
        currentAccountBookId: '2',
      }
    )

    expect(screen.getByDisplayValue('Tokyo Trip')).toBeTruthy()

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Tokyo Trip Plus' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(
        store
          .getState()
          .accountBooks.find((accountBook) => accountBook.id === '2')?.name
      ).toBe('Tokyo Trip Plus')
    })

    fireEvent.click(screen.getByRole('button', { name: /Manage categories/i }))
    expect(push).toHaveBeenCalledWith('/settings/account-books/2/categories')

    push.mockClear()

    fireEvent.click(screen.getByRole('button', { name: 'Delete account book' }))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeTruthy()
    })

    fireEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' })
    )

    await waitFor(() => {
      expect(
        store
          .getState()
          .accountBooks.find((accountBook) => accountBook.id === '2')
      ).toBeUndefined()
    })

    expect(push).toHaveBeenCalledWith('/settings/account-books')
  })

  it('returns from category settings to the originating account book settings page', async () => {
    const { push } = await renderWithProviders(<CategorySettingsRoute />, {
      pathname: '/settings/account-books/2/categories',
      query: { id: '2' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Go back' }))

    expect(push).toHaveBeenCalledWith('/settings/account-books/2')
  })
})
