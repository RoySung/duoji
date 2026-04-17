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
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Previous week"
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
        onClick={() => onChangeWeek(currentWeekDate.subtract(7, 'day'))}
      >
        <PiCaretLeftBold size={14} />
      </button>

      <div className="grid flex-1 grid-cols-7 gap-1">
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
              className="flex flex-col items-center gap-1 rounded-xl py-2 hover:bg-accent"
              onClick={() => onSelectDate(isSelected ? null : dateStr)}
            >
              <span className="text-xs text-muted-foreground">
                {DAY_LABELS[i]}
              </span>
              <span
                className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : today
                    ? 'ring-2 ring-primary/50'
                    : ''
                }`}
              >
                {day.date()}
              </span>
              <span className="flex h-3 items-center justify-center text-[10px] font-medium leading-3 text-primary">
                {displayMode === 'amount'
                  ? hasTransaction
                    ? `$${formatCompactAmount(summary.totalAmount)}`
                    : ''
                  : hasTransaction && (
                      <span className="size-1 rounded-full bg-primary" />
                    )}
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
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
        onClick={() => onChangeWeek(currentWeekDate.add(7, 'day'))}
      >
        <PiCaretRightBold size={14} />
      </button>
    </div>
  )
}
