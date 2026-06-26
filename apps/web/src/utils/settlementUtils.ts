import {
  isUnsettledSettlementRecordId,
  Transaction,
} from '@/entities/transaction'
import {
  SettlementMemberStatus,
  SettlementTransfer,
} from '@/entities/settlement'

export interface SharedWalletSummary {
  totalExpense: number
  averagePerPerson: number
  borrowings: { userId: string; amount: number }[]
}

/**
 * Returns expense transactions not yet referenced by any settlement record.
 */
export function computeUnsettledTransactions(
  transactions: Transaction[]
): Transaction[] {
  return transactions.filter(
    (t) =>
      t.type === 'expense' &&
      t.deletedAt === null &&
      isUnsettledSettlementRecordId(t.settlementRecordId)
  )
}

/**
 * 計算每位成員在結算時的「應收 / 應付」淨額 (netAmount)：
 * 1. 淨額 = 個人代墊總額 (paidAmount) - 個人應分擔總額 (splitAmount)
 * 2. 正值代表「應收」（別人欠他錢），負值代表「應付」（他欠別人錢）。
 * 3. 若公積金有參與付款，成員的「應分擔金額」會依比例扣除由公積金代付的部分，以算出成員間真實的 P2P 欠款。
 */
export function computeMemberStatuses(
  transactions: Transaction[],
  sharedWalletIds: Set<string> = new Set()
): SettlementMemberStatus[] {
  const paidMap = new Map<string, number>()
  const splitMap = new Map<string, number>()

  for (const t of transactions) {
    if (t.type !== 'expense') continue

    let swPaid = 0
    let totalSplit = 0

    for (const item of t.paidByDetail) {
      if (sharedWalletIds.has(item.userId)) {
        swPaid += item.amount
      } else {
        paidMap.set(item.userId, (paidMap.get(item.userId) ?? 0) + item.amount)
      }
    }

    for (const item of t.splitDetail) {
      totalSplit += item.amount
    }

    for (const item of t.splitDetail) {
      if (sharedWalletIds.has(item.userId)) continue

      let effectiveSplit = item.amount
      if (swPaid > 0 && totalSplit > 0) {
        // Reduce their P2P split amount by the portion covered by the shared wallet
        const coveredBySw = swPaid * (item.amount / totalSplit)
        effectiveSplit -= coveredBySw
      }
      splitMap.set(
        item.userId,
        (splitMap.get(item.userId) ?? 0) + effectiveSplit
      )
    }
  }

  const userIds = new Set([...paidMap.keys(), ...splitMap.keys()])
  const statuses: SettlementMemberStatus[] = []

  for (const userId of userIds) {
    const paidAmount = round2(paidMap.get(userId) ?? 0)
    const splitAmount = round2(splitMap.get(userId) ?? 0)
    const netAmount = round2(paidAmount - splitAmount)
    
    // Ignore users with 0 balances to keep the list clean
    if (paidAmount === 0 && splitAmount === 0 && netAmount === 0) continue

    statuses.push({ userId, paidAmount, splitAmount, netAmount })
  }

  return statuses
}

/**
 * Generates the minimum number of transfers to settle all non-zero balances.
 * Uses greedy creditor/debtor matching.
 */
export function computeMinimumTransfers(
  memberStatuses: SettlementMemberStatus[]
): Omit<
  SettlementTransfer,
  'id' | 'actualAmount' | 'note' | 'status' | 'completedAt'
>[] {
  const creditors = memberStatuses
    .filter((m) => m.netAmount > 0.01)
    .map((m) => ({ userId: m.userId, balance: m.netAmount }))
    .sort((a, b) => b.balance - a.balance)

  const debtors = memberStatuses
    .filter((m) => m.netAmount < -0.01)
    .map((m) => ({ userId: m.userId, balance: -m.netAmount }))
    .sort((a, b) => b.balance - a.balance)

  const transfers: Omit<
    SettlementTransfer,
    'id' | 'actualAmount' | 'note' | 'status' | 'completedAt'
  >[] = []

  let ci = 0
  let di = 0

  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci]
    const debtor = debtors[di]
    const amount = round2(Math.min(creditor.balance, debtor.balance))

    transfers.push({
      fromUserId: debtor.userId,
      toUserId: creditor.userId,
      suggestedAmount: amount,
    })

    creditor.balance = round2(creditor.balance - amount)
    debtor.balance = round2(debtor.balance - amount)

    if (creditor.balance < 0.01) ci++
    if (debtor.balance < 0.01) di++
  }

  return transfers
}

export function computeSharedWalletSummary(
  transactions: Transaction[],
  sharedWalletIds: Set<string>,
  realMembersCount: number
): SharedWalletSummary {
  let totalExpense = 0
  let fullySharedExpense = 0
  const borrowingsMap = new Map<string, number>()

  for (const t of transactions) {
    if (t.type !== 'expense') continue

    let swPaid = 0
    for (const item of t.paidByDetail) {
      if (sharedWalletIds.has(item.userId)) {
        swPaid += item.amount
      }
    }

    if (swPaid > 0) {
      totalExpense += swPaid

      const splitRealMembers = new Set<string>()
      let totalSplit = 0
      for (const item of t.splitDetail) {
        if (!sharedWalletIds.has(item.userId)) {
          splitRealMembers.add(item.userId)
          totalSplit += item.amount
        }
      }

      if (
        splitRealMembers.size > 0 &&
        splitRealMembers.size < realMembersCount
      ) {
        for (const item of t.splitDetail) {
          if (!sharedWalletIds.has(item.userId)) {
            const borrowing = swPaid * (totalSplit > 0 ? item.amount / totalSplit : 0)
            borrowingsMap.set(
              item.userId,
              (borrowingsMap.get(item.userId) ?? 0) + borrowing
            )
          }
        }
      } else if (splitRealMembers.size === realMembersCount) {
        fullySharedExpense += swPaid
      }
    }
  }

  const averagePerPerson =
    realMembersCount > 0 ? fullySharedExpense / realMembersCount : 0

  const borrowings = Array.from(borrowingsMap.entries())
    .map(([userId, amount]) => ({ userId, amount: round2(amount) }))
    .filter((b) => b.amount > 0.01)
    .sort((a, b) => b.amount - a.amount)

  return {
    totalExpense: round2(totalExpense),
    averagePerPerson: round2(averagePerPerson),
    borrowings,
  }
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}
