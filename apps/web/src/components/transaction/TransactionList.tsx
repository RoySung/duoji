import { useMemo } from 'react'
import { Avatar, AvatarGroup, Chip } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { LuDollarSign } from 'react-icons/lu'
import {
  PiBookBold,
  PiCreditCardBold,
  PiGitBranchBold,
  PiQuestionMark,
  PiReceiptBold,
} from 'react-icons/pi'
import {
  hasLinkedSettlementRecordId,
  Transaction,
} from '@/entities/transaction'
import { User } from '@/entities/user'
import { useAccountBookStore } from '@/stores/accountBook'
import { useCategoryStore } from '@/stores/category'
import { useUserStore } from '@/stores/user'
import { formatAmount } from '@/utils/amountUtils'
import { SurfaceCard } from '@/components/ui/SurfaceCard'

type Props = {
  currency: string | null
  emptyMessage?: string
  error: string | null
  isLoading: boolean
  transactions: Transaction[]
  showAccountBook?: boolean
  onEditTransaction: (transactionId: string) => void
}

const equalSplitTolerance = 0.01

function formatUserNameSummary(names: string[]): string | null {
  const normalizedNames = names.map((n) => n.trim()).filter(Boolean)
  if (normalizedNames.length === 0) return null
  return normalizedNames.join('、')
}

function formatSignedAmount(
  amount: number,
  type: Transaction['type'],
  currency: string | null
): string {
  const prefix = type === 'income' ? '+' : ''
  return `${prefix}${formatAmount(amount, currency)}`
}

function hasEqualSplit(transaction: Transaction): boolean {
  if (transaction.splitDetail.length <= 1) {
    return false
  }

  const [firstDetail, ...remainingDetails] = transaction.splitDetail

  return remainingDetails.every(
    (detail) =>
      Math.abs(detail.amount - firstDetail.amount) < equalSplitTolerance
  )
}

function formatParticipantSummary(
  transaction: Transaction,
  userMap: Map<string, User>
): string | null {
  if (transaction.type === 'income') {
    if (!transaction.receivedByUserId) return null
    return (
      userMap.get(transaction.receivedByUserId)?.name ??
      transaction.receivedByUserId
    )
  }

  return formatUserNameSummary(
    transaction.paidByDetail.map(
      (item) => userMap.get(item.userId)?.name ?? item.userId
    )
  )
}

