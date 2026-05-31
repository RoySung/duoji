import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import LanguageStep from '@/components/onboarding/LanguageStep'
import ProfileStep from '@/components/onboarding/ProfileStep'
import AccountBookStep from '@/components/onboarding/AccountBookStep'
import { useAccountBookStore } from '@/stores/accountBook'
import { useSettingsStore } from '@/stores/settings'

const VALID_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const
type OnboardingStep = (typeof VALID_STEPS)[number]
type TutorialStep = 4 | 5 | 6 | 7 | 8 | 9

function parseStep(value: unknown, fallback: OnboardingStep): OnboardingStep {
  const n = typeof value === 'string' ? Number(value) : NaN
  return (VALID_STEPS as readonly number[]).includes(n)
    ? (n as OnboardingStep)
    : fallback
}

function tutorialPath(step: TutorialStep, accountBookId: string) {
  const base = `/account-books/${accountBookId}`
  const param = step - 1
  if (step === 4 || step === 5 || step === 6)
    return `${base}/settings?onboarding=${param}`
  if (step === 7) return `${base}?onboarding=${param}`
  if (step === 8) return `${base}/settlement?onboarding=${param}`
  return `${base}/report?onboarding=${param}`
}

export default function OnboardingPage() {
  const router = useRouter()
  const initialized = useSettingsStore((s) => s.initialized)
  const onboardingCompleted = useSettingsStore((s) => s.onboardingCompleted)
  const accountBooks = useAccountBookStore((s) => s.accountBooks)
  const accountBookInitialized = useAccountBookStore((s) => s.initialized)

  const firstAccountBookId = accountBooks[0]?.id ?? null
  const fallbackStep: OnboardingStep = firstAccountBookId ? 4 : 1

  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

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

  // Redirect tutorial steps (4-9) to the real pages with ?onboarding=(step-1)
  useEffect(() => {
    if (!initialized || !accountBookInitialized) return
    if (currentStep < 4) return

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

  // Step 3 needs an ownerId from step 2. If the user reloads the tab and React
  // state is lost, fall back to step 2 instead of creating an account book with
  // an empty ownerId.
  useEffect(() => {
    if (!initialized || !accountBookInitialized) return
    if (currentStep === 3 && !currentUserId) {
      void router.replace('/onboarding?step=2')
    }
  }, [currentStep, currentUserId, initialized, accountBookInitialized, router])

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
      <ProfileStep
        onCreated={(userId) => {
          setCurrentUserId(userId)
          goToStep(3)
        }}
      />
    )
  }

  if (currentStep === 3) {
    if (!currentUserId) return null
    return (
      <AccountBookStep
        ownerId={currentUserId}
        onCreated={(id) => {
          void router.replace(tutorialPath(4, id))
        }}
      />
    )
  }

  return null
}
