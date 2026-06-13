import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import React, { type ReactNode } from 'react'
import {
  DefaultPaymentMethod,
  isUnsettledSettlementRecordId,
  Transaction,
  TransactionDateQuery,
  TransactionDateRangeQuery,
  TransactionRepo,
  UNSETTLED_SETTLEMENT_RECORD_ID,
} from '../src/entities/transaction'
import { useAccountBookTagSuggestions } from '../src/hooks/useAccountBookTagSuggestions'
import { useAccountBookTransactions } from '../src/hooks/useAccountBookTransactions'
import { TransactionCalendarVisibleRange } from '../src/hooks/transactionQueryUtils'
import { userList } from './fixtures'

const baseTimestamp = 1710000000000

const testRange: TransactionCalendarVisibleRange = {
  startDate: '2026/03/01',
  endDate: '2026/03/31',
}

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
      this.transactions.find((t) => t.id === id && t.deletedAt === null) ?? null
    )
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactions.filter((t) => t.deletedAt === null)
  }

  async findByDate({
    date,
    accountBookId,
  }: TransactionDateQuery): Promise<Transaction[]> {
    return this.transactions.filter(
      (t) =>
        t.date === date &&
        t.deletedAt === null &&
        (accountBookId === undefined || t.accountBookId === accountBookId)
    )
  }

  async findByAccountBookId(accountBookId: string): Promise<Transaction[]> {
    return this.transactions.filter(
      (t) => t.accountBookId === accountBookId && t.deletedAt === null
    )
  }

  async findByDateRange(
    query: TransactionDateRangeQuery
  ): Promise<Transaction[]> {
    const { startDate, endDate, accountBookId } = query

    return this.transactions.filter(
      (t) =>
        t.date >= startDate &&
        t.date <= endDate &&
        t.deletedAt === null &&
        (accountBookId === undefined || t.accountBookId === accountBookId)
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

  const promise = new Promise<T>((res) => {
    resolve = res
  })

  return { promise, resolve }
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

    if (!deferred) {
      throw new Error(`No deferred load for ${accountBookId}`)
    }

    deferred.resolve(transactions)
  }
}

function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  function QueryWrapper({ children }: { children: ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    )
  }

  return { queryClient, wrapper: QueryWrapper }
}

describe('useAccountBookTagSuggestions', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('uses only the selected account book and clears stale suggestions while switching', () => {
    const { result, rerender } = renderHook(
      ({ accountBookId }: { accountBookId: string | null }) =>
        useAccountBookTagSuggestions(accountBookId, []),
      {
        initialProps: { accountBookId: 'book-1' },
      }
    )

    expect(result.current.suggestions).toEqual([])

    act(() => {
      localStorage.setItem('duoji_tag_suggestions_book-1', JSON.stringify(['meal', 'travel']))
    })
    rerender({ accountBookId: 'book-1' })
    expect(result.current.suggestions).toEqual(['meal', 'travel'])

    rerender({ accountBookId: 'book-2' })
    expect(result.current.suggestions).toEqual([])

    act(() => {
      localStorage.setItem('duoji_tag_suggestions_book-2', JSON.stringify(['salary']))
    })
    rerender({ accountBookId: 'book-2' })
    expect(result.current.suggestions).toEqual(['salary'])
  })

  it('normalizes visible suggestions by trimming, deduping, sorting, and hiding selected tags', () => {
    localStorage.setItem(
      'duoji_tag_suggestions_book-1',
      JSON.stringify([' Meal ', '', 'zebra', 'meal', '  ', 'apple', 'travel'])
    )

    const { result } = renderHook(
      () => useAccountBookTagSuggestions('book-1', ['travel'])
    )

    expect(result.current.suggestions).toEqual(['apple', 'Meal', 'zebra'])
  })

  it('stays coherent with create and update mutations via localStorage updates', async () => {
    localStorage.setItem(
      'duoji_tag_suggestions_book-1',
      JSON.stringify(['meal'])
    )
    const repo = new InMemoryTransactionRepo([
      createTransactionFixture({ id: 'tx-1', accountBookId: 'book-1', tags: ['meal'] }),
    ])
    const { wrapper } = createQueryWrapper()

    const suggestions = renderHook(
      () => useAccountBookTagSuggestions('book-1', [])
    )
    const transactions = renderHook(
      () => useAccountBookTransactions('book-1', testRange, repo),
      { wrapper }
    )

    expect(suggestions.result.current.suggestions).toEqual(['meal'])
    await waitFor(() => {
      expect(transactions.result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await transactions.result.current.createTransaction(
        createTransactionFixture({
          id: 'tx-2',
          accountBookId: 'book-1',
          tags: ['travel'],
        })
      )
    })

    suggestions.rerender()
    expect(suggestions.result.current.suggestions).toEqual(['meal', 'travel'])

    await act(async () => {
      await transactions.result.current.updateTransaction('tx-1', {
        tags: [],
        updatedAt: baseTimestamp + 1000,
      })
    })

    suggestions.rerender()
    expect(suggestions.result.current.suggestions).toEqual(['meal', 'travel'])

    await act(async () => {
      await transactions.result.current.deleteTransaction('tx-2')
    })

    suggestions.rerender()
    expect(suggestions.result.current.suggestions).toEqual(['meal', 'travel'])
  })
})