import { useState } from 'react'
import { Button, Chip } from '@heroui/react'
import { PiCaretDownBold, PiCaretUpBold } from 'react-icons/pi'
import { SettlementRecord, SettlementTransfer } from '@/entities/settlement'
import { Transaction } from '@/entities/transaction'
import { User, isDeletedUser } from '@/entities/user'
import { useUserStore } from '@/stores/user'
import TransactionList from '@/components/transaction/TransactionList'
import SettlementTransferModal from './SettlementTransferModal'

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
  const [isTransactionsExpanded, setIsTransactionsExpanded] = useState(false)
  const [selectedTransfer, setSelectedTransfer] =
    useState<SettlementTransfer | null>(null)
  const allUsers = useUserStore((state) => state.allUsers)
  const userMap = new Map(allUsers.map((u) => [u.id, u]))

  const coveredTransactions = transactions

  const date = new Date(record.createdAt).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Settlement #{sequenceNumber}
          </h2>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
      </div>

      {/* Member statuses */}
      <section>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Member balances
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
                    {isSettled ? 'Settled' : 'Pending'}
                  </Chip>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>
                    <p>Split</p>
                    <p className="font-medium text-foreground">
                      {ms.splitAmount.toLocaleString()}
                      {currency ? ` ${currency}` : ''}
                    </p>
                  </div>
                  <div>
                    <p>Paid</p>
                    <p className="font-medium text-foreground">
                      {ms.paidAmount.toLocaleString()}
                      {currency ? ` ${currency}` : ''}
                    </p>
                  </div>
                  <div>
                    <p>{isCreditor ? 'To receive' : 'To pay'}</p>
                    <p
                      className={`font-semibold ${
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
          Transfers
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
                      Suggested: {transfer.suggestedAmount.toLocaleString()}
                      {currency ? ` ${currency}` : ''}
                    </p>
                    {transfer.status === 'completed' && (
                      <p className="text-xs text-muted-foreground">
                        Actual: {transfer.actualAmount?.toLocaleString() ?? '-'}
                        {currency ? ` ${currency}` : ''}
                        {transfer.note ? `  ·  ${transfer.note}` : ''}
                      </p>
                    )}
                  </div>
                  {transfer.status === 'completed' ? (
                    <Chip
                      className="shrink-0 bg-success/10 text-success"
                      size="sm"
                      variant="flat"
                    >
                      Done ✓
                    </Chip>
                  ) : (
                    <Button
                      className="shrink-0"
                      color="primary"
                      size="sm"
                      variant="flat"
                      onPress={() => setSelectedTransfer(transfer)}
                    >
                      Mark done
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
          className="flex w-full items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 text-left transition hover:bg-accent/50"
          type="button"
          onClick={() => setIsTransactionsExpanded((v) => !v)}
        >
          <p className="text-sm font-medium text-foreground">
            Covered transactions ({coveredTransactions.length})
          </p>
          {isTransactionsExpanded ? (
            <PiCaretUpBold className="text-muted-foreground" />
          ) : (
            <PiCaretDownBold className="text-muted-foreground" />
          )}
        </button>

        {isTransactionsExpanded && (
          <TransactionList
            currency={currency}
            error={null}
            isLoading={false}
            transactions={coveredTransactions}
            onEditTransaction={onViewTransaction}
          />
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
    </div>
  )
}
