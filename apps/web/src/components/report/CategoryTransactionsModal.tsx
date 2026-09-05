import {
  Avatar,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from '@heroui/react'
import { PiQuestionMark, PiReceiptBold } from 'react-icons/pi'
import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useCategoryStore } from '@/stores/category'
import { formatAmount } from '@/utils/amountUtils'
import { CategorySummary } from './reportTypes'

type Props = {
  summary: CategorySummary | null
  currency: string
  isOpen: boolean
  onClose: () => void
  onTransactionClick?: (id: string) => void
}

export default function CategoryTransactionsModal({
  summary,
  currency,
  isOpen,
  onClose,
  onTransactionClick,
}: Props) {
  const t = useTranslations()
  const categories = useCategoryStore((state) => state.categories)
  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  )

  const transactions = useMemo(
    () =>
      summary
        ? [...summary.transactions].sort((a, b) => b.date.localeCompare(a.date))
        : [],
    [summary]
  )

  const displayName =
    summary?.displayName === 'Uncategorized'
      ? t('transactions.list.uncategorized')
      : summary?.displayName ?? ''

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
      <DrawerContent className="bg-card text-card-foreground shadow-[0_18px_60px_rgba(20,31,29,0.24)]">
        <DrawerHeader className="flex flex-col gap-1 border-b border-border px-4 pb-4 pt-5 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            {summary?.imageUrl ? (
              <Avatar
                className="h-11 w-11 shrink-0 bg-secondary"
                name={displayName}
                src={summary.imageUrl}
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <PiReceiptBold size={14} />
              </div>
            )}
            <div className="flex min-w-0 flex-col">
              <span className="break-words text-title font-semibold leading-snug text-foreground">
                {displayName}
              </span>
              <span className="mt-0.5 break-words text-body font-normal leading-5 text-muted-foreground tabular-nums">
                {t('report.categoryModal.recordsCount', {
                  count: summary?.transactionCount ?? 0,
                })}{' '}
                ·{' '}
                {summary
                  ? formatAmount(summary.totalAmount, currency)
                  : formatAmount(0, currency)}
              </span>
            </div>
          </div>
        </DrawerHeader>

        <DrawerBody className="overflow-y-auto px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:px-4">
          {transactions.length === 0 ? (
            <div className="rounded-2xl bg-secondary/70 px-4 py-8 text-center text-body text-muted-foreground">
              {t('report.categoryModal.empty')}
            </div>
          ) : (
            <ul className="space-y-2">
              {transactions.map((tx) => {
                const category = categoryMap.get(tx.categoryId) ?? null
                const amountClass =
                  tx.type === 'expense'
                    ? 'text-emphasis-foreground'
                    : 'text-success'
                const prefix = tx.type === 'income' ? '+' : ''
                return (
                  <li key={tx.id}>
                    <button
                      type="button"
                      className="group flex min-h-14 w-full min-w-0 items-start gap-3 rounded-2xl border border-border bg-background px-3 py-3 text-left transition-colors hover:border-primary/45 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => onTransactionClick?.(tx.id)}
                    >
                      {category ? (
                        <Avatar
                          className="mt-0.5 h-9 w-9 shrink-0 bg-secondary"
                          name={category.name}
                          src={category.imageUrl}
                        />
                      ) : (
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-content2 text-muted-foreground">
                          <PiQuestionMark size={14} />
                        </div>
                      )}
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="grid min-w-0 gap-1 min-[400px]:grid-cols-[minmax(0,1fr)_auto] min-[400px]:gap-3">
                          <span className="min-w-0 break-words text-body font-medium leading-5 text-foreground group-hover:text-primary">
                            {category?.name ??
                              t('transactions.list.uncategorized')}
                          </span>
                          <span
                            className={`min-w-0 break-words text-body font-semibold leading-5 tabular-nums min-[400px]:text-right ${amountClass}`}
                          >
                            {prefix}
                            {formatAmount(tx.amount, currency)}
                          </span>
                        </div>
                        <div className="grid min-w-0 gap-1 min-[400px]:grid-cols-[minmax(0,1fr)_auto] min-[400px]:items-end min-[400px]:gap-3">
                          <p className="min-w-0 break-words text-label leading-5 text-muted-foreground">
                            {tx.description ||
                              t('transactions.list.noDescription')}
                          </p>
                          <span className="shrink-0 text-label leading-5 text-muted-foreground tabular-nums min-[400px]:text-right">
                            {tx.date}
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
