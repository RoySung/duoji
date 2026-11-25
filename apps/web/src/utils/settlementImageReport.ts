import dayjs from 'dayjs'
import type { SettlementTransfer } from '@/entities/settlement'
import { formatAmount } from './amountUtils'
import {
  activeSettlementExpenses,
  settlementUserName,
  type SettlementRecordExportData,
  type SettlementDraftExportData,
} from './settlementMarkdown'

export type SettlementImageSource =
  | Omit<SettlementRecordExportData, 'transactions'>
  | Omit<SettlementDraftExportData, 'transactions'>

export function createSettlementImageReport(
  source: SettlementRecordExportData | SettlementDraftExportData
) {
  const {
    transactions,
    currency,
    autoRound = true,
    userMap,
    categoryMap,
    t,
  } = source
  const isRecord = 'record' in source
  const wallet = isRecord ? null : source.sharedWalletSummary
  const members = isRecord
    ? source.record.memberStatuses
    : source.memberStatuses
  const transfers: (
    | SettlementTransfer
    | SettlementDraftExportData['transfers'][number]
  )[] = isRecord ? source.record.transfers : source.transfers
  const amount = (value: number) => formatAmount(value, currency)
  const suggested = (value: number) =>
    formatAmount(value, currency, { roundMode: autoRound ? 'ceil' : 'none' })
  const name = (id: string) => settlementUserName(id, userMap, t)
  const expenses = activeSettlementExpenses(transactions).map(
    (transaction) => ({
      description:
        transaction.description ||
        t('settlement.markdown.content.noDescription'),
      date: transaction.date,
      category:
        categoryMap.get(transaction.categoryId) ?? transaction.categoryId,
      amount: amount(transaction.amount),
      payers: transaction.paidByDetail.map(
        ({ userId, amount: share }) => `${name(userId)} ${amount(share)}`
      ),
      splits: transaction.splitDetail.map(
        ({ userId, amount: share }) => `${name(userId)} ${amount(share)}`
      ),
    })
  )

  return {
    title: isRecord
      ? t('settlement.detail.title', { sequenceNumber: source.sequenceNumber })
      : t('settlement.image.draftTitle'),
    date: isRecord
      ? dayjs(source.record.createdAt).format('YYYY-MM-DD')
      : dayjs(source.exportedAt).format('YYYY-MM-DD HH:mm'),
    completed: isRecord
      ? source.record.transfers.every(({ status }) => status === 'completed')
      : null,
    members: members.map(({ userId, splitAmount, paidAmount, netAmount }) => ({
      name: name(userId),
      split: suggested(splitAmount),
      paid: suggested(paidAmount),
      balance: suggested(Math.abs(netAmount)),
      direction:
        netAmount > 0
          ? ('receivable' as const)
          : netAmount < 0
          ? ('payable' as const)
          : ('settled' as const),
    })),
    transfers: transfers.map((transfer) => {
      const isRecordedTransfer = isRecord && 'status' in transfer
      return {
        direction: `${name(transfer.fromUserId)} → ${name(transfer.toUserId)}`,
        suggested: suggested(transfer.suggestedAmount),
        completed: isRecordedTransfer ? transfer.status === 'completed' : null,
        actual:
          isRecordedTransfer &&
          transfer.status === 'completed' &&
          transfer.actualAmount !== null
            ? amount(transfer.actualAmount)
            : null,
        note:
          isRecordedTransfer && transfer.status === 'completed'
            ? transfer.note
            : '',
      }
    }),
    wallet:
      wallet && wallet.totalExpense > 0
        ? {
            total: amount(wallet.totalExpense),
            average: suggested(wallet.averagePerPerson),
            borrowings: wallet.borrowings.map(({ userId, amount: share }) => ({
              name: name(userId),
              amount: suggested(share),
            })),
          }
        : null,
    expenses,
    t,
  }
}

export type SettlementImageReport = ReturnType<
  typeof createSettlementImageReport
>
