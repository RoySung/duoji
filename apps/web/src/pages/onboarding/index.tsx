import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import LanguageStep from '@/components/onboarding/LanguageStep'
import LedgerStep from '@/components/onboarding/LedgerStep'
import { useAccountBookStore } from '@/stores/accountBook'
import { useSettingsStore } from '@/stores/settings'

const VALID_STEPS = [1, 2, 3, 4, 5, 6, 7, 8] as const
type OnboardingStep = (typeof VALID_STEPS)[number]
type TutorialStep = 3 | 4 | 5 | 6 | 7 | 8

function parseStep(
  value: unknown,
  fallback: OnboardingStep
): OnboardingStep {
  const n = typeof value === 'string' ? Number(value) : NaN
  return (VALID_STEPS as readonly number[]).includes(n)
    ? (n as OnboardingStep)
    : fallback
}

function tutorialPath(step: TutorialStep, accountBookId: string) {
  const base = `/account-books/${accountBookId}`
  if (step === 3) return `${base}/settings?onboarding=3`
  if (step === 4) return `${base}/settings?onboarding=4`
  if (step === 5) return `${base}/settings?onboarding=5`
  if (step === 6) return `${base}?onboarding=6`
  if (step === 7) return `${base}/settlement?onboarding=7`
  return `${base}/report?onboarding=8`
}

export default function OnboardingPage() {
  const router = useRouter()
  const initialized = useSettingsStore((s) => s.initialized)
  const onboardingCompleted = useSettingsStore((s) => s.onboardingCompleted)
  const accountBooks = useAccountBookStore((s) => s.accountBooks)
  const accountBookInitialized = useAccountBookStore((s) => s.initialized)

  const firstAccountBookId = accountBooks[0]?.id ?? null
  const fallbackStep: OnboardingStep = firstAccountBookId ? 3 : 1

  const currentStep = useMemo(
    () => parseStep(router.query.step, fallbackStep),
    [router.query.step, fallbackStep]
  )

  useEffect(() => {
    if (!initialized || !accountBookInitialized) return
    if (onboardingCompleted) {
      void router.replace(
        firstAccountBookId ? `/account-books/${firstAccountBookId}` : '/'
      )
    }
  }, [
    initialized,
    accountBookInitialized,
    onboardingCompleted,
    firstAccountBookId,
    router,
  ])

  // Redirect tutorial steps (3-8) to the real pages with ?onboarding=N
  useEffect(() => {
    if (!initialized || !accountBookInitialized) return
    if (currentStep < 3) return

    if (!firstAccountBookId) {
      void router.replace('/onboarding?step=2')
      return
    }
    void router.replace(
      tutorialPath(currentStep as TutorialStep, firstAccountBookId)
    )
  }, [
    currentStep,
    initialized,
    accountBookInitialized,
    firstAccountBookId,
    router,
  ])

  function goToStep(step: OnboardingStep) {
    void router.replace(`/onboarding?step=${step}`)
  }

  if (!initialized || !accountBookInitialized) {
    return null
  }

  if (currentStep === 1) {
    return <LanguageStep onAdvance={() => goToStep(2)} />
  }

  if (currentStep === 2) {
    return (
      <LedgerStep
        onCreated={(id) => {
          void router.replace(tutorialPath(3, id))
        }}
      />
    )
  }

  return null
}
