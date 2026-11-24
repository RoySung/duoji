import { useCallback, useEffect, useRef, useState } from 'react'
import { liveQuery } from 'dexie'
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
      const results = await repoRef.current.findUnsettledExpenseByAccountBookId(
        id
      )
      setTransactions(results)
      return results
    },
    []
  )

  useEffect(() => {
    if (!accountBookId) {
      setTransactions(null)
      return
    }
    const subscription = liveQuery(() =>
      repoRef.current.findUnsettledExpenseByAccountBookId(accountBookId)
    ).subscribe(setTransactions)

    return () => subscription.unsubscribe()
  }, [accountBookId])

  return {
    transactions,
    refresh: () => load(accountBookId),
  }
}
