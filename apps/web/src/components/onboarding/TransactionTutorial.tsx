import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTour } from '@reactour/tour'
import OnboardingTutorial, { type OnboardingSubStep } from './OnboardingTutorial'
import { useAccountBookStore } from '@/stores/accountBook'

const SUB_STEPS: OnboardingSubStep[] = [
  {
    selector: '[data-onboarding-anchor="create-transaction"]',
    titleKey: 'onboarding.step6.sub1.title',
    descriptionKey: 'onboarding.step6.sub1.description',
    showNextButton: false,
  },
  {
    selector: '[data-onboarding-anchor="transaction-form-amount"]',
    titleKey: 'onboarding.step6.sub2.title',
    descriptionKey: 'onboarding.step6.sub2.description',
    showNextButton: true,
  },
  {
    selector: '[data-onboarding-anchor="transaction-form-category"]',
    titleKey: 'onboarding.step6.sub3.title',
    descriptionKey: 'onboarding.step6.sub3.description',
    showNextButton: true,
  },
  {
    selector: '[data-onboarding-anchor="transaction-form-payer"]',
    titleKey: 'onboarding.step6.sub4.title',
    descriptionKey: 'onboarding.step6.sub4.description',
    showNextButton: true,
  },
  {
    selector: '[data-onboarding-anchor="transaction-form-split"]',
    titleKey: 'onboarding.step6.sub5.title',
    descriptionKey: 'onboarding.step6.sub5.description',
    showNextButton: true,
  },
  {
    selector: '[data-onboarding-anchor="transaction-form-submit"]',
    titleKey: 'onboarding.step6.sub6.title',
    descriptionKey: 'onboarding.step6.sub6.description',
    showNextButton: false,
  },
]

export default function TransactionTutorial({
  children,
}: {
  children: ReactNode
}) {
  return (
    <OnboardingTutorial step={6} subSteps={SUB_STEPS}>
      <TransactionTutorialAdvancer />
      {children}
    </OnboardingTutorial>
  )
}

function TransactionTutorialAdvancer() {
  const router = useRouter()
  const accountBooks = useAccountBookStore((s) => s.accountBooks)
  const { currentStep, setCurrentStep, isOpen } = useTour()
  const active = Number(router.query.onboarding) === 6 && isOpen

  useEffect(() => {
    if (!active) return
    if (currentStep === 0) {
      let timer: number | undefined
      const handler = (e: Event) => {
        const target = e.target as HTMLElement | null
        if (!target) return
        const anchor = target.closest('[data-onboarding-anchor="create-transaction"]')
        if (!anchor) return
        // Defer advancing until the modal slide-up animation settles, so reactour
        // measures the next anchor at its final position instead of mid-animation.
        timer = window.setTimeout(() => setCurrentStep(1), 450)
      }
      document.addEventListener('click', handler, true)
      return () => {
        document.removeEventListener('click', handler, true)
        if (timer !== undefined) window.clearTimeout(timer)
      }
    }
    if (currentStep === 5) {
      // Submit click: the modal will close and the anchor disappears, so
      // SelectorWaiter's initial resolve never re-fires. Watch for the anchor
      // being removed from the DOM and advance to step 4 then.
      const observer = new MutationObserver(() => {
        const stillThere = document.querySelector(
          '[data-onboarding-anchor="transaction-form-submit"]'
        )
        if (!stillThere) {
          observer.disconnect()
          const accountBookId =
            typeof router.query.id === 'string'
              ? router.query.id
              : accountBooks[0]?.id
          if (accountBookId) {
            void router.replace(
              `/account-books/${accountBookId}/settlement?onboarding=7`
            )
          }
        }
      })
      observer.observe(document.body, { childList: true, subtree: true })
      return () => observer.disconnect()
    }
    return
    // SubSteps 3, 4, 5 (category, payer, split) advance via the fallback Next
    // button rendered by OnboardingTutorial.
    // router and accountBooks are only read inside the submit handler at fire
    // time; including them re-runs the effect and tears down handlers/timers
    // started by earlier subSteps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, currentStep, setCurrentStep])

  return null
}
