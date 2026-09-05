import { useMemo, useState } from 'react'
import { Button, DateRangePicker } from '@heroui/react'
import { CalendarDate, parseDate } from '@internationalized/date'
import { useTranslations } from 'next-intl'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { TimeRangePreset } from './reportTypes'

type CalendarRange = { start: CalendarDate; end: CalendarDate }
type DateRange = { startDate: string; endDate: string }

dayjs.extend(isoWeek)

type TimeRangeSelectorProps = {
  value: DateRange | null
  onChange: (range: DateRange | null) => void
}

// CalendarDate ↔ 'YYYY/MM/DD' bridge utilities
function stringToCalendarDate(s: string): CalendarDate {
  return parseDate(s.replace(/\//g, '-')) as CalendarDate
}

function calendarDateToString(d: CalendarDate): string {
  return `${d.year}/${String(d.month).padStart(2, '0')}/${String(
    d.day
  ).padStart(2, '0')}`
}

function resolveTimeRangePreset(preset: TimeRangePreset): DateRange | null {
  const today = dayjs()

  switch (preset) {
    case 'thisWeek':
      return {
        startDate: today.startOf('isoWeek').format('YYYY/MM/DD'),
        endDate: today.endOf('isoWeek').format('YYYY/MM/DD'),
      }
    case 'month':
      return {
        startDate: today.startOf('month').format('YYYY/MM/DD'),
        endDate: today.endOf('month').format('YYYY/MM/DD'),
      }
    case '3m':
      return {
        startDate: today.subtract(3, 'month').format('YYYY/MM/DD'),
        endDate: today.format('YYYY/MM/DD'),
      }
    case '1y':
      return {
        startDate: today.subtract(1, 'year').format('YYYY/MM/DD'),
        endDate: today.format('YYYY/MM/DD'),
      }
    case 'all':
      return null
  }
}

const QUICK_PRESET_VALUES: TimeRangePreset[] = [
  'thisWeek',
  'month',
  '3m',
  '1y',
  'all',
]

function detectPreset(value: DateRange | null): TimeRangePreset | null {
  if (value === null) return 'all'
  for (const preset of QUICK_PRESET_VALUES) {
    if (preset === 'all') continue
    const resolved = resolveTimeRangePreset(preset)
    if (
      resolved &&
      resolved.startDate === value.startDate &&
      resolved.endDate === value.endDate
    ) {
      return preset
    }
  }
  return null
}

const PRESET_LABEL_KEYS: Record<TimeRangePreset, string> = {
  thisWeek: 'thisWeek',
  month: 'thisMonth',
  '3m': 'threeMonths',
  '1y': 'oneYear',
  all: 'all',
}

export default function TimeRangeSelector({
  value,
  onChange,
}: TimeRangeSelectorProps) {
  const t = useTranslations()
  const [activePreset, setActivePreset] = useState<TimeRangePreset | null>(() =>
    detectPreset(value)
  )

  const pickerValue = useMemo((): CalendarRange | null => {
    if (!value) return null
    return {
      start: stringToCalendarDate(value.startDate),
      end: stringToCalendarDate(value.endDate),
    }
  }, [value])

  function handlePickerChange(range: CalendarRange | null) {
    setActivePreset(null)
    if (!range) {
      onChange(null)
      return
    }
    onChange({
      startDate: calendarDateToString(range.start),
      endDate: calendarDateToString(range.end),
    })
  }

  function handlePresetClick(preset: TimeRangePreset) {
    setActivePreset(preset)
    onChange(resolveTimeRangePreset(preset))
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <DateRangePicker
        value={pickerValue}
        onChange={handlePickerChange}
        size="sm"
        granularity="day"
        aria-label={t('report.dateRangeAria')}
        showMonthAndYearPickers
        firstDayOfWeek={'mon'}
        className="w-full"
        classNames={{
          inputWrapper:
            'min-h-11 rounded-xl border border-input bg-background shadow-none transition-colors hover:border-primary/50 data-[focus=true]:border-primary data-[focus=true]:ring-2 data-[focus=true]:ring-ring/25',
          input: 'text-body',
          label: 'text-label',
        }}
      />
      <div className="flex flex-wrap gap-2">
        {QUICK_PRESET_VALUES.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={activePreset === p ? 'solid' : 'flat'}
            color={activePreset === p ? 'warning' : 'default'}
            onPress={() => handlePresetClick(p)}
            aria-pressed={activePreset === p}
            className={
              activePreset === p
                ? 'min-h-11 rounded-full bg-emphasis px-3 text-body text-emphasis-contrast hover:bg-emphasis/90 focus-visible:ring-2 focus-visible:ring-ring'
                : 'min-h-11 rounded-full bg-secondary px-3 text-body text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-ring'
            }
          >
            {t(`report.presets.${PRESET_LABEL_KEYS[p]}`)}
          </Button>
        ))}
      </div>
    </div>
  )
}
