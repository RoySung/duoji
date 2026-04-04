import { AccountBook, AccountBookRepo } from '../src/entities/accountBook'
import { User, VirtualUser, RegisteredUser, UserRepo } from '../src/entities/user'
import { createUserStore } from '../src/stores/user'
import { userList } from '../src/mocks/user'

const baseTimestamp = 1710000000000

function createAccountBookFixture(
  overrides: Partial<AccountBook> = {}
): AccountBook {
  return {
    id: 'book-1',
    name: 'Daily Life',
    currency: 'TWD',
    description: '',
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    ownerId: userList[0]!.id,
    userIds: [userList[0]!.id],
    virtualUsers: [],
    ...overrides,
  }
}

function createVirtualUserFixture(
  overrides: Partial<VirtualUser> = {}
): VirtualUser {
  return {
    id: 'vu-1',
    name: 'Alice',
    accountBookId: 'book-1',
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
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
    return this.accountBooks.find((ab) => ab.id === id) ?? null
  }

  async findAll(): Promise<AccountBook[]> {
    return [...this.accountBooks]
  }

  async update(
    id: string,
    updates: Partial<AccountBook>
  ): Promise<AccountBook | null> {
    const index = this.accountBooks.findIndex((ab) => ab.id === id)
    if (index === -1) return null
    this.accountBooks[index] = { ...this.accountBooks[index]!, ...updates }
    return this.accountBooks[index]!
  }

  async delete(id: string): Promise<boolean> {
    const index = this.accountBooks.findIndex((ab) => ab.id === id)
    if (index === -1) return false
    this.accountBooks.splice(index, 1)
    return true
  }

  async clear(): Promise<void> {
    this.accountBooks = []
  }
}

class InMemoryUserRepo implements UserRepo {
  private users: RegisteredUser[]

  constructor(users: RegisteredUser[] = []) {
    this.users = [...users]
  }

  async findByIds(ids: string[]): Promise<RegisteredUser[]> {
    return this.users.filter((u) => ids.includes(u.id))
  }
}

describe('User Store', () => {
  it('exposes allUsers and activeUsers after initialize — both include users, none deleted', async () => {
    const accountBook = createAccountBookFixture({ userIds: [userList[0]!.id] })
    const store = createUserStore(
      new InMemoryAccountBookRepo([accountBook]),
      new InMemoryUserRepo(userList)
    )

    await store.getState().initialize(accountBook)

    const { allUsers, activeUsers } = store.getState()
    expect(allUsers).toHaveLength(1)
    expect(activeUsers).toHaveLength(1)
    expect(allUsers[0]).toMatchObject({ id: userList[0]!.id, type: 'registered' })
  })

  it('softDeleteVirtualUser sets deletedAt — user is removed from activeUsers but remains in allUsers', async () => {
    const virtualUser = createVirtualUserFixture({ id: 'vu-soft' })
    const accountBook = createAccountBookFixture({
      virtualUsers: [virtualUser],
    })
    const store = createUserStore(
      new InMemoryAccountBookRepo([accountBook]),
      new InMemoryUserRepo(userList)
    )

    await store.getState().initialize(accountBook)

    expect(store.getState().allUsers).toHaveLength(2) // user + virtual
    expect(store.getState().activeUsers).toHaveLength(2)

    const result = await store.getState().softDeleteVirtualUser('book-1', 'vu-soft')

    expect(result).toBe(true)
    expect(store.getState().allUsers).toHaveLength(2) // record still present
    expect(store.getState().activeUsers).toHaveLength(1) // excluded from active

    const deletedUser = store
      .getState()
      .allUsers.find((u) => u.id === 'vu-soft') as VirtualUser | undefined

    expect(deletedUser).toBeDefined()
    expect(deletedUser?.type).toBe('virtual')
    expect((deletedUser as VirtualUser).deletedAt).toBeGreaterThan(0)
  })

  it('computeActiveUsers filters out virtual users with deletedAt and keeps users and non-deleted virtual users', () => {
    const users: User[] = [
      { ...userList[0]!, type: 'registered' as const },
      {
        id: 'vu-active',
        name: 'Active VU',
        accountBookId: 'book-1',
        createdAt: baseTimestamp,
        updatedAt: baseTimestamp,
        type: 'virtual' as const,
      },
      {
        id: 'vu-deleted',
        name: 'Deleted VU',
        accountBookId: 'book-1',
        createdAt: baseTimestamp,
        updatedAt: baseTimestamp,
        deletedAt: baseTimestamp + 1000,
        type: 'virtual' as const,
      },
    ]

    const store = createUserStore(
      new InMemoryAccountBookRepo(),
      new InMemoryUserRepo(),
      {
        allUsers: users,
        activeUsers: users.filter(
          (u) => !(u.type === 'virtual' && (u as VirtualUser).deletedAt)
        ),
      }
    )

    expect(store.getState().allUsers).toHaveLength(3)
    expect(store.getState().activeUsers).toHaveLength(2)
    expect(
      store.getState().activeUsers.find((u) => u.id === 'vu-deleted')
    ).toBeUndefined()
  })

  it('softDeleteVirtualUser returns false when account book is not found', async () => {
    const store = createUserStore(
      new InMemoryAccountBookRepo([]),
      new InMemoryUserRepo()
    )
    const result = await store.getState().softDeleteVirtualUser('missing-book', 'vu-1')
    expect(result).toBe(false)
  })
})
