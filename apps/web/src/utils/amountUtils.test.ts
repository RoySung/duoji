import { formatAmount } from './amountUtils'

describe('formatAmount', () => {
  it('formats amount with default options preserving decimals and adding thousand separators', () => {
    expect(formatAmount(1234.56, 'TWD')).toBe('1,234.56 TWD')
    expect(formatAmount(1234, 'USD')).toBe('1,234 USD')
    expect(formatAmount(0, 'JPY')).toBe('0 JPY')
  })

  it('formats amount with currency parameter as suffix by default', () => {
    expect(formatAmount(1234.56, 'TWD')).toBe('1,234.56 TWD')
  })

  it('formats amount with currency parameter as prefix when currencyPosition is prefix', () => {
    expect(
      formatAmount(151, 'TWD', {
        currencyPosition: 'prefix',
      })
    ).toBe('TWD 151')
  })

  it('handles roundMode ceil correctly', () => {
    expect(formatAmount(150.2, 'TWD', { roundMode: 'ceil' })).toBe('151 TWD')
    expect(formatAmount(150.8, 'USD', { roundMode: 'ceil' })).toBe('151 USD')
  })

  it('handles roundMode round correctly', () => {
    expect(formatAmount(150.2, 'TWD', { roundMode: 'round' })).toBe('150 TWD')
    expect(formatAmount(150.8, 'JPY', { roundMode: 'round' })).toBe('151 JPY')
  })

  it('handles roundMode floor correctly', () => {
    expect(formatAmount(150.8, 'USD', { roundMode: 'floor' })).toBe('150 USD')
  })

  it('handles invalid numbers gracefully', () => {
    expect(formatAmount(NaN, 'TWD')).toBe('0 TWD')
  })
})
