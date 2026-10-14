import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type Key,
} from 'react'
import { Avatar, Tab, Tabs } from '@heroui/react'
import { useTranslations } from 'next-intl'
import {
  PiChartPieFill,
  PiCaretLeftBold,
  PiCaretRightBold,
  PiEye,
  PiEyeSlash,
  PiReceiptBold,
} from 'react-icons/pi'
import type { ApexOptions } from 'apexcharts'
import { SurfaceCard } from '@/components/ui/SurfaceCard'
import { formatAmount } from '@/utils/amountUtils'
import CategoryTransactionsModal from './CategoryTransactionsModal'
import ReportApexChart from './ReportApexChart'
import ReportEmptyState from './ReportEmptyState'
import { CategorySummary, TransactionType } from './reportTypes'

type BreakdownViewMode = 'overview' | 'comparison'
type ComparisonSummary = CategorySummary & { rootKey: string }

type ReportCategoryBreakdownProps = {
  expense: CategorySummary[]
  income: CategorySummary[]
  activeExpense: CategorySummary[]
  activeIncome: CategorySummary[]
  currency: string
  excludedKeys: Set<string>
  drillableRootKeys?: ReadonlySet<string>
  descendantKeysByRoot?: ReadonlyMap<string, ReadonlySet<string>>
  onToggleKey: (key: string) => void
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]
const DIRECT_SUMMARY_PREFIX = 'report-direct::'

function buildDirectSummary(
  root: CategorySummary,
  directLabel: string
): CategorySummary | null {
  if (root.directAmount <= 0) return null

  return {
    key: `${DIRECT_SUMMARY_PREFIX}${root.key}`,
    displayName: directLabel,
    imageUrl: null,
    totalAmount: root.directAmount,
    transactionCount: root.directTransactionCount,
    directAmount: root.directAmount,
    directTransactionCount: root.directTransactionCount,
    directTransactions: root.directTransactions,
    percentage: 0,
    transactions: root.directTransactions,
    children: [],
  }
}

function buildFocusedSummaries(
  root: CategorySummary,
  directLabel: string
): CategorySummary[] {
  const directSummary = buildDirectSummary(root, directLabel)

  return [...root.children, ...(directSummary ? [directSummary] : [])].sort(
    (left, right) => right.totalAmount - left.totalAmount
  )
}

function findSummaryByKey(
  roots: CategorySummary[],
  key: string,
  directLabelFor: (root: CategorySummary) => string
): CategorySummary | null {
  for (const root of roots) {
    if (root.key === key) return root

    const child = root.children.find((summary) => summary.key === key)
    if (child) return child

    if (`${DIRECT_SUMMARY_PREFIX}${root.key}` === key) {
      return buildDirectSummary(root, directLabelFor(root))
    }
  }

  return null
}

function isDirectSummary(summary: CategorySummary): boolean {
  return summary.key.startsWith(DIRECT_SUMMARY_PREFIX)
}

// Stable color map by key so dot ↔ slice colors stay in sync after exclusion
function buildColorMap(summaries: CategorySummary[]): Map<string, string> {
  return new Map(
    summaries.map((s, i) => [s.key, CHART_COLORS[i % CHART_COLORS.length]])
  )
}

function buildComparisonSummaries(
  roots: CategorySummary[],
  directLabelFor: (root: CategorySummary) => string,
  denominator: number
): ComparisonSummary[] {
  return roots
    .flatMap((root) =>
      buildFocusedSummaries(root, directLabelFor(root)).map((summary) => ({
        ...summary,
        rootKey: root.key,
        displayName: `${root.displayName} / ${summary.displayName}`,
        percentage:
          denominator > 0 ? (summary.totalAmount / denominator) * 100 : 0,
      }))
    )
    .sort((left, right) => right.totalAmount - left.totalAmount)
}

function buildComparisonColorMap(
  roots: CategorySummary[],
  summaries: ComparisonSummary[]
): Map<string, string> {
  const rootColors = new Map(
    roots.map((root, index) => [
      root.key,
      CHART_COLORS[index % CHART_COLORS.length],
    ])
  )

  return new Map(
    summaries.map((summary) => [
      summary.key,
      rootColors.get(summary.rootKey) ?? CHART_COLORS[0],
    ])
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
              fontSize: '12px',
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce(
                  (sum: number, value: number) => sum + value,
                  0
                )
                return formatAmount(total, currency)
              },
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => formatAmount(value, currency),
      },
    },
  }
}

