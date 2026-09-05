import { useMemo } from 'react'
import { PiChartBarFill } from 'react-icons/pi'
import { useTranslations } from 'next-intl'
import type { ApexOptions } from 'apexcharts'
import { SurfaceCard } from '@/components/ui/SurfaceCard'
import { formatAmount } from '@/utils/amountUtils'
import ReportApexChart from './ReportApexChart'
import ReportEmptyState from './ReportEmptyState'
import { MonthlyTrendPoint } from './reportTypes'

type ReportMonthlyTrendProps = {
  points: MonthlyTrendPoint[]
  currency: string
}

function buildTrendOptions(
  points: MonthlyTrendPoint[],
  currency: string
): ApexOptions {
  return {
    chart: {
      type: 'bar',
      stacked: false,
      animations: { enabled: true },
      toolbar: { show: false },
    },
    // Use CSS-variable references; ReportApexChart resolves them at render time
    // so they stay in sync when the theme changes.
    colors: ['hsl(var(--income-color))', 'hsl(var(--expense-color))'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '58%',
        borderRadius: 6,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: points.map((point) => point.month),
      labels: {
        style: { colors: 'hsl(var(--muted-foreground))', fontSize: '12px' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: 'hsl(var(--muted-foreground))',
          fontSize: '12px',
        },
        formatter: (value: number) => formatAmount(value, currency),
      },
    },
    grid: {
      borderColor: 'hsl(var(--border))',
      strokeDashArray: 4,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      labels: { colors: 'hsl(var(--muted-foreground))' },
    },
    tooltip: {
      y: {
        formatter: (value: number) => formatAmount(value, currency),
      },
    },
  }
}

export default function ReportMonthlyTrend({
  points,
  currency,
}: ReportMonthlyTrendProps) {
  const t = useTranslations()
  const trendOptions = useMemo(
    () => buildTrendOptions(points, currency),
    [points, currency]
  )
  const series = useMemo(
    () => [
      { name: t('categorySettings.income'), data: points.map((p) => p.income) },
      {
        name: t('categorySettings.expense'),
        data: points.map((p) => p.expense),
      },
    ],
    [points, t]
  )

  if (points.length === 0) {
    return (
      <SurfaceCard className="space-y-4 bg-secondary/45 p-4 shadow-none sm:p-5">
        <h3 className="text-title font-semibold leading-snug text-foreground">
          {t('report.trend.title')}
        </h3>
        <ReportEmptyState
          icon={<PiChartBarFill size={18} />}
          description={t('report.trend.empty')}
        />
      </SurfaceCard>
    )
  }

  return (
    <SurfaceCard
      className="min-w-0 space-y-4 bg-secondary/45 p-4 shadow-none sm:p-5"
      data-testid="monthly-trend-surface"
    >
      <h3 className="text-title font-semibold leading-snug text-foreground">
        {t('report.trend.title')}
      </h3>

      {/* Accessible text alternative for screen readers (C1) */}
      <table className="sr-only" aria-label={t('report.trend.tableAria')}>
        <thead>
          <tr>
            <th scope="col">{t('report.trend.month')}</th>
            <th scope="col">
              {t('categorySettings.income')} ({currency})
            </th>
            <th scope="col">
              {t('categorySettings.expense')} ({currency})
            </th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.month}>
              <td>{p.month}</td>
              <td>{formatAmount(p.income, currency)}</td>
              <td>{formatAmount(p.expense, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Visual chart — hidden from screen readers since the table above covers it */}
      <div
        aria-hidden="true"
        className="h-[220px] min-w-0 overflow-hidden sm:h-[240px]"
      >
        <ReportApexChart
          type="bar"
          options={trendOptions}
          series={series}
          height="100%"
        />
      </div>
    </SurfaceCard>
  )
}
