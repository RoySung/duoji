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
import NewAccountBookRoute from '../src/pages/account-books/new'
import AccountBookSettingsRoute from '../src/pages/account-books/[id]/settings'
import NavBar from '../src/components/layout/navbar'
import { AccountBook, AccountBookRepo } from '../src/entities/accountBook'
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
import { THEME_STORAGE_KEY } from '../src/constants/theme'

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
import {
  Category,
  CategoryBulkDeleteResult,
  CategoryBulkUpdateInput,
  CategoryBulkUpdateResult,
  CategoryRepo,
} from '../src/entities/category'
import { VirtualUser } from '../src/entities/user'

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
    Button: ({
      children,
      color,
      disabled,
      disableRipple,
      endContent,
      isDisabled,
      isIconOnly,
      isLoading,
      onClick,
      onPress,
      startContent,
      variant,
      ...props
    }: any) => {
      const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (typeof onPress === 'function') {
          onPress(event)
        } else if (typeof onClick === 'function') {
          onClick(event)
        }
      }

      return (
        <button
          type="button"
          disabled={disabled ?? isDisabled ?? isLoading}
          aria-busy={isLoading ? 'true' : undefined}
          onClick={handleClick}
          {...props}
        >
          {startContent}
          {children}
          {endContent}
        </button>
      )
    },
    Input: ({
      label,
      value,
      onChange,
      onValueChange,
      isRequired,
      placeholder,
      ...props
    }: any) => {
      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event)
        onValueChange?.(event.target.value)
      }

      return (
        <label>
          {label}
          <input
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            {...props}
          />
        </label>
      )
    },
    Textarea: ({
      label,
      value,
      onChange,
      onValueChange,
      minRows,
      placeholder,
      ...props
    }: any) => {
      const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(event)
        onValueChange?.(event.target.value)
      }

      return (
        <label>
          {label}
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            {...props}
          />
        </label>
      )
    },
    Modal: ({ children, isOpen }: any) =>
      isOpen ? (
        <div role="dialog">
          {typeof children === 'function'
            ? children(() => undefined)
            : children}
        </div>
      ) : null,
    ModalContent: ({ children }: any) =>
      typeof children === 'function' ? (
        <div>{children(() => undefined)}</div>
      ) : (
        <div>{children}</div>
      ),
    ModalHeader: ({ children }: any) => <div>{children}</div>,
    ModalBody: ({ children }: any) => <div>{children}</div>,
    ModalFooter: ({ children }: any) => <div>{children}</div>,
    Switch: ({ children, isDisabled, isSelected, onValueChange }: any) => (
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          disabled={isDisabled}
          onChange={(event) => onValueChange?.(event.target.checked)}
        />
        {children}
      </label>
    ),
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
    virtualUsers: [],
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

  async mutateVirtualUsers(
    id: string,
    mutate: (virtualUsers: VirtualUser[]) => VirtualUser[]
  ): Promise<AccountBook | null> {
    const index = this.accountBooks.findIndex(
      (accountBook) => accountBook.id === id
    )

    if (index === -1) {
      return null
    }

    const updatedAccountBook = {
      ...this.accountBooks[index],
      virtualUsers: mutate(this.accountBooks[index]?.virtualUsers ?? []),
    }

    this.accountBooks[index] = updatedAccountBook
    return updatedAccountBook
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
  const replace = jest.fn()
  mockedUseRouter.mockReturnValue({
    query: options.query ?? {},
    pathname: options.pathname ?? '/settings',
    push,
    replace,
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
    store.getState().setCurrentAccountBookId(options.currentAccountBookId)
  }

  const categoryStore = createCategoryStore(new InMemoryCategoryRepo())
  const seededRegisteredUser = {
    id: 'test-registered-user',
    name: 'Test User',
    email: 'test@example.com',
    avatarUrl: 'https://ui-avatars.com/api/?name=Test',
    createdAt: 0,
    updatedAt: 0,
    type: 'registered' as const,
  }
  const userStore = createUserStore(undefined, undefined, {
    allUsers: [seededRegisteredUser],
    activeUsers: [seededRegisteredUser],
  })
  const settingsStore = createSettingsStore(FAKE_SETTINGS_REPO, {
    initialized: true,
    onboardingCompleted: true,
  })

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
            <CategoryStoreProvider store={categoryStore}>
              <UserStoreProvider store={userStore}>
                <SettingsStoreProvider store={settingsStore}>
                  {ui}
                </SettingsStoreProvider>
              </UserStoreProvider>
            </CategoryStoreProvider>
          </AccountBookStoreProvider>
        </HeroUIProvider>
      </ThemeProvider>
    )
  })

  return {
    push,
    replace,
    back,
    store,
    ...renderResult!,
  }
}

