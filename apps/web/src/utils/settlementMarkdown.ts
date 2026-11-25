import dayjs from 'dayjs'

import { SettlementRecord, SettlementTransfer } from '@/entities/settlement'
import { Transaction } from '@/entities/transaction'
import { User, isDeletedUser } from '@/entities/user'
import { formatAmount } from '@/utils/amountUtils'
import type { SharedWalletSummary } from '@/utils/settlementUtils'

type Translate = (
  key: string,
  values?: Record<string, string | number>
) => string

export function settlementUserName(
  userId: string,
  userMap: ReadonlyMap<string, User>,
  t: Translate
): string {
  const user = userMap.get(userId)
  if (!user) return userId

  return isDeletedUser(user)
    ? `${user.name} ${t('settlement.markdown.content.deleted')}`
    : user.name
}

type MarkdownData = {
  transactions: Transaction[]
  currency: string | null
  autoRound?: boolean
  userMap: ReadonlyMap<string, User>
  categoryMap: ReadonlyMap<string, string>
  t: Translate
}

export type SettlementRecordExportData = MarkdownData & {
  sequenceNumber: number
  record: SettlementRecord
}

export type SettlementDraftExportData = MarkdownData & {
  exportedAt: Date
  memberStatuses: SettlementRecord['memberStatuses']
  transfers: Pick<
    SettlementTransfer,
    'fromUserId' | 'toUserId' | 'suggestedAmount'
  >[]
  sharedWalletSummary: SharedWalletSummary | null
}

