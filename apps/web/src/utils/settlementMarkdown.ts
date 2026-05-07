import dayjs from 'dayjs'

import { SettlementRecord } from '@/entities/settlement'
import { Transaction } from '@/entities/transaction'
import { User, isDeletedUser } from '@/entities/user'

function userName(userId: string, userMap: Map<string, User>): string {
  const user = userMap.get(userId)
  if (!user) return userId
  if (isDeletedUser(user)) return `${user.name} (deleted)`
  return user.name
}

function fmt(amount: number, currency: string | null): string {
  return `${amount.toLocaleString()}${currency ? ` ${currency}` : ''}`
}

export function generateSettlementMarkdown(params: {
  sequenceNumber: number
  record: SettlementRecord
  transactions: Transaction[]
  currency: string | null
  userMap: Map<string, User>
  categoryMap: Map<string, string>
}): string {
  const {
    sequenceNumber,
    record,
    transactions,
    currency,
    userMap,
    categoryMap,
  } = params

  const date = dayjs(record.createdAt).format('YYYY-MM-DD')

  const sections: string[] = []

  // Header
  sections.push(`# Settlement #${sequenceNumber}\n\nDate: ${date}`)

  // Member Balances
  const memberLines: string[] = ['## Member Balances', '']
  if (record.memberStatuses.length === 0) {
    memberLines.push('_No member data._')
  } else {
    memberLines.push('| Member | Split | Paid | Balance |')
    memberLines.push('|--------|-------|------|---------|')
    for (const ms of record.memberStatuses) {
      const name = userName(ms.userId, userMap)
      const split = fmt(ms.splitAmount, currency)
      const paid = fmt(ms.paidAmount, currency)
      let balance: string
      if (ms.netAmount === 0) {
        balance = `${fmt(0, currency)} (settled)`
      } else if (ms.netAmount > 0) {
        balance = `+${fmt(ms.netAmount, currency)} (to receive)`
      } else {
        balance = `-${fmt(Math.abs(ms.netAmount), currency)} (to pay)`
      }
      memberLines.push(`| ${name} | ${split} | ${paid} | ${balance} |`)
    }
  }
  sections.push(memberLines.join('\n'))

  // Transfers
  const transferLines: string[] = ['## Transfers', '']
  if (record.transfers.length === 0) {
    transferLines.push('_No transfers._')
  } else {
    for (const t of record.transfers) {
      const from = userName(t.fromUserId, userMap)
      const to = userName(t.toUserId, userMap)
      const suggested = fmt(t.suggestedAmount, currency)
      const checkbox = t.status === 'completed' ? '[x]' : '[ ]'
      let line = `- ${checkbox} ${from} → ${to}: ${suggested}`
      if (t.status === 'completed' && t.actualAmount !== null) {
        const showActual =
          t.actualAmount !== t.suggestedAmount || t.note.length > 0
        if (showActual) {
          const noteFragment = t.note ? ` · ${t.note}` : ''
          line += ` _(actual: ${fmt(t.actualAmount, currency)}${noteFragment})_`
        }
      }
      transferLines.push(line)
    }
  }
  sections.push(transferLines.join('\n'))

  // Covered Transactions
  const activeTxs = transactions.filter((tx) => tx.deletedAt === null)
  const txLines: string[] = [
    `## Covered Transactions (${activeTxs.length})`,
    '',
  ]
  if (activeTxs.length === 0) {
    txLines.push('_No covered transactions._')
  } else {
    for (const tx of activeTxs) {
      const desc = tx.description || 'No description'
      const category = categoryMap.get(tx.categoryId) ?? tx.categoryId

      const paidByNames = tx.paidByDetail
        .map((p) => `${userName(p.userId, userMap)} ${fmt(p.amount, currency)}`)
        .join(', ')

      const splitWithNames = tx.splitDetail
        .map((s) => `${userName(s.userId, userMap)} ${fmt(s.amount, currency)}`)
        .join(', ')

      txLines.push(`- ${tx.date} · ${desc} · ${fmt(tx.amount, currency)}`)
      txLines.push(`  - Category: ${category}`)
      txLines.push(`  - Paid by: ${paidByNames}`)
      txLines.push(`  - Split with: ${splitWithNames}`)
    }
  }
  sections.push(txLines.join('\n'))

  return sections.join('\n\n')
}
