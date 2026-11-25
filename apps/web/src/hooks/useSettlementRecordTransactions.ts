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
  repo?: Pick<TransactionLocalRepo, 'findBySettlementRecordId'>
) {
  const [repository] = useState(() => repo ?? new TransactionLocalRepo())
  const [result, setResult] = useState<{
    recordId: string | null
    status: 'loading' | 'ready' | 'error'
    transactions: Transaction[]
    error: string | null
  }>({ recordId: null, status: 'ready', transactions: [], error: null })
  const pendingRef = useRef(0)

  const loadTransactions = useCallback(
    async (recordId: string | null) => {
      const request = ++pendingRef.current

      if (!recordId) {
        setResult({ recordId, status: 'ready', transactions: [], error: null })
        return []
      }

      setResult((current) => ({
        recordId,
        status: 'loading',
        transactions: current.recordId === recordId ? current.transactions : [],
        error: null,
      }))

      try {
        const transactions = await repository.findBySettlementRecordId(recordId)

        if (pendingRef.current !== request) return []

        setResult({
          recordId,
          status: 'ready',
          transactions: sortTransactions(transactions),
          error: null,
        })
        return transactions
      } catch (err) {
        if (pendingRef.current !== request) return []

        setResult({
          recordId,
          status: 'error',
          transactions: [],
          error: toErrorMessage(err),
        })
        return []
      }
    },
    [repository]
  )

  useEffect(() => {
    void loadTransactions(settlementRecordId)
    return () => {
      pendingRef.current += 1
    }
  }, [loadTransactions, settlementRecordId])

  const isCurrent = result.recordId === settlementRecordId
  const status = isCurrent ? result.status : 'loading'
  return {
    transactions: isCurrent ? result.transactions : [],
    status,
    isLoading: status === 'loading',
    error: isCurrent ? result.error : null,
    loadTransactions,
  }
}
