import { useTranslations } from 'next-intl'
import { formatAmount } from '@/utils/amountUtils'
import { SummaryTotals } from './reportTypes'

type ReportSummaryCardsProps = {
  totals: SummaryTotals
  currency: string
}

export default function ReportSummaryCards({
  totals,
  currency,
}: ReportSummaryCardsProps) {
  const t = useTranslations()
  const netSign = totals.net > 0 ? '+' : totals.net < 0 ? '−' : ''
  const netColor = totals.net >= 0 ? 'text-success' : 'text-danger'

  return (
    <div className="space-y-4">
      {/* Net — primary focus */}
      <div className="grid min-w-0 gap-1 border-b border-border pb-4 min-[400px]:grid-cols-[auto_minmax(0,1fr)] min-[400px]:items-baseline min-[400px]:gap-4">
        <p className="text-body font-medium text-muted-foreground">
          {t('report.summary.net')}
        </p>
        <p
          className={`min-w-0 break-words text-xl font-semibold leading-tight tracking-[-0.02em] tabular-nums min-[400px]:text-right ${netColor}`}
        >
          {netSign}
          {formatAmount(Math.abs(totals.net), currency)}
        </p>
      </div>

      {/* Income & Expense — secondary breakdown */}
      <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 min-[400px]:gap-0">
        <div className="min-w-0 min-[400px]:pr-4">
          <p className="text-body font-medium text-muted-foreground">
            {t('categorySettings.income')}
          </p>
          <p className="mt-1.5 break-words text-title font-semibold tracking-tight text-success tabular-nums">
            +{formatAmount(totals.income, currency)}
          </p>
        </div>
        <div className="min-w-0 border-t border-border pt-4 min-[400px]:border-l min-[400px]:border-t-0 min-[400px]:pl-4 min-[400px]:pt-0">
          <p className="text-body font-medium text-muted-foreground">
            {t('categorySettings.expense')}
          </p>
          <p className="mt-1.5 break-words text-title font-semibold tracking-tight text-emphasis-foreground tabular-nums">
            −{formatAmount(totals.expense, currency)}
          </p>
        </div>
      </div>
    </div>
  )
}
