import { render, screen, fireEvent } from '@testing-library/react'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import TimeRangeSelector from '../src/components/report/TimeRangeSelector'

dayjs.extend(isoWeek)

jest.mock('@heroui/react', () => ({
  Button: ({ children, color, onPress, variant }: any) => (
    <button
      type="button"
      data-color={color}
      data-variant={variant}
      onClick={() => onPress?.()}
    >
      {children}
    </button>
  ),
  DateRangePicker: ({ isDisabled, onChange, value }: any) => (
    <div>
      <div data-testid="picker-disabled">{String(Boolean(isDisabled))}</div>
      <div data-testid="picker-value">
        {value
          ? `${value.start.year}/${String(value.start.month).padStart(
              2,
              '0'
            )}/${String(value.start.day).padStart(2, '0')}~${
              value.end.year
            }/${String(value.end.month).padStart(2, '0')}/${String(
              value.end.day
            ).padStart(2, '0')}`
          : 'empty'}
      </div>
      <button
        type="button"
        onClick={() =>
          onChange?.({
            start: { year: 2026, month: 5, day: 1 },
            end: { year: 2026, month: 5, day: 4 },
          })
        }
      >
        Change Range
      </button>
    </div>
  ),
}))

describe('TimeRangeSelector', () => {
  it('starts with this-week preset active', () => {
    const now = dayjs()
    const value = {
      startDate: now.startOf('isoWeek').format('YYYY/MM/DD'),
      endDate: now.endOf('isoWeek').format('YYYY/MM/DD'),
    }

    render(<TimeRangeSelector value={value} onChange={jest.fn()} />)

    expect(screen.getByText('This Week').getAttribute('data-variant')).toBe(
      'solid'
    )
    expect(screen.getByText('This Week').getAttribute('data-color')).toBe(
      'warning'
    )
  })

  it('keeps the picker interactive after selecting All', () => {
    const onChange = jest.fn()
    const now = dayjs()
    const value = {
      startDate: now.startOf('isoWeek').format('YYYY/MM/DD'),
      endDate: now.endOf('isoWeek').format('YYYY/MM/DD'),
    }

    render(<TimeRangeSelector value={value} onChange={onChange} />)

    fireEvent.click(screen.getByText('All'))

    expect(onChange).toHaveBeenCalledWith(null)
    expect(screen.getByTestId('picker-disabled').textContent).toBe('false')

    fireEvent.click(screen.getByText('Change Range'))

    expect(onChange).toHaveBeenLastCalledWith({
      startDate: '2026/05/01',
      endDate: '2026/05/04',
    })
  })
})
