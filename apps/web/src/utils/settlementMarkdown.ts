import dayjs from 'dayjs'

import { SettlementRecord } from '@/entities/settlement'
import { Transaction } from '@/entities/transaction'
import { User, isDeletedUser } from '@/entities/user'

function userName(userId: string, userMap: Map<string, User>, t: (key: string, values?: any) => string): string {
  const user = userMap.get(userId)
  if (!user) return userId
  if (isDeletedUser(user)) return `${user.name} ${t('settlement.markdown.content.deleted')}`
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
  t: (key: string, values?: any) => string
}): string {
  const {
    sequenceNumber,
    record,
    transactions,
    currency,
    userMap,
    categoryMap,
    t,
  } = params

  const date = dayjs(record.createdAt).format('YYYY-MM-DD')

  const sections: string[] = []

  // Header
  sections.push(t('settlement.markdown.content.title', { sequenceNumber, date }))

  // Member Balances
  const memberLines: string[] = [t('settlement.markdown.content.memberBalances'), '']
  if (record.memberStatuses.length === 0) {
    memberLines.push(t('settlement.markdown.content.noMemberData'))
  } else {
    memberLines.push(
      `| ${t('settlement.markdown.content.tableHeaderMember')} | ${t(
        'settlement.markdown.content.tableHeaderSplit'
      )} | ${t('settlement.markdown.content.tableHeaderPaid')} | ${t(
        'settlement.markdown.content.tableHeaderBalance'
      )} |`
    )
    memberLines.push('|--------|-------|------|---------|')
    for (const ms of record.memberStatuses) {
      const name = userName(ms.userId, userMap, t)
      const split = fmt(ms.splitAmount, currency)
      const paid = fmt(ms.paidAmount, currency)
      let balance: string
      if (ms.netAmount === 0) {
        balance = `${fmt(0, currency)} ${t('settlement.markdown.content.settled')}`
      } else if (ms.netAmount > 0) {
        balance = `+${fmt(ms.netAmount, currency)} ${t('settlement.markdown.content.toReceive')}`
      } else {
        balance = `-${fmt(Math.abs(ms.netAmount), currency)} ${t('settlement.markdown.content.toPay')}`
      }
      memberLines.push(`| ${name} | ${split} | ${paid} | ${balance} |`)
    }
  }
  sections.push(memberLines.join('\n'))

  // Transfers
  const transferLines: string[] = [t('settlement.markdown.content.transfers'), '']
  if (record.transfers.length === 0) {
    transferLines.push(t('settlement.markdown.content.noTransfers'))
  } else {
    for (const transfer of record.transfers) {
      const from = userName(transfer.fromUserId, userMap, t)
      const to = userName(transfer.toUserId, userMap, t)
      const suggested = fmt(transfer.suggestedAmount, currency)
      const checkbox = transfer.status === 'completed' ? '[x]' : '[ ]'
      let line = `- ${checkbox} ${from} → ${to}: ${suggested}`
      if (transfer.status === 'completed' && transfer.actualAmount !== null) {
        const showActual =
          transfer.actualAmount !== transfer.suggestedAmount || transfer.note.length > 0
        if (showActual) {
          line += ` _${t('settlement.markdown.content.actual', {
            amount: fmt(transfer.actualAmount, currency),
            note: transfer.note ? ` · ${transfer.note}` : '',
          })}_`
        }
      }
      transferLines.push(line)
    }
  }
  sections.push(transferLines.join('\n'))

  // Covered Transactions
  const activeTxs = transactions.filter((tx) => tx.deletedAt === null)
  const txLines: string[] = [
    t('settlement.markdown.content.coveredTransactions', { count: activeTxs.length }),
    '',
  ]
  if (activeTxs.length === 0) {
    txLines.push(t('settlement.markdown.content.noCoveredTransactions'))
  } else {
    for (const tx of activeTxs) {
      const desc = tx.description || t('settlement.markdown.content.noDescription')
      const category = categoryMap.get(tx.categoryId) ?? tx.categoryId

      const paidByNames = tx.paidByDetail
        .map((p) => `${userName(p.userId, userMap, t)} ${fmt(p.amount, currency)}`)
        .join(', ')

      const splitWithNames = tx.splitDetail
        .map((s) => `${userName(s.userId, userMap, t)} ${fmt(s.amount, currency)}`)
        .join(', ')

      txLines.push(`- ${tx.date} · ${desc} · ${fmt(tx.amount, currency)}`)
      txLines.push(`  - ${t('settlement.markdown.content.category', { category })}`)
      txLines.push(`  - ${t('settlement.markdown.content.paidBy', { paidBy: paidByNames })}`)
      txLines.push(`  - ${t('settlement.markdown.content.splitWith', { splitWith: splitWithNames })}`)
    }
  }
  sections.push(txLines.join('\n'))

  return sections.join('\n\n')
}
