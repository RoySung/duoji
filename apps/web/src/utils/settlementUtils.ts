import {
  isUnsettledSettlementRecordId,
  Transaction,
} from '@/entities/transaction'
import {
  SettlementMemberStatus,
  SettlementTransfer,
} from '@/entities/settlement'

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
 * Computes per-member net balances from a list of expense transactions.
 * netAmount = paidAmount − splitAmount
 * Positive = member is owed money; negative = member owes money.
 */
export function computeMemberStatuses(
  transactions: Transaction[]
): SettlementMemberStatus[] {
  const paidMap = new Map<string, number>()
  const splitMap = new Map<string, number>()

  for (const t of transactions) {
    if (t.type !== 'expense') continue

    for (const item of t.paidByDetail) {
      paidMap.set(item.userId, (paidMap.get(item.userId) ?? 0) + item.amount)
    }

    for (const item of t.splitDetail) {
      splitMap.set(item.userId, (splitMap.get(item.userId) ?? 0) + item.amount)
    }
  }

  const userIds = new Set([...paidMap.keys(), ...splitMap.keys()])
  const statuses: SettlementMemberStatus[] = []

  for (const userId of userIds) {
    const paidAmount = round2(paidMap.get(userId) ?? 0)
    const splitAmount = round2(splitMap.get(userId) ?? 0)
    const netAmount = round2(paidAmount - splitAmount)
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

function round2(value: number): number {
  return Math.round(value * 100) / 100
}
