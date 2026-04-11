import { useCallback, useEffect, useRef, useState } from 'react'
import { Transaction } from '@/entities/transaction'
import {
  SettlementRecord,
  SettlementMemberStatus,
  SettlementTransfer,
  SettlementRepo,
} from '@/entities/settlement'
import { SettlementLocalRepo } from '@/repositories/settlementRepo'
import {
  computeUnsettledTransactions,
  computeMemberStatuses,
  computeMinimumTransfers,
} from '@/utils/settlementUtils'
import { genUuid } from '@/utils/genUuid'

type UseSettlementReturn = {
  records: SettlementRecord[]
  /**
   * Per-member balance preview for unsettled transactions.
   * netAmount > 0: others owe this member; netAmount < 0: this member owes others.
   * Recomputed whenever transactions change. Snapshot is also embedded in each SettlementRecord.
   */
  memberStatuses: SettlementMemberStatus[]
  /**
   * Minimum set of transfers needed to settle all non-zero balances,
   * derived from the current memberStatuses via greedy creditor/debtor matching.
   * These are previews only — they become persisted SettlementTransfer objects
   * (with id, status, etc.) when createSettlementRecord is called.
   */
  transferSuggestions: Omit<
    SettlementTransfer,
    'id' | 'actualAmount' | 'note' | 'status' | 'completedAt'
  >[]
  isLoading: boolean
  error: string | null
  createSettlementRecord: (transactions: Transaction[]) => Promise<void>
  completeTransfer: (
    recordId: string,
    transferId: string,
    actualAmount: number,
    note: string
  ) => Promise<void>
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Unknown settlement error'
}

export function useSettlement(
  accountBookId: string | null,
  transactions: Transaction[] | null = null,
  repo: SettlementRepo = new SettlementLocalRepo()
): UseSettlementReturn {
  const [records, setRecords] = useState<SettlementRecord[]>([])
  const [memberStatuses, setMemberStatuses] = useState<
    SettlementMemberStatus[]
  >([])
  const [transferSuggestions, setTransferSuggestions] = useState<
    Omit<
      SettlementTransfer,
      'id' | 'actualAmount' | 'note' | 'status' | 'completedAt'
    >[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const repoRef = useRef(repo)

  useEffect(() => {
    if (!accountBookId) {
      setRecords([])
      setMemberStatuses([])
      setTransferSuggestions([])
      return
    }

    let isActive = true
    setIsLoading(true)
    setError(null)

    repoRef.current
      .findByAccountBookId(accountBookId)
      .then((fetchedRecords) => {
        if (!isActive) return
        setRecords(fetchedRecords)
        if (transactions !== null) {
          const unsettled = computeUnsettledTransactions(transactions)
          const statuses = computeMemberStatuses(unsettled)
          const suggestions = computeMinimumTransfers(statuses)
          setMemberStatuses(statuses)
          setTransferSuggestions(suggestions)
        }
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        if (!isActive) return
        setError(toErrorMessage(err))
        setIsLoading(false)
      })

    return () => {
      isActive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountBookId, transactions])

  const createSettlementRecord = useCallback(
    async (txns: Transaction[]) => {
      if (!accountBookId) return

      setIsLoading(true)
      setError(null)

      try {
        const unsettled = computeUnsettledTransactions(txns)
        const statuses = computeMemberStatuses(unsettled)
        const suggestions = computeMinimumTransfers(statuses)
        const now = Date.now()

        const newRecord: SettlementRecord = {
          id: genUuid(),
          accountBookId,
          memberStatuses: statuses,
          transfers: suggestions.map((t) => ({
            ...t,
            id: genUuid(),
            actualAmount: null,
            note: '',
            status: 'pending',
            completedAt: null,
          })),
          createdAt: now,
          updatedAt: now,
        }

        await repoRef.current.create(
          newRecord,
          unsettled.map((t) => t.id)
        )

        const emptyStatuses = computeMemberStatuses([])
        const emptySuggestions = computeMinimumTransfers(emptyStatuses)

        setRecords((prev) => [...prev, newRecord])
        setMemberStatuses(emptyStatuses)
        setTransferSuggestions(emptySuggestions)
        setIsLoading(false)
      } catch (err) {
        setError(toErrorMessage(err))
        setIsLoading(false)
        throw err
      }
    },
    [accountBookId]
  )

  const completeTransfer = useCallback(
    async (
      recordId: string,
      transferId: string,
      actualAmount: number,
      note: string
    ) => {
      setIsLoading(true)
      setError(null)

      try {
        const record = records.find((r) => r.id === recordId)
        if (!record) {
          setIsLoading(false)
          return
        }

        const updatedTransfers = record.transfers.map((t) =>
          t.id === transferId
            ? {
                ...t,
                actualAmount,
                note,
                status: 'completed' as const,
                completedAt: Date.now(),
              }
            : t
        )

        const updatedRecord = await repoRef.current.update(recordId, {
          transfers: updatedTransfers,
          updatedAt: Date.now(),
        })

        if (!updatedRecord) {
          setError(`Settlement record ${recordId} no longer exists`)
          setIsLoading(false)
          return
        }

        setRecords((prev) =>
          prev.map((r) => (r.id === recordId ? updatedRecord : r))
        )
        setIsLoading(false)
      } catch (err) {
        setError(toErrorMessage(err))
        setIsLoading(false)
        throw err
      }
    },
    [records]
  )

  return {
    records,
    memberStatuses,
    transferSuggestions,
    isLoading,
    error,
    createSettlementRecord,
    completeTransfer,
  }
}
