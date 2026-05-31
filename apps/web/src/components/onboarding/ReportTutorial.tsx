import { ReactNode } from 'react'
import OnboardingTutorial from './OnboardingTutorial'

export default function ReportTutorial({
  children,
}: {
  children: ReactNode
}) {
  return (
    <OnboardingTutorial
      step={8}
      selector='[data-onboarding-anchor="report-filters"]'
      titleKey="onboarding.step9.title"
      descriptionKey="onboarding.step9.description"
    >
      {children}
    </OnboardingTutorial>
  )
}
