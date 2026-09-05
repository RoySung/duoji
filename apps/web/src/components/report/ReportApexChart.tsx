import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import type { ApexOptions } from 'apexcharts'
import { useTheme } from 'next-themes'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

type ReportApexChartProps = {
  options: ApexOptions
  series: ApexOptions['series']
  type: NonNullable<ApexOptions['chart']>['type']
  height?: number | string
  width?: number | string
}

/** ApexCharts does not consistently resolve CSS variables, including nested
 * axis, grid, and legend colors. Convert semantic token references without
 * mutating the caller's options so a theme change can rebuild the chart.
 */
function resolveSemanticColor(value: string): string {
  if (typeof document === 'undefined') return value

  const style = getComputedStyle(document.documentElement)
  const match = value.match(/^hsl\(var\((--[\w-]+)\)(?:\s*\/\s*([^)]+))?\)$/)
  if (!match) return value

  const tokenValue = style.getPropertyValue(match[1]).trim()
  if (!tokenValue) return value

  return `hsl(${tokenValue}${match[2] ? ` / ${match[2].trim()}` : ''})`
}

function resolveSemanticColors<T>(value: T): T {
  if (typeof value === 'string') {
    return resolveSemanticColor(value) as T
  }
  if (Array.isArray(value)) {
    return value.map(resolveSemanticColors) as T
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        resolveSemanticColors(nestedValue),
      ])
    ) as T
  }
  return value
}

export default function ReportApexChart({
  options,
  series,
  type,
  height = 320,
  width = '100%',
}: ReportApexChartProps) {
  const { resolvedTheme } = useTheme()

  const themedOptions = useMemo<ApexOptions>(() => {
    const mode: 'light' | 'dark' = resolvedTheme === 'dark' ? 'dark' : 'light'
    return resolveSemanticColors({
      ...options,
      theme: { ...(options.theme ?? {}), mode },
      chart: {
        ...(options.chart ?? {}),
        background: 'transparent',
        foreColor: 'hsl(var(--muted-foreground))',
        toolbar: { show: false, ...(options.chart?.toolbar ?? {}) },
      },
      tooltip: {
        ...(options.tooltip ?? {}),
        theme: mode,
      },
    })
  }, [options, resolvedTheme])

  const mode = resolvedTheme === 'dark' ? 'dark' : 'light'

  return (
    <div
      className="h-full min-w-0 overflow-hidden"
      data-report-chart=""
      data-chart-theme={mode}
    >
      <Chart
        options={themedOptions}
        series={series}
        type={type}
        height={height}
        width={width}
      />
    </div>
  )
}
