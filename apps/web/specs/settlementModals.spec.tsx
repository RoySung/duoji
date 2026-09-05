import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { HeroUIProvider } from '@heroui/react'

import SettlementConfirmModal from '../src/components/settlement/SettlementConfirmModal'
import SettlementMarkdownModal from '../src/components/settlement/SettlementMarkdownModal'
import SettlementTransferModal from '../src/components/settlement/SettlementTransferModal'
import { SettlementTransfer } from '../src/entities/settlement'

jest.mock('@heroui/react', () => {
  const React = jest.requireActual('react')

  return {
    addToast: jest.fn(),
    HeroUIProvider: ({ children }: { children: React.ReactNode }) => children,
    Modal: ({
      children,
      classNames,
      isOpen,
      onOpenChange,
    }: {
      children: React.ReactNode
      classNames?: Record<string, string>
      isOpen: boolean
      onOpenChange?: (open: boolean) => void
    }) => {
      React.useEffect(() => {
        const closeOnEscape = (event: KeyboardEvent) => {
          if (event.key === 'Escape') onOpenChange?.(false)
        }
        globalThis.document.addEventListener('keydown', closeOnEscape)
        return () =>
          globalThis.document.removeEventListener('keydown', closeOnEscape)
      }, [onOpenChange])

      return isOpen ? (
        <div className={classNames?.wrapper}>
          <div className={classNames?.base} role="dialog">
            <button
              aria-label="Dismiss dialog"
              className={classNames?.closeButton}
              type="button"
              onClick={() => onOpenChange?.(false)}
            />
            {children}
          </div>
        </div>
      ) : null
    },
    ModalContent: ({
      children,
      className,
    }: {
      children: React.ReactNode
      className?: string
    }) => <div className={className}>{children}</div>,
    ModalHeader: ({
      children,
      className,
    }: {
      children: React.ReactNode
      className?: string
    }) => <div className={className}>{children}</div>,
    ModalBody: ({
      children,
      className,
    }: {
      children: React.ReactNode
      className?: string
    }) => (
      <div className={className} data-testid="modal-body">
        {children}
      </div>
    ),
    ModalFooter: ({
      children,
      className,
    }: {
      children: React.ReactNode
      className?: string
    }) => <div className={className}>{children}</div>,
    Button: ({
      'aria-label': ariaLabel,
      children,
      className,
      isDisabled,
      onPress,
    }: {
      'aria-label'?: string
      children: React.ReactNode
      className?: string
      isDisabled?: boolean
      onPress?: () => void
      [key: string]: unknown
    }) => (
      <button
        aria-label={ariaLabel}
        className={className}
        disabled={isDisabled}
        type="button"
        onClick={onPress}
      >
        {children}
      </button>
    ),
    Input: ({
      classNames,
      isRequired,
      label,
      onValueChange,
      value,
      ...props
    }: {
      classNames?: Record<string, string>
      isRequired?: boolean
      label: string
      onValueChange: (value: string) => void
      value: string
      [key: string]: unknown
    }) => (
      <label className={classNames?.label}>
        {label}
        <input
          aria-label={label}
          className={classNames?.inputWrapper}
          required={isRequired}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          {...props}
        />
      </label>
    ),
    Switch: ({
      'aria-label': ariaLabel,
      className,
      isSelected,
      onValueChange,
    }: {
      'aria-label': string
      className?: string
      isSelected: boolean
      onValueChange: (selected: boolean) => void
    }) => (
      <input
        aria-label={ariaLabel}
        checked={isSelected}
        className={className}
        type="checkbox"
        onChange={(event) => onValueChange(event.target.checked)}
      />
    ),
  }
})

jest.mock('../src/stores/user', () => ({
  useUserStore: (selector: (state: unknown) => unknown) =>
    selector({
      allUsers: [
        { id: 'user-a', name: 'Alexandra with a long display name' },
        { id: 'user-b', name: 'Bo' },
      ],
    }),
}))

