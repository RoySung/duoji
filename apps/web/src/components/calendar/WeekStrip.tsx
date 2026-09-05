import dayjs from 'dayjs'
import { Tooltip } from '@heroui/react'
import { PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi'
import { TransactionCalendarSummary } from '@/entities/transaction'
import {
  getWeekDays,
  formatCalendarDate,
  isToday,
  DAY_LABELS,
  formatCompactAmount,
} from './calendarUtils'
import type { CalendarDisplayMode } from './TransactionCalendar'

type Props = {
  selectedDate: string | null
  currentWeekDate: dayjs.Dayjs
  onSelectDate: (date: string | null) => void
  onChangeWeek: (weekDate: dayjs.Dayjs) => void
  calendarSummaries: Record<string, TransactionCalendarSummary>
  displayMode: CalendarDisplayMode
}

export default function WeekStrip({
  selectedDate,
  currentWeekDate,
  onSelectDate,
  onChangeWeek,
  calendarSummaries,
  displayMode,
}: Props) {
  const days = getWeekDays(currentWeekDate)

  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <button
        type="button"
        aria-label="Previous week"
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-accent/25 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        onClick={() => onChangeWeek(currentWeekDate.subtract(7, 'day'))}
      >
        <PiCaretLeftBold aria-hidden="true" size={14} />
      </button>

      <div className="grid min-w-0 flex-1 grid-cols-7 gap-0.5 sm:gap-1">
        {days.map((day, i) => {
          const dateStr = formatCalendarDate(day)
          const isSelected = selectedDate === dateStr
          const today = isToday(day)
          const summary = calendarSummaries[dateStr]
          const hasTransaction = summary?.hasTransactions ?? false

          const button = (
            <button
              key={dateStr}
              type="button"
              aria-pressed={isSelected}
              className="flex min-h-[76px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-2 outline-none transition-colors hover:bg-accent/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              onClick={() => onSelectDate(isSelected ? null : dateStr)}
            >
              <span className="text-label font-medium text-muted-foreground">
                {DAY_LABELS[i]}
              </span>
              <span
                className={`flex size-9 items-center justify-center rounded-full text-body font-semibold transition-colors max-[359px]:size-7 ${
                  isSelected
                    ? '!bg-emphasis !text-emphasis-contrast'
                    : today
                    ? 'ring-2 ring-primary/60 ring-offset-2 ring-offset-card'
                    : ''
                }`}
              >
                {day.date()}
              </span>
              <span className="flex h-3 max-w-full items-center justify-center truncate text-label font-semibold leading-3 text-emphasis-foreground">
                {displayMode === 'amount' ? (
                  hasTransaction ? (
                    `$${formatCompactAmount(summary.totalAmount)}`
                  ) : (
                    ''
                  )
                ) : hasTransaction ? (
                  <span className="size-1.5 rounded-full bg-emphasis" />
                ) : null}
              </span>
            </button>
          )

          return hasTransaction && displayMode !== 'amount' ? (
            <Tooltip
              key={dateStr}
              content={`$${summary.totalAmount.toLocaleString()}`}
              placement="top"
              size="sm"
            >
              {button}
            </Tooltip>
          ) : (
            button
          )
        })}
      </div>

      <button
        type="button"
        aria-label="Next week"
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-accent/25 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        onClick={() => onChangeWeek(currentWeekDate.add(7, 'day'))}
      >
        <PiCaretRightBold aria-hidden="true" size={14} />
      </button>
    </div>
  )
}
