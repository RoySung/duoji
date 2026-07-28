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
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
          onClick={() => onChangeMonth(displayMonth.subtract(1, 'month'))}
        >
          <PiCaretLeftBold size={14} />
        </button>
        <span className="text-sm font-semibold text-foreground">
          {displayMonth.format('MMMM YYYY')}
        </span>
        <button
          type="button"
          aria-label="Next month"
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
          onClick={() => onChangeMonth(displayMonth.add(1, 'month'))}
        >
          <PiCaretRightBold size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-1 text-center text-xs text-muted-foreground"
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
              className={`flex flex-col items-center gap-0.5 rounded-xl py-1 hover:bg-accent ${
                !inMonth ? 'text-muted-foreground/40' : ''
              }`}
              onClick={() => onSelectDate(isSelected ? null : dateStr)}
            >
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
