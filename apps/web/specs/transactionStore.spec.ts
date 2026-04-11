import { act, renderHook, waitFor } from '@testing-library/react'
import {
  DefaultPaymentMethod,
  isUnsettledSettlementRecordId,
  Transaction,
  TransactionRepo,
  UNSETTLED_SETTLEMENT_RECORD_ID,
} from '../src/entities/transaction'
import { useAccountBookTransactions } from '../src/hooks/useAccountBookTransactions'
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
    settlementRecordId: UNSETTLED_SETTLEMENT_RECORD_ID,
    tags: ['meal'],
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
        (t) => t.id === id && t.deletedAt === null
      ) ?? null
    )
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactions.filter((t) => t.deletedAt === null)
  }

  async findByAccountBookId(accountBookId: string): Promise<Transaction[]> {
    return this.transactions.filter(
      (t) => t.accountBookId === accountBookId && t.deletedAt === null
    )
  }

  async findUnsettledExpenseByAccountBookId(
    accountBookId: string
  ): Promise<Transaction[]> {
    return this.transactions.filter(
      (t) =>
        t.accountBookId === accountBookId &&
        t.type === 'expense' &&
        t.deletedAt === null &&
        isUnsettledSettlementRecordId(t.settlementRecordId)
    )
  }

  async findBySettlementRecordId(recordId: string): Promise<Transaction[]> {
    return this.transactions.filter(
      (t) => t.settlementRecordId === recordId && t.deletedAt === null
    )
  }

  async update(
    id: string,
    updates: Partial<Transaction>
  ): Promise<Transaction | null> {
    const index = this.transactions.findIndex((t) => t.id === id)
    if (index === -1) return null
    this.transactions[index] = { ...this.transactions[index], ...updates }
    return this.transactions[index]
  }

  async delete(id: string): Promise<boolean> {
    const transaction = this.transactions.find((t) => t.id === id)
    if (!transaction) return false
    const index = this.transactions.findIndex((t) => t.id === id)
    this.transactions[index] = { ...transaction, deletedAt: Date.now() }
    return true
  }

  async clear(): Promise<void> {
    this.transactions = []
  }
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

class DeferredTransactionRepo extends InMemoryTransactionRepo {
  private deferredLoads = new Map<
    string,
    ReturnType<typeof createDeferred<Transaction[]>>
  >()

  async findByAccountBookId(accountBookId: string): Promise<Transaction[]> {
    const deferred = createDeferred<Transaction[]>()
    this.deferredLoads.set(accountBookId, deferred)
    return deferred.promise
  }

  resolveLoad(accountBookId: string, transactions: Transaction[]) {
    const deferred = this.deferredLoads.get(accountBookId)
    if (!deferred) throw new Error(`No deferred load for ${accountBookId}`)
    deferred.resolve(transactions)
  }
}

describe('useAccountBookTransactions', () => {
  it('loads transactions for the requested account book and keeps them sorted by date', async () => {
    const repo = new InMemoryTransactionRepo([
      createTransactionFixture({ id: 'tx-1', accountBookId: 'book-1', date: '2026/03/17' }),
      createTransactionFixture({ id: 'tx-2', accountBookId: 'book-1', date: '2026/03/19', description: 'Dinner' }),
      createTransactionFixture({ id: 'tx-3', accountBookId: 'book-2', description: 'Salary', type: 'income', categoryId: '101-1' }),
    ])

    const { result } = renderHook(() =>
      useAccountBookTransactions('book-1', repo)
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.transactions.map((t) => t.id)).toEqual(['tx-2', 'tx-1'])
    expect(result.current.error).toBeNull()
  })

  it('creates and updates transactions inside the current scope', async () => {
    const repo = new InMemoryTransactionRepo([
      createTransactionFixture({ id: 'tx-1', accountBookId: 'book-1' }),
    ])

    const { result } = renderHook(() =>
      useAccountBookTransactions('book-1', repo)
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.createTransaction(
        createTransactionFixture({
          id: 'tx-2',
          accountBookId: 'book-1',
          description: 'Train ticket',
          categoryId: '3-1',
          paymentMethod: 'Line Pay',
          amount: 80,
        })
      )
    })

    expect(result.current.transactions).toHaveLength(2)

    await act(async () => {
      await result.current.updateTransaction('tx-2', {
        description: 'Airport train ticket',
        paymentMethod: 'Credit Card',
        updatedAt: baseTimestamp + 1000,
      })
    })

    expect(
      result.current.transactions.find((t) => t.id === 'tx-2')
    ).toMatchObject({
      description: 'Airport train ticket',
      paymentMethod: 'Credit Card',
    })
  })

  it('updates income recipients inside the current scope', async () => {
    const repo = new InMemoryTransactionRepo([
      createTransactionFixture({
        id: 'tx-income',
        accountBookId: 'book-1',
        type: 'income',
        amount: 500,
        categoryId: '101-1',
        description: 'Monthly salary',
        receivedByUserId: userList[0]!.id,
        paidByDetail: [{ userId: userList[0]!.id, userType: 'registered', amount: 500 }],
        splitDetail: [{ userId: userList[0]!.id, userType: 'registered', amount: 500 }],
      }),
    ])

    const { result } = renderHook(() =>
      useAccountBookTransactions('book-1', repo)
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.updateTransaction('tx-income', {
        receivedByUserId: userList[1]!.id,
        paidByDetail: [{ userId: userList[1]!.id, userType: 'registered', amount: 500 }],
        splitDetail: [{ userId: userList[1]!.id, userType: 'registered', amount: 500 }],
        updatedAt: baseTimestamp + 1000,
      })
    })

    expect(
      result.current.transactions.find((t) => t.id === 'tx-income')
    ).toMatchObject({ receivedByUserId: userList[1]!.id })
  })

  it('removes transactions that move out of scope during update', async () => {
    const repo = new InMemoryTransactionRepo([
      createTransactionFixture({ id: 'tx-1', accountBookId: 'book-1' }),
    ])

    const { result } = renderHook(() =>
      useAccountBookTransactions('book-1', repo)
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.updateTransaction('tx-1', {
        accountBookId: 'book-2',
        updatedAt: baseTimestamp + 1000,
      })
    })

    expect(result.current.transactions).toEqual([])
  })

  it('removes deleted transactions from the list', async () => {
    const repo = new InMemoryTransactionRepo([
      createTransactionFixture({ id: 'tx-1', accountBookId: 'book-1' }),
    ])

    const { result } = renderHook(() =>
      useAccountBookTransactions('book-1', repo)
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.deleteTransaction('tx-1')
    })

    expect(result.current.transactions).toEqual([])
  })

  it('ignores stale account-book transaction loads and keeps the latest scope active', async () => {
    const repo = new DeferredTransactionRepo()

    const { result, rerender } = renderHook(
      ({ id }: { id: string }) => useAccountBookTransactions(id, repo),
      { initialProps: { id: 'book-1' } }
    )

    expect(result.current.isLoading).toBe(true)

    rerender({ id: 'book-2' })

    repo.resolveLoad('book-1', [
      createTransactionFixture({ id: 'tx-1', accountBookId: 'book-1' }),
    ])

    await act(async () => {})

    // stale load for book-1 should not update the displayed transactions
    expect(result.current.transactions).toEqual([])

    repo.resolveLoad('book-2', [
      createTransactionFixture({ id: 'tx-2', accountBookId: 'book-2', description: 'Salary', type: 'income', categoryId: '101-1' }),
    ])

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.transactions.map((t) => t.id)).toEqual(['tx-2'])
  })
})
