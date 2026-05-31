import { AccountBook, AccountBookRepo } from '../src/entities/accountBook'
import { User, VirtualUser, RegisteredUser, UserRepo } from '../src/entities/user'
import { createUserStore } from '../src/stores/user'
import { userList } from './fixtures'

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

  async mutateVirtualUsers(
    id: string,
    mutate: (virtualUsers: VirtualUser[]) => VirtualUser[]
  ): Promise<AccountBook | null> {
    const index = this.accountBooks.findIndex((ab) => ab.id === id)
    if (index === -1) return null

    const updatedAccountBook = {
      ...this.accountBooks[index]!,
      virtualUsers: mutate(this.accountBooks[index]!.virtualUsers ?? []),
    }

    this.accountBooks[index] = updatedAccountBook
    return updatedAccountBook
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
  users: RegisteredUser[]
  shouldFailCreate = false

  constructor(users: RegisteredUser[] = []) {
    this.users = [...users]
  }

  async findByIds(ids: string[]): Promise<RegisteredUser[]> {
    return this.users.filter((u) => ids.includes(u.id))
  }

  async create(user: RegisteredUser): Promise<void> {
    if (this.shouldFailCreate) {
      throw new Error('simulated create failure')
    }
    const idx = this.users.findIndex((u) => u.id === user.id)
    if (idx === -1) this.users.push(user)
    else this.users[idx] = user
  }
}

class DeferredFirstFindUserRepo extends InMemoryUserRepo {
  private findCallCount = 0
  private notifyFirstFindBlocked: (() => void) | null = null
  private releaseFirstFind: (() => void) | null = null
  private firstFindBlocked = false

  constructor(
    users: RegisteredUser[] = [],
    private readonly blockedFindCall: number = 1
  ) {
    super(users)
  }

  waitForFirstFind(): Promise<void> {
    if (this.firstFindBlocked) {
      return Promise.resolve()
    }

    return new Promise((resolve) => {
      this.notifyFirstFindBlocked = resolve
    })
  }

  unblockFirstFind() {
    this.releaseFirstFind?.()
    this.releaseFirstFind = null
  }

  override async findByIds(ids: string[]): Promise<RegisteredUser[]> {
    this.findCallCount += 1

    if (!this.firstFindBlocked && this.findCallCount === this.blockedFindCall) {
      this.firstFindBlocked = true
      this.notifyFirstFindBlocked?.()
      this.notifyFirstFindBlocked = null
      await new Promise<void>((resolve) => {
        this.releaseFirstFind = resolve
      })
    }

    return super.findByIds(ids)
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

  it('createRegisteredUser persists a new RegisteredUser via the injected repo and returns it', async () => {
    const repo = new InMemoryUserRepo()
    const store = createUserStore(new InMemoryAccountBookRepo(), repo)

    const created = await store.getState().createRegisteredUser('Alice', 'alice@example.com')

    expect(created).not.toBeNull()
    expect(created).toMatchObject({ name: 'Alice', email: 'alice@example.com' })
    expect(created!.id).toBeTruthy()
    expect(created!.avatarUrl).toContain('Alice')
    expect(repo.users).toHaveLength(1)
    expect(repo.users[0]!.id).toBe(created!.id)
    expect(store.getState().error).toBeNull()
  })

  it('createRegisteredUser returns null and sets error state when the repo create fails', async () => {
    const repo = new InMemoryUserRepo()
    repo.shouldFailCreate = true
    const store = createUserStore(new InMemoryAccountBookRepo(), repo)

    const created = await store.getState().createRegisteredUser('Bob', 'bob@example.com')

    expect(created).toBeNull()
    expect(repo.users).toHaveLength(0)
    expect(store.getState().error).toBe('simulated create failure')
  })

  it('does not let a stale initialize overwrite a later added virtual user', async () => {
    const accountBook = createAccountBookFixture({ userIds: [userList[0]!.id] })
    const accountBookRepo = new InMemoryAccountBookRepo([accountBook])
    const userRepo = new DeferredFirstFindUserRepo(userList)
    const store = createUserStore(accountBookRepo, userRepo)

    const initializePromise = store.getState().initialize(accountBook)
    await userRepo.waitForFirstFind()

    const createdVirtualUser = await store.getState().addVirtualUser('book-1', 'Bob')

    expect(createdVirtualUser).not.toBeNull()
    expect(store.getState().activeUsers.map((user) => user.name)).toEqual([
      'Roy',
      'Bob',
    ])

    userRepo.unblockFirstFind()
    await initializePromise

    expect(store.getState().activeUsers.map((user) => user.name)).toEqual([
      'Roy',
      'Bob',
    ])
  })

  it('preserves concurrent virtual-user add and rename mutations', async () => {
    const existingVirtualUser = createVirtualUserFixture({ id: 'vu-1', name: 'Alice' })
    const accountBook = createAccountBookFixture({
      userIds: [userList[0]!.id],
      virtualUsers: [existingVirtualUser],
    })
    const accountBookRepo = new InMemoryAccountBookRepo([accountBook])
    const userRepo = new DeferredFirstFindUserRepo(userList, 2)
    const store = createUserStore(accountBookRepo, userRepo)

    await store.getState().initialize(accountBook)

    const addPromise = store.getState().addVirtualUser('book-1', 'Bob')
    await userRepo.waitForFirstFind()

    const renamePromise = store
      .getState()
      .renameVirtualUser('book-1', 'vu-1', 'Alice updated')

    userRepo.unblockFirstFind()

    const [createdVirtualUser, renamed] = await Promise.all([
      addPromise,
      renamePromise,
    ])

    expect(createdVirtualUser).not.toBeNull()
    expect(renamed).toBe(true)
    expect(
      store
        .getState()
        .allUsers.filter((user) => user.type === 'virtual')
        .map((user) => user.name)
        .sort()
    ).toEqual(['Alice updated', 'Bob'])
  })
})
