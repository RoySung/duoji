import { AccountBook, AccountBookRepo } from '../src/entities/accountBook'
import { VirtualUser } from '../src/entities/user'
import { createAccountBookStore } from '../src/stores/accountBook/index'
import { accountBookList } from './fixtures'
import { db, initializeDB } from '../src/lib/dexie'

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
    userIds: ['1', '2'],
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
      (existingAccountBook) => existingAccountBook.id === id
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
    accountBook: Partial<AccountBook>
  ): Promise<AccountBook | null> {
    const index = this.accountBooks.findIndex(
      (existingAccountBook) => existingAccountBook.id === id
    )

    if (index === -1) {
      return null
    }

    const updatedAccountBook = {
      ...this.accountBooks[index],
      ...accountBook,
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

describe('AccountBook Store', () => {
  it('should load account books without auto-selecting a current account book', async () => {
    const store = createAccountBookStore(
      new InMemoryAccountBookRepo([
        createAccountBookFixture({ id: '1', name: 'Daily Life' }),
        createAccountBookFixture({ id: '2', name: 'Tokyo Trip' }),
      ])
    )

    await store.getState().initialize()

    expect(store.getState().accountBooks).toHaveLength(2)
    expect(store.getState().currentAccountBookId).toBeNull()
  })

  it('should switch the current account book manually', async () => {
    const store = createAccountBookStore(
      new InMemoryAccountBookRepo([
        createAccountBookFixture({ id: '1' }),
        createAccountBookFixture({ id: '2', name: 'Tokyo Trip' }),
      ])
    )

    await store.getState().initialize()
    store.getState().setCurrentAccountBookId('2')

    expect(store.getState().currentAccountBookId).toBe('2')
  })

  it('should keep currentAccountBookId unset after creating the first account book', async () => {
    const store = createAccountBookStore(new InMemoryAccountBookRepo())
    const createdAccountBook = createAccountBookFixture({ id: 'first-book' })

    await store.getState().initialize()
    expect(store.getState().currentAccountBookId).toBeNull()

    await store.getState().createAccountBook(createdAccountBook)

    expect(store.getState().currentAccountBookId).toBeNull()
    expect(store.getState().accountBooks).toHaveLength(1)
  })

  it('should clear the current account book when deleting the selected account book', async () => {
    const store = createAccountBookStore(
      new InMemoryAccountBookRepo([
        createAccountBookFixture({ id: '1', name: 'Daily Life' }),
        createAccountBookFixture({ id: '2', name: 'Tokyo Trip' }),
      ])
    )

    await store.getState().initialize()
    store.getState().setCurrentAccountBookId('2')

    await store.getState().deleteAccountBook('2')

    expect(store.getState().currentAccountBookId).toBeNull()
    expect(store.getState().accountBooks).toHaveLength(1)
  })

  it('should clear the current account book when deleting the last remaining account book', async () => {
    const store = createAccountBookStore(
      new InMemoryAccountBookRepo([createAccountBookFixture({ id: '1' })])
    )

    await store.getState().initialize()
    await store.getState().deleteAccountBook('1')

    expect(store.getState().accountBooks).toEqual([])
    expect(store.getState().currentAccountBookId).toBeNull()
  })
})

describe('AccountBook Store runtime composition', () => {
  beforeEach(async () => {
    await db.delete()
  })

  afterAll(async () => {
    await db.delete()
  })

  it('should hydrate from the Dexie-backed repository after database initialization', async () => {
    const store = createAccountBookStore()

    await initializeDB()
    await db.accountBooks.bulkPut(accountBookList)
    await store.getState().initialize()

    expect(store.getState().accountBooks).toHaveLength(accountBookList.length)
    expect(store.getState().currentAccountBookId).toBeNull()
  })
})
