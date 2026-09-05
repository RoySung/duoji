import { useState } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import TransactionCalendar from '../src/components/calendar/TransactionCalendar'
import type { TransactionCalendarVisibleRange } from '../src/hooks/transactionQueryUtils'

jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  motion: {
    div: (
      props: React.HTMLAttributes<HTMLDivElement> & {
        animate?: unknown
        exit?: unknown
        initial?: unknown
        transition?: unknown
      }
    ) => {
      const { animate, children, exit, initial, transition, ...htmlProps } =
        props
      void animate
      void exit
      void initial
      void transition

      return <div {...htmlProps}>{children}</div>
    },
  },
}))

jest.mock('@heroui/react', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => children,
}))

const summaries = {
  '2026/03/18': {
    date: '2026/03/18',
    totalAmount: 120,
    transactionCount: 1,
    hasTransactions: true,
  },
}

type HarnessProps = {
  onQueryRangeChange?: (range: TransactionCalendarVisibleRange) => void
  onSelectDate?: (date: string | null) => void
  onVisibleRangeChange?: (range: TransactionCalendarVisibleRange) => void
}

function CalendarHarness({
  onQueryRangeChange,
  onSelectDate = jest.fn(),
  onVisibleRangeChange,
}: HarnessProps) {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')

  return (
    <TransactionCalendar
      calendarSummaries={summaries}
      currency="TWD"
      selectedDate="2026/03/18"
      viewMode={viewMode}
      onQueryRangeChange={onQueryRangeChange}
      onSelectDate={onSelectDate}
      onViewModeChange={setViewMode}
      onVisibleRangeChange={onVisibleRangeChange}
    />
  )
}

describe('TransactionCalendar presentation', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('uses a 24px display-mode control and preserves the other calendar controls', () => {
    const onSelectDate = jest.fn()

    render(<CalendarHarness onSelectDate={onSelectDate} />)

    const previousWeek = screen.getByRole('button', { name: 'Previous week' })
    const nextWeek = screen.getByRole('button', { name: 'Next week' })
    const displayToggle = screen.getByRole('button', {
      name: 'Show transaction indicator',
    })
    const viewToggle = screen.getByRole('button', {
      name: 'Expand to month view',
    })
    const selectedDay = screen.getByText('18', { selector: 'span' })
    const selectedDayButton = selectedDay.closest('button')

    expect(screen.getByTestId('transaction-calendar')).toBeTruthy()
    expect(previousWeek.classList.contains('size-11')).toBe(true)
    expect(nextWeek.classList.contains('size-11')).toBe(true)
    expect(displayToggle.classList.contains('size-6')).toBe(true)
    expect(viewToggle.classList.contains('size-8')).toBe(true)
    expect(previousWeek.querySelector('svg')?.getAttribute('width')).toBe('14')
    expect(displayToggle.querySelector('svg')?.getAttribute('width')).toBe('24')
    expect(displayToggle.querySelector('svg')?.getAttribute('height')).toBe(
      '24'
    )
    expect(viewToggle.querySelector('svg')?.getAttribute('width')).toBe('12')
    expect(screen.getByText('Wed').classList.contains('text-label')).toBe(true)
    expect(screen.getByText('$120').classList.contains('text-label')).toBe(true)
    expect(selectedDay.classList.contains('text-body')).toBe(true)
    expect(selectedDayButton?.classList.contains('min-h-[76px]')).toBe(true)
    expect(selectedDayButton?.getAttribute('aria-pressed')).toBe('true')
    expect(selectedDay.classList.contains('!bg-emphasis')).toBe(true)

    if (!selectedDayButton) {
      throw new Error('Expected the selected date to be inside a button')
    }

    fireEvent.click(selectedDayButton)
    expect(onSelectDate).toHaveBeenCalledWith(null)

    fireEvent.click(displayToggle)
    expect(
      screen
        .getByRole('button', { name: 'Show daily total amount' })
        .querySelector('svg')
        ?.getAttribute('width')
    ).toBe('24')
  })

  it('preserves week and month range behavior while toggling views', async () => {
    const onQueryRangeChange = jest.fn()
    const onVisibleRangeChange = jest.fn()

    render(
      <CalendarHarness
        onQueryRangeChange={onQueryRangeChange}
        onVisibleRangeChange={onVisibleRangeChange}
      />
    )

    await waitFor(() => {
      expect(onVisibleRangeChange).toHaveBeenLastCalledWith({
        startDate: '2026/03/16',
        endDate: '2026/03/22',
      })
    })

    fireEvent.click(screen.getByRole('button', { name: 'Previous week' }))

    await waitFor(() => {
      expect(onVisibleRangeChange).toHaveBeenLastCalledWith({
        startDate: '2026/03/09',
        endDate: '2026/03/15',
      })
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Expand to month view' })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Next month' }))

    await waitFor(() => {
      expect(onQueryRangeChange).toHaveBeenLastCalledWith({
        startDate: '2026/03/30',
        endDate: '2026/05/03',
      })
    })
  })

  it('keeps the persisted display-mode interaction intact', async () => {
    render(<CalendarHarness />)

    const displayToggle = screen.getByRole('button', {
      name: 'Show transaction indicator',
    })

    fireEvent.click(displayToggle)

    await waitFor(() => {
      expect(window.localStorage.getItem('calendar-display-mode')).toBe('dot')
    })

    expect(
      screen.getByRole('button', { name: 'Show daily total amount' })
    ).toBeTruthy()
  })
})
