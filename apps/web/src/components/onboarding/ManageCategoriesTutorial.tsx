import { ReactNode } from 'react'
import OnboardingTutorial from './OnboardingTutorial'

export default function ManageCategoriesTutorial({
  children,
}: {
  children: ReactNode
}) {
  return (
    <OnboardingTutorial
      step={5}
      selector='[data-onboarding-anchor="manage-categories"]'
      titleKey="onboarding.step6.title"
      descriptionKey="onboarding.step6.description"
    >
      {children}
    </OnboardingTutorial>
  )
}
