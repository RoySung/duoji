import { useCallback, useEffect, useRef, useState } from 'react'
import { Transaction } from '@/entities/transaction'
import { TransactionLocalRepo } from '@/repositories/transactionRepo'

function sortTransactions(transactions: Transaction[]): Transaction[] {
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

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown transaction error'
}

export function useSettlementRecordTransactions(
  settlementRecordId: string | null,
  repo: TransactionLocalRepo = new TransactionLocalRepo()
) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pendingRef = useRef<string | null>(null)
  const repoRef = useRef(repo)

  const loadTransactions = useCallback(async (recordId: string | null) => {
    pendingRef.current = recordId
    setIsLoading(true)
    setError(null)

    if (!recordId) {
      setTransactions([])
      setIsLoading(false)
      return []
    }

    try {
      const results = await repoRef.current.findBySettlementRecordId(recordId)

      if (pendingRef.current !== recordId) {
        return []
      }

      setTransactions(sortTransactions(results))
      setIsLoading(false)
      return results
    } catch (err) {
      if (pendingRef.current !== recordId) {
        return []
      }

      setError(toErrorMessage(err))
      setIsLoading(false)
      return []
    }
  }, [])

  useEffect(() => {
    void loadTransactions(settlementRecordId)
  }, [loadTransactions, settlementRecordId])

  return {
    transactions,
    isLoading,
    error,
    loadTransactions,
  }
}
