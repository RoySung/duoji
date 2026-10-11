import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import type { ApexOptions } from 'apexcharts'
import { useTheme } from 'next-themes'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
const SEMANTIC_COLOR_PATTERN =
  /^hsl\(var\((--[\w-]+)\)(?:\s*\/\s*([^)]+))?\)$/

type ReportApexChartProps = {
  options: ApexOptions
  series: ApexOptions['series']
  type: NonNullable<ApexOptions['chart']>['type']
  height?: number | string
  width?: number | string
  allowTooltipOverflow?: boolean
}

/** ApexCharts does not consistently resolve CSS variables, including nested
 * axis, grid, and legend colors. Convert semantic token references without
 * mutating the caller's options so a theme change can rebuild the chart.
 */
function resolveSemanticColor(
  value: string,
  style: CSSStyleDeclaration | null
): string {
  const match = value.match(SEMANTIC_COLOR_PATTERN)
  if (!match || !style) return value

  const tokenValue = style.getPropertyValue(match[1]).trim()
  if (!tokenValue) return value

  return `hsl(${tokenValue}${match[2] ? ` / ${match[2].trim()}` : ''})`
}

function resolveSemanticColors<T>(
  value: T,
  style: CSSStyleDeclaration | null
): T {
  if (typeof value === 'string') {
    return resolveSemanticColor(value, style) as T
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveSemanticColors(item, style)) as T
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        resolveSemanticColors(nestedValue, style),
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
  allowTooltipOverflow = false,
}: ReportApexChartProps) {
  const { resolvedTheme } = useTheme()

  const themedOptions = useMemo<ApexOptions>(() => {
    const mode: 'light' | 'dark' = resolvedTheme === 'dark' ? 'dark' : 'light'
    const style =
      typeof document === 'undefined'
        ? null
        : getComputedStyle(document.documentElement)
    return resolveSemanticColors(
      {
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
      },
      style
    )
  }, [options, resolvedTheme])

  const mode = resolvedTheme === 'dark' ? 'dark' : 'light'

  return (
    <div
      className={`h-full min-w-0 ${
        allowTooltipOverflow ? 'overflow-visible' : 'overflow-hidden'
      }`}
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
