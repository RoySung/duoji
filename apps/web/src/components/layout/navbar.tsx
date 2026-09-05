import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Tooltip } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import {
  PiArrowsLeftRight,
  PiChartPieSliceFill,
  PiGearFill,
  PiHouseFill,
  PiListPlusFill,
} from 'react-icons/pi'

import { useAccountBookStore } from '@/stores/accountBook'
import { cn } from '@/lib/utils'

type NavigationItemProps = {
  children: ReactNode
  disabled?: boolean
  inputId: 'home' | 'report' | 'settings' | 'settlement'
  label: string
  onClick?: () => void
  selected?: boolean
}

function NavigationItem({
  children,
  disabled = false,
  inputId,
  label,
  onClick,
  selected = false,
}: NavigationItemProps) {
  return (
    <div className="relative flex items-center justify-center">
      <input
        aria-hidden="true"
        checked={selected}
        disabled={disabled}
        hidden
        id={inputId}
        name="page"
        tabIndex={-1}
        type="radio"
        onChange={onClick}
      />
      <button
        aria-current={selected ? 'page' : undefined}
        aria-label={label}
        className={cn(
          'group relative flex min-h-11 min-w-11 items-center justify-center rounded-xl text-muted-foreground outline-none transition-colors',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
          selected && 'bg-emphasis/10 text-emphasis',
          !selected && !disabled && 'hover:bg-primary/10 hover:text-primary',
          disabled && 'pointer-events-none opacity-45'
        )}
        disabled={disabled}
        title={label}
        type="button"
        onClick={onClick}
      >
        <span aria-hidden="true" className="text-[20px]">
          {children}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'absolute bottom-1 h-0.5 w-5 rounded-full bg-emphasis transition-opacity',
            selected ? 'opacity-100' : 'opacity-0'
          )}
        />
      </button>
    </div>
  )
}

function ProhibitionMask() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="h-0.5 w-4 rotate-45 rounded-full bg-emphasis/75" />
    </span>
  )
}

function DisabledWithTooltip({
  message,
  children,
  className,
  style,
}: {
  message: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return
    const timeout = window.setTimeout(() => setMobileOpen(false), 2000)
    return () => window.clearTimeout(timeout)
  }, [mobileOpen])

  return (
    <Tooltip
      content={message}
      isOpen={mobileOpen || undefined}
      placement="top"
      showArrow
      onOpenChange={(open) => {
        if (!open) setMobileOpen(false)
      }}
    >
      <div
        className={cn('relative flex items-center justify-center', className)}
        style={style}
        onClick={() => setMobileOpen((current) => !current)}
      >
        {children}
      </div>
    </Tooltip>
  )
}

export default function NavBar() {
  const router = useRouter()
  const t = useTranslations()
  const isSettlement = router.pathname.includes('/settlement')
  const isReport = router.pathname === '/account-books/[id]/report'
  const isAccountBookSettings =
    router.pathname === '/account-books/[id]/settings' ||
    router.pathname === '/account-books/new'
  const isHome =
    router.pathname === '/' || router.pathname === '/account-books/[id]'
  const isSettings =
    router.pathname.startsWith('/settings') || isAccountBookSettings

  const currentAccountBookId = useAccountBookStore(
    (state) => state.currentAccountBookId
  )
  const accountBookId =
    (typeof router.query.id === 'string' ? router.query.id : null) ??
    currentAccountBookId
  const isAggregateView = !accountBookId || accountBookId === 'all'

  function handleHomeNavigation() {
    const homeTarget = accountBookId ? `/account-books/${accountBookId}` : '/'
    void router.push(homeTarget)
  }

  function handleAddTransaction() {
    if (isAggregateView) return

    const onboardingParam =
      typeof router.query.onboarding === 'string'
        ? `&onboarding=${router.query.onboarding}`
        : ''
    void router.push(
      `/account-books/${accountBookId}?modal=create${onboardingParam}`
    )
  }

  return (
    <div
      className="navbar h-[calc(88px+env(safe-area-inset-bottom))] w-full px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 sm:px-6"
      data-testid="bottom-navigation"
    >
      <nav
        className="mx-auto grid h-16 w-full max-w-3xl grid-cols-5 items-center rounded-[2rem] bg-card/95 px-2 shadow-[0_18px_50px_-22px_hsl(var(--surface-shadow)/0.55)] backdrop-blur-md dark:bg-card"
        data-testid="bottom-navigation-surface"
      >
        <NavigationItem
          inputId="home"
          label={t('navbar.home')}
          selected={isHome}
          onClick={handleHomeNavigation}
        >
          <PiHouseFill />
        </NavigationItem>

        {isAggregateView ? (
          <DisabledWithTooltip message={t('navbar.notAvailableAllBooks')}>
            <NavigationItem
              disabled
              inputId="settlement"
              label={t('navbar.settlement')}
            >
              <PiArrowsLeftRight />
            </NavigationItem>
            <ProhibitionMask />
          </DisabledWithTooltip>
        ) : (
          <NavigationItem
            inputId="settlement"
            label={t('navbar.settlement')}
            selected={isSettlement}
            onClick={() =>
              void router.push(`/account-books/${accountBookId}/settlement`)
            }
          >
            <PiArrowsLeftRight />
          </NavigationItem>
        )}

        {isAggregateView ? (
          <DisabledWithTooltip message={t('navbar.notAvailableAllBooks')}>
            <button
              aria-label={t('navbar.newTransaction')}
              className="pointer-events-none relative flex h-14 w-14 -translate-y-2 items-center justify-center rounded-2xl bg-muted text-muted-foreground opacity-60 shadow-lg"
              disabled
              type="button"
            >
              <PiListPlusFill aria-hidden="true" size={24} />
              <ProhibitionMask />
            </button>
          </DisabledWithTooltip>
        ) : (
          <button
            aria-label={t('navbar.newTransaction')}
            className="relative flex h-14 w-14 -translate-y-2 items-center justify-center justify-self-center rounded-2xl bg-primary text-primary-foreground shadow-[0_14px_28px_-14px_hsl(var(--primary)/0.9)] outline-none transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            data-onboarding-anchor="create-transaction"
            type="button"
            onClick={handleAddTransaction}
          >
            <PiListPlusFill aria-hidden="true" size={24} />
          </button>
        )}

        <NavigationItem
          inputId="report"
          label={t('navbar.reports')}
          selected={isReport}
          onClick={() =>
            void router.push(`/account-books/${accountBookId ?? 'all'}/report`)
          }
        >
          <PiChartPieSliceFill />
        </NavigationItem>

        <NavigationItem
          inputId="settings"
          label={t('navbar.settings')}
          selected={isSettings}
          onClick={() => void router.push('/settings')}
        >
          <PiGearFill />
        </NavigationItem>
      </nav>
    </div>
  )
}
