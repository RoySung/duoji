import React from 'react'
import { Avatar, Chip } from '@heroui/react'
import { useTranslations } from 'next-intl'
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
import { User, isDeletedUser } from '@/entities/user'
import { useAccountBookStore } from '@/stores/accountBook'
import { useCategoryStore } from '@/stores/category'
import { useUserStore } from '@/stores/user'

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

function formatSignedAmount(amount: number, type: Transaction['type']): string {
  const prefix = type === 'income' ? '+' : ''
  return `${prefix}${amount.toLocaleString()}`
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

function renderParticipantSummary(
  transaction: Transaction,
  userMap: Map<string, User>
): React.ReactNode {
  if (transaction.type === 'income') {
    if (!transaction.receivedByUserId) return null
    const person = userMap.get(transaction.receivedByUserId)
    const name = person?.name ?? transaction.receivedByUserId
    return person && isDeletedUser(person) ? (
      <span className="line-through">{name}</span>
    ) : (
      name
    )
  }

  const parts = transaction.paidByDetail
    .map((item) => {
      const person = userMap.get(item.userId)
      const name = (person?.name ?? item.userId).trim()
      if (!name) return null
      return person && isDeletedUser(person) ? (
        <span key={item.userId} className="line-through">
          {name}
        </span>
      ) : (
        <span key={item.userId}>{name}</span>
      )
    })
    .filter(Boolean)

  return parts.reduce<React.ReactNode[]>((acc, part, i) => {
    if (i > 0) acc.push('、')
    acc.push(part)
    return acc
  }, [])
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
  const categoryMap = new Map(
    categories.map((category) => [category.id, category])
  )
  const users = useUserStore((state) => state.allUsers)
  const userMap = new Map(users.map((u) => [u.id, u]))
  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const accountBookMap = new Map(accountBooks.map((ab) => [ab.id, ab]))

  return (
    <>
      {error ? (
        <div className="mt-6 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-6 rounded-3xl border border-dashed border-border bg-background px-5 py-10 text-center text-sm text-muted-foreground">
          {t('transactions.list.loading')}
        </div>
      ) : null}

      {!isLoading && transactions.length === 0 ? (
        <div
          className="mt-6 rounded-3xl border border-dashed border-border bg-background px-5 py-10 text-center"
          data-testid="transaction-history-empty"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300">
            <PiReceiptBold size={22} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            {emptyMessage ?? t('transactions.list.emptyTitle')}
          </h3>
          {!emptyMessage ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {t('transactions.list.emptyDescription')}
            </p>
          ) : null}
        </div>
      ) : null}

      {!isLoading && transactions.length > 0 ? (
        <div className="mt-6 space-y-3" data-testid="transaction-list">
          {transactions.map((transaction) => {
            const category = categoryMap.get(transaction.categoryId) ?? null
            const participantSummary = formatParticipantSummary(
              transaction,
              userMap
            )
            const signedAmount = formatSignedAmount(
              transaction.amount,
              transaction.type
            )
            const amountClassName =
              transaction.type === 'expense' ? 'text-danger' : 'text-success'
            const accountBook = showAccountBook
              ? accountBookMap.get(transaction.accountBookId) ?? null
              : null
            const effectiveCurrency = showAccountBook
              ? accountBook?.currency ?? null
              : currency

            return (
              <article key={transaction.id}>
                <button
                  className="block w-full rounded-3xl border border-border bg-background px-4 py-4 text-left transition hover:border-orange-200 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  data-testid={`transaction-row-${transaction.id}`}
                  type="button"
                  onClick={() => onEditTransaction(transaction.id)}
                >
                  <div className="flex items-start gap-3">
                    {category ? (
                      <Avatar
                        className="mt-1 h-10 w-10 bg-content2"
                        name={category.name}
                        src={category.imageUrl}
                      />
                    ) : (
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-content2 text-muted-foreground">
                        <PiQuestionMark size={18} />
                      </div>
                    )}

                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-foreground">
                              {category?.name ??
                                t('transactions.list.uncategorized')}
                            </h3>
                            <Chip
                              className="bg-orange-100 text-orange-700"
                              size="sm"
                              variant="flat"
                            >
                              {transaction.date}
                            </Chip>
                            {accountBook ? (
                              <Chip
                                className="bg-blue-100 text-blue-700"
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
                                className="bg-muted text-muted-foreground"
                                size="sm"
                                variant="flat"
                                startContent={
                                  <PiCreditCardBold
                                    className="ml-1"
                                    size={12}
                                  />
                                }
                              >
                                {transaction.paymentMethod}
                              </Chip>
                            ) : null}
                            {hasEqualSplit(transaction) ? (
                              <Chip
                                className="bg-success/10 text-success"
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
                                className="bg-blue-100 text-blue-700"
                                size="sm"
                                variant="flat"
                              >
                                {t('transactions.list.settled')}
                              </Chip>
                            ) : null}
                          </div>
                          <p className="truncate text-sm text-muted-foreground">
                            {transaction.description || '-'}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p
                            className={`text-lg font-semibold ${amountClassName}`}
                          >
                            {signedAmount}
                            {effectiveCurrency ? ` ${effectiveCurrency}` : ''}
                          </p>
                        </div>
                      </div>

                      {participantSummary ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <Chip
                            className="bg-content2 text-muted-foreground"
                            size="sm"
                            variant="flat"
                          >
                            {renderParticipantSummary(transaction, userMap)}
                          </Chip>
                        </div>
                      ) : null}

                      {transaction.tags.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-2">
                          {transaction.tags.map((tag) => (
                            <Chip
                              key={tag}
                              className="bg-content2 text-muted-foreground"
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
              </article>
            )
          })}
        </div>
      ) : null}
    </>
  )
}
