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

/**
 * Resolve `hsl(var(--some-var))` strings to actual computed color values so
 * ApexCharts (which doesn't natively parse CSS variables) gets real colors.
 * Falls back to the original string on SSR or if the variable is not found.
 */
function resolveColors(colors: string[] | undefined): string[] | undefined {
  if (!colors || typeof document === 'undefined') return colors
  const style = getComputedStyle(document.documentElement)
  return colors.map((color) => {
    const match = color.match(/^hsl\(var\((--[\w-]+)\)\)$/)
    if (match) {
      const value = style.getPropertyValue(match[1]).trim()
      return value ? `hsl(${value})` : color
    }
    return color
  })
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
    return {
      ...options,
      // Resolve CSS-variable color strings so ApexCharts receives real values.
      // This runs whenever the theme changes, so dark/light colors update correctly.
      colors: resolveColors(options.colors),
      theme: { ...(options.theme ?? {}), mode },
      chart: {
        ...(options.chart ?? {}),
        background: 'transparent',
        foreColor: 'hsl(var(--foreground))',
        toolbar: { show: false, ...(options.chart?.toolbar ?? {}) },
      },
      tooltip: {
        ...(options.tooltip ?? {}),
        theme: mode,
      },
    }
  }, [options, resolvedTheme])

  return (
    <Chart
      options={themedOptions}
      series={series}
      type={type}
      height={height}
      width={width}
    />
  )
}
