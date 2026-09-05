import dayjs from 'dayjs'
import { Tooltip } from '@heroui/react'
import { PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi'
import { TransactionCalendarSummary } from '@/entities/transaction'
import {
  getMonthGrid,
  formatCalendarDate,
  isToday,
  isSameMonth,
  DAY_LABELS,
  formatCompactAmount,
} from './calendarUtils'
import type { CalendarDisplayMode } from './TransactionCalendar'
import { formatAmount } from '@/utils/amountUtils'

type Props = {
  currency: string
  selectedDate: string | null
  displayMonth: dayjs.Dayjs
  onSelectDate: (date: string | null) => void
  onChangeMonth: (month: dayjs.Dayjs) => void
  calendarSummaries: Record<string, TransactionCalendarSummary>
  displayMode: CalendarDisplayMode
}

export default function MonthGrid({
  currency,
  selectedDate,
  displayMonth,
  onSelectDate,
  onChangeMonth,
  calendarSummaries,
  displayMode,
}: Props) {
  const weeks = getMonthGrid(displayMonth.year(), displayMonth.month())

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          type="button"
          aria-label="Previous month"
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-accent/25 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          onClick={() => onChangeMonth(displayMonth.subtract(1, 'month'))}
        >
          <PiCaretLeftBold aria-hidden="true" size={14} />
        </button>
        <time
          className="min-w-0 truncate text-body font-semibold text-foreground"
          dateTime={displayMonth.format('YYYY-MM')}
        >
          {displayMonth.format('MMMM YYYY')}
        </time>
        <button
          type="button"
          aria-label="Next month"
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-accent/25 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          onClick={() => onChangeMonth(displayMonth.add(1, 'month'))}
        >
          <PiCaretRightBold aria-hidden="true" size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-1 text-center text-label font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}

        {weeks.flat().map((day) => {
          const dateStr = formatCalendarDate(day)
          const isSelected = selectedDate === dateStr
          const today = isToday(day)
          const summary = calendarSummaries[dateStr]
          const hasTransaction = summary?.hasTransactions ?? false
          const inMonth = isSameMonth(day, displayMonth)

          const button = (
            <button
              key={dateStr}
              type="button"
              aria-pressed={isSelected}
              className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1 outline-none transition-colors hover:bg-accent/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
                !inMonth ? 'text-muted-foreground/50' : ''
              }`}
              onClick={() => onSelectDate(isSelected ? null : dateStr)}
            >
              <span
                className={`flex size-8 items-center justify-center rounded-full text-body font-semibold transition-colors ${
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
              content={formatAmount(summary.totalAmount, currency)}
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
    </div>
  )
}
