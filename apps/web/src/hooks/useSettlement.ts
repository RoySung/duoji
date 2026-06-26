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
  computeSharedWalletSummary,
  SharedWalletSummary,
} from '@/utils/settlementUtils'
import { genUuid } from '@/utils/genUuid'
import { useUserStore } from '@/stores/user'
import { isDeletedUser, isSharedWalletUser } from '@/entities/user'

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
  sharedWalletSummary: SharedWalletSummary | null
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
  const [sharedWalletSummary, setSharedWalletSummary] =
    useState<SharedWalletSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allUsers = useUserStore((state) => state.allUsers)

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
          const sharedWalletIds = new Set(
            allUsers.filter(isSharedWalletUser).map((u) => u.id)
          )
          const realMembersCount = allUsers.filter(
            (u) => !isDeletedUser(u) && !isSharedWalletUser(u)
          ).length

          const unsettled = computeUnsettledTransactions(transactions)
          const statuses = computeMemberStatuses(unsettled, sharedWalletIds)
          const suggestions = computeMinimumTransfers(statuses)
          const summary = computeSharedWalletSummary(
            unsettled,
            sharedWalletIds,
            realMembersCount
          )

          setMemberStatuses(statuses)
          setTransferSuggestions(suggestions)
          setSharedWalletSummary(summary)
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
  }, [accountBookId, transactions, allUsers])

  const createSettlementRecord = useCallback(
    async (txns: Transaction[]) => {
      if (!accountBookId) return

      setIsLoading(true)
      setError(null)

      try {
        const sharedWalletIds = new Set(
          allUsers.filter(isSharedWalletUser).map((u) => u.id)
        )
        const realMembersCount = allUsers.filter(
          (u) => !isDeletedUser(u) && !isSharedWalletUser(u)
        ).length

        const unsettled = computeUnsettledTransactions(txns)
        const statuses = computeMemberStatuses(unsettled, sharedWalletIds)
        const suggestions = computeMinimumTransfers(statuses)
        const summary = computeSharedWalletSummary(
          unsettled,
          sharedWalletIds,
          realMembersCount
        )

        const now = Date.now()

        const sharedWalletTransfers = summary.borrowings.flatMap((b) => {
          const swId = Array.from(sharedWalletIds)[0]
          if (!swId) return []
          return [
            {
              fromUserId: b.userId,
              toUserId: swId,
              suggestedAmount: b.amount,
            },
          ]
        })

        const allTransfersToSave = [...suggestions, ...sharedWalletTransfers]

        const newRecord: SettlementRecord = {
          id: genUuid(),
          accountBookId,
          memberStatuses: statuses,
          transfers: allTransfersToSave.map((t) => ({
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
        setSharedWalletSummary(null)
        setIsLoading(false)
      } catch (err) {
        setError(toErrorMessage(err))
        setIsLoading(false)
        throw err
      }
    },
    [accountBookId, allUsers]
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
    sharedWalletSummary,
    isLoading,
    error,
    createSettlementRecord,
    completeTransfer,
  }
}
