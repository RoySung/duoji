/// <reference types="jest" />

import { render, screen } from '@testing-library/react'
import type { ApexOptions } from 'apexcharts'
import ReportMonthlyTrend from '../src/components/report/ReportMonthlyTrend'

let mockResolvedTheme = 'light'

jest.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: mockResolvedTheme }),
}))

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () =>
    function MockApexChart({
      options,
      series,
      height,
      width,
    }: {
      options: ApexOptions
      series: ApexOptions['series']
      height?: number | string
      width?: number | string
    }) {
      return (
        <div
          data-testid="apex-chart"
          data-options={JSON.stringify(options)}
          data-series={JSON.stringify(series)}
          data-height={height}
          data-width={width}
        />
      )
    },
}))

const FIXED_POINTS = [
  { month: '2026/05', income: 1200, expense: 460 },
  { month: '2026/06', income: 900, expense: 625 },
]

const ONE_MONTH_POINT = [{ month: '2026/07', income: 0, expense: 2311 }]

function setChartTokens(tokens: Record<string, string>) {
  for (const [name, value] of Object.entries(tokens)) {
    document.documentElement.style.setProperty(name, value)
  }
}

describe('report chart presentation', () => {
  beforeEach(() => {
    mockResolvedTheme = 'light'
    setChartTokens({
      '--income-color': '145 50% 32%',
      '--expense-color': '24 84% 57%',
      '--muted-foreground': '163 9% 38%',
      '--border': '40 10% 85%',
    })
  })

  afterEach(() => {
    document.documentElement.removeAttribute('style')
  })

  it('keeps fixed report data intact while resolving semantic light chart colors', () => {
    render(<ReportMonthlyTrend points={FIXED_POINTS} currency="TWD" />)

    expect(
      screen.getByTestId('monthly-trend-surface').getAttribute('data-ui')
    ).toBe('surface-card')
    expect(
      screen.getByRole('heading', { name: 'Monthly trend' }).className
    ).toContain('text-title')
    expect(
      screen.getByRole('table', { name: 'Monthly income and expense data' })
    ).not.toBeNull()
    expect(screen.queryByText('1,200 TWD')).not.toBeNull()
    expect(screen.queryByText('625 TWD')).not.toBeNull()

    const chart = screen.getByTestId('apex-chart')
    const options = JSON.parse(chart.dataset.options ?? '{}')
    const series = JSON.parse(chart.dataset.series ?? '[]')

    expect(options.theme.mode).toBe('light')
    expect(options.tooltip.theme).toBe('light')
    expect(options.colors).toEqual(['hsl(145 50% 32%)', 'hsl(24 84% 57%)'])
    expect(options.chart.foreColor).toBe('hsl(163 9% 38%)')
    expect(options.xaxis.labels.style.colors).toBe('hsl(163 9% 38%)')
    expect(options.xaxis.labels.style.fontSize).toBe('12px')
    expect(options.yaxis.labels.style.fontSize).toBe('12px')
    expect(options.legend.fontSize).toBe('12px')
    expect(options.grid.borderColor).toBe('hsl(40 10% 85%)')
    expect(series).toEqual([
      { name: 'Income', data: [1200, 900] },
      { name: 'Expense', data: [460, 625] },
    ])
    expect(chart.getAttribute('data-height')).toBe('100%')
    const chartContainer = chart.closest('[aria-hidden="true"]')
    expect(chartContainer?.className).toContain('h-[220px]')
    expect(chartContainer?.className).toContain('sm:h-[240px]')
    expect(chart.closest('[data-report-chart]')?.className).toContain('h-full')
    expect(
      document
        .querySelector('[data-report-chart]')
        ?.getAttribute('data-chart-theme')
    ).toBe('light')
  })

  it('re-resolves the same chart against dark semantic tokens', () => {
    const { rerender } = render(
      <ReportMonthlyTrend points={FIXED_POINTS} currency="TWD" />
    )

    mockResolvedTheme = 'dark'
    setChartTokens({
      '--income-color': '145 43% 59%',
      '--expense-color': '23 100% 68%',
      '--muted-foreground': '160 10% 77%',
      '--border': '163 12% 29%',
    })
    rerender(<ReportMonthlyTrend points={FIXED_POINTS} currency="TWD" />)

    const chart = screen.getByTestId('apex-chart')
    const options = JSON.parse(chart.dataset.options ?? '{}')

    expect(options.theme.mode).toBe('dark')
    expect(options.tooltip.theme).toBe('dark')
    expect(options.colors).toEqual(['hsl(145 43% 59%)', 'hsl(23 100% 68%)'])
    expect(options.chart.foreColor).toBe('hsl(160 10% 77%)')
    expect(options.grid.borderColor).toBe('hsl(163 12% 29%)')
    expect(
      document
        .querySelector('[data-report-chart]')
        ?.getAttribute('data-chart-theme')
    ).toBe('dark')
  })

  it('keeps a one-month trend readable inside the compact plotting height', () => {
    render(<ReportMonthlyTrend points={ONE_MONTH_POINT} currency="TWD" />)

    const chart = screen.getByTestId('apex-chart')
    const options = JSON.parse(chart.dataset.options ?? '{}')
    const series = JSON.parse(chart.dataset.series ?? '[]')

    expect(options.xaxis.categories).toEqual(['2026/07'])
    expect(series).toEqual([
      { name: 'Income', data: [0] },
      { name: 'Expense', data: [2311] },
    ])
    expect(chart.closest('[aria-hidden="true"]')?.className).toContain(
      'h-[220px]'
    )
    expect(chart.closest('[data-report-chart]')?.className).toContain('h-full')
    expect(screen.queryByText('0 TWD')).not.toBeNull()
    expect(screen.queryByText('2,311 TWD')).not.toBeNull()
  })
})
