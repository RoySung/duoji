import { ReactNode } from 'react'
import OnboardingTutorial from './OnboardingTutorial'

export default function EditAccountBookTutorial({
  children,
}: {
  children: ReactNode
}) {
  return (
    <OnboardingTutorial
      step={3}
      selector='[data-onboarding-anchor="edit-account-book"]'
      titleKey="onboarding.step3.title"
      descriptionKey="onboarding.step3.description"
    >
      {children}
    </OnboardingTutorial>
  )
}
