import { TourProvider, useTour, type StepType } from '@reactour/tour'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import { Button } from '@heroui/react'
import { useAccountBookStore } from '@/stores/accountBook'

export type OnboardingSubStep = {
  selector: string
  titleKey: string
  descriptionKey: string
  showNextButton?: boolean
}

export type OnboardingStep = 3 | 4 | 5 | 6 | 7 | 8

export const ONBOARDING_TOTAL_STEPS = 8
export const ONBOARDING_FINAL_STEP: OnboardingStep = 8

type OnboardingTutorialProps = {
  step: OnboardingStep
  subSteps?: OnboardingSubStep[]
  selector?: string
  titleKey?: string
  descriptionKey?: string
  children: ReactNode
}

const ANCHOR_WAIT_TIMEOUT_MS = 1500

function nextHrefAfterStep(
  step: OnboardingStep,
  accountBookId: string | null
): string {
  if (!accountBookId) return '/'
  const base = `/account-books/${accountBookId}`
  if (step === 3) return `${base}/settings?onboarding=4`
  if (step === 4) return `${base}/settings?onboarding=5`
  if (step === 5) return `${base}?onboarding=6`
  if (step === 6) return `${base}/settlement?onboarding=7`
  if (step === 7) return `${base}/report?onboarding=8`
  return base
}

function waitForElement(
  selector: string,
  timeoutMs: number
): Promise<Element | null> {
  if (typeof document === 'undefined') {
    return Promise.resolve(null)
  }
  const existing = document.querySelector(selector)
  if (existing) {
    return Promise.resolve(existing)
  }
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector)
      if (found) {
        observer.disconnect()
        window.clearTimeout(timer)
        resolve(found)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
    const timer = window.setTimeout(() => {
      observer.disconnect()
      resolve(null)
    }, timeoutMs)
  })
}

function TutorialController({ step }: { step: OnboardingStep }) {
  const router = useRouter()
  const { setIsOpen, isOpen, setCurrentStep } = useTour()
  const active = Number(router.query.onboarding) === step

  useEffect(() => {
    if (active) {
      setCurrentStep(0)
      setIsOpen(true)
    } else if (isOpen) {
      setIsOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return null
}

export default function OnboardingTutorial({
  step,
  subSteps,
  selector,
  titleKey,
  descriptionKey,
  children,
}: OnboardingTutorialProps) {
  const router = useRouter()
  const t = useTranslations()
  const accountBooks = useAccountBookStore((s) => s.accountBooks)
  const accountBookId =
    typeof router.query.id === 'string'
      ? router.query.id
      : accountBooks[0]?.id ?? null

  const normalizedSubSteps: OnboardingSubStep[] = useMemo(() => {
    if (subSteps && subSteps.length > 0) return subSteps
    return [
      {
        selector: selector ?? '',
        titleKey: titleKey ?? '',
        descriptionKey: descriptionKey ?? '',
        showNextButton: true,
      },
    ]
  }, [subSteps, selector, titleKey, descriptionKey])

  function completeFlow() {
    // Defer markOnboardingComplete to the welcome modal so OnboardingGate
    // doesn't race us off the page before the welcome screen shows.
    void router.replace(
      accountBookId
        ? `/account-books/${accountBookId}?onboarding=welcome`
        : '/?onboarding=welcome'
    )
  }

  const advanceRef = useRef<() => void>(() => undefined)
  advanceRef.current = () => {
    if (step === ONBOARDING_FINAL_STEP) {
      void completeFlow()
    } else {
      void router.replace(nextHrefAfterStep(step, accountBookId))
    }
  }
  const advance = useCallback(() => advanceRef.current(), [])

  const totalSubSteps = normalizedSubSteps.length

  const selectorList = useMemo(
    () => normalizedSubSteps.map((s) => s.selector),
    [normalizedSubSteps]
  )

  const steps: StepType[] = useMemo(
    () =>
      normalizedSubSteps.map((sub, idx) => ({
        selector: sub.selector,
        position: 'top',
        content: ({ setCurrentStep }) => {
          const isLast = idx === totalSubSteps - 1
          const goNext = () => {
            if (isLast) {
              advance()
            } else {
              setCurrentStep(idx + 1)
            }
          }
          return (
            <div className="flex flex-col gap-3 p-1">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-orange-300">
                {t('onboarding.shell.progress', {
                  current: step,
                  total: ONBOARDING_TOTAL_STEPS,
                })}
                {totalSubSteps > 1 ? ` · ${idx + 1}/${totalSubSteps}` : ''}
              </p>
              <h2 className="text-lg font-semibold">{t(sub.titleKey)}</h2>
              <p className="text-sm text-muted-foreground">
                {t(sub.descriptionKey)}
              </p>
              <div className="mt-2 flex items-center justify-end gap-2">
                <Button size="sm" variant="light" onPress={advance}>
                  {t('common.skip')}
                </Button>
                {sub.showNextButton || isLast ? (
                  <Button size="sm" color="primary" onPress={goNext}>
                    {step === ONBOARDING_FINAL_STEP && isLast
                      ? t('onboarding.shell.finish')
                      : t('common.next')}
                  </Button>
                ) : null}
              </div>
            </div>
          )
        },
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [normalizedSubSteps, step, accountBookId, totalSubSteps]
  )

  return (
    <TourProvider
      steps={steps}
      showBadge={false}
      showCloseButton
      showNavigation={false}
      showDots={false}
      disableInteraction={false}
      onClickClose={({ setIsOpen: close }) => {
        close(false)
        advance()
      }}
      onClickMask={() => {
        // Allow clicks on the highlighted element to pass through;
        // do not auto-advance when the user clicks outside.
        return undefined
      }}
      styles={{
        popover: (base) => ({
          ...base,
          borderRadius: 16,
          padding: 16,
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          maxWidth: 360,
          zIndex: 100001,
        }),
        maskWrapper: (base) => ({ ...base, zIndex: 99999, color: 'rgba(0, 0, 0, 0.85)' }),
        maskArea: (base) => ({ ...base, rx: 12 }),
      }}
    >
      <TutorialController step={step} />
      <SelectorWaiter
        selectors={selectorList}
        step={step}
        onTimeout={advance}
      />
      {children}
    </TourProvider>
  )
}

function SelectorWaiter({
  selectors,
  step,
  onTimeout,
}: {
  selectors: string[]
  step: OnboardingStep
  onTimeout: () => void
}) {
  const router = useRouter()
  const { currentStep, isOpen } = useTour()
  const active = Number(router.query.onboarding) === step

  useEffect(() => {
    if (!active || !isOpen) return
    const selector = selectors[currentStep]
    if (!selector) return
    let cancelled = false
    void waitForElement(selector, ANCHOR_WAIT_TIMEOUT_MS).then((el) => {
      if (cancelled) return
      if (!el) {
        onTimeout()
        return
      }
      // Anchors inside a scrollable container (e.g. modal body) may be below the
      // fold when the subStep activates. Scroll the anchor into view and nudge
      ;(el as HTMLElement).scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      })
      window.setTimeout(() => {
        if (cancelled) return
        window.dispatchEvent(new Event('resize'))
      }, 350)
    })
    return () => {
      cancelled = true
    }
  }, [active, isOpen, currentStep, selectors, onTimeout])

  return null
}
