import { useMemo, useState } from 'react'
import { Button, Chip, Switch } from '@heroui/react'
import { useTranslations } from 'next-intl'
import {
  PiCaretDownBold,
  PiCaretUpBold,
  PiCheckBold,
  PiCopyBold,
  PiSlidersBold,
} from 'react-icons/pi'
import { SettlementRecord, SettlementTransfer } from '@/entities/settlement'
import { Transaction } from '@/entities/transaction'
import { User, isDeletedUser, isSharedWalletUser } from '@/entities/user'
import { useUserStore } from '@/stores/user'
import { useCategoryStore } from '@/stores/category'
import TransactionList from '@/components/transaction/TransactionList'
import { generateSettlementMarkdown } from '@/utils/settlementMarkdown'
import { computeSharedWalletSummary } from '@/utils/settlementUtils'
import { formatAmount } from '@/utils/amountUtils'
import { SurfaceCard } from '@/components/ui/SurfaceCard'
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
  const [autoRound, setAutoRound] = useState(true)
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

  const sharedWalletIds = useMemo(
    () => new Set(allUsers.filter(isSharedWalletUser).map((u) => u.id)),
    [allUsers]
  )

  const realMembersCount = useMemo(
    () =>
      allUsers.filter((u) => !isDeletedUser(u) && !isSharedWalletUser(u))
        .length,
    [allUsers]
  )

  const sharedWalletSummary = useMemo(
    () =>
      computeSharedWalletSummary(
        transactions,
        sharedWalletIds,
        realMembersCount
      ),
    [transactions, sharedWalletIds, realMembersCount]
  )

  const peerToPeerTransfers = useMemo(
    () =>
      record.transfers.filter(
        (t) =>
          !sharedWalletIds.has(t.toUserId) && !sharedWalletIds.has(t.fromUserId)
      ),
    [record.transfers, sharedWalletIds]
  )

  const sharedWalletTransfers = useMemo(
    () => record.transfers.filter((t) => sharedWalletIds.has(t.toUserId)),
    [record.transfers, sharedWalletIds]
  )

  const markdownText = useMemo(
    () =>
      generateSettlementMarkdown({
        sequenceNumber,
        record,
        transactions,
        currency,
        autoRound,
        userMap,
        categoryMap,
        t,
      }),
    [
      sequenceNumber,
      record,
      transactions,
      currency,
      autoRound,
      userMap,
      categoryMap,
      t,
    ]
  )

  const coveredTransactions = transactions

  const date = new Date(record.createdAt).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const isCompleted = record.transfers.every((t) => t.status === 'completed')

  return (
    <div className="space-y-6" data-testid="settlement-record-detail">
      <SurfaceCard className="flex flex-col gap-4 px-4 py-5 min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between sm:px-6">
        <div className="min-w-0 space-y-2">
          <h1 className="break-words text-headline font-semibold leading-tight tracking-[-0.02em] text-foreground text-balance">
            {t('settlement.detail.title', { sequenceNumber })}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-body text-muted-foreground">{date}</p>
            <Chip
              className={
                isCompleted
                  ? 'bg-success/10 text-label text-success-700 dark:text-success-400'
                  : 'bg-warning/10 text-label text-warning-700 dark:text-warning-400'
              }
              size="sm"
              variant="flat"
            >
              {isCompleted
                ? t('settlement.detail.settled')
                : t('settlement.detail.pending')}
            </Chip>
          </div>
        </div>
        <div className="flex items-center">
          <Button
            className="min-h-11 w-full rounded-xl bg-secondary px-4 text-body text-secondary-foreground focus-visible:ring-2 focus-visible:ring-ring min-[360px]:w-auto"
            size="sm"
            startContent={<PiCopyBold size={12} />}
            variant="flat"
            onPress={() => setIsMarkdownModalOpen(true)}
          >
            {t('settlement.detail.exportMarkdown')}
          </Button>
        </div>
      </SurfaceCard>

      <SurfaceCard className="flex min-h-14 items-center justify-between gap-3 px-4 py-3 shadow-none ring-1 ring-inset ring-border">
        <div className="flex items-center gap-2.5">
          <PiSlidersBold
            aria-hidden
            className="shrink-0 text-primary"
            size={16}
          />
          <span className="text-body font-medium text-foreground">
            {t('settlement.unsettled.autoRound')}
          </span>
        </div>
        <Switch
          isSelected={autoRound}
          onValueChange={setAutoRound}
          size="sm"
          aria-label={t('settlement.unsettled.autoRound')}
        />
      </SurfaceCard>

      <section aria-labelledby="settlement-member-balances">
        <h2
          className="mb-3 text-title font-semibold text-foreground"
          id="settlement-member-balances"
        >
          {t('settlement.confirm.balances')}
        </h2>
        <SurfaceCard className="divide-y divide-border overflow-hidden shadow-none ring-1 ring-inset ring-border">
          {record.memberStatuses.map((ms) => {
            const isSettled = ms.netAmount === 0
            const isCreditor = ms.netAmount > 0

            return (
              <div key={ms.userId} className="px-4 py-4 sm:px-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="min-w-0 break-words text-body font-medium text-foreground">
                    {renderUserName(ms.userId, userMap)}
                  </p>
                  <Chip
                    className={
                      isSettled
                        ? 'bg-success/10 text-label text-success-700 dark:text-success-400'
                        : 'bg-warning/10 text-label text-warning-700 dark:text-warning-400'
                    }
                    size="sm"
                    variant="flat"
                  >
                    {isSettled
                      ? t('settlement.detail.settled')
                      : t('settlement.detail.pending')}
                  </Chip>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 rounded-xl bg-muted/60 px-3 py-3 text-label text-muted-foreground min-[360px]:grid-cols-3 min-[360px]:gap-2">
                  <div className="min-w-0">
                    <p>{t('settlement.detail.split')}</p>
                    <p className="mt-0.5 break-all font-medium tabular-nums text-foreground">
                      {formatAmount(ms.splitAmount, currency, {
                        roundMode: autoRound ? 'ceil' : 'none',
                      })}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p>{t('settlement.detail.paid')}</p>
                    <p className="mt-0.5 break-all font-medium tabular-nums text-foreground">
                      {formatAmount(ms.paidAmount, currency, {
                        roundMode: autoRound ? 'ceil' : 'none',
                      })}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p>
                      {isCreditor
                        ? t('settlement.detail.toReceive')
                        : t('settlement.detail.toPay')}
                    </p>
                    <p
                      className={`mt-0.5 break-all font-semibold tabular-nums ${
                        isCreditor
                          ? 'text-success-700 dark:text-success-400'
                          : 'text-danger-700 dark:text-danger-400'
                      }`}
                    >
                      {formatAmount(Math.abs(ms.netAmount), currency, {
                        roundMode: autoRound ? 'ceil' : 'none',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </SurfaceCard>
      </section>

      <section aria-labelledby="settlement-transfers">
        <h2
          className="mb-3 text-title font-semibold text-foreground"
          id="settlement-transfers"
        >
          {t('settlement.detail.transfers')}
        </h2>
        {peerToPeerTransfers.length === 0 ? (
          <SurfaceCard className="px-4 py-5 text-body text-muted-foreground shadow-none ring-1 ring-inset ring-border">
            {t('settlement.detail.noTransfers')}
          </SurfaceCard>
        ) : (
          <SurfaceCard className="divide-y divide-border overflow-hidden shadow-none ring-1 ring-inset ring-border">
            {peerToPeerTransfers.map((transfer) => {
              return (
                <div key={transfer.id} className="px-4 py-4 sm:px-5">
                  <div className="flex flex-col items-stretch gap-3 min-[360px]:flex-row min-[360px]:items-start min-[360px]:justify-between">
                    <div className="min-w-0 space-y-1">
                      <p className="break-words text-body font-medium text-foreground">
                        {renderUserName(transfer.fromUserId, userMap)} →{' '}
                        {renderUserName(transfer.toUserId, userMap)}
                      </p>
                      <p className="break-words text-label leading-5 text-muted-foreground">
                        {t('settlement.detail.suggested', {
                          amount: formatAmount(
                            transfer.suggestedAmount,
                            currency,
                            {
                              roundMode: autoRound ? 'ceil' : 'none',
                            }
                          ),
                        })}
                      </p>
                      {transfer.status === 'completed' && (
                        <p className="break-words text-label leading-5 text-muted-foreground">
                          {t('settlement.detail.actual', {
                            amount: formatAmount(
                              transfer.actualAmount ?? 0,
                              currency
                            ),
                          })}
                          {transfer.note ? `  ·  ${transfer.note}` : ''}
                        </p>
                      )}
                    </div>
                    {transfer.status === 'completed' ? (
                      <Chip
                        className="shrink-0 self-start bg-success/10 text-label text-success-700 dark:text-success-400"
                        size="sm"
                        startContent={
                          <PiCheckBold className="ml-1" size={12} />
                        }
                        variant="flat"
                      >
                        {t('settlement.detail.done')}
                      </Chip>
                    ) : (
                      <Button
                        className="min-h-11 w-full shrink-0 rounded-xl bg-primary px-4 text-body text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring min-[360px]:w-auto"
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
          </SurfaceCard>
        )}
      </section>

      {sharedWalletSummary && sharedWalletSummary.totalExpense > 0 && (
        <section aria-labelledby="settlement-shared-wallet">
          <h2
            className="mb-3 text-title font-semibold text-foreground"
            id="settlement-shared-wallet"
          >
            {t('settlement.sharedWallet.title')}
          </h2>
          <SurfaceCard className="divide-y divide-border overflow-hidden shadow-none ring-1 ring-inset ring-border">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
              <p className="min-w-0 break-words text-body text-foreground">
                {t('settlement.sharedWallet.total')}
              </p>
              <p className="break-all text-body font-semibold tabular-nums text-foreground">
                {formatAmount(sharedWalletSummary.totalExpense, currency)}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
              <p className="min-w-0 break-words text-body text-foreground">
                {t('settlement.sharedWallet.average')}
              </p>
              <p className="break-all text-body font-semibold tabular-nums text-foreground">
                {formatAmount(sharedWalletSummary.averagePerPerson, currency, {
                  roundMode: autoRound ? 'ceil' : 'none',
                })}
              </p>
            </div>

            {sharedWalletTransfers.length > 0 && (
              <div className="bg-muted/35 px-4 py-4 sm:px-5">
                <p className="mb-3 text-body font-medium text-muted-foreground">
                  {t('settlement.sharedWallet.borrowings')}
                </p>
                {sharedWalletTransfers.map((transfer) => {
                  return (
                    <div
                      key={transfer.id}
                      className="border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0"
                    >
                      <div className="flex flex-col items-stretch gap-3 min-[360px]:flex-row min-[360px]:items-start min-[360px]:justify-between">
                        <div className="min-w-0 space-y-1">
                          <p className="break-words text-body font-medium text-foreground">
                            {renderUserName(transfer.fromUserId, userMap)} →{' '}
                            {renderUserName(transfer.toUserId, userMap)}
                          </p>
                          <p className="break-words text-label leading-5 text-muted-foreground">
                            {t('settlement.detail.suggested', {
                              amount: formatAmount(
                                transfer.suggestedAmount,
                                currency,
                                {
                                  roundMode: autoRound ? 'ceil' : 'none',
                                }
                              ),
                            })}
                          </p>
                          {transfer.status === 'completed' && (
                            <p className="break-words text-label leading-5 text-muted-foreground">
                              {t('settlement.detail.actual', {
                                amount: formatAmount(
                                  transfer.actualAmount ?? 0,
                                  currency
                                ),
                              })}
                              {transfer.note ? `  ·  ${transfer.note}` : ''}
                            </p>
                          )}
                        </div>
                        {transfer.status === 'completed' ? (
                          <Chip
                            className="shrink-0 self-start bg-success/10 text-label text-success-700 dark:text-success-400"
                            size="sm"
                            startContent={
                              <PiCheckBold className="ml-1" size={12} />
                            }
                            variant="flat"
                          >
                            {t('settlement.detail.done')}
                          </Chip>
                        ) : (
                          <Button
                            className="min-h-11 w-full shrink-0 rounded-xl bg-primary px-4 text-body text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring min-[360px]:w-auto"
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
            )}
          </SurfaceCard>
        </section>
      )}

      <section>
        <SurfaceCard className="overflow-hidden shadow-none ring-1 ring-inset ring-border">
          <button
            aria-controls={`settlement-${sequenceNumber}-covered-transactions`}
            aria-expanded={isTransactionsExpanded}
            className="flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            type="button"
            onClick={() => setIsTransactionsExpanded((v) => !v)}
          >
            <span className="min-w-0 break-words text-body font-medium text-foreground">
              {t('settlement.detail.coveredTransactions', {
                count: coveredTransactions.length,
              })}
            </span>
            {isTransactionsExpanded ? (
              <PiCaretUpBold
                aria-hidden
                className="shrink-0 text-muted-foreground"
                size={14}
              />
            ) : (
              <PiCaretDownBold
                aria-hidden
                className="shrink-0 text-muted-foreground"
                size={14}
              />
            )}
          </button>
        </SurfaceCard>

        {isTransactionsExpanded && (
          <div
            className="mt-6"
            id={`settlement-${sequenceNumber}-covered-transactions`}
          >
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
