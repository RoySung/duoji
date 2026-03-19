import { AccountBook, AccountBookRepo } from '../src/entities/accountBook'
import {
  createAccountBookStore,
  selectActiveAccountBook,
} from '../src/stores/accountBook/index'
import { accountBookList } from '../src/mocks'
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
  it('should load account books and bootstrap a deterministic active account book', async () => {
    const store = createAccountBookStore(
      new InMemoryAccountBookRepo([
        createAccountBookFixture({ id: '1', name: 'Daily Life' }),
        createAccountBookFixture({ id: '2', name: 'Tokyo Trip' }),
      ])
    )

    await store.getState().initialize()

    expect(store.getState().accountBooks).toHaveLength(2)
    expect(store.getState().activeAccountBookId).toBe('1')
    expect(selectActiveAccountBook(store.getState())?.name).toBe('Daily Life')
  })

  it('should switch the active account book manually', async () => {
    const store = createAccountBookStore(
      new InMemoryAccountBookRepo([
        createAccountBookFixture({ id: '1' }),
        createAccountBookFixture({ id: '2', name: 'Tokyo Trip' }),
      ])
    )

    await store.getState().initialize()
    store.getState().setActiveAccountBook('2')

    expect(store.getState().activeAccountBookId).toBe('2')
    expect(selectActiveAccountBook(store.getState())?.name).toBe('Tokyo Trip')
  })

  it('should activate the first created account book when there is no active account book', async () => {
    const store = createAccountBookStore(new InMemoryAccountBookRepo())
    const createdAccountBook = createAccountBookFixture({ id: 'first-book' })

    await store.getState().initialize()
    expect(store.getState().activeAccountBookId).toBeNull()

    await store.getState().createAccountBook(createdAccountBook)

    expect(store.getState().activeAccountBookId).toBe('first-book')
    expect(store.getState().accountBooks).toHaveLength(1)
  })

  it('should fall back to another account book when deleting the active account book', async () => {
    const store = createAccountBookStore(
      new InMemoryAccountBookRepo([
        createAccountBookFixture({ id: '1', name: 'Daily Life' }),
        createAccountBookFixture({ id: '2', name: 'Tokyo Trip' }),
      ])
    )

    await store.getState().initialize()
    store.getState().setActiveAccountBook('2')

    await store.getState().deleteAccountBook('2')

    expect(store.getState().activeAccountBookId).toBe('1')
    expect(store.getState().accountBooks).toHaveLength(1)
  })

  it('should clear the active account book when deleting the last remaining account book', async () => {
    const store = createAccountBookStore(
      new InMemoryAccountBookRepo([createAccountBookFixture({ id: '1' })])
    )

    await store.getState().initialize()
    await store.getState().deleteAccountBook('1')

    expect(store.getState().accountBooks).toEqual([])
    expect(store.getState().activeAccountBookId).toBeNull()
    expect(selectActiveAccountBook(store.getState())).toBeNull()
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
    await store.getState().initialize()

    expect(store.getState().accountBooks).toHaveLength(accountBookList.length)
    expect(store.getState().activeAccountBookId).toBe(accountBookList[0].id)
    expect(selectActiveAccountBook(store.getState())?.id).toBe(
      accountBookList[0].id
    )
  })
})
