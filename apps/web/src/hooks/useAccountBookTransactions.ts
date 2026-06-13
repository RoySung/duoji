import { useMemo, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Transaction,
  TransactionCalendarSummary,
  TransactionRepo,
} from '@/entities/transaction'
import { TransactionLocalRepo } from '@/repositories/transactionRepo'
import {
  TransactionCalendarVisibleRange,
  patchTransactionRangeQueries,
  sortTransactions,
  transactionRangeQueryKey,
} from './transactionQueryUtils'
import { saveAccountBookTagsToCache } from './useAccountBookTagSuggestions'

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown transaction error'
}

export function useAccountBookTransactions(
  accountBookId: string | null,
  visibleRange: TransactionCalendarVisibleRange | null,
  repo: TransactionRepo = new TransactionLocalRepo()
) {
  const queryClient = useQueryClient()
  const repoRef = useRef(repo)

  const rangeQuery = useQuery({
    queryKey: transactionRangeQueryKey(
      accountBookId,
      visibleRange?.startDate ?? null,
      visibleRange?.endDate ?? null
    ),
    queryFn: async () => {
      if (!accountBookId || !visibleRange) {
        return []
      }

      return repoRef.current.findByDateRange({
        startDate: visibleRange.startDate,
        endDate: visibleRange.endDate,
        accountBookId: accountBookId === 'all' ? undefined : accountBookId,
      })
    },
    enabled: accountBookId !== null && visibleRange !== null,
    staleTime: 10_000,
    gcTime: 60_000,
  })

  const rangeTransactions = rangeQuery.data ?? []

  const summariesByDate = useMemo(() => {
    const map: Record<string, TransactionCalendarSummary> = {}

    for (const transaction of rangeTransactions) {
      const existing = map[transaction.date]
      if (existing) {
        existing.totalAmount += transaction.amount
        existing.transactionCount += 1
      } else {
        map[transaction.date] = {
          date: transaction.date,
          totalAmount: transaction.amount,
          transactionCount: 1,
          hasTransactions: true,
        }
      }
    }

    return map
  }, [rangeTransactions])

  const transactionsByDate = useMemo(() => {
    const map: Record<string, Transaction[]> = {}

    for (const transaction of rangeTransactions) {
      if (!map[transaction.date]) {
        map[transaction.date] = []
      }
      map[transaction.date].push(transaction)
    }

    for (const date of Object.keys(map)) {
      map[date] = sortTransactions(map[date])
    }

    return map
  }, [rangeTransactions])

  const createTransactionMutation = useMutation({
    mutationFn: (transaction: Transaction) =>
      repoRef.current.create(transaction),
    onSuccess: (createdTransaction) => {
      saveAccountBookTagsToCache(createdTransaction.accountBookId, createdTransaction.tags)
      patchTransactionRangeQueries(queryClient, null, createdTransaction)
      void queryClient.invalidateQueries({
        queryKey: ['transactions', 'range'],
      })
    },
  })

  const updateTransactionMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Transaction>
    }) => {
      const previousTransaction = await repoRef.current.findById(id)
      const updatedTransaction = await repoRef.current.update(id, updates)

      return {
        previousTransaction,
        updatedTransaction,
      }
    },
    onSuccess: ({ previousTransaction, updatedTransaction }) => {
      if (!updatedTransaction) {
        return
      }

      saveAccountBookTagsToCache(updatedTransaction.accountBookId, updatedTransaction.tags)
      patchTransactionRangeQueries(
        queryClient,
        previousTransaction,
        updatedTransaction
      )
      void queryClient.invalidateQueries({
        queryKey: ['transactions', 'range'],
      })
    },
  })

  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      const previousTransaction = await repoRef.current.findById(id)
      const deleted = await repoRef.current.delete(id)

      return {
        previousTransaction,
        deleted,
      }
    },
    onSuccess: ({ previousTransaction, deleted }) => {
      if (!deleted || !previousTransaction) {
        return
      }

      patchTransactionRangeQueries(queryClient, previousTransaction, null)
      void queryClient.invalidateQueries({
        queryKey: ['transactions', 'range'],
      })
    },
  })

  const error =
    rangeQuery.error ??
    createTransactionMutation.error ??
    updateTransactionMutation.error ??
    deleteTransactionMutation.error

  return {
    summariesByDate,
    transactionsByDate,
    rangeTransactions,
    isLoading:
      rangeQuery.isPending ||
      createTransactionMutation.isPending ||
      updateTransactionMutation.isPending ||
      deleteTransactionMutation.isPending,
    error: error ? toErrorMessage(error) : null,
    refetch: rangeQuery.refetch,
    createTransaction: createTransactionMutation.mutateAsync,
    updateTransaction: async (id: string, updates: Partial<Transaction>) => {
      const result = await updateTransactionMutation.mutateAsync({
        id,
        updates,
      })

      return result.updatedTransaction
    },
    deleteTransaction: async (id: string) => {
      const result = await deleteTransactionMutation.mutateAsync(id)
      return result.deleted
    },
  }
}
