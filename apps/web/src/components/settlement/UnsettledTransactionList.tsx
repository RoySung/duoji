import { Button } from '@heroui/react'
import { PiReceiptBold } from 'react-icons/pi'
import { Transaction } from '@/entities/transaction'
import TransactionList from '@/components/transaction/TransactionList'

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
  if (transactions.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-dashed border-border bg-background px-5 py-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300">
          <PiReceiptBold size={22} />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          All settled
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          There are no unsettled transactions.
        </p>
      </div>
    )
  }

  const total = transactions.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-4">
      <TransactionList
        currency={currency}
        error={null}
        isLoading={false}
        transactions={transactions}
        onEditTransaction={onEditTransaction}
      />

      <div className="flex items-center justify-between rounded-2xl bg-accent/60 px-4 py-3">
        <p className="text-sm font-medium text-foreground">Total</p>
        <p className="text-sm font-semibold text-danger">
          -{total.toLocaleString()}
          {currency ? ` ${currency}` : ''}
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <Button color="primary" disableRipple onPress={onConfirm}>
          Review & settle
        </Button>
      </div>
    </div>
  )
}
