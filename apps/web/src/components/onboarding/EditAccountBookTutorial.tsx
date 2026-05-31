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
      titleKey="onboarding.step4.title"
      descriptionKey="onboarding.step4.description"
    >
      {children}
    </OnboardingTutorial>
  )
}