describe('Account book settings pages', () => {
  beforeEach(() => {
    mockedUseRouter.mockReset()
  })

  it('redirects the home page to the first account book when data is initialized', async () => {
    const { replace } = await renderWithProviders(<Home />, {
      pathname: '/',
    })

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('/account-books/1')
    })
  })

  it('renders the settings landing page content', async () => {
    await renderWithProviders(<Settings />)

    expect(screen.getByText('Personal workspace')).toBeTruthy()
    expect(screen.getByText('Appearance')).toBeTruthy()
  })

  it('keeps the settings navigation active for settings descendant routes', async () => {
    const { container } = await renderWithProviders(<NavBar />, {
      pathname: '/settings/account-books/[id]/categories',
      query: { id: '2' },
    })

    const settingsInput = container.querySelector<HTMLInputElement>('#settings')
    const homeInput = container.querySelector<HTMLInputElement>('#home')

    expect(settingsInput?.checked).toBe(true)
    expect(homeInput?.checked).toBe(false)
  })

  it('navigates home back to the current account book from account-book settings', async () => {
    const { container, push } = await renderWithProviders(<NavBar />, {
      pathname: '/account-books/[id]/settings',
      query: { id: '2' },
    })

    const settingsInput = container.querySelector<HTMLInputElement>('#settings')
    const homeInput = container.querySelector<HTMLInputElement>('#home')

    expect(settingsInput?.checked).toBe(true)
    expect(homeInput?.checked).toBe(false)

    fireEvent.click(homeInput!)

    expect(push).toHaveBeenCalledWith('/account-books/2')
  })

  it('renders the new account book page and creates a new account book', async () => {
    const { back, push, store } = await renderWithProviders(
      <NewAccountBookRoute />,
      {
        pathname: '/account-books/new',
      }
    )

    expect(screen.getByText('New account book')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Go back' }))
    expect(back).toHaveBeenCalled()

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
        expect.stringMatching(/^\/account-books\/.+\/settings$/)
      )
    })
  })

  it('renders an existing account book settings page and supports update, category modal, and delete', async () => {
    const { push, store } = await renderWithProviders(
      <AccountBookSettingsRoute />,
      {
        pathname: '/account-books/[id]/settings',
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

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeTruthy()
    })
    expect(screen.getByText('Tokyo Trip Plus — Categories')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Delete account book' }))

    await waitFor(() => {
      expect(screen.getAllByRole('dialog').length).toBeGreaterThan(1)
    })

    const deleteDialog = screen
      .getAllByRole('dialog')
      .find((dialog) => within(dialog).queryByText(/Permanently delete/i))

    expect(deleteDialog).toBeTruthy()

    fireEvent.click(
      within(deleteDialog as HTMLElement).getByRole('button', {
        name: 'Delete account book',
      })
    )

    await waitFor(() => {
      expect(
        store
          .getState()
          .accountBooks.find((accountBook) => accountBook.id === '2')
      ).toBeUndefined()
    })

    expect(push).toHaveBeenCalledWith('/account-books/1')
  })
})