function buildBarOptions(
  summaries: ComparisonSummary[],
  colorMap: Map<string, string>,
  currency: string,
  onBarClick: (index: number) => void
): ApexOptions {
  return {
    chart: {
      type: 'bar',
      animations: { enabled: true },
      events: {
        dataPointSelection: (_event, _chartContext, config) => {
          const { dataPointIndex } = config
          if (dataPointIndex >= 0 && dataPointIndex < summaries.length) {
            onBarClick(dataPointIndex)
          }
        },
      },
    },
    colors: summaries.map(
      (summary) => colorMap.get(summary.key) ?? CHART_COLORS[0]
    ),
    dataLabels: { enabled: false },
    legend: { show: false },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        borderRadius: 5,
        barHeight: '64%',
      },
    },
    xaxis: {
      categories: summaries.map((summary) => summary.displayName),
      labels: {
        formatter: (value) => formatAmount(Number(value), currency),
      },
    },
    yaxis: {
      labels: {
        maxWidth: 220,
      },
    },
    grid: {
      borderColor: 'hsl(var(--border))',
      strokeDashArray: 3,
    },
    tooltip: {
      y: {
        formatter: (value: number) => formatAmount(value, currency),
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
  onActivate,
  onSelect,
  canDrill,
  inheritedExcludedKeys,
}: {
  summaries: CategorySummary[]
  colorMap: Map<string, string>
  currency: string
  excludedKeys: Set<string>
  onToggle: (summary: CategorySummary) => void
  onActivate: (summary: CategorySummary) => void
  onSelect: (summary: CategorySummary) => void
  canDrill: (summary: CategorySummary) => boolean
  inheritedExcludedKeys?: ReadonlySet<string>
}) {
  const t = useTranslations()

  const renderPrimaryButton = (summary: CategorySummary, dotColor: string) => {
    const isExcluded =
      excludedKeys.has(summary.key) ||
      (inheritedExcludedKeys?.has(summary.key) ?? false)
    const isDrillable = canDrill(summary)

    return (
      <button
        type="button"
        onClick={() => onActivate(summary)}
        aria-label={t(
          isDrillable
            ? 'report.breakdown.viewBreakdownFor'
            : 'report.breakdown.openTransactionsFor',
          { name: summary.displayName }
        )}
        data-chart-color={dotColor}
        style={{ '--category-chart-color': dotColor } as CSSProperties}
        className={`relative grid min-h-14 min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1 overflow-hidden rounded-2xl border py-2.5 pl-5 pr-3 text-left transition-colors before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-2 before:rounded-l-2xl before:bg-[var(--category-chart-color)] before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card lg:grid-cols-[auto_minmax(0,1fr)_auto] ${
          isExcluded
            ? 'border-border bg-card/60 opacity-60'
            : 'border-border bg-card hover:border-primary/45 hover:bg-accent/10'
        }`}
      >
        {summary.imageUrl ? (
          <Avatar
            className="row-span-2 h-8 w-8 bg-content2 lg:row-auto"
            classNames={{ img: 'p-1' }}
            name={summary.displayName}
            src={summary.imageUrl}
          />
        ) : (
          <div
            className="row-span-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-content2 text-muted-foreground lg:row-auto"
            style={{ color: dotColor }}
          >
            <PiChartPieFill size={12} />
          </div>
        )}
        <div className="flex min-w-0 flex-col lg:row-auto">
          <span
            className={`truncate text-body font-medium transition-colors ${
              isExcluded
                ? 'text-muted-foreground line-through'
                : 'text-foreground'
            }`}
          >
            {summary.displayName}
          </span>
          <span className="text-label text-muted-foreground">
            {t('report.categoryModal.recordsCount', {
              count: summary.transactionCount,
            })}{' '}
            · {summary.percentage.toFixed(1)}%
          </span>
        </div>
        <span className="col-start-2 flex min-w-0 items-center gap-2 justify-self-start lg:col-auto lg:justify-self-end">
          <span className="min-w-0 break-words text-left text-body font-semibold leading-tight text-foreground tabular-nums lg:text-right">
            {formatAmount(summary.totalAmount, currency)}
          </span>
          <PiCaretRightBold
            aria-hidden="true"
            size={14}
            className="shrink-0 text-muted-foreground"
          />
        </span>
      </button>
    )
  }

  const renderFilterButton = (summary: CategorySummary) => {
    const isExplicitlyExcluded = excludedKeys.has(summary.key)
    const isInheritedExcluded = inheritedExcludedKeys?.has(summary.key) ?? false
    const isExcluded = isExplicitlyExcluded || isInheritedExcluded

    return (
      <button
        type="button"
        onClick={() => onToggle(summary)}
        disabled={isInheritedExcluded}
        aria-pressed={!isExcluded}
        aria-label={t(
          isInheritedExcluded
            ? 'report.breakdown.excludedByParent'
            : isExplicitlyExcluded
            ? 'report.breakdown.includeCategory'
            : 'report.breakdown.excludeCategory',
          { name: summary.displayName }
        )}
        title={
          isInheritedExcluded
            ? t('report.breakdown.excludedByParent', {
                name: summary.displayName,
              })
            : isExplicitlyExcluded
            ? t('report.breakdown.clickToInclude')
            : t('report.breakdown.clickToExclude')
        }
        className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary/45 hover:bg-accent/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-card disabled:hover:text-muted-foreground"
      >
        {isExcluded ? <PiEye size={14} /> : <PiEyeSlash size={14} />}
      </button>
    )
  }

  const renderDetailButton = (summary: CategorySummary) => (
    <button
      type="button"
      onClick={() => onSelect(summary)}
      aria-label={t('report.breakdown.viewTransactionsFor', {
        name: summary.displayName,
      })}
      title={t('report.breakdown.viewTransactions')}
      className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary/45 hover:bg-accent/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <PiReceiptBold size={14} />
    </button>
  )

  return (
    <ul className="space-y-2.5">
      {summaries.map((summary) => {
        const dotColor = colorMap.get(summary.key) ?? CHART_COLORS[0]

        return (
          <li
            key={summary.key}
            className="grid min-w-0 grid-cols-[minmax(0,1fr)_2.75rem_2.75rem] items-stretch gap-2"
          >
            {renderPrimaryButton(summary, dotColor)}
            {isDirectSummary(summary) ? (
              <span aria-hidden="true" />
            ) : (
              renderFilterButton(summary)
            )}
            {renderDetailButton(summary)}
          </li>
        )
      })}
    </ul>
  )
}

