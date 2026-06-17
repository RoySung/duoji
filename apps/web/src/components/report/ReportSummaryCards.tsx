import { useTranslations } from 'next-intl'
import { formatAmount } from '@/utils/reportAggregate'
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
      <div className="flex items-baseline justify-between border-b border-border pb-4">
        <p className="text-xs font-medium text-muted-foreground">
          {t('report.summary.net')}
        </p>
        <p className={`text-3xl font-semibold tracking-tight ${netColor}`}>
          {netSign}
          {formatAmount(Math.abs(totals.net))}
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">
            {currency}
          </span>
        </p>
      </div>

      {/* Income & Expense — secondary breakdown */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {t('categorySettings.income')}
          </p>
          <p className="mt-1.5 text-xl font-semibold tracking-tight text-success">
            +{formatAmount(totals.income)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              {currency}
            </span>
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {t('categorySettings.expense')}
          </p>
          <p className="mt-1.5 text-xl font-semibold tracking-tight text-primary-400">
            −{formatAmount(totals.expense)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              {currency}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
