import { HeroUIProvider } from '@heroui/react'
import {
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
import NavBar from '../src/components/layout/navbar'
import { AccountBook, AccountBookRepo } from '../src/entities/accountBook'
import {
  AccountBookStoreProvider,
  createAccountBookStore,
} from '../src/stores/accountBook'

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@heroui/react', () => {
  const actual = jest.requireActual('@heroui/react')

  return {
    ...actual,
    addToast: jest.fn(),
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

const mockedUseRouter = useRouter as jest.Mock

type RenderOptions = {
  accountBooks?: AccountBook[]
  currentAccountBookId?: string | null
  pathname?: string
}

async function renderWithProviders(ui: ReactNode, options: RenderOptions = {}) {
  const push = jest.fn()
  const back = jest.fn()
  mockedUseRouter.mockReturnValue({
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

  return {
    push,
    back,
    store,
    ...render(
      <HeroUIProvider>
        <AccountBookStoreProvider store={store}>{ui}</AccountBookStoreProvider>
      </HeroUIProvider>
    ),
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
      screen.getByRole('option', { name: 'Tokyo Trip (JPY)' }).selected
    ).toBe(true)
  })

  it('navigates from the settings landing page to account-book settings', async () => {
    const { push } = await renderWithProviders(<Settings />)

    fireEvent.click(screen.getByRole('button', { name: /Account books/i }))

    expect(push).toHaveBeenCalledWith('/settings/account-books')
  })

  it('keeps the settings navigation active for settings descendant routes', async () => {
    const { container } = await renderWithProviders(<NavBar />, {
      pathname: '/settings/account-books',
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

  it('shows the current account book in settings and supports CRUD interactions without selection controls', async () => {
    await renderWithProviders(<AccountBookSettingsRoute />, {
      pathname: '/settings/account-books',
      currentAccountBookId: '2',
    })

    const dailyLifeCard = screen.getByTestId('account-book-card-1')
    const tokyoTripCard = screen.getByTestId('account-book-card-2')

    expect(within(tokyoTripCard).getByText('Current')).toBeTruthy()
    expect(
      screen.queryByRole('button', { name: /Set current|Current now/i })
    ).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Create' }))
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Weekend Trip' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Short getaway budget' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      expect(screen.getByText('Weekend Trip')).toBeTruthy()
    })

    const weekendTripCard = screen.getByText('Weekend Trip').closest('article')
    if (!weekendTripCard) {
      throw new Error('Weekend Trip card was not rendered')
    }

    fireEvent.click(
      within(weekendTripCard).getByRole('button', { name: 'Edit' })
    )
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Weekend Trip Plus' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(screen.getByText('Weekend Trip Plus')).toBeTruthy()
    })

    fireEvent.click(
      within(tokyoTripCard).getByRole('button', { name: 'Delete' })
    )

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeTruthy()
    })

    fireEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' })
    )

    await waitFor(() => {
      expect(screen.queryByText('Tokyo Trip')).toBeNull()
    })

    await waitFor(() => {
      expect(within(dailyLifeCard).getByText('Current')).toBeTruthy()
    })
  })
})
