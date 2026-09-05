import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  PiCaretDownBold,
  PiCaretUpBold,
  PiCircleFill,
  PiCurrencyDollarBold,
} from 'react-icons/pi'
import { TransactionCalendarSummary } from '@/entities/transaction'
import { TransactionCalendarVisibleRange } from '@/hooks/transactionQueryUtils'
import WeekStrip from './WeekStrip'
import MonthGrid from './MonthGrid'
import {
  formatCalendarDate,
  getMonthGridVisibleRange,
  getWeekVisibleRange,
  parseCalendarDate,
} from './calendarUtils'

export type CalendarDisplayMode = 'dot' | 'amount'

type Props = {
  currency?: string
  selectedDate: string | null
  onSelectDate: (date: string | null) => void
  calendarSummaries: Record<string, TransactionCalendarSummary>
  onVisibleRangeChange?: (range: TransactionCalendarVisibleRange) => void
  onQueryRangeChange?: (range: TransactionCalendarVisibleRange) => void
  onDisplayMonthChange?: (month: string) => void
  viewMode?: 'week' | 'month'
  onViewModeChange?: (mode: 'week' | 'month') => void
}

export default function TransactionCalendar({
  currency = 'TWD',
  selectedDate,
  onSelectDate,
  calendarSummaries,
  onVisibleRangeChange,
  onQueryRangeChange,
  onDisplayMonthChange,
  viewMode: controlledViewMode,
  onViewModeChange,
}: Props) {
  const t = useTranslations()

  const [internalViewMode, setInternalViewMode] = useState<'week' | 'month'>(
    'week'
  )
  const viewMode = controlledViewMode ?? internalViewMode
  const setViewMode = (next: 'week' | 'month') => {
    if (controlledViewMode === undefined) setInternalViewMode(next)
    onViewModeChange?.(next)
  }
  const [displayMode, setDisplayMode] = useState<CalendarDisplayMode>(() => {
    if (typeof window === 'undefined') return 'amount'
    const stored = window.localStorage.getItem('calendar-display-mode')
    return stored === 'dot' ? 'dot' : 'amount'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('calendar-display-mode', displayMode)
  }, [displayMode])

  const [displayMonth, setDisplayMonth] = useState(() =>
    selectedDate ? parseCalendarDate(selectedDate) : dayjs()
  )

  const visibleRange = useMemo(
    () =>
      viewMode === 'week'
        ? getWeekVisibleRange(displayMonth)
        : getMonthGridVisibleRange(displayMonth),
    [displayMonth, viewMode]
  )

  useEffect(() => {
    onVisibleRangeChange?.(visibleRange)
  }, [onVisibleRangeChange, visibleRange])

  useEffect(() => {
    onQueryRangeChange?.(getMonthGridVisibleRange(displayMonth))
  }, [displayMonth, onQueryRangeChange])

  useEffect(() => {
    onDisplayMonthChange?.(formatCalendarDate(displayMonth.startOf('month')))
  }, [displayMonth, onDisplayMonthChange])

  function handleChangeWeek(weekDate: dayjs.Dayjs) {
    setDisplayMonth(weekDate)
  }

  function handleChangeMonth(month: dayjs.Dayjs) {
    setDisplayMonth(month)
  }

  function handleMonthSelectDate(date: string | null) {
    if (date) {
      setDisplayMonth(parseCalendarDate(date))
    }
    onSelectDate(date)
  }

  function toggleViewMode() {
    if (viewMode === 'month') {
      const anchor = selectedDate ? parseCalendarDate(selectedDate) : dayjs()
      setDisplayMonth(anchor)
    }
    setViewMode(viewMode === 'week' ? 'month' : 'week')
  }

  function toggleDisplayMode() {
    setDisplayMode((mode) => (mode === 'dot' ? 'amount' : 'dot'))
  }

  return (
    <div className="w-full" data-testid="transaction-calendar">
      <div className="mb-1 flex justify-end">
        <button
          type="button"
          aria-label={
            displayMode === 'dot'
              ? t('calendar.toggleDisplay.showAmountsAria')
              : t('calendar.toggleDisplay.showDotsAria')
          }
          title={
            displayMode === 'dot'
              ? t('calendar.toggleDisplay.showAmountsTitle')
              : t('calendar.toggleDisplay.showDotsTitle')
          }
          className="flex size-6 p-1 items-center justify-center rounded-full bg-secondary text-secondary-foreground outline-none transition-colors hover:bg-accent/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          onClick={toggleDisplayMode}
        >
          {displayMode === 'dot' ? (
            <PiCurrencyDollarBold aria-hidden="true" size={24} />
          ) : (
            <PiCircleFill
              aria-hidden="true"
              className="text-emphasis"
              size={24}
            />
          )}
        </button>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {viewMode === 'week' ? (
          <motion.div
            key="week"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <WeekStrip
              selectedDate={selectedDate}
              currentWeekDate={displayMonth}
              onSelectDate={onSelectDate}
              onChangeWeek={handleChangeWeek}
              calendarSummaries={calendarSummaries}
              displayMode={displayMode}
            />
          </motion.div>
        ) : (
          <motion.div
            key="month"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <MonthGrid
              currency={currency}
              selectedDate={selectedDate}
              displayMonth={displayMonth}
              onSelectDate={handleMonthSelectDate}
              onChangeMonth={handleChangeMonth}
              calendarSummaries={calendarSummaries}
              displayMode={displayMode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center pt-2">
        <button
          type="button"
          aria-label={
            viewMode === 'week'
              ? t('calendar.toggleView.expandAria')
              : t('calendar.toggleView.collapseAria')
          }
          aria-expanded={viewMode === 'month'}
          className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground outline-none transition-colors hover:bg-accent/25 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          onClick={toggleViewMode}
        >
          {viewMode === 'week' ? (
            <PiCaretDownBold aria-hidden="true" size={12} />
          ) : (
            <PiCaretUpBold aria-hidden="true" size={12} />
          )}
        </button>
      </div>
    </div>
  )
}
