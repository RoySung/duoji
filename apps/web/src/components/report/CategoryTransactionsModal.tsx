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
      : (summary?.displayName ?? '')

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      size="sm"
    >
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            {summary?.imageUrl ? (
              <Avatar
                className="h-9 w-9 bg-content2"
                name={displayName}
                src={summary.imageUrl}
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-content2 text-muted-foreground">
                <PiReceiptBold size={16} />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-base font-semibold text-foreground">
                {displayName}
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                {t('report.categoryModal.recordsCount', { count: summary?.transactionCount ?? 0 })} ·{' '}
                {summary ? formatAmount(summary.totalAmount, currency) : formatAmount(0, currency)}
              </span>
            </div>
          </div>
        </DrawerHeader>

        <DrawerBody className="px-3 py-4">
          {transactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted-foreground">
              {t('report.categoryModal.empty')}
            </div>
          ) : (
            <ul className="space-y-2">
              {transactions.map((tx) => {
                const category = categoryMap.get(tx.categoryId) ?? null
                const amountClass =
                  tx.type === 'expense' ? 'text-danger' : 'text-success'
                const prefix = tx.type === 'income' ? '+' : ''
                return (
                  <li key={tx.id}>
                    <button
                      type="button"
                      className="group flex w-full items-start gap-3 rounded-2xl border border-border bg-background px-3 py-3 text-left transition-colors hover:border-primary-200 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/70"
                      onClick={() => onTransactionClick?.(tx.id)}
                    >
                      {category ? (
                        <Avatar
                          className="mt-0.5 h-9 w-9 bg-content2"
                          name={category.name}
                          src={category.imageUrl}
                        />
                      ) : (
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-content2 text-muted-foreground">
                          <PiQuestionMark size={16} />
                        </div>
                      )}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <span className="truncate text-sm font-medium text-foreground group-hover:text-primary-700">
                            {category?.name ?? t('transactions.list.uncategorized')}
                          </span>
                          <span
                            className={`shrink-0 text-sm font-semibold ${amountClass}`}
                          >
                            {prefix}
                            {formatAmount(tx.amount, currency)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-xs text-muted-foreground">
                            {tx.description || t('transactions.list.noDescription')}
                          </p>
                          <span className="shrink-0 text-xs text-muted-foreground">
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
