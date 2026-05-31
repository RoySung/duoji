import { ReactNode } from 'react'
import OnboardingTutorial from './OnboardingTutorial'

export default function SplitTutorial({
  children,
}: {
  children: ReactNode
}) {
  return (
    <OnboardingTutorial
      step={7}
      selector='[data-onboarding-anchor="settlement-tabs"]'
      titleKey="onboarding.step8.title"
      descriptionKey="onboarding.step8.description"
    >
      {children}
    </OnboardingTutorial>
  )
}
