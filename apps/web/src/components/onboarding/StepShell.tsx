import { Button } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'

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
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-6 px-4 py-10">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-orange-300">
            {t('onboarding.shell.progress', { current: currentStep, total: totalSteps })}
          </p>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 flex-1 rounded-full ${
                  idx + 1 <= currentStep ? 'bg-orange-300' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-lg shadow-black/5">
          {children}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {onBack && (
              <Button variant="light" onPress={onBack}>
                {t('common.back')}
              </Button>
            )}
            {canSkip && onSkip && (
              <Button variant="light" onPress={onSkip}>
                {t('onboarding.shell.skipStep')}
              </Button>
            )}
          </div>
          {primaryAction}
        </div>
      </div>
    </div>
  )
}