function escapeMarkdownText(value: string): string {
  return value
    .replace(/\r\n?|\n/g, ' ')
    .replace(/[!&*<>_~[\]`|\\]/g, '\\$&')
    .replace(/^(\s*)(#{1,6}|[-+])(?=\s|$)/, '$1\\$2')
    .replace(/^(\s*\d{1,9})([.)])(?=\s|$)/, '$1\\$2')
}

export function activeSettlementExpenses(transactions: Transaction[]) {
  return transactions.filter((transaction) => transaction.deletedAt === null)
}

export function generateSettlementMarkdown(
  params: SettlementRecordExportData
): string {
  return formatSettlementMarkdown(params)
}

export function generateSettlementDraftMarkdown(params: SettlementDraftExportData): string {
  return formatSettlementMarkdown(params)
}

function formatSettlementMarkdown(
  params: SettlementRecordExportData | SettlementDraftExportData
): string {
  const {
    transactions,
    autoRound = true,
    userMap,
    categoryMap,
    t,
  } = params

  const roundMode = autoRound ? 'ceil' : 'none'
  const escapeText = (value: string) =>
    'record' in params ? value : escapeMarkdownText(value)
  const currency = params.currency === null ? null : escapeText(params.currency)
  const userName = (userId: string) =>
    escapeText(settlementUserName(userId, userMap, t))
  const memberStatuses =
    'record' in params ? params.record.memberStatuses : params.memberStatuses
  const transfers: (SettlementTransfer | SettlementDraftExportData['transfers'][number])[] =
    'record' in params ? params.record.transfers : params.transfers

  let titleSection: string
  if ('record' in params) {
    titleSection = t('settlement.markdown.content.title', {
      sequenceNumber: params.sequenceNumber,
      date: dayjs(params.record.createdAt).format('YYYY-MM-DD'),
    })
    if (autoRound) {
      titleSection += `\n_${t('settlement.markdown.content.autoRoundNote')}_`
    }
  } else {
    titleSection = t('settlement.markdown.draft.title', {
      timestamp: params.exportedAt.toISOString(),
    })
    titleSection += `\n_${t(
      autoRound
        ? 'settlement.markdown.draft.roundingOn'
        : 'settlement.markdown.draft.roundingOff'
    )}_`
  }
  const sections = [titleSection]

  // Member Balances
  const memberLines: string[] = [
    t('settlement.markdown.content.memberBalances'),
    '',
  ]
  if (memberStatuses.length === 0) {
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
    for (const ms of memberStatuses) {
      const name = userName(ms.userId)
      const split = formatAmount(ms.splitAmount, currency, { roundMode })
      const paid = formatAmount(ms.paidAmount, currency, { roundMode })
      let balance: string
      if (ms.netAmount === 0) {
        balance = formatAmount(0, currency, { roundMode })
        if ('record' in params) {
          balance += ` ${t('settlement.markdown.content.settled')}`
        }
      } else if (ms.netAmount > 0) {
        balance = `+${formatAmount(ms.netAmount, currency, { roundMode })} ${t(
          'settlement.markdown.content.toReceive'
        )}`
      } else {
        balance = `-${formatAmount(Math.abs(ms.netAmount), currency, {
          roundMode,
        })} ${t('settlement.markdown.content.toPay')}`
      }
      memberLines.push(`| ${name} | ${split} | ${paid} | ${balance} |`)
    }
  }
  sections.push(memberLines.join('\n'))

  // Transfers
  const transferLines: string[] = [
    t(
      'record' in params
        ? 'settlement.markdown.content.transfers'
        : 'settlement.markdown.draft.transfers'
    ),
    '',
  ]
  if (transfers.length === 0) {
    transferLines.push(t('settlement.markdown.content.noTransfers'))
  } else {
    for (const transfer of transfers) {
      const from = userName(transfer.fromUserId)
      const to = userName(transfer.toUserId)
      const suggested = formatAmount(transfer.suggestedAmount, currency, {
        roundMode,
      })
      const recordedTransfer =
        'record' in params && 'status' in transfer ? transfer : null
      const checkbox = recordedTransfer
        ? recordedTransfer.status === 'completed'
          ? '[x] '
          : '[ ] '
        : ''
      let line = `- ${checkbox}${from} → ${to}: ${suggested}`
      if (
        recordedTransfer?.status === 'completed' &&
        recordedTransfer.actualAmount !== null
      ) {
        const showActual =
          recordedTransfer.actualAmount !== transfer.suggestedAmount ||
          recordedTransfer.note.length > 0
        if (showActual) {
          line += ` _${t('settlement.markdown.content.actual', {
            amount: formatAmount(recordedTransfer.actualAmount, currency),
            note: recordedTransfer.note ? ` · ${recordedTransfer.note}` : '',
          })}_`
        }
      }
      transferLines.push(line)
    }
  }
  sections.push(transferLines.join('\n'))

  if ('sharedWalletSummary' in params && params.sharedWalletSummary) {
    const { totalExpense, averagePerPerson, borrowings } =
      params.sharedWalletSummary
    if (totalExpense > 0) {
      const walletLines = [
        `## ${t('settlement.sharedWallet.title')}`,
        '',
        `- ${t('settlement.sharedWallet.total')}: ${formatAmount(
          totalExpense,
          currency
        )}`,
        `- ${t('settlement.sharedWallet.average')}: ${formatAmount(
          averagePerPerson,
          currency,
          { roundMode }
        )}`,
      ]
      if (borrowings.length > 0) {
        walletLines.push(
          `- ${t('settlement.sharedWallet.borrowings')}`,
          ...borrowings.map(
            ({ userId, amount }) =>
              `  - ${userName(userId)}: -${formatAmount(amount, currency, {
                roundMode,
              })}`
          )
        )
      }
      sections.push(walletLines.join('\n'))
    }
  }

  // Covered Transactions
  const activeTxs = activeSettlementExpenses(transactions)
  const txLines: string[] = [
    'record' in params
      ? t('settlement.markdown.content.coveredTransactions', {
          count: activeTxs.length,
        })
      : `## ${t('settlement.markdown.draft.includedExpenses', {
          count: activeTxs.length,
        })}`,
    '',
  ]
  if (activeTxs.length === 0) {
    txLines.push(t('settlement.markdown.content.noCoveredTransactions'))
  } else {
    for (const tx of activeTxs) {
      const desc = tx.description
        ? escapeText(tx.description)
        : t('settlement.markdown.content.noDescription')
      const category = escapeText(
        categoryMap.get(tx.categoryId) ?? tx.categoryId
      )

      const paidByNames = tx.paidByDetail
        .map((p) => `${userName(p.userId)} ${formatAmount(p.amount, currency)}`)
        .join(', ')

      const splitWithNames = tx.splitDetail
        .map((s) => `${userName(s.userId)} ${formatAmount(s.amount, currency)}`)
        .join(', ')

      txLines.push(
        `- ${tx.date} · ${desc} · ${formatAmount(tx.amount, currency)}`
      )
      txLines.push(
        `  - ${t('settlement.markdown.content.category', { category })}`
      )
      txLines.push(
        `  - ${t('settlement.markdown.content.paidBy', {
          paidBy: paidByNames,
        })}`
      )
      txLines.push(
        `  - ${t('settlement.markdown.content.splitWith', {
          splitWith: splitWithNames,
        })}`
      )
    }
  }
  sections.push(txLines.join('\n'))

  return sections.join('\n\n')
}
