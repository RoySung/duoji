import { useMemo, useState } from 'react'
import { Avatar, Tab, Tabs } from '@heroui/react'
import { useTranslations } from 'next-intl'
import {
  PiChartPieFill,
  PiEye,
  PiEyeSlash,
  PiReceiptBold,
} from 'react-icons/pi'
import type { ApexOptions } from 'apexcharts'
import { formatAmount } from '@/utils/reportAggregate'
import CategoryTransactionsModal from './CategoryTransactionsModal'
import ReportApexChart from './ReportApexChart'
import ReportEmptyState from './ReportEmptyState'
import { CategorySummary, TransactionType } from './reportTypes'

type ReportCategoryBreakdownProps = {
  expense: CategorySummary[]
  income: CategorySummary[]
  currency: string
  excludedKeys: Set<string>
  onToggleKey: (key: string) => void
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

// Stable color map by key so dot ↔ slice colors stay in sync after exclusion
function buildColorMap(summaries: CategorySummary[]): Map<string, string> {
  return new Map(
    summaries.map((s, i) => [s.key, CHART_COLORS[i % CHART_COLORS.length]])
  )
}

function buildDonutOptions(
  summaries: CategorySummary[],
  colorMap: Map<string, string>,
  currency: string,
  totalLabel: string,
  onSliceClick: (index: number) => void
): ApexOptions {
  return {
    chart: {
      type: 'donut',
      animations: { enabled: true },
      events: {
        dataPointSelection: (_event, _chartContext, config) => {
          const { dataPointIndex } = config
          if (dataPointIndex >= 0 && dataPointIndex < summaries.length) {
            onSliceClick(dataPointIndex)
          }
        },
      },
    },
    labels: summaries.map((s) => s.displayName),
    colors: summaries.map((s) => colorMap.get(s.key) ?? CHART_COLORS[0]),
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            total: {
              show: true,
              label: totalLabel,
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce(
                  (sum: number, value: number) => sum + value,
                  0
                )
                return `${formatAmount(total)} ${currency}`
              },
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${formatAmount(value)} ${currency}`,
      },
    },
  }
}

function BreakdownList({
  summaries,
  colorMap,
  currency,
  excludedKeys,
  onToggle,
  onSelect,
}: {
  summaries: CategorySummary[]
  colorMap: Map<string, string>
  currency: string
  excludedKeys: Set<string>
  onToggle: (key: string) => void
  onSelect: (summary: CategorySummary) => void
}) {
  const t = useTranslations()
  return (
    <ul className="space-y-2">
      {summaries.map((summary) => {
        const isExcluded = excludedKeys.has(summary.key)
        const dotColor = colorMap.get(summary.key) ?? CHART_COLORS[0]
        return (
          <li key={summary.key} className="group flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onToggle(summary.key)}
              aria-pressed={!isExcluded}
              title={isExcluded ? t('report.breakdown.clickToInclude') : t('report.breakdown.clickToExclude')}
              className={`relative flex flex-1 items-center gap-3 rounded-2xl border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
                isExcluded
                  ? 'border-border bg-card/50 opacity-40'
                  : 'border-border bg-background hover:border-primary-200 hover:bg-accent/50'
              }`}
            >
              {/* Color dot — flips to eye-slash icon on hover to signal it's a toggle */}
              <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                <span
                  aria-hidden
                  className={`absolute h-2.5 w-2.5 rounded-full transition-opacity duration-150 ${
                    isExcluded
                      ? 'opacity-100'
                      : 'opacity-100 group-hover:opacity-0'
                  }`}
                  style={{ backgroundColor: dotColor }}
                />
                <span
                  aria-hidden
                  className={`absolute text-muted-foreground transition-opacity duration-150 ${
                    isExcluded
                      ? 'opacity-0'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {isExcluded ? <PiEye size={14} /> : <PiEyeSlash size={14} />}
                </span>
              </span>

              {summary.imageUrl ? (
                <Avatar
                  className="h-8 w-8 bg-content2"
                  name={summary.displayName}
                  src={summary.imageUrl}
                />
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-content2 text-muted-foreground">
                  <PiChartPieFill size={14} />
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col">
                <span
                  className={`truncate text-sm font-medium transition-colors ${
                    isExcluded
                      ? 'text-muted-foreground line-through'
                      : 'text-foreground'
                  }`}
                >
                  {summary.displayName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t('report.categoryModal.recordsCount', { count: summary.transactionCount })} ·{' '}
                  {summary.percentage.toFixed(1)}%
                </span>
              </div>
              <span className="shrink-0 text-sm font-semibold text-foreground">
                {formatAmount(summary.totalAmount)}{' '}
                <span className="text-xs font-normal text-muted-foreground">
                  {currency}
                </span>
              </span>
            </button>

            {/* View transactions button — more visible styling */}
            <button
              type="button"
              onClick={() => onSelect(summary)}
              aria-label={t('report.breakdown.viewTransactionsFor', { name: summary.displayName })}
              title={t('report.breakdown.viewTransactions')}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-accent/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/70"
            >
              <PiReceiptBold size={15} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function BreakdownPanel({
  summaries,
  currency,
  emptyLabel,
  excludedKeys,
  onToggle,
  onSelect,
}: {
  summaries: CategorySummary[]
  currency: string
  emptyLabel: string
  excludedKeys: Set<string>
  onToggle: (key: string) => void
  onSelect: (summary: CategorySummary) => void
}) {
  const t = useTranslations()
  const colorMap = useMemo(() => buildColorMap(summaries), [summaries])

  const activeSummaries = useMemo(
    () => summaries.filter((s) => !excludedKeys.has(s.key)),
    [summaries, excludedKeys]
  )
  const donutOptions = useMemo(
    () =>
      buildDonutOptions(
        activeSummaries,
        colorMap,
        currency,
        t('report.breakdown.total'),
        (index) => onSelect(activeSummaries[index])
      ),
    [activeSummaries, colorMap, currency, onSelect, t]
  )
  const series = useMemo(
    () => activeSummaries.map((s) => s.totalAmount),
    [activeSummaries]
  )

  if (summaries.length === 0) {
    return (
      <ReportEmptyState
        icon={<PiChartPieFill size={22} />}
        description={emptyLabel}
        className="py-10"
      />
    )
  }

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center">
      {activeSummaries.length === 0 ? (
        <ReportEmptyState
          icon={<PiChartPieFill size={22} />}
          description={emptyLabel}
          className="py-10"
        />
      ) : (
        /* Donut chart — visual only; BreakdownList below is the accessible equivalent */
        <div className="min-h-[260px]" aria-hidden="true">
          <ReportApexChart
            type="donut"
            options={donutOptions}
            series={series}
            height={260}
          />
        </div>
      )}
      <BreakdownList
        summaries={summaries}
        colorMap={colorMap}
        currency={currency}
        excludedKeys={excludedKeys}
        onToggle={onToggle}
        onSelect={onSelect}
      />
    </div>
  )
}

export default function ReportCategoryBreakdown({
  expense,
  income,
  currency,
  excludedKeys,
  onToggleKey,
  onEditTransaction,
}: ReportCategoryBreakdownProps & { onEditTransaction?: (id: string) => void }) {
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState<TransactionType>('expense')
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const allSummaries = useMemo(() => [...expense, ...income], [expense, income])
  const selectedSummary = useMemo(
    () => allSummaries.find((s) => s.key === selectedKey) ?? null,
    [allSummaries, selectedKey]
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {t('report.breakdown.title')}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t('report.breakdown.description')}
          </p>
        </div>
        <Tabs
          aria-label={t('report.breakdown.ariaLabel')}
          color="primary"
          selectedKey={activeTab}
          size="sm"
          variant="solid"
          onSelectionChange={(key) => setActiveTab(key as TransactionType)}
        >
          <Tab key="expense" title={t('categorySettings.expense')} />
          <Tab key="income" title={t('categorySettings.income')} />
        </Tabs>
      </div>

      {activeTab === 'expense' ? (
        <BreakdownPanel
          summaries={expense}
          currency={currency}
          emptyLabel={t('report.breakdown.emptyExpense')}
          excludedKeys={excludedKeys}
          onToggle={onToggleKey}
          onSelect={(summary) => setSelectedKey(summary.key)}
        />
      ) : (
        <BreakdownPanel
          summaries={income}
          currency={currency}
          emptyLabel={t('report.breakdown.emptyIncome')}
          excludedKeys={excludedKeys}
          onToggle={onToggleKey}
          onSelect={(summary) => setSelectedKey(summary.key)}
        />
      )}

      <CategoryTransactionsModal
        summary={selectedSummary}
        currency={currency}
        isOpen={selectedSummary !== null}
        onClose={() => setSelectedKey(null)}
        onTransactionClick={onEditTransaction}
      />
    </div>
  )
}
