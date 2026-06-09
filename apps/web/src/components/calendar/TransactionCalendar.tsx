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
    if (typeof window === 'undefined') return 'dot'
    const stored = window.localStorage.getItem('calendar-display-mode')
    return stored === 'amount' ? 'amount' : 'dot'
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
    <div>
      <div className="flex justify-end">
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
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
          onClick={toggleDisplayMode}
        >
          {displayMode === 'dot' ? (
            <PiCurrencyDollarBold size={14} />
          ) : (
            <PiCircleFill size={10} />
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
          >
            <MonthGrid
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

      <div className="flex justify-center pt-1">
        <button
          type="button"
          aria-label={
            viewMode === 'week'
              ? t('calendar.toggleView.expandAria')
              : t('calendar.toggleView.collapseAria')
          }
          className="flex h-8 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
          onClick={toggleViewMode}
        >
          {viewMode === 'week' ? (
            <PiCaretDownBold size={12} />
          ) : (
            <PiCaretUpBold size={12} />
          )}
        </button>
      </div>
    </div>
  )
}
