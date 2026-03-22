import {
  DefaultPaymentMethod,
  Transaction,
  TransactionRepo,
} from '../src/entities/transaction'
import { createTransactionStore } from '../src/stores/transaction'
import { userList } from '../src/mocks'

const baseTimestamp = 1710000000000

function createTransactionFixture(
  overrides: Partial<Transaction> = {}
): Transaction {
  const type = overrides.type ?? 'expense'

  return {
    id: 'tx-1',
    type,
    accountBookId: 'book-1',
    categoryId: type === 'income' ? '101-1' : '1-1',
    amount: 120,
    date: '2026/03/18',
    description: 'Breakfast with friends',
    paymentMethod: DefaultPaymentMethod,
    receivedByUserId: type === 'income' ? userList[0]?.id ?? null : null,
    tags: ['meal'],
    paidByDetail: [
      {
        user: userList[0],
        amount: 120,
      },
    ],
    splitDetail: [
      {
        user: userList[0],
        amount: 60,
      },
      {
        user: userList[1],
        amount: 60,
      },
    ],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    deletedAt: null,
    ...overrides,
  }
}

class InMemoryTransactionRepo implements TransactionRepo {
  private transactions: Transaction[]

  constructor(transactions: Transaction[] = []) {
    this.transactions = [...transactions]
  }

  async create(transaction: Transaction): Promise<Transaction> {
    this.transactions.push(transaction)
    return transaction
  }

  async findById(id: string): Promise<Transaction | null> {
    return (
      this.transactions.find(
        (transaction) => transaction.id === id && transaction.deletedAt === null
      ) ?? null
    )
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactions.filter((t) => t.deletedAt === null)
  }

  async findByAccountBookId(accountBookId: string): Promise<Transaction[]> {
    return this.transactions.filter(
      (transaction) =>
        transaction.accountBookId === accountBookId &&
        transaction.deletedAt === null
    )
  }

  async update(
    id: string,
    updates: Partial<Transaction>
  ): Promise<Transaction | null> {
    const index = this.transactions.findIndex(
      (transaction) => transaction.id === id
    )

    if (index === -1) {
      return null
    }

    const updatedTransaction = {
      ...this.transactions[index],
      ...updates,
    }

    this.transactions[index] = updatedTransaction
    return updatedTransaction
  }

  async delete(id: string): Promise<boolean> {
    const transaction = this.transactions.find((t) => t.id === id)
    if (!transaction) {
      return false
    }

    // Soft delete: set deletedAt timestamp
    const updatedTransaction = { ...transaction, deletedAt: Date.now() }
    const index = this.transactions.findIndex((t) => t.id === id)
    this.transactions[index] = updatedTransaction
    return true
  }

  async clear(): Promise<void> {
    this.transactions = []
  }
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve
    reject = nextReject
  })

  return {
    promise,
    resolve,
    reject,
  }
}

class DeferredTransactionRepo extends InMemoryTransactionRepo {
  private deferredLoads = new Map<
    string,
    ReturnType<typeof createDeferred<Transaction[]>>
  >()

  async findByAccountBookId(accountBookId: string): Promise<Transaction[]> {
    const deferredLoad = createDeferred<Transaction[]>()
    this.deferredLoads.set(accountBookId, deferredLoad)

    return deferredLoad.promise
  }

  resolveLoad(accountBookId: string, transactions: Transaction[]) {
    const deferredLoad = this.deferredLoads.get(accountBookId)

    if (!deferredLoad) {
      throw new Error(`No deferred transaction load found for ${accountBookId}`)
    }

    deferredLoad.resolve(transactions)
  }
}

