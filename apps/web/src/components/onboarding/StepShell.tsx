import { Button } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'

import { PageScaffold } from '@/components/ui/PageScaffold'
import { SurfaceCard } from '@/components/ui/SurfaceCard'

type StepShellProps = {
  currentStep: number
  totalSteps: number
  title: string
  description?: string
  canSkip?: boolean
  onSkip?: () => void
  onBack?: () => void
  primaryAction?: ReactNode
  children?: ReactNode
}

export default function StepShell({
  currentStep,
  totalSteps,
  title,
  description,
  canSkip = true,
  onSkip,
  onBack,
  primaryAction,
  children,
}: StepShellProps) {
  const t = useTranslations()

  return (
    <PageScaffold
      className="!min-h-0 !max-w-2xl !gap-6 !px-0 !py-4 !pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:!py-8 sm:!pb-[calc(2rem+env(safe-area-inset-bottom))]"
      data-testid="onboarding-step-shell"
    >
      <section className="space-y-3" aria-labelledby="onboarding-step-title">
        <p className="text-label font-medium text-emphasis-foreground">
          {t('onboarding.shell.progress', {
            current: currentStep,
            total: totalSteps,
          })}
        </p>
        <div
          className="flex items-center gap-1.5"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-valuenow={currentStep}
          aria-label={t('onboarding.shell.progress', {
            current: currentStep,
            total: totalSteps,
          })}
        >
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <span
              key={idx}
              aria-hidden="true"
              className={`h-1.5 flex-1 rounded-full ${
                idx + 1 <= currentStep ? 'bg-emphasis' : 'bg-border'
              }`}
            />
          ))}
        </div>
        <h1
          id="onboarding-step-title"
          className="max-w-[24ch] break-words text-headline font-semibold text-balance"
        >
          {title}
        </h1>
        {description && (
          <p className="max-w-[65ch] break-words text-body text-muted-foreground">
            {description}
          </p>
        )}
      </section>

      <SurfaceCard className="rounded-2xl border border-border bg-card p-4 shadow-none sm:p-6">
        {children}
      </SurfaceCard>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {onBack && (
            <Button
              className="min-h-11 rounded-xl px-4 text-body focus-visible:ring-2 focus-visible:ring-ring"
              variant="light"
              onPress={onBack}
            >
              {t('common.back')}
            </Button>
          )}
          {canSkip && onSkip && (
            <Button
              className="min-h-11 rounded-xl px-4 text-body focus-visible:ring-2 focus-visible:ring-ring"
              variant="light"
              onPress={onSkip}
            >
              {t('onboarding.shell.skipStep')}
            </Button>
          )}
        </div>
        {primaryAction}
      </div>
    </PageScaffold>
  )
}
