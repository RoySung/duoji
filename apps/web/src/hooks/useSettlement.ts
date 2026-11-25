import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { liveQuery } from 'dexie'
import { Transaction } from '@/entities/transaction'
import {
  SettlementRecord,
  SettlementMemberStatus,
  SettlementReviewMembers,
  SettlementTransfer,
  SettlementRepo,
  StaleSettlementReviewError,
} from '@/entities/settlement'
import { SettlementLocalRepo } from '@/repositories/settlementRepo'
import {
  computeUnsettledTransactions,
  computeMemberStatuses,
  computeMinimumTransfers,
  computeSharedWalletSummary,
  getSettlementReviewMembers,
  haveSameSettlementExpenses,
  haveSameSettlementReviewMembers,
  SharedWalletSummary,
} from '@/utils/settlementUtils'
import { genUuid } from '@/utils/genUuid'
import { useUserStore } from '@/stores/user'
import type { User } from '@/entities/user'

export type SettlementPreview = {
  accountBookId: string
  users: User[]
  reviewedMembers: SettlementReviewMembers
  transactions: Transaction[]
  memberStatuses: SettlementMemberStatus[]
  transferSuggestions: Pick<
    SettlementTransfer,
    'fromUserId' | 'toUserId' | 'suggestedAmount'
  >[]
  sharedWalletSummary: SharedWalletSummary
  sharedWalletTransfers: SettlementPreview['transferSuggestions']
}

const noMemberStatuses: SettlementMemberStatus[] = []
const noTransferSuggestions: SettlementPreview['transferSuggestions'] = []

