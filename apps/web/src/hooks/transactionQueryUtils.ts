import { QueryClient } from '@tanstack/react-query'
import { Transaction } from '@/entities/transaction'

export type TransactionCalendarVisibleRange = {
  startDate: string
  endDate: string
}

const EMPTY_SCOPE = '__none__'

type RangeScope = {
  accountBookId: string
  startDate: string
  endDate: string
}

export function transactionRangeQueryKey(
  accountBookId: string | null,
  startDate: string | null,
  endDate: string | null
) {
  return [
    'transactions',
    'range',
    accountBookId ?? EMPTY_SCOPE,
    startDate ?? EMPTY_SCOPE,
    endDate ?? EMPTY_SCOPE,
  ] as const
}

export function sortTransactions(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((left, right) => {
    if (left.date !== right.date) {
      return right.date.localeCompare(left.date)
    }

    if (left.updatedAt !== right.updatedAt) {
      return right.updatedAt - left.updatedAt
    }

    return right.createdAt - left.createdAt
  })
}

function matchesAccountBookScope(
  transaction: Transaction,
  accountBookId: string
): boolean {
  return accountBookId === 'all' || transaction.accountBookId === accountBookId
}

function isDateInRange(
  date: string,
  startDate: string,
  endDate: string
): boolean {
  return date >= startDate && date <= endDate
}

function upsertTransaction(
  transactions: Transaction[],
  transaction: Transaction
): Transaction[] {
  const next = transactions.filter((item) => item.id !== transaction.id)
  next.push(transaction)
  return sortTransactions(next)
}

function parseRangeScope(queryKey: readonly unknown[]): RangeScope | null {
  if (
    queryKey[0] !== 'transactions' ||
    queryKey[1] !== 'range' ||
    typeof queryKey[2] !== 'string' ||
    typeof queryKey[3] !== 'string' ||
    typeof queryKey[4] !== 'string'
  ) {
    return null
  }

  if (
    queryKey[2] === EMPTY_SCOPE ||
    queryKey[3] === EMPTY_SCOPE ||
    queryKey[4] === EMPTY_SCOPE
  ) {
    return null
  }

  return {
    accountBookId: queryKey[2],
    startDate: queryKey[3],
    endDate: queryKey[4],
  }
}

export function patchTransactionRangeQueries(
  queryClient: QueryClient,
  previousTransaction: Transaction | null,
  nextTransaction: Transaction | null
) {
  queryClient
    .getQueriesData<Transaction[]>({ queryKey: ['transactions', 'range'] })
    .forEach(([queryKey, cachedTransactions]) => {
      const scope = parseRangeScope(queryKey)

      if (!scope || !cachedTransactions) {
        return
      }

      let updated = cachedTransactions

      if (
        previousTransaction &&
        matchesAccountBookScope(previousTransaction, scope.accountBookId) &&
        isDateInRange(previousTransaction.date, scope.startDate, scope.endDate)
      ) {
        updated = updated.filter(
          (transaction) => transaction.id !== previousTransaction.id
        )
      }

      if (
        nextTransaction &&
        nextTransaction.deletedAt === null &&
        matchesAccountBookScope(nextTransaction, scope.accountBookId) &&
        isDateInRange(nextTransaction.date, scope.startDate, scope.endDate)
      ) {
        updated = upsertTransaction(updated, nextTransaction)
      }

      if (updated !== cachedTransactions) {
        queryClient.setQueryData(queryKey, updated)
      }
    })
}
