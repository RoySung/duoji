import { ReactNode } from 'react'
import OnboardingTutorial from './OnboardingTutorial'

export default function AddMemberTutorial({
  children,
}: {
  children: ReactNode
}) {
  return (
    <OnboardingTutorial
      step={4}
      selector='[data-onboarding-anchor="add-member"]'
      titleKey="onboarding.step5.title"
      descriptionKey="onboarding.step5.description"
    >
      {children}
    </OnboardingTutorial>
  )
}