type UseSettlementReturn = {
  preview: SettlementPreview | null
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
  refreshReviewUsers: () => Promise<void>
  createSettlementRecord: (
    transactionsOrPreview: Transaction[] | SettlementPreview
  ) => Promise<void>
  cancelSettlementRecord: (recordId: string) => Promise<void>
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

function buildSettlementPreview(
  accountBookId: string,
  transactions: Transaction[],
  allUsers: User[]
): SettlementPreview {
  const reviewedMembers = getSettlementReviewMembers(allUsers)
  const sharedWalletIds = new Set(reviewedMembers.sharedWalletIds)
  const eligible = computeUnsettledTransactions(transactions).filter(
    (transaction) => transaction.accountBookId === accountBookId
  )
  // Transfer matching uses member encounter order to break ties.
  eligible.sort((left, right) =>
    left.id === right.id ? 0 : left.id < right.id ? -1 : 1
  )
  const memberStatuses = computeMemberStatuses(eligible, sharedWalletIds)
  const sharedWalletSummary = computeSharedWalletSummary(
    eligible,
    sharedWalletIds,
    reviewedMembers.activeMemberCount
  )
  const [sharedWalletId] = sharedWalletIds

  return {
    accountBookId,
    users: allUsers,
    reviewedMembers,
    transactions: eligible,
    memberStatuses,
    transferSuggestions: computeMinimumTransfers(memberStatuses),
    sharedWalletSummary,
    sharedWalletTransfers: sharedWalletId
      ? sharedWalletSummary.borrowings.map(({ userId, amount }) => ({
          fromUserId: userId,
          toUserId: sharedWalletId,
          suggestedAmount: amount,
        }))
      : [],
  }
}

export function haveSameSettlementPreview(
  reviewed: SettlementPreview,
  current: SettlementPreview
): boolean {
  if (reviewed === current) return true
  return (
    reviewed.accountBookId === current.accountBookId &&
    haveSameSettlementReviewMembers(
      reviewed.reviewedMembers,
      current.reviewedMembers
    ) &&
    haveSameSettlementExpenses(reviewed.transactions, current.transactions) &&
    JSON.stringify(reviewed.memberStatuses) ===
      JSON.stringify(current.memberStatuses) &&
    JSON.stringify(reviewed.transferSuggestions) ===
      JSON.stringify(current.transferSuggestions) &&
    JSON.stringify(reviewed.sharedWalletSummary) ===
      JSON.stringify(current.sharedWalletSummary) &&
    JSON.stringify(reviewed.sharedWalletTransfers) ===
      JSON.stringify(current.sharedWalletTransfers)
  )
}

export function useSettlement(
  accountBookId: string | null,
  transactions: Transaction[] | null = null,
  repo: SettlementRepo = new SettlementLocalRepo()
): UseSettlementReturn {
  const [records, setRecords] = useState<SettlementRecord[]>([])
  const [lastSavedPreview, setLastSavedPreview] =
    useState<SettlementPreview | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allUsers = useUserStore((state) => state.allUsers)

  const repoRef = useRef(repo)
  const observesReviewUsers =
    !!repoRef.current.findReviewUsers && transactions !== null
  const [reviewUserSnapshot, setReviewUserSnapshot] = useState<{
    accountBookId: string
    users: User[] | null
  } | null>(null)

  useEffect(() => {
    const repo = repoRef.current
    const findReviewUsers = repo.findReviewUsers
    if (!accountBookId || !observesReviewUsers || !findReviewUsers) return

    const subscription = liveQuery(() =>
      findReviewUsers.call(repo, accountBookId)
    ).subscribe({
      next: (users) => setReviewUserSnapshot({ accountBookId, users }),
      error: (err: unknown) => setError(toErrorMessage(err)),
    })

    return () => subscription.unsubscribe()
  }, [accountBookId, observesReviewUsers])

  const refreshReviewUsers = useCallback(async () => {
    if (!accountBookId || !repoRef.current.findReviewUsers) return

    const users = await repoRef.current.findReviewUsers(accountBookId)
    setReviewUserSnapshot((current) =>
      current?.accountBookId === accountBookId
        ? { accountBookId, users }
        : current
    )
  }, [accountBookId])

  useEffect(() => {
    if (!accountBookId) {
      setRecords([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const subscription = liveQuery(() =>
      repoRef.current.findByAccountBookId(accountBookId)
    ).subscribe({
      next: (fetchedRecords) => {
        setRecords(fetchedRecords)
        setIsLoading(false)
      },
      error: (err: unknown) => {
        setError(toErrorMessage(err))
        setIsLoading(false)
      },
    })

    return () => subscription.unsubscribe()
  }, [accountBookId])

  const persistedUsers =
    reviewUserSnapshot?.accountBookId === accountBookId
      ? reviewUserSnapshot.users
      : null
  const reviewUsers = observesReviewUsers ? persistedUsers : allUsers
  const currentPreview = useMemo(
    () =>
      accountBookId && transactions !== null && reviewUsers !== null
        ? buildSettlementPreview(accountBookId, transactions, reviewUsers)
        : null,
    [accountBookId, transactions, reviewUsers]
  )

  const preview = currentPreview === lastSavedPreview ? null : currentPreview

  const createSettlementRecord = useCallback(
    async (transactionsOrPreview: Transaction[] | SettlementPreview) => {
      if (!accountBookId) return

      const reviewed = !Array.isArray(transactionsOrPreview)
      const settlement = reviewed
        ? transactionsOrPreview
        : buildSettlementPreview(accountBookId, transactionsOrPreview, allUsers)
      if (
        reviewed &&
        (!preview || !haveSameSettlementPreview(settlement, preview))
      ) {
        throw new StaleSettlementReviewError()
      }

      setIsLoading(true)
      setError(null)

      try {
        const now = Date.now()
        const transfers = [
          ...settlement.transferSuggestions,
          ...settlement.sharedWalletTransfers,
        ]
        const newRecord: SettlementRecord = {
          id: genUuid(),
          accountBookId,
          memberStatuses: settlement.memberStatuses,
          transfers: transfers.map((t) => ({
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
          reviewed
            ? {
                reviewedExpenses: settlement.transactions,
                reviewedMembers: settlement.reviewedMembers,
              }
            : settlement.transactions.map(({ id }) => id)
        )

        setRecords((prev) =>
          prev.some((record) => record.id === newRecord.id)
            ? prev
            : [...prev, newRecord]
        )
        if (!reviewed) setLastSavedPreview(currentPreview)
        setIsLoading(false)
      } catch (err) {
        setError(toErrorMessage(err))
        setIsLoading(false)
        throw err
      }
    },
    [accountBookId, allUsers, currentPreview, preview]
  )

  const cancelSettlementRecord = useCallback(
    async (recordId: string) => {
      if (!accountBookId) throw new Error('Account book is unavailable')

      await repoRef.current.cancel(accountBookId, recordId)
      setRecords((previous) =>
        previous.filter((record) => record.id !== recordId)
      )
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
          throw new Error(`Settlement record ${recordId} no longer exists`)
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
          throw new Error(`Settlement record ${recordId} no longer exists`)
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
    preview,
    memberStatuses: preview?.memberStatuses ?? noMemberStatuses,
    transferSuggestions: preview?.transferSuggestions ?? noTransferSuggestions,
    sharedWalletSummary: preview?.sharedWalletSummary ?? null,
    isLoading,
    error,
    refreshReviewUsers,
    createSettlementRecord,
    cancelSettlementRecord,
    completeTransfer,
  }
}