function BreakdownPanel({
  summaries,
  activeSummaries,
  currency,
  emptyLabel,
  excludedKeys,
  onToggle,
  onDrill,
  onSelect,
  drilledSummary,
  activeDrilledSummary,
  onBack,
  directLabel,
  canDrillRoot,
}: {
  summaries: CategorySummary[]
  activeSummaries: CategorySummary[]
  currency: string
  emptyLabel: string
  excludedKeys: Set<string>
  onToggle: (summary: CategorySummary) => void
  onDrill: (summary: CategorySummary) => void
  onSelect: (summary: CategorySummary) => void
  drilledSummary: CategorySummary | null
  activeDrilledSummary: CategorySummary | null
  onBack: () => void
  directLabel: string
  canDrillRoot: (summary: CategorySummary) => boolean
}) {
  const t = useTranslations()
  const displayedSummaries = useMemo(() => {
    if (!drilledSummary) return summaries

    const denominator = drilledSummary.totalAmount
    return buildFocusedSummaries(drilledSummary, directLabel).map(
      (summary) => ({
        ...summary,
        percentage:
          denominator > 0 ? (summary.totalAmount / denominator) * 100 : 0,
      })
    )
  }, [directLabel, drilledSummary, summaries])
  const displayedActiveSummaries = useMemo(() => {
    if (!drilledSummary) return activeSummaries
    if (!activeDrilledSummary) return []

    const denominator = activeDrilledSummary.totalAmount
    return buildFocusedSummaries(activeDrilledSummary, directLabel).map(
      (summary) => ({
        ...summary,
        percentage:
          denominator > 0 ? (summary.totalAmount / denominator) * 100 : 0,
      })
    )
  }, [activeDrilledSummary, activeSummaries, directLabel, drilledSummary])
  const colorMap = useMemo(
    () => buildColorMap(displayedSummaries),
    [displayedSummaries]
  )
  const inheritedExcludedKeys = useMemo(() => {
    if (!drilledSummary || !excludedKeys.has(drilledSummary.key))
      return undefined
    return new Set(displayedSummaries.map((summary) => summary.key))
  }, [displayedSummaries, drilledSummary, excludedKeys])

  const donutOptions = useMemo(
    () =>
      buildDonutOptions(
        displayedActiveSummaries,
        colorMap,
        currency,
        drilledSummary
          ? drilledSummary.displayName
          : t('report.breakdown.allCategories'),
        (index) => {
          const summary = displayedActiveSummaries[index]
          if (!drilledSummary && canDrillRoot(summary)) onDrill(summary)
          else onSelect(summary)
        }
      ),
    [
      colorMap,
      currency,
      displayedActiveSummaries,
      drilledSummary,
      onDrill,
      onSelect,
      canDrillRoot,
      t,
    ]
  )
  const series = useMemo(
    () => displayedActiveSummaries.map((s) => s.totalAmount),
    [displayedActiveSummaries]
  )

  if (displayedSummaries.length === 0) {
    return (
      <ReportEmptyState
        icon={<PiChartPieFill size={18} />}
        description={emptyLabel}
        className="py-10"
      />
    )
  }

  return (
    <div className="space-y-4">
      {drilledSummary ? (
        <button
          type="button"
          onClick={onBack}
          aria-label={t('report.breakdown.backToAllCategories')}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-3 text-body font-medium text-foreground transition-colors hover:border-primary/45 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <PiCaretLeftBold aria-hidden="true" size={14} />
          <span>{t('report.breakdown.allCategories')}</span>
          <span aria-hidden="true" className="text-muted-foreground">
            /
          </span>
          <span>{drilledSummary.displayName}</span>
        </button>
      ) : (
        <div className="inline-flex min-h-11 items-center rounded-xl border border-border bg-card px-3 text-body font-medium text-foreground">
          {t('report.breakdown.allCategories')}
        </div>
      )}

      <div className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center">
        {displayedActiveSummaries.length === 0 ? (
          <ReportEmptyState
            icon={<PiChartPieFill size={18} />}
            description={emptyLabel}
            className="py-10"
          />
        ) : (
          /* Donut chart — visual only; BreakdownList below is the accessible equivalent */
          <div
            className="mx-auto h-[220px] w-full min-w-0 max-w-[19rem] overflow-visible sm:h-[240px]"
            aria-label={t('report.breakdown.chartLabel')}
          >
            <ReportApexChart
              type="donut"
              options={donutOptions}
              series={series}
              height="100%"
              allowTooltipOverflow
            />
          </div>
        )}
        <BreakdownList
          summaries={displayedSummaries}
          colorMap={colorMap}
          currency={currency}
          excludedKeys={excludedKeys}
          onToggle={onToggle}
          canDrill={(summary) => !drilledSummary && canDrillRoot(summary)}
          inheritedExcludedKeys={inheritedExcludedKeys}
          onActivate={(summary) => {
            if (!drilledSummary && canDrillRoot(summary)) onDrill(summary)
            else onSelect(summary)
          }}
          onSelect={onSelect}
        />
      </div>
    </div>
  )
}