describe('Transaction Store', () => {
  it('loads transactions for the requested account book and keeps them sorted by date', async () => {
    const store = createTransactionStore(
      new InMemoryTransactionRepo([
        createTransactionFixture({
          id: 'tx-1',
          accountBookId: 'book-1',
          date: '2026/03/17',
        }),
        createTransactionFixture({
          id: 'tx-2',
          accountBookId: 'book-1',
          date: '2026/03/19',
          description: 'Dinner',
        }),
        createTransactionFixture({
          id: 'tx-3',
          accountBookId: 'book-2',
          description: 'Salary',
          type: 'income',
          categoryId: '101-1',
        }),
      ])
    )

    await store.getState().initialize('book-1')

    expect(store.getState().scopedAccountBookId).toBe('book-1')
    expect(
      store.getState().transactions.map((transaction) => transaction.id)
    ).toEqual(['tx-2', 'tx-1'])
  })

  it('creates and updates transactions inside the current scope', async () => {
    const store = createTransactionStore(
      new InMemoryTransactionRepo([
        createTransactionFixture({ id: 'tx-1', accountBookId: 'book-1' }),
      ])
    )

    await store.getState().initialize('book-1')

    await store.getState().createTransaction(
      createTransactionFixture({
        id: 'tx-2',
        accountBookId: 'book-1',
        description: 'Train ticket',
        categoryId: '3-1',
        paymentMethod: 'Line Pay',
        amount: 80,
      })
    )

    expect(store.getState().transactions).toHaveLength(2)

    await store.getState().updateTransaction('tx-2', {
      description: 'Airport train ticket',
      paymentMethod: 'Credit Card',
      updatedAt: baseTimestamp + 1000,
    })

    expect(
      store
        .getState()
        .transactions.find((transaction) => transaction.id === 'tx-2')
    ).toMatchObject({
      description: 'Airport train ticket',
      paymentMethod: 'Credit Card',
    })
  })

  it('updates income recipients inside the current scope', async () => {
    const store = createTransactionStore(
      new InMemoryTransactionRepo([
        createTransactionFixture({
          id: 'tx-income',
          accountBookId: 'book-1',
          type: 'income',
          amount: 500,
          categoryId: '101-1',
          description: 'Monthly salary',
          receivedByUserId: userList[0].id,
          paidByDetail: [{ user: userList[0], amount: 500 }],
          splitDetail: [{ user: userList[0], amount: 500 }],
        }),
      ])
    )

    await store.getState().initialize('book-1')

    await store.getState().updateTransaction('tx-income', {
      receivedByUserId: userList[1].id,
      paidByDetail: [{ user: userList[1], amount: 500 }],
      splitDetail: [{ user: userList[1], amount: 500 }],
      updatedAt: baseTimestamp + 1000,
    })

    expect(
      store
        .getState()
        .transactions.find((transaction) => transaction.id === 'tx-income')
    ).toMatchObject({
      receivedByUserId: userList[1].id,
    })
  })

  it('removes transactions that move out of scope during update', async () => {
    const store = createTransactionStore(
      new InMemoryTransactionRepo([
        createTransactionFixture({ id: 'tx-1', accountBookId: 'book-1' }),
      ])
    )

    await store.getState().initialize('book-1')

    await store.getState().updateTransaction('tx-1', {
      accountBookId: 'book-2',
      updatedAt: baseTimestamp + 1000,
    })

    expect(store.getState().transactions).toEqual([])
  })

  it('tracks modal session actions and closes the modal after deleting the selected transaction', async () => {
    const store = createTransactionStore(
      new InMemoryTransactionRepo([
        createTransactionFixture({ id: 'tx-1', accountBookId: 'book-1' }),
      ])
    )

    await store.getState().initialize('book-1')

    store.getState().openCreateModal()
    expect(store.getState().isModalOpen).toBe(true)
    expect(store.getState().modalMode).toBe('create')

    store.getState().openEditModal('tx-1')
    expect(store.getState().modalMode).toBe('edit')
    expect(store.getState().selectedTransactionId).toBe('tx-1')

    await store.getState().deleteTransaction('tx-1')

    expect(store.getState().isModalOpen).toBe(false)
    expect(store.getState().selectedTransactionId).toBeNull()
    expect(store.getState().modalMode).toBe('create')
  })

  it('ignores stale account-book transaction loads and keeps the latest scope active', async () => {
    const transactionRepo = new DeferredTransactionRepo()
    const store = createTransactionStore(transactionRepo)

    const loadBookOnePromise = store.getState().loadTransactions('book-1')

    expect(store.getState().pendingScopedAccountBookId).toBe('book-1')
    expect(store.getState().isLoading).toBe(true)

    const loadBookTwoPromise = store.getState().loadTransactions('book-2')

    expect(store.getState().pendingScopedAccountBookId).toBe('book-2')

    transactionRepo.resolveLoad('book-1', [
      createTransactionFixture({ id: 'tx-1', accountBookId: 'book-1' }),
    ])

    await loadBookOnePromise

    expect(store.getState().isLoading).toBe(true)
    expect(store.getState().scopedAccountBookId).toBeNull()
    expect(store.getState().transactions).toEqual([])

    transactionRepo.resolveLoad('book-2', [
      createTransactionFixture({
        id: 'tx-2',
        accountBookId: 'book-2',
        description: 'Salary',
        type: 'income',
        categoryId: '101-1',
      }),
    ])

    await loadBookTwoPromise

    expect(store.getState().isLoading).toBe(false)
    expect(store.getState().pendingScopedAccountBookId).toBeNull()
    expect(store.getState().scopedAccountBookId).toBe('book-2')
    expect(
      store.getState().transactions.map((transaction) => transaction.id)
    ).toEqual(['tx-2'])
  })
})
