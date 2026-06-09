import { act, renderHook } from '@testing-library/react'
import { useAmountInputValue } from '../src/components/TransactionModal/useAmountInputValue'

describe('useAmountInputValue', () => {
  it('clears the displayed value when focused with zero amount', () => {
    const onAmountChange = jest.fn()
    const { result } = renderHook(() =>
      useAmountInputValue({
        amount: 0,
        onAmountChange,
      })
    )

    expect(result.current.inputValue).toBe('0')

    act(() => {
      result.current.handleFocus()
    })

    expect(result.current.inputValue).toBe('')
    expect(onAmountChange).not.toHaveBeenCalled()

    act(() => {
      result.current.handleBlur()
    })

    expect(result.current.inputValue).toBe('0')
  })

  it('keeps non-zero values visible on focus', () => {
    const { result } = renderHook(() =>
      useAmountInputValue({
        amount: 128,
        onAmountChange: jest.fn(),
      })
    )

    act(() => {
      result.current.handleFocus()
    })

    expect(result.current.inputValue).toBe('128')
  })
})
