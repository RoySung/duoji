import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import Login from '../src/pages/login'
import StepShell from '../src/components/onboarding/StepShell'
import OnboardingWelcomeModal from '../src/components/onboarding/OnboardingWelcomeModal'

const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockMarkOnboardingComplete = jest.fn()

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/account-books/[id]',
    query: { id: 'book-1', onboarding: 'welcome', source: 'test' },
    push: mockPush,
    replace: mockReplace,
  }),
}))

jest.mock('../src/stores/settings', () => ({
  useSettingsStore: (selector: (state: object) => unknown) =>
    selector({ markOnboardingComplete: mockMarkOnboardingComplete }),
}))

jest.mock('@heroui/toast', () => ({
  ToastProvider: () => null,
}))

jest.mock('@heroui/react', () => ({
  HeroUIProvider: ({ children }: { children: ReactNode }) => children,
  Button: ({
    children,
    className,
    isDisabled,
    isLoading,
    onPress,
  }: {
    children: ReactNode
    className?: string
    isDisabled?: boolean
    isLoading?: boolean
    onPress?: () => void
  }) => (
    <button
      type="button"
      className={className}
      disabled={isDisabled || isLoading}
      onClick={onPress}
    >
      {children}
    </button>
  ),
  Modal: ({
    children,
    classNames,
    isOpen,
  }: {
    children: ReactNode
    classNames?: Record<string, string>
    isOpen?: boolean
  }) =>
    isOpen ? (
      <div role="dialog" className={classNames?.base}>
        {children}
      </div>
    ) : null,
  ModalContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  ModalBody: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ModalFooter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

jest.mock('@heroui/button', () => ({
  Button: ({
    children,
    className,
    onPress,
  }: {
    children: ReactNode
    className?: string
    onPress?: () => void
  }) => (
    <button type="button" className={className} onClick={onPress}>
      {children}
    </button>
  ),
}))

describe('onboarding presentation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMarkOnboardingComplete.mockResolvedValue(undefined)
    mockReplace.mockResolvedValue(true)
  })

  it('uses the shared entry shell and surface for login without changing navigation', () => {
    render(Login.getLayout(<Login />))

    expect(screen.getByTestId('entry-header').textContent).toContain('Duoji')
    expect(document.querySelector('[data-ui="entry-shell"]')).toBeTruthy()
    expect(document.querySelector('[data-ui="surface-card"]')).toBeTruthy()

    const heading = screen.getByRole('heading', { level: 1, name: 'Duoji' })
    expect(heading.className).toContain('text-headline')
    const loginIcon = document.querySelector('[data-ui="login-page"] svg')
    expect(loginIcon?.getAttribute('class')).toContain('size-6')

    const login = screen.getByRole('button', { name: 'Login' })
    expect(login.className).toContain('min-h-11')
    fireEvent.click(login)
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('exposes step progress and keeps back and skip actions touch-sized', () => {
    const onBack = jest.fn()
    const onSkip = jest.fn()

    render(
      <StepShell
        currentStep={2}
        totalSteps={3}
        title="Set up your profile"
        description="A deliberately long description remains inside the centered onboarding surface."
        onBack={onBack}
        onSkip={onSkip}
      >
        <label>
          Your name
          <input />
        </label>
      </StepShell>
    )

    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe(
      '2'
    )
    expect(screen.getByRole('progressbar').getAttribute('aria-valuemax')).toBe(
      '3'
    )
    const surface = document.querySelector('[data-ui="surface-card"]')
    expect(surface?.className).toContain('rounded-2xl')
    expect(surface?.className).toContain('border-border')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Set up your profile' })
        .className
    ).toContain('text-headline')
    expect(
      screen.getByText(
        'A deliberately long description remains inside the centered onboarding surface.'
      ).className
    ).toContain('text-body')

    const back = screen.getByRole('button', { name: 'Back' })
    const skip = screen.getByRole('button', { name: 'Skip this step' })
    expect(back.className).toContain('min-h-11')
    expect(skip.className).toContain('min-h-11')
    fireEvent.click(back)
    fireEvent.click(skip)
    expect(onBack).toHaveBeenCalledTimes(1)
    expect(onSkip).toHaveBeenCalledTimes(1)
  })

  it('keeps the welcome completion callback and removes only its query parameter', async () => {
    render(<OnboardingWelcomeModal />)

    const dialog = screen.getByRole('dialog')
    expect(dialog.className).toContain('rounded-2xl')
    expect(dialog.className).toContain('border-border')
    expect(dialog.className).toContain('bg-card')
    expect(
      screen.getByRole('heading', { name: 'Welcome to DuoJi!' }).className
    ).toContain('text-title')

    const complete = screen.getByRole('button', {
      name: 'Log my first expense',
    })
    expect(complete.className).toContain('min-h-11')
    fireEvent.click(complete)

    await waitFor(() => {
      expect(mockMarkOnboardingComplete).toHaveBeenCalledTimes(1)
      expect(mockReplace).toHaveBeenCalledWith(
        {
          pathname: '/account-books/[id]',
          query: { id: 'book-1', source: 'test' },
        },
        undefined,
        { shallow: true }
      )
    })
  })
})