const transfer: SettlementTransfer = {
  id: 'transfer-1',
  fromUserId: 'user-a',
  toUserId: 'user-b',
  suggestedAmount: 125.5,
  actualAmount: null,
  note: '',
  status: 'pending',
  completedAt: null,
}

function renderWithHeroUI(node: React.ReactNode) {
  return render(<HeroUIProvider>{node}</HeroUIProvider>)
}

describe('settlement modal presentation and behavior', () => {
  it('keeps review callbacks and a keyboard-dismissable, scrollable modal surface', async () => {
    const onClose = jest.fn()
    const onConfirm = jest.fn(async () => undefined)

    renderWithHeroUI(
      <SettlementConfirmModal
        isOpen
        memberStatuses={[
          {
            userId: 'user-a',
            paidAmount: 200,
            splitAmount: 75,
            netAmount: 125,
          },
          {
            userId: 'user-b',
            paidAmount: 0,
            splitAmount: 125,
            netAmount: -125,
          },
        ]}
        transferSuggestions={[transfer]}
        currency="TWD"
        isSubmitting={false}
        onConfirm={onConfirm}
        onClose={onClose}
      />
    )

    const dialog = await screen.findByRole('dialog')
    expect(dialog.className).toContain('bg-card')
    expect(
      screen.getByRole('heading', { name: 'Review & settle' }).className
    ).toContain('text-title')

    expect(screen.getByTestId('modal-body').className).toContain(
      'overflow-y-auto'
    )

    const submit = screen.getByRole('button', {
      name: 'Create settlement record',
    })
    expect(submit.className).toContain('min-h-11')
    expect(submit.className).toContain('text-body')
    fireEvent.click(submit)
    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1))

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })

  it('preserves transfer form values and cancel behavior', async () => {
    const onClose = jest.fn()
    const onConfirm = jest.fn(async () => undefined)

    renderWithHeroUI(
      <SettlementTransferModal
        transfer={transfer}
        currency="TWD"
        onConfirm={onConfirm}
        onClose={onClose}
      />
    )

    const amountInput = await screen.findByLabelText('Actual amount (TWD)')
    const noteInput = screen.getByLabelText('Note (optional)')
    expect(
      screen.getByRole('heading', { name: 'Mark transfer done' }).className
    ).toContain('text-title')

    fireEvent.change(amountInput, { target: { value: '123.45' } })
    fireEvent.change(noteInput, { target: { value: 'Paid in cash' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    await waitFor(() =>
      expect(onConfirm).toHaveBeenCalledWith(123.45, 'Paid in cash')
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('keeps generated Markdown exact, focusable, scrollable, and copyable', async () => {
    const markdown = Array.from(
      { length: 80 },
      (_, index) => `- Entry ${index + 1}: **TWD ${index + 100}**`
    ).join('\n')
    const writeText = jest.fn(async () => undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    renderWithHeroUI(
      <SettlementMarkdownModal
        markdown={markdown}
        sequenceNumber={7}
        onClose={jest.fn()}
      />
    )

    const output = await screen.findByText((_, element) =>
      Boolean(element?.matches('pre') && element.textContent === markdown)
    )
    expect(output.textContent).toBe(markdown)
    expect(output.getAttribute('tabindex')).toBe('0')
    expect(output.className).toContain('max-h-')
    expect(output.className).toContain('!overflow-auto')
    expect(output.className).toContain('text-body')
    expect(
      screen.getByRole('heading', {
        name: 'Export as Markdown — Settlement #7',
      }).className
    ).toContain('text-title')

    fireEvent.click(screen.getByRole('button', { name: 'Copy markdown' }))
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(markdown))
    await waitFor(() =>
      expect(
        screen.getByRole('button', {
          name: 'Markdown copied to clipboard',
        })
      ).toBeTruthy()
    )
  })
})