function ComparisonPanel({
  summaries,
  activeSummaries,
  currency,
  emptyLabel,
  excludedKeys,
  onToggle,
  onSelect,
}: {
  summaries: CategorySummary[]
  activeSummaries: CategorySummary[]
  currency: string
  emptyLabel: string
  excludedKeys: Set<string>
  onToggle: (summary: CategorySummary) => void
  onSelect: (summary: CategorySummary) => void
}) {
  const t = useTranslations()
  const denominator = useMemo(
    () => summaries.reduce((total, summary) => total + summary.totalAmount, 0),
    [summaries]
  )
  const displayedSummaries = useMemo(
    () =>
      buildComparisonSummaries(
        summaries,
        (root) => t('report.breakdown.directlyIn', { name: root.displayName }),
        denominator
      ),
    [denominator, summaries, t]
  )
  const displayedActiveSummaries = useMemo(
    () =>
      buildComparisonSummaries(
        activeSummaries,
        (root) => t('report.breakdown.directlyIn', { name: root.displayName }),
        denominator
      ),
    [activeSummaries, denominator, t]
  )
  const colorMap = useMemo(
    () => buildComparisonColorMap(summaries, displayedSummaries),
    [displayedSummaries, summaries]
  )
  const activeColorMap = useMemo(
    () => buildComparisonColorMap(summaries, displayedActiveSummaries),
    [displayedActiveSummaries, summaries]
  )
  const inheritedExcludedKeys = useMemo(
    () =>
      new Set(
        displayedSummaries
          .filter((summary) => excludedKeys.has(summary.rootKey))
          .map((summary) => summary.key)
      ),
    [displayedSummaries, excludedKeys]
  )
  const barOptions = useMemo(
    () =>
      buildBarOptions(
        displayedActiveSummaries,
        activeColorMap,
        currency,
        (index) => onSelect(displayedActiveSummaries[index])
      ),
    [activeColorMap, currency, displayedActiveSummaries, onSelect]
  )
  const series = useMemo(
    () => [
      {
        name: t('report.breakdown.amount'),
        data: displayedActiveSummaries.map((summary) => summary.totalAmount),
      },
    ],
    [displayedActiveSummaries, t]
  )

  if (displayedSummaries.length === 0) {
    return (
      <ReportEmptyState
        icon={<PiChartPieFill size={18} />}
        description={emptyLabel}
        className="py-10"
      />
    )
  }

  return (
    <div className="space-y-5">
      {displayedActiveSummaries.length === 0 ? (
        <ReportEmptyState
          icon={<PiChartPieFill size={18} />}
          description={emptyLabel}
          className="py-10"
        />
      ) : (
        <div
          className="min-w-0 overflow-visible"
          aria-label={t('report.breakdown.comparisonChartLabel')}
        >
          <ReportApexChart
            type="bar"
            options={barOptions}
            series={series}
            height={Math.max(260, displayedActiveSummaries.length * 52)}
            allowTooltipOverflow
          />
        </div>
      )}
      <BreakdownList
        summaries={displayedSummaries}
        colorMap={colorMap}
        currency={currency}
        excludedKeys={excludedKeys}
        onToggle={onToggle}
        canDrill={() => false}
        inheritedExcludedKeys={inheritedExcludedKeys}
        onActivate={onSelect}
        onSelect={onSelect}
      />
    </div>
  )
}

