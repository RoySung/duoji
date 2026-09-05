import { useRef, useState, type ReactNode, type RefObject } from 'react'
import { PiArrowsClockwiseBold } from 'react-icons/pi'
import { useMedia, useScroll } from 'react-use'

import { cn } from '@/lib/utils'

const publicBasePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '')
  .trim()
  .replace(/^\/+|\/+$/g, '')
const assetRoot = publicBasePath ? `/${publicBasePath}` : ''
const backgroundAsset = `${assetRoot}/images/ui/duoji-banner-background.webp`
const travelAsset = `${assetRoot}/images/ui/duoji-banner-travel.webp`
const PARALLAX_SCROLL_DISTANCE = 160
const BACKGROUND_PARALLAX_DISTANCE = 24
const TRAVEL_PARALLAX_DISTANCE = 10
const MOBILE_PARALLAX_SCALE = 0.6

export type TransactionHeroProps = {
  accountBookName: string
  isRefreshDisabled?: boolean
  isRefreshing?: boolean
  onRefresh: () => void
  recordCount: ReactNode
  refreshLabel: string
  refreshingLabel: string
  sectionLabel: string
  scrollContainerRef?: RefObject<HTMLElement | null>
}

export function TransactionHero({
  accountBookName,
  isRefreshDisabled = false,
  isRefreshing = false,
  onRefresh,
  recordCount,
  refreshLabel,
  refreshingLabel,
  sectionLabel,
  scrollContainerRef,
}: TransactionHeroProps) {
  const [hasBackground, setHasBackground] = useState(true)
  const [hasTravelIllustration, setHasTravelIllustration] = useState(true)
  const fallbackScrollContainerRef = useRef<HTMLElement>(null)
  const parallaxScrollContainerRef =
    scrollContainerRef ?? fallbackScrollContainerRef
  const { y: scrollY } = useScroll(
    parallaxScrollContainerRef as RefObject<HTMLElement>
  )
  const prefersReducedMotion = useMedia(
    '(prefers-reduced-motion: reduce)',
    false
  )
  const isMobileViewport = useMedia('(max-width: 639px)', false)
  const parallaxScale = isMobileViewport ? MOBILE_PARALLAX_SCALE : 1
  const scrollProgress = Math.min(
    Math.max(scrollY, 0) / PARALLAX_SCROLL_DISTANCE,
    1
  )
  const parallaxProgress = prefersReducedMotion ? 0 : scrollProgress
  const backgroundOffset =
    parallaxProgress * BACKGROUND_PARALLAX_DISTANCE * parallaxScale
  const travelOffset =
    parallaxProgress * TRAVEL_PARALLAX_DISTANCE * parallaxScale

  return (
    <section
      aria-labelledby="transaction-hero-title"
      className="relative isolate h-[200px] overflow-hidden rounded-2xl bg-peach text-foreground shadow-[0_24px_60px_-36px_hsl(var(--surface-shadow)/0.55)] sm:h-[220px]"
      data-testid="transaction-hero"
    >
      <span
        aria-hidden="true"
        className="absolute -left-10 -top-16 size-44 rounded-full bg-emphasis/10"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-20 right-6 size-48 rotate-45 bg-primary/15"
      />

      {hasBackground ? (
        <img
          alt=""
          aria-hidden="true"
          className="absolute -inset-y-6 inset-x-0 h-[calc(100%+3rem)] w-full object-cover object-bottom opacity-95 will-change-transform dark:opacity-40"
          data-testid="transaction-hero-background"
          draggable={false}
          src={backgroundAsset}
          style={{ transform: `translate3d(0, -${backgroundOffset}px, 0)` }}
          onError={() => setHasBackground(false)}
        />
      ) : null}

      {hasTravelIllustration ? (
        <img
          alt=""
          aria-hidden="true"
          className="absolute -bottom-4 -right-12 z-[1] w-[76%] max-w-[560px] object-contain opacity-80 will-change-transform max-[359px]:-right-24 max-[359px]:w-[86%] max-[359px]:opacity-45 sm:-right-8 sm:w-[72%] dark:opacity-45"
          data-testid="transaction-hero-travel"
          draggable={false}
          src={travelAsset}
          style={{ transform: `translate3d(0, -${travelOffset}px, 0)` }}
          onError={() => setHasTravelIllustration(false)}
        />
      ) : null}

      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] bg-gradient-to-r from-background/80 via-background/25 to-transparent dark:from-background/90 dark:via-background/60 dark:to-background/25"
      />

      <div
        className="relative z-10 flex h-full max-w-full flex-col justify-between p-5 pb-12 min-[360px]:pb-16 sm:p-6 sm:pb-[68px]"
        data-testid="transaction-hero-content"
      >
        <div>
          <p className="text-label font-medium text-emphasis-foreground">
            {sectionLabel}
          </p>
          <h1
            className="mt-1 mb-0 break-words text-display font-semibold text-foreground sm:mt-2 sm:mb-6"
            id="transaction-hero-title"
          >
            {accountBookName}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            aria-label={refreshLabel}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 text-body font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-peach disabled:pointer-events-none disabled:opacity-55"
            disabled={isRefreshDisabled || isRefreshing}
            type="button"
            onClick={onRefresh}
          >
            <PiArrowsClockwiseBold
              aria-hidden="true"
              className={cn(
                isRefreshing && 'animate-spin motion-reduce:animate-none'
              )}
              size={14}
            />
            <span className="max-[359px]:sr-only">
              {isRefreshing ? refreshingLabel : refreshLabel}
            </span>
          </button>
          <span
            className="inline-flex min-h-11 items-center rounded-full bg-card/80 px-4 text-body font-medium text-foreground shadow-sm backdrop-blur-sm dark:bg-card"
            data-testid="transaction-hero-record-count"
          >
            {recordCount}
          </span>
        </div>
      </div>
    </section>
  )
}
