import { useMemo, useState } from 'react'
import { Button, DateRangePicker } from '@heroui/react'
import { CalendarDate, parseDate } from '@internationalized/date'
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

const QUICK_PRESETS: { value: TimeRangePreset; label: string }[] = [
  { value: 'thisWeek', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: '3m', label: '3 Months' },
  { value: '1y', label: '1 Year' },
  { value: 'all', label: 'All' },
]

function detectPreset(value: DateRange | null): TimeRangePreset | null {
  if (value === null) return 'all'
  for (const preset of QUICK_PRESETS) {
    if (preset.value === 'all') continue
    const resolved = resolveTimeRangePreset(preset.value)
    if (
      resolved &&
      resolved.startDate === value.startDate &&
      resolved.endDate === value.endDate
    ) {
      return preset.value
    }
  }
  return null
}

export default function TimeRangeSelector({
  value,
  onChange,
}: TimeRangeSelectorProps) {
  const [activePreset, setActivePreset] = useState<TimeRangePreset | null>(
    () => detectPreset(value)
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
    <div className="flex flex-col gap-2">
      <DateRangePicker
        value={pickerValue}
        onChange={handlePickerChange}
        size="sm"
        granularity="day"
        aria-label="Report date range"
        showMonthAndYearPickers
        firstDayOfWeek={'mon'}
      />
      <div className="flex flex-wrap gap-1">
        {QUICK_PRESETS.map((p) => (
          <Button
            key={p.value}
            size="sm"
            variant={activePreset === p.value ? 'solid' : 'flat'}
            color={activePreset === p.value ? 'warning' : 'default'}
            onPress={() => handlePresetClick(p.value)}
          >
            {p.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
