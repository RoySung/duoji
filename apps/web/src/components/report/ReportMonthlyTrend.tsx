import { useMemo } from 'react'
import { PiChartBarFill } from 'react-icons/pi'
import type { ApexOptions } from 'apexcharts'
import { formatAmount } from '@/utils/reportAggregate'
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
        columnWidth: '50%',
        borderRadius: 6,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: points.map((point) => point.month),
      labels: { style: { colors: 'hsl(var(--muted-foreground))' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: 'hsl(var(--muted-foreground))' },
        formatter: (value: number) => formatAmount(value),
      },
    },
    grid: {
      borderColor: 'hsl(var(--border))',
      strokeDashArray: 4,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: 'hsl(var(--muted-foreground))' },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${formatAmount(value)} ${currency}`,
      },
    },
  }
}

export default function ReportMonthlyTrend({
  points,
  currency,
}: ReportMonthlyTrendProps) {
  const trendOptions = useMemo(
    () => buildTrendOptions(points, currency),
    [points, currency]
  )
  const series = useMemo(
    () => [
      { name: 'Income', data: points.map((p) => p.income) },
      { name: 'Expense', data: points.map((p) => p.expense) },
    ],
    [points]
  )

  if (points.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">
          Monthly trend
        </h3>
        <ReportEmptyState
          icon={<PiChartBarFill size={22} />}
          description="No transactions in range"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-foreground">Monthly trend</h3>

      {/* Accessible text alternative for screen readers (C1) */}
      <table className="sr-only" aria-label="Monthly income and expense data">
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Income ({currency})</th>
            <th scope="col">Expense ({currency})</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.month}>
              <td>{p.month}</td>
              <td>{formatAmount(p.income)}</td>
              <td>{formatAmount(p.expense)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Visual chart — hidden from screen readers since the table above covers it */}
      <div aria-hidden="true">
        <ReportApexChart
          type="bar"
          options={trendOptions}
          series={series}
          height={300}
        />
      </div>
    </div>
  )
}
