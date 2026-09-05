import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'

import { AppButton } from '../src/components/ui/AppButton'

jest.mock('@heroui/react', () => {
  const React = jest.requireActual<typeof import('react')>('react')
  const HeroUIButtonMock = React.forwardRef(
    function HeroUIButtonMock(
      {
        color,
        variant,
        isDisabled,
        isLoading,
        onPress,
        onClick,
        ...props
      }: {
        color?: string
        variant?: string
        isDisabled?: boolean
        isLoading?: boolean
        onPress?: () => void
        onClick?: React.MouseEventHandler<HTMLButtonElement>
      } & React.ButtonHTMLAttributes<HTMLButtonElement>,
      ref: React.ForwardedRef<HTMLButtonElement>
    ) {
      return (
        <button
          {...props}
          ref={ref}
          data-color={color}
          disabled={isDisabled}
          data-loading={String(Boolean(isLoading))}
          data-variant={variant}
          onClick={(event) => {
            onClick?.(event)
            onPress?.()
          }}
        />
      )
    }
  )

  HeroUIButtonMock.displayName = 'HeroUIButtonMock'

  return {
    Button: HeroUIButtonMock,
  }
})

describe('AppButton', () => {
  it.each([
    ['primary', 'primary'],
    ['danger', 'danger'],
    ['success', 'success'],
    ['warning', 'warning'],
    ['neutral', 'default'],
  ] as const)('maps %s tone to the %s HeroUI color', (tone, color) => {
    render(<AppButton tone={tone}>Action</AppButton>)

    const button = screen.getByRole('button', { name: 'Action' })
    expect(button.getAttribute('data-color')).toBe(color)
    expect(button.getAttribute('data-variant')).toBe('solid')
  })

  it.each(['solid', 'flat', 'light', 'ghost'] as const)(
    'maps %s appearance to the matching HeroUI variant',
    (appearance) => {
      render(<AppButton appearance={appearance}>Action</AppButton>)

      expect(
        screen.getByRole('button', { name: 'Action' }).getAttribute('data-variant')
      ).toBe(appearance)
    }
  )

  it('keeps non-solid and warning treatments free of a white-text override', () => {
    const { rerender } = render(
      <AppButton tone="warning">Warning</AppButton>
    )

    expect(screen.getByRole('button', { name: 'Warning' }).className).not.toContain(
      'text-white'
    )

    rerender(
      <AppButton appearance="flat" className="feature-button">
        Cancel
      </AppButton>
    )

    const button = screen.getByRole('button', { name: 'Cancel' })
    expect(button.getAttribute('data-variant')).toBe('flat')
    expect(button.className).toBe('feature-button')
  })

  it.each(['primary', 'danger', 'success'] as const)(
    'uses the shared white foreground override for disabled solid %s actions',
    (tone) => {
      render(
        <AppButton isDisabled tone={tone}>
          Action
        </AppButton>
      )

      expect(screen.getByRole('button', { name: 'Action' }).className).toContain(
        '!text-white'
      )
    }
  )

  it('forwards disabled, loading, keyboard, press, ARIA, test-id, and ref behavior', () => {
    const onKeyDown = jest.fn()
    const onPress = jest.fn()
    const ref = createRef<HTMLButtonElement>()

    render(
      <AppButton
        aria-label="Save transaction"
        data-testid="save-transaction"
        isDisabled
        isLoading
        onKeyDown={onKeyDown}
        onPress={onPress}
        ref={ref}
      >
        Save
      </AppButton>
    )

    const button = screen.getByTestId('save-transaction')
    expect(button).toBe(ref.current)
    expect(button.hasAttribute('disabled')).toBe(true)
    expect(button.getAttribute('aria-label')).toBe('Save transaction')
    expect(button.getAttribute('data-loading')).toBe('true')

    fireEvent.keyDown(button, { key: 'Enter' })
    fireEvent.click(button)

    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onPress).not.toHaveBeenCalled()
  })

  it('preserves HeroUI press handling for enabled actions', () => {
    const onPress = jest.fn()

    render(<AppButton onPress={onPress}>Save</AppButton>)
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
