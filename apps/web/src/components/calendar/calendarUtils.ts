import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import {
  parseTransactionDateValue,
  TransactionDateFormat,
} from '@/utils/transactionUtils'
import { TransactionCalendarVisibleRange } from '@/hooks/transactionQueryUtils'

dayjs.extend(isoWeek)

export function getWeekDays(date: dayjs.Dayjs): dayjs.Dayjs[] {
  const startOfWeek = date.startOf('isoWeek')
  return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'))
}

export function formatCalendarDate(date: dayjs.Dayjs): string {
  return date.format(TransactionDateFormat)
}

export function parseCalendarDate(value: string): dayjs.Dayjs {
  return dayjs(parseTransactionDateValue(value).toString())
}

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function getMonthGrid(year: number, month: number): dayjs.Dayjs[][] {
  const firstOfMonth = dayjs(new Date(year, month, 1))
  const startDate = firstOfMonth.startOf('isoWeek')
  const lastOfMonth = firstOfMonth.endOf('month')
  const endDate = lastOfMonth.endOf('isoWeek')

  const weeks: dayjs.Dayjs[][] = []
  let current = startDate

  while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
    const week = getWeekDays(current)
    weeks.push(week)
    current = current.add(7, 'day')
  }

  return weeks
}

export function getWeekVisibleRange(
  date: dayjs.Dayjs
): TransactionCalendarVisibleRange {
  const days = getWeekDays(date)

  return {
    startDate: formatCalendarDate(days[0]),
    endDate: formatCalendarDate(days[days.length - 1]),
  }
}

export function getMonthGridVisibleRange(
  date: dayjs.Dayjs
): TransactionCalendarVisibleRange {
  const weeks = getMonthGrid(date.year(), date.month())
  const flattened = weeks.flat()

  return {
    startDate: formatCalendarDate(flattened[0]),
    endDate: formatCalendarDate(flattened[flattened.length - 1]),
  }
}

export function isToday(date: dayjs.Dayjs): boolean {
  return date.isSame(dayjs(), 'day')
}

export function isSameMonth(date: dayjs.Dayjs, ref: dayjs.Dayjs): boolean {
  return date.year() === ref.year() && date.month() === ref.month()
}

export function formatCompactAmount(amount: number): string {
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''
  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`
  }
  if (abs >= 1_000) {
    return `${sign}${(abs / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}k`
  }
  return `${sign}${Math.round(abs)}`
}
