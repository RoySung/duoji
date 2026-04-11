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

function upsertTransaction(
  transactions: Transaction[],
  transaction: Transaction
): Transaction[] {
  const existingIndex = transactions.findIndex(
    (t) => t.id === transaction.id
  )

  if (existingIndex === -1) {
    return sortTransactions([...transactions, transaction])
  }

  const next = [...transactions]
  next[existingIndex] = transaction
  return sortTransactions(next)
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown transaction error'
}

export function useAccountBookTransactions(
  accountBookId: string | null,
  repo: TransactionLocalRepo = new TransactionLocalRepo()
) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pendingRef = useRef<string | null>(null)
  const repoRef = useRef(repo)

  const loadTransactions = useCallback(async (id: string | null) => {
    pendingRef.current = id
    setIsLoading(true)
    setError(null)

    if (!id) {
      setTransactions([])
      setIsLoading(false)
      return []
    }

    try {
      const results = await repoRef.current.findByAccountBookId(id)

      if (pendingRef.current !== id) {
        return []
      }

      setTransactions(sortTransactions(results))
      setIsLoading(false)
      return results
    } catch (err) {
      if (pendingRef.current !== id) {
        return []
      }

      setError(toErrorMessage(err))
      setIsLoading(false)
      return []
    }
  }, [])

  useEffect(() => {
    void loadTransactions(accountBookId)
  }, [accountBookId, loadTransactions])

  const createTransaction = useCallback(
    async (transaction: Transaction): Promise<Transaction> => {
      setIsLoading(true)
      setError(null)

      try {
        const created = await repoRef.current.create(transaction)

        setTransactions((prev) =>
          created.accountBookId === accountBookId
            ? upsertTransaction(prev, created)
            : prev
        )
        setIsLoading(false)
        return created
      } catch (err) {
        setIsLoading(false)
        setError(toErrorMessage(err))
        throw err
      }
    },
    [accountBookId]
  )

  const updateTransaction = useCallback(
    async (
      id: string,
      updates: Partial<Transaction>
    ): Promise<Transaction | null> => {
      setIsLoading(true)
      setError(null)

      try {
        const updated = await repoRef.current.update(id, updates)

        setTransactions((prev) => {
          if (!updated) {
            return prev
          }

          return updated.accountBookId === accountBookId
            ? upsertTransaction(prev, updated)
            : prev.filter((t) => t.id !== id)
        })
        setIsLoading(false)
        return updated
      } catch (err) {
        setIsLoading(false)
        setError(toErrorMessage(err))
        throw err
      }
    },
    [accountBookId]
  )

  const deleteTransaction = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const deleted = await repoRef.current.delete(id)

      if (deleted) {
        setTransactions((prev) => prev.filter((t) => t.id !== id))
      }

      setIsLoading(false)
      return deleted
    } catch (err) {
      setIsLoading(false)
      setError(toErrorMessage(err))
      return false
    }
  }, [])

  return {
    transactions,
    isLoading,
    error,
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
