import { useState, useEffect, ReactNode, CSSProperties } from 'react'
import { Button, Tooltip } from '@heroui/react'
import styled from '@emotion/styled'
import {
  PiHouseFill,
  PiListPlusFill,
  PiGearFill,
  PiArrowsLeftRight,
  PiChartPieSliceFill,
} from 'react-icons/pi'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
// @ts-expect-error 暫時忽略，不影響功能
import tailwindConfig from '../../../tailwind.config' // 根據你的路徑調整
import { useAccountBookStore } from '@/stores/accountBook'

const resolvedConfig = require('tailwindcss/resolveConfig')
const themeConfig = resolvedConfig(tailwindConfig)

const StyledWrapper = styled.div`
  section {
    --col-orange: ${themeConfig.theme.colors.orange[400]};
    --col-dark: #0c0f14;
    --col-darkGray: #52555a;
    --col-gray: #aeaeae;

    width: fit-content;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background-color: var(--col-dark);
    border-radius: 30px;
  }
  .label {
    padding: 8px 4px;
    transition: all 200ms;
    display: inline-block;
    position: relative;
  }

  .label input[type='radio'] {
    display: none;
  }
  .label > svg {
    transition: all 200ms;
    fill: var(--col-gray);
    width: 42px;
  }
  .label:hover:not(:has(input:checked)) > svg {
    fill: var(--col-orange);
    opacity: 0.6;
  }
  .label::before {
    content: '';
    display: block;
    width: 20px;
    height: 2px;
    border-radius: 2px;
    position: absolute;
    left: 50%;
    bottom: 4px;
    transform: translateX(-50%) scaleX(0);
    background: var(--col-orange);
    transition: transform 200ms ease;
    transform-origin: center;
  }
  .label > svg {
    transition: 300ms;
    fill: var(--col-darkGray);
    margin-top: 0;
  }
  .label:has(input:checked) > svg {
    fill: var(--col-orange);
    scale: 1.2;
    margin-top: 0;
  }

  .label:has(input:checked)::before {
    transform: translateX(-50%) scaleX(1);
  }
`

function ProhibitionMask() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="h-[2px] w-[14px] rotate-45 rounded-full bg-orange-400/60" />
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
    const t = setTimeout(() => setMobileOpen(false), 2000)
    return () => clearTimeout(t)
  }, [mobileOpen])

  return (
    <Tooltip
      content={message}
      showArrow
      placement="top"
      isOpen={mobileOpen || undefined}
      onOpenChange={(open) => { if (!open) setMobileOpen(false) }}
    >
      <div
        className={`relative cursor-default ${className ?? ''}`}
        style={style}
        onClick={() => setMobileOpen((s) => !s)}
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
    if (isAggregateView) {
      return
    }

    const onboardingParam =
      typeof router.query.onboarding === 'string'
        ? `&onboarding=${router.query.onboarding}`
        : ''
    void router.push(
      `/account-books/${accountBookId}?modal=create${onboardingParam}`
    )
  }

  return (
    <div className="navbar flex h-[calc(72px+env(safe-area-inset-bottom))] shrink-0 w-full items-center justify-center px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <StyledWrapper>
        <section>
          <label title={t('navbar.home')} htmlFor="home" className="label">
            <input
              id="home"
              name="page"
              type="radio"
              checked={isHome}
              onChange={handleHomeNavigation}
            />
            <PiHouseFill></PiHouseFill>
          </label>
          {isAggregateView ? (
            <DisabledWithTooltip message={t('navbar.notAvailableAllBooks')}>
              <label title={t('navbar.settlement')} className="label" aria-disabled style={{ position: 'relative' }}>
                <input id="settlement" name="page" type="radio" checked={false} onChange={() => {}} disabled /> {/* eslint-disable-line @typescript-eslint/no-empty-function */}
                <PiArrowsLeftRight />
                <ProhibitionMask />
              </label>
            </DisabledWithTooltip>
          ) : (
            <label title={t('navbar.settlement')} htmlFor="settlement" className="label">
              <input
                id="settlement"
                name="page"
                type="radio"
                checked={isSettlement}
                onChange={() => void router.push(`/account-books/${accountBookId}/settlement`)}
              />
              <PiArrowsLeftRight />
            </label>
          )}
          {isAggregateView ? (
            <DisabledWithTooltip message={t('navbar.notAvailableAllBooks')} className="relative mx-2" style={{ transform: 'scale(1.2)' }}>
              <Button className="bg-gray-600/75 text-white" isIconOnly isDisabled>
                <PiListPlusFill size={28} />
              </Button>
              <ProhibitionMask />
            </DisabledWithTooltip>
          ) : (
            <Button
              aria-label={t('navbar.newTransaction')}
              className="bg-gray-600/75 text-white mx-2"
              data-onboarding-anchor="create-transaction"
              isIconOnly
              style={{ transform: 'scale(1.2)' }}
              onPress={handleAddTransaction}
            >
              <PiListPlusFill size={28} />
            </Button>
          )}
          <label title={t('navbar.reports')} htmlFor="report" className="label">
            <input
              id="report"
              name="page"
              type="radio"
              checked={isReport}
              onChange={() =>
                router.push(`/account-books/${accountBookId ?? 'all'}/report`)
              }
            />
            <PiChartPieSliceFill />
          </label>
          <label title={t('navbar.settings')} htmlFor="settings" className="label">
            <input
              id="settings"
              name="page"
              type="radio"
              checked={isSettings}
              onChange={() => router.push('/settings')}
            />
            <PiGearFill></PiGearFill>
          </label>
        </section>
      </StyledWrapper>
    </div>
  )
}