export default function TransactionList({
  currency,
  emptyMessage,
  error,
  isLoading,
  transactions,
  showAccountBook = false,
  onEditTransaction,
}: Props) {
  const t = useTranslations()
  const categories = useCategoryStore((state) => state.categories)
  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  )
  const users = useUserStore((state) => state.allUsers)
  const userMap = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    [users]
  )
  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const accountBookMap = useMemo(
    () =>
      new Map(accountBooks.map((accountBook) => [accountBook.id, accountBook])),
    [accountBooks]
  )

  return (
    <>
      {error ? (
        <SurfaceCard
          className="bg-danger-50 px-4 py-4 text-body text-danger-700 shadow-none ring-1 ring-danger-200 dark:bg-danger-50/10 dark:text-danger-300 dark:ring-danger-400/30"
          role="alert"
        >
          {error}
        </SurfaceCard>
      ) : null}

      {!error && isLoading ? (
        <SurfaceCard aria-live="polite" className="px-5 py-6" role="status">
          <div aria-hidden className="space-y-3">
            <div className="h-4 w-2/5 animate-pulse rounded-full bg-muted" />
            <div className="h-12 animate-pulse rounded-xl bg-muted/80" />
          </div>
          <p className="mt-4 text-center text-body text-muted-foreground">
            {t('transactions.list.loading')}
          </p>
        </SurfaceCard>
      ) : null}

      {!error && !isLoading && transactions.length === 0 ? (
        <SurfaceCard
          className="px-5 py-9 text-center"
          data-testid="transaction-history-empty"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-peach/70 text-emphasis-foreground dark:bg-peach/15 dark:text-peach-foreground">
            <PiReceiptBold size={18} />
          </div>
          <h3 className="mt-4 text-title font-semibold text-foreground">
            {emptyMessage ?? t('transactions.list.emptyTitle')}
          </h3>
          {!emptyMessage ? (
            <p className="mt-2 text-body text-muted-foreground">
              {t('transactions.list.emptyDescription')}
            </p>
          ) : null}
        </SurfaceCard>
      ) : null}

      {!error && !isLoading && transactions.length > 0 ? (
        <div className="space-y-3" data-testid="transaction-list">
          {transactions.map((transaction) => {
            const category = categoryMap.get(transaction.categoryId) ?? null
            const participantSummary = formatParticipantSummary(
              transaction,
              userMap
            )
            const accountBook = showAccountBook
              ? accountBookMap.get(transaction.accountBookId) ?? null
              : null
            const effectiveCurrency = showAccountBook
              ? accountBook?.currency ?? null
              : currency
            const signedAmount = formatSignedAmount(
              transaction.amount,
              transaction.type,
              effectiveCurrency
            )
            const amountClassName =
              transaction.type === 'expense'
                ? 'text-emphasis-foreground dark:text-peach-foreground'
                : 'text-success-700 dark:text-success-400'
            const paidUsers = (
              transaction.type === 'income'
                ? transaction.receivedByUserId
                  ? [transaction.receivedByUserId]
                  : []
                : transaction.paidByDetail.map((d) => d.userId)
            ).flatMap((id) => {
              const user = userMap.get(id)
              return user ? [user] : []
            })

            return (
              <article key={transaction.id}>
                <SurfaceCard className="overflow-hidden transition-colors duration-200 hover:bg-card">
                  <button
                    className="block min-h-11 w-full rounded-2xl px-4 py-4 text-left transition-colors duration-200 hover:bg-muted/35 focus-visible:outline-none"
                    data-testid={`transaction-row-${transaction.id}`}
                    type="button"
                    onClick={() => onEditTransaction(transaction.id)}
                  >
                    <div className="flex items-start gap-3">
                      {category ? (
                        <Avatar
                          className="h-11 w-11 shrink-0 bg-primary/15 p-2 text-primary"
                          name={category.name}
                          src={category.imageUrl}
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <PiQuestionMark size={16} />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-[minmax(0,1fr)_auto] min-[360px]:gap-3">
                          <div className="min-w-0 space-y-1">
                            <h3 className="break-words text-title font-semibold text-foreground">
                              {category?.name ??
                                t('transactions.list.uncategorized')}
                            </h3>
                            <p className="break-words text-body leading-5 text-muted-foreground">
                              {transaction.description || '-'}
                            </p>
                          </div>

                          <p
                            className={`shrink-0 text-left text-title font-semibold tabular-nums min-[360px]:text-right ${amountClassName}`}
                          >
                            {signedAmount}
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Chip
                            className="max-w-full bg-peach/70 text-label text-emphasis-foreground dark:bg-peach/15 dark:text-peach-foreground"
                            size="sm"
                            variant="flat"
                          >
                            {transaction.date}
                          </Chip>
                          {accountBook ? (
                            <Chip
                              className="max-w-full bg-primary/10 text-label text-primary-700 dark:text-primary-300"
                              size="sm"
                              variant="flat"
                              startContent={
                                <PiBookBold className="ml-1" size={12} />
                              }
                            >
                              {accountBook.name}
                            </Chip>
                          ) : null}
                          {transaction.paymentMethod ? (
                            <Chip
                              className="max-w-full bg-muted text-label text-muted-foreground"
                              size="sm"
                              variant="flat"
                              startContent={
                                <PiCreditCardBold className="ml-1" size={12} />
                              }
                            >
                              {t(
                                `transactionForm.paymentMethods.${transaction.paymentMethod}` as any
                              )}
                            </Chip>
                          ) : null}
                          {hasEqualSplit(transaction) ? (
                            <Chip
                              className="max-w-full bg-primary/10 text-label text-primary-700 dark:text-primary-300"
                              size="sm"
                              variant="flat"
                              startContent={
                                <PiGitBranchBold
                                  className="ml-1 rotate-90"
                                  size={12}
                                />
                              }
                            >
                              {t('transactions.list.equalSplit')}
                            </Chip>
                          ) : null}
                          {hasLinkedSettlementRecordId(
                            transaction.settlementRecordId
                          ) ? (
                            <Chip
                              className="max-w-full bg-success/10 text-label text-success-700 dark:text-success-400"
                              size="sm"
                              variant="flat"
                            >
                              {t('transactions.list.settled')}
                            </Chip>
                          ) : null}
                        </div>

                        {participantSummary ? (
                          <div className="mt-3 flex min-w-0 items-center gap-2 rounded-xl bg-muted/70 px-3 py-2 text-muted-foreground">
                            <LuDollarSign className="shrink-0" size={12} />
                            {paidUsers.length > 0 ? (
                              <AvatarGroup
                                className="shrink-0"
                                max={3}
                                renderCount={(count) => (
                                  <p className="ms-1 text-label font-medium text-foreground">
                                    +{count}
                                  </p>
                                )}
                                size="sm"
                              >
                                {paidUsers.map((user) => (
                                  <Avatar
                                    key={user.id}
                                    src={user.avatarUrl}
                                    name={user.name}
                                    classNames={{
                                      base: 'h-6 w-6 text-[8px]',
                                    }}
                                  />
                                ))}
                              </AvatarGroup>
                            ) : null}
                            <span className="min-w-0 flex-1 break-words text-label leading-5">
                              {participantSummary}
                            </span>
                          </div>
                        ) : null}

                        {transaction.tags.length > 0 ? (
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {transaction.tags.map((tag) => (
                              <Chip
                                key={tag}
                                className="max-w-full bg-muted text-label text-muted-foreground"
                                size="sm"
                                variant="flat"
                              >
                                {tag}
                              </Chip>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </button>
                </SurfaceCard>
              </article>
            )
          })}
        </div>
      ) : null}
    </>
  )
}
