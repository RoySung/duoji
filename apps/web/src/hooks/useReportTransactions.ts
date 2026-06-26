import { useRef } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Transaction, TransactionRepo } from '@/entities/transaction'
import { TransactionLocalRepo } from '@/repositories/transactionRepo'

type DateRange = { startDate: string; endDate: string }

export function useReportTransactions(
  accountBookId: string | null,
  dateRange: DateRange | null,
  repo: TransactionRepo = new TransactionLocalRepo()
) {
  const repoRef = useRef(repo)

  const query = useQuery<Transaction[]>({
    queryKey: [
      'transactions',
      'report',
      accountBookId ?? '__none__',
      dateRange?.startDate ?? '',
      dateRange?.endDate ?? '',
    ],
    queryFn: async () => {
      if (!accountBookId) {
        return []
      }

      if (dateRange === null) {
        if (accountBookId === 'all') {
          return repoRef.current.findAll()
        }
        return repoRef.current.findByAccountBookId(accountBookId)
      }

      return repoRef.current.findByDateRange({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        accountBookId: accountBookId === 'all' ? undefined : accountBookId,
      })
    },
    enabled: accountBookId !== null,
    staleTime: 10_000,
    gcTime: 60_000,
    placeholderData: keepPreviousData,
  })

  const error = query.error

  return {
    transactions: query.data ?? [],
    isLoading: query.isPending,
    isFetching: query.isFetching,
    error: error ? toErrorMessage(error) : null,
    refetch: query.refetch,
    range: dateRange,
  }
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'Unknown report query error'
}