export default function ReportCategoryBreakdown({
  expense,
  income,
  activeExpense,
  activeIncome,
  currency,
  excludedKeys,
  drillableRootKeys,
  descendantKeysByRoot,
  onToggleKey,
  onEditTransaction,
}: ReportCategoryBreakdownProps & {
  onEditTransaction?: (id: string) => void
}) {
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState<TransactionType>('expense')
  const [viewMode, setViewMode] = useState<BreakdownViewMode>('overview')
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [drilledKey, setDrilledKey] = useState<string | null>(null)

  const selectedSummary = useMemo(() => {
    if (!selectedKey) return null

    const directLabelFor = (root: CategorySummary) =>
      t('report.breakdown.directlyIn', { name: root.displayName })
    return (
      findSummaryByKey(expense, selectedKey, directLabelFor) ??
      findSummaryByKey(income, selectedKey, directLabelFor)
    )
  }, [expense, income, selectedKey, t])
  const currentSummaries = activeTab === 'expense' ? expense : income
  const currentActiveSummaries =
    activeTab === 'expense' ? activeExpense : activeIncome
  const drilledSummary = useMemo(
    () =>
      currentSummaries.find((summary) => summary.key === drilledKey) ?? null,
    [currentSummaries, drilledKey]
  )
  const activeDrilledSummary = useMemo(
    () =>
      currentActiveSummaries.find((summary) => summary.key === drilledKey) ??
      null,
    [currentActiveSummaries, drilledKey]
  )
  const canDrillRoot = (summary: CategorySummary) =>
    drillableRootKeys?.has(summary.key) ?? summary.children.length > 0

  useEffect(() => {
    if (
      drilledKey &&
      !currentSummaries.some((summary) => summary.key === drilledKey)
    ) {
      setDrilledKey(null)
    }
  }, [currentSummaries, drilledKey])

  useEffect(() => {
    if (selectedKey && !selectedSummary) {
      setSelectedKey(null)
    }
  }, [selectedKey, selectedSummary])

  const handleToggleSummary = (summary: CategorySummary) => {
    const isReincluding = excludedKeys.has(summary.key)
    const descendantKeys =
      descendantKeysByRoot?.get(summary.key) ??
      summary.children.map((child) => child.key)

    onToggleKey(summary.key)
    if (isReincluding) {
      for (const descendantKey of descendantKeys) {
        if (excludedKeys.has(descendantKey)) onToggleKey(descendantKey)
      }
    }
  }

  const handleTabChange = (key: Key) => {
    setActiveTab(key as TransactionType)
    setDrilledKey(null)
    setViewMode('overview')
  }

  const handleViewModeChange = (mode: BreakdownViewMode) => {
    setViewMode(mode)
    if (mode === 'comparison') setDrilledKey(null)
  }

  return (
    <SurfaceCard
      className="min-w-0 space-y-5 bg-secondary/45 p-4 shadow-none sm:p-5"
      data-testid="category-breakdown-surface"
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-title font-semibold leading-snug text-foreground">
            {t('report.breakdown.title')}
          </h3>
          <p className="mt-1 text-body leading-5 text-muted-foreground">
            {t('report.breakdown.description')}
          </p>
        </div>
        <Tabs
          aria-label={t('report.breakdown.ariaLabel')}
          color="primary"
          selectedKey={activeTab}
          size="sm"
          variant="solid"
          onSelectionChange={handleTabChange}
          className="w-full sm:w-auto"
          classNames={{
            tabList: 'grid w-full grid-cols-2 rounded-xl bg-card p-1',
            tab: 'min-h-11 px-3 text-body',
            cursor: 'bg-emphasis shadow-none',
            tabContent:
              'text-muted-foreground group-data-[selected=true]:text-emphasis-contrast',
          }}
        >
          <Tab key="expense" title={t('categorySettings.expense')} />
          <Tab key="income" title={t('categorySettings.income')} />
        </Tabs>
      </div>

      <div
        role="group"
        aria-label={t('report.breakdown.viewModeLabel')}
        className="grid w-full grid-cols-2 rounded-xl bg-card p-1 sm:w-fit"
      >
        <button
          type="button"
          aria-pressed={viewMode === 'overview'}
          onClick={() => handleViewModeChange('overview')}
          className={`min-h-11 rounded-lg px-3 text-body font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            viewMode === 'overview'
              ? 'bg-emphasis text-emphasis-contrast'
              : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
          }`}
        >
          {t('report.breakdown.overviewMode')}
        </button>
        <button
          type="button"
          aria-pressed={viewMode === 'comparison'}
          onClick={() => handleViewModeChange('comparison')}
          className={`min-h-11 rounded-lg px-3 text-body font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            viewMode === 'comparison'
              ? 'bg-emphasis text-emphasis-contrast'
              : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
          }`}
        >
          {t('report.breakdown.comparisonMode')}
        </button>
      </div>

      {viewMode === 'comparison' ? (
        <ComparisonPanel
          summaries={activeTab === 'expense' ? expense : income}
          activeSummaries={
            activeTab === 'expense' ? activeExpense : activeIncome
          }
          currency={currency}
          emptyLabel={t(
            activeTab === 'expense'
              ? 'report.breakdown.emptyExpense'
              : 'report.breakdown.emptyIncome'
          )}
          excludedKeys={excludedKeys}
          onToggle={handleToggleSummary}
          onSelect={(summary) => setSelectedKey(summary.key)}
        />
      ) : activeTab === 'expense' ? (
        <BreakdownPanel
          summaries={expense}
          activeSummaries={activeExpense}
          currency={currency}
          emptyLabel={t('report.breakdown.emptyExpense')}
          excludedKeys={excludedKeys}
          onToggle={handleToggleSummary}
          onDrill={(summary) => setDrilledKey(summary.key)}
          onSelect={(summary) => setSelectedKey(summary.key)}
          drilledSummary={drilledSummary}
          activeDrilledSummary={activeDrilledSummary}
          onBack={() => setDrilledKey(null)}
          directLabel={
            drilledSummary
              ? t('report.breakdown.directlyIn', {
                  name: drilledSummary.displayName,
                })
              : ''
          }
          canDrillRoot={canDrillRoot}
        />
      ) : (
        <BreakdownPanel
          summaries={income}
          activeSummaries={activeIncome}
          currency={currency}
          emptyLabel={t('report.breakdown.emptyIncome')}
          excludedKeys={excludedKeys}
          onToggle={handleToggleSummary}
          onDrill={(summary) => setDrilledKey(summary.key)}
          onSelect={(summary) => setSelectedKey(summary.key)}
          drilledSummary={drilledSummary}
          activeDrilledSummary={activeDrilledSummary}
          onBack={() => setDrilledKey(null)}
          directLabel={
            drilledSummary
              ? t('report.breakdown.directlyIn', {
                  name: drilledSummary.displayName,
                })
              : ''
          }
          canDrillRoot={canDrillRoot}
        />
      )}

      <CategoryTransactionsModal
        summary={selectedSummary}
        currency={currency}
        isOpen={selectedSummary !== null}
        onClose={() => setSelectedKey(null)}
        onTransactionClick={onEditTransaction}
      />
    </SurfaceCard>
  )
}
