import { useCallback, useEffect, useRef, useState } from 'react'
import { Transaction } from '@/entities/transaction'
import { TransactionLocalRepo } from '@/repositories/transactionRepo'

export function useUnsettledTransactions(
  accountBookId: string | null,
  repo: TransactionLocalRepo = new TransactionLocalRepo()
) {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null)
  const repoRef = useRef(repo)

  const load = useCallback(
    async (id: string | null): Promise<Transaction[]> => {
      if (!id) {
        setTransactions(null)
        return []
      }
      const results = await repoRef.current.findUnsettledExpenseByAccountBookId(id)
      setTransactions(results)
      return results
    },
    []
  )

  useEffect(() => {
    let isActive = true
    if (!accountBookId) {
      setTransactions(null)
      return
    }
    void repoRef.current
      .findUnsettledExpenseByAccountBookId(accountBookId)
      .then((results) => {
        if (isActive) setTransactions(results)
      })
    return () => {
      isActive = false
    }
  }, [accountBookId])

  const updateTransaction = useCallback(
    async (id: string, updates: Partial<Transaction>): Promise<Transaction | null> => {
      const updated = await repoRef.current.update(id, updates)
      if (updated && accountBookId) {
        await load(accountBookId)
      }
      return updated
    },
    [accountBookId, load]
  )

  const deleteTransaction = useCallback(
    async (id: string): Promise<boolean> => {
      const deleted = await repoRef.current.delete(id)
      if (deleted && accountBookId) {
        await load(accountBookId)
      }
      return deleted
    },
    [accountBookId, load]
  )

  return {
    transactions,
    refresh: () => load(accountBookId),
    updateTransaction,
    deleteTransaction,
  }
}
