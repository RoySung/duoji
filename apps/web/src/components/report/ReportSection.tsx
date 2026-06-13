import { useMemo } from 'react'
import { Chip } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { PiReceiptBold } from 'react-icons/pi'
import { AccountBook, Currency } from '@/entities/accountBook'
import { Category } from '@/entities/category'
import { Transaction } from '@/entities/transaction'
import {
  getCategoryBucketIdentity,
  groupByCategory,
  groupByMonth,
  summarize,
} from '@/utils/reportAggregate'
import ReportCategoryBreakdown from './ReportCategoryBreakdown'
import ReportEmptyState from './ReportEmptyState'
import ReportMonthlyTrend from './ReportMonthlyTrend'
import ReportSummaryCards from './ReportSummaryCards'

type ReportSectionProps = {
  transactions: Transaction[]
  categories: Category[]
  mergeByName: boolean
  currency: Currency
  selectedTags: Set<string>
  label?: string
  showCurrencyHeading?: boolean
  accountBook?: AccountBook | null
  excludedKeys: Set<string>
  onToggleKey: (key: string) => void
}

export default function ReportSection({
  transactions,
  categories,
  mergeByName,
  currency,
  selectedTags,
  label,
  showCurrencyHeading = false,
  accountBook,
  excludedKeys,
  onToggleKey,
}: ReportSectionProps) {
  const t = useTranslations()

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  )

  const tagFilteredTransactions = useMemo(() => {
    if (!selectedTags || selectedTags.size === 0) return transactions
    return transactions.filter(
      (tx) => tx.tags && (tx.tags.length === 0 || tx.tags.some((tag) => selectedTags.has(tag)))
    )
  }, [transactions, selectedTags])

  // Category-filtered transactions: used for summary cards and monthly trend only.
  // The breakdown list always uses the full `tagFilteredTransactions` so excluded rows stay visible.
  const activeTransactions = useMemo(() => {
    if (excludedKeys.size === 0) return tagFilteredTransactions

    return tagFilteredTransactions.filter((tx) => {
      const category = categoryById.get(tx.categoryId) ?? null
      const currentKey = getCategoryBucketIdentity(
        tx,
        category,
        mergeByName
      ).key
      if (excludedKeys.has(currentKey)) {
        return false
      }

      if (!mergeByName && category?.parentId) {
        const parentCategory = categoryById.get(category.parentId) ?? null
        if (parentCategory) {
          const parentKey = getCategoryBucketIdentity(
            tx,
            parentCategory,
            mergeByName
          ).key
          if (excludedKeys.has(parentKey)) {
            return false
          }
        }
      }

      return true
    })
  }, [tagFilteredTransactions, excludedKeys, categoryById, mergeByName])

  const totals = useMemo(
    () => summarize(activeTransactions),
    [activeTransactions]
  )
  const expenseCategories = useMemo(
    () => groupByCategory(tagFilteredTransactions, categories, 'expense', { mergeByName }),
    [tagFilteredTransactions, categories, mergeByName]
  )
  const incomeCategories = useMemo(
    () => groupByCategory(tagFilteredTransactions, categories, 'income', { mergeByName }),
    [tagFilteredTransactions, categories, mergeByName]
  )
  const monthlyTrend = useMemo(
    () => groupByMonth(activeTransactions),
    [activeTransactions]
  )

  const heading = label ?? accountBook?.name ?? null
  // Used to connect the section landmark to its heading for screen readers
  const headingId = showCurrencyHeading
    ? `report-section-${currency}`
    : undefined

  if (tagFilteredTransactions.length === 0) {
    return (
      <section
        className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/5"
        aria-labelledby={headingId}
        aria-label={headingId ? undefined : t('report.section.ariaLabel')}
      >
        {showCurrencyHeading ? (
          <div className="mb-4 flex items-center gap-2">
            <h2
              id={headingId}
              className="text-lg font-semibold text-foreground"
            >
              {heading ?? currency}
            </h2>
            <Chip
              size="sm"
              variant="flat"
              className="bg-accent text-muted-foreground"
            >
              {currency}
            </Chip>
          </div>
        ) : (
          <h2 className="sr-only">{t('report.section.ariaLabel')}</h2>
        )}
        <ReportEmptyState
          icon={<PiReceiptBold size={22} />}
          title={t('report.section.emptyTitle')}
          description={t('report.section.emptyDescription')}
        />
      </section>
    )
  }

  return (
    <section
      className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/5"
      aria-labelledby={headingId}
      aria-label={headingId ? undefined : t('report.section.ariaLabel')}
    >
      {showCurrencyHeading ? (
        <div className="mb-5 flex items-center gap-2">
          <h2 id={headingId} className="text-lg font-semibold text-foreground">
            {heading ?? currency}
          </h2>
          <Chip
            size="sm"
            variant="flat"
            className="bg-accent text-muted-foreground"
          >
            {currency}
          </Chip>
          <Chip
            size="sm"
            variant="flat"
            className="bg-accent text-muted-foreground"
          >
            {t('report.section.recordsCount', { count: tagFilteredTransactions.length })}
          </Chip>
        </div>
      ) : (
        <h2 className="sr-only">{t('report.section.ariaLabel')}</h2>
      )}

      <div className="space-y-8">
        <ReportSummaryCards totals={totals} currency={currency} />
        <ReportCategoryBreakdown
          expense={expenseCategories}
          income={incomeCategories}
          currency={currency}
          excludedKeys={excludedKeys}
          onToggleKey={onToggleKey}
        />
        <ReportMonthlyTrend points={monthlyTrend} currency={currency} />
      </div>
    </section>
  )
}
