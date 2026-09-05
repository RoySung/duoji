import { Button } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { PiReceiptBold } from 'react-icons/pi'
import { Transaction } from '@/entities/transaction'
import TransactionList from '@/components/transaction/TransactionList'
import { formatAmount } from '@/utils/amountUtils'
import { SurfaceCard } from '@/components/ui/SurfaceCard'

type Props = {
  transactions: Transaction[]
  currency: string | null
  onConfirm: () => void
  onEditTransaction: (transactionId: string) => void
}

export default function UnsettledTransactionList({
  transactions,
  currency,
  onConfirm,
  onEditTransaction,
}: Props) {
  const t = useTranslations()

  if (transactions.length === 0) {
    return (
      <SurfaceCard
        className="px-5 py-9 text-center"
        data-testid="unsettled-empty-state"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-peach/70 text-emphasis-foreground dark:bg-peach/15 dark:text-peach-foreground">
          <PiReceiptBold size={18} />
        </div>
        <h3 className="mt-4 text-title font-semibold text-foreground">
          {t('settlement.unsettled.emptyTitle')}
        </h3>
        <p className="mt-2 text-body text-muted-foreground">
          {t('settlement.unsettled.emptyDescription')}
        </p>
      </SurfaceCard>
    )
  }

  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="space-y-4">
      <SurfaceCard
        className="flex flex-col gap-4 px-4 py-4 min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between"
        data-testid="unsettled-summary"
      >
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-body font-medium text-foreground">
            {t('settlement.unsettled.total')}
          </span>
          <span className="break-all text-base font-semibold tabular-nums text-emphasis-foreground dark:text-peach-foreground">
            -{formatAmount(total, currency)}
          </span>
        </div>
        <Button
          className="min-h-11 w-full rounded-xl bg-primary px-4 text-body text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring min-[360px]:w-auto"
          color="primary"
          disableRipple
          onPress={onConfirm}
        >
          {t('settlement.unsettled.reviewAndSettle')}
        </Button>
      </SurfaceCard>

      <TransactionList
        currency={currency}
        error={null}
        isLoading={false}
        transactions={transactions}
        onEditTransaction={onEditTransaction}
      />
    </div>
  )
}
