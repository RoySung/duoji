import { fireEvent, render, screen } from '@testing-library/react'

import { TransactionHero } from '../src/components/transaction/TransactionHero'

const defaultProps = {
  accountBookName: 'A very long travel account book',
  onRefresh: jest.fn(),
  recordCount: '12 records',
  refreshLabel: 'Refresh transactions',
  refreshingLabel: 'Refreshing',
  sectionLabel: 'Transactions',
}

describe('TransactionHero', () => {
  beforeEach(() => {
    defaultProps.onRefresh.mockClear()
  })

  it('keeps its live content and touch-sized action operable at 320px', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 320,
    })

    render(<TransactionHero {...defaultProps} />)

    const hero = screen.getByTestId('transaction-hero')
    const content = screen.getByTestId('transaction-hero-content')
    const refresh = screen.getByRole('button', {
      name: 'Refresh transactions',
    })
    const title = screen.getByRole('heading', {
      name: 'A very long travel account book',
    })

    expect(hero.classList.contains('h-[200px]')).toBe(true)
    expect(hero.classList.contains('sm:h-[220px]')).toBe(true)
    expect(hero.classList.contains('h-[220px]')).toBe(false)
    expect(hero.classList.contains('h-[clamp(220px,39vw,300px)]')).toBe(false)
    expect(content.classList.contains('pb-12')).toBe(true)
    expect(content.classList.contains('min-[360px]:pb-16')).toBe(true)
    expect(content.classList.contains('sm:max-w-[62%]')).toBe(false)
    expect(content.classList.contains('sm:pb-[68px]')).toBe(true)
    expect(hero.textContent).toContain('A very long travel account book')
    expect(hero.textContent).toContain('12 records')
    expect(title.classList.contains('text-display')).toBe(true)
    expect(title.classList.contains('mt-1')).toBe(true)
    expect(title.classList.contains('mb-0')).toBe(true)
    expect(title.classList.contains('sm:mt-2')).toBe(true)
    expect(title.classList.contains('sm:mb-6')).toBe(true)
    expect(refresh.classList.contains('min-h-11')).toBe(true)
    expect(refresh.classList.contains('text-body')).toBe(true)
    expect(refresh.querySelector('svg')?.getAttribute('width')).toBe('14')
    expect((refresh as HTMLButtonElement).disabled).toBe(false)

    fireEvent.click(refresh)
    expect(defaultProps.onRefresh).toHaveBeenCalledTimes(1)
  })

  it('retains the semantic fallback when either decorative asset fails', () => {
    render(<TransactionHero {...defaultProps} />)

    fireEvent.error(screen.getByTestId('transaction-hero-background'))
    fireEvent.error(screen.getByTestId('transaction-hero-travel'))

    expect(screen.queryByTestId('transaction-hero-background')).toBeNull()
    expect(screen.queryByTestId('transaction-hero-travel')).toBeNull()
    expect(
      screen.getByRole('heading', { name: 'A very long travel account book' })
    ).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Refresh transactions' })
    ).toBeTruthy()
    expect(screen.getByTestId('transaction-hero').textContent).toContain(
      '12 records'
    )
  })
})
