import { useMemo, useState } from 'react'
import { Button, Chip } from '@heroui/react'
import { useTranslations } from 'next-intl'
import {
  PiCaretDownBold,
  PiCaretUpBold,
  PiCheckBold,
  PiCopyBold,
} from 'react-icons/pi'
import { SettlementRecord, SettlementTransfer } from '@/entities/settlement'
import { Transaction } from '@/entities/transaction'
import { User, isDeletedUser } from '@/entities/user'
import { useUserStore } from '@/stores/user'
import { useCategoryStore } from '@/stores/category'
import TransactionList from '@/components/transaction/TransactionList'
import { generateSettlementMarkdown } from '@/utils/settlementMarkdown'
import SettlementTransferModal from './SettlementTransferModal'
import SettlementMarkdownModal from './SettlementMarkdownModal'

type Props = {
  record: SettlementRecord
  sequenceNumber: number
  transactions: Transaction[]
  currency: string | null
  onCompleteTransfer: (
    transferId: string,
    actualAmount: number,
    note: string
  ) => Promise<void>
  onViewTransaction: (transactionId: string) => void
}

function renderUserName(userId: string, userMap: Map<string, User>) {
  const user = userMap.get(userId)
  const name = user?.name ?? userId

  if (!user || !isDeletedUser(user)) {
    return name
  }

  return <span className="line-through">{name}</span>
}

export default function SettlementRecordDetail({
  record,
  sequenceNumber,
  transactions,
  currency,
  onCompleteTransfer,
  onViewTransaction,
}: Props) {
  const t = useTranslations()
  const [isTransactionsExpanded, setIsTransactionsExpanded] = useState(false)
  const [selectedTransfer, setSelectedTransfer] =
    useState<SettlementTransfer | null>(null)
  const [isMarkdownModalOpen, setIsMarkdownModalOpen] = useState(false)
  const allUsers = useUserStore((state) => state.allUsers)
  const categories = useCategoryStore((state) => state.categories)

  const userMap = useMemo(
    () => new Map(allUsers.map((u) => [u.id, u])),
    [allUsers]
  )
  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories]
  )

  const markdownText = useMemo(
    () =>
      generateSettlementMarkdown({
        sequenceNumber,
        record,
        transactions,
        currency,
        userMap,
        categoryMap,
        t,
      }),
    [sequenceNumber, record, transactions, currency, userMap, categoryMap, t]
  )

  const coveredTransactions = transactions

  const date = new Date(record.createdAt).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const isCompleted = record.transfers.every((t) => t.status === 'completed')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">
              {t('settlement.detail.title', { sequenceNumber })}
            </h2>
            <Chip
              className={
                isCompleted
                  ? 'bg-success/10 text-success'
                  : 'bg-warning/10 text-warning'
              }
              size="sm"
              variant="flat"
            >
              {isCompleted ? t('settlement.detail.settled') : t('settlement.detail.pending')}
            </Chip>
          </div>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
        <Button
          size="sm"
          startContent={<PiCopyBold size={14} />}
          variant="flat"
          onPress={() => setIsMarkdownModalOpen(true)}
        >
          {t('settlement.detail.exportMarkdown')}
        </Button>
      </div>

      {/* Member statuses */}
      <section>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {t('settlement.confirm.balances')}
        </h3>
        <div className="space-y-2">
          {record.memberStatuses.map((ms) => {
            const isSettled = ms.netAmount === 0
            const isCreditor = ms.netAmount > 0

            return (
              <div
                key={ms.userId}
                className="rounded-2xl border border-border bg-background px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-foreground">
                    {renderUserName(ms.userId, userMap)}
                  </p>
                  <Chip
                    className={
                      isSettled
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }
                    size="sm"
                    variant="flat"
                  >
                    {isSettled ? t('settlement.detail.settled') : t('settlement.detail.pending')}
                  </Chip>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div className="min-w-0">
                    <p>{t('settlement.detail.split')}</p>
                    <p className="break-words font-medium tabular-nums text-foreground">
                      {ms.splitAmount.toLocaleString()}
                      {currency ? ` ${currency}` : ''}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p>{t('settlement.detail.paid')}</p>
                    <p className="break-words font-medium tabular-nums text-foreground">
                      {ms.paidAmount.toLocaleString()}
                      {currency ? ` ${currency}` : ''}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p>{isCreditor ? t('settlement.detail.toReceive') : t('settlement.detail.toPay')}</p>
                    <p
                      className={`break-words font-semibold tabular-nums ${
                        isCreditor ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {Math.abs(ms.netAmount).toLocaleString()}
                      {currency ? ` ${currency}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Transfers */}
      <section>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {t('settlement.detail.transfers')}
        </h3>
        <div className="space-y-2">
          {record.transfers.map((transfer) => {
            return (
              <div
                key={transfer.id}
                className="rounded-2xl border border-border bg-background px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {renderUserName(transfer.fromUserId, userMap)} →{' '}
                      {renderUserName(transfer.toUserId, userMap)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('settlement.detail.suggested', { amount: transfer.suggestedAmount.toLocaleString() + (currency ? ` ${currency}` : '') })}
                    </p>
                    {transfer.status === 'completed' && (
                      <p className="text-xs text-muted-foreground">
                        {t('settlement.detail.actual', { amount: (transfer.actualAmount?.toLocaleString() ?? '-') + (currency ? ` ${currency}` : '') })}
                        {transfer.note ? `  ·  ${transfer.note}` : ''}
                      </p>
                    )}
                  </div>
                  {transfer.status === 'completed' ? (
                    <Chip
                      className="shrink-0 bg-success/10 text-success"
                      size="sm"
                      startContent={<PiCheckBold className="ml-1" size={12} />}
                      variant="flat"
                    >
                      {t('settlement.detail.done')}
                    </Chip>
                  ) : (
                    <Button
                      className="shrink-0"
                      color="primary"
                      size="sm"
                      variant="flat"
                      onPress={() => setSelectedTransfer(transfer)}
                    >
                      {t('settlement.detail.markDone')}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Covered transactions */}
      <section>
        <button
          aria-controls={`settlement-${sequenceNumber}-covered-transactions`}
          aria-expanded={isTransactionsExpanded}
          className="flex w-full items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 text-left transition hover:bg-accent/50"
          type="button"
          onClick={() => setIsTransactionsExpanded((v) => !v)}
        >
          <p className="text-sm font-medium text-foreground">
            {t('settlement.detail.coveredTransactions', { count: coveredTransactions.length })}
          </p>
          {isTransactionsExpanded ? (
            <PiCaretUpBold className="text-muted-foreground" />
          ) : (
            <PiCaretDownBold className="text-muted-foreground" />
          )}
        </button>

        {isTransactionsExpanded && (
          <div id={`settlement-${sequenceNumber}-covered-transactions`}>
            <TransactionList
              currency={currency}
              error={null}
              isLoading={false}
              transactions={coveredTransactions}
              onEditTransaction={onViewTransaction}
            />
          </div>
        )}
      </section>

      {selectedTransfer && (
        <SettlementTransferModal
          transfer={selectedTransfer}
          currency={currency}
          onConfirm={async (actualAmount, note) => {
            await onCompleteTransfer(selectedTransfer.id, actualAmount, note)
            setSelectedTransfer(null)
          }}
          onClose={() => setSelectedTransfer(null)}
        />
      )}

      {isMarkdownModalOpen && (
        <SettlementMarkdownModal
          markdown={markdownText}
          sequenceNumber={sequenceNumber}
          onClose={() => setIsMarkdownModalOpen(false)}
        />
      )}

    </div>
  )
}
