import { Button } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import StepShell from './StepShell'
import { useSettingsStore } from '@/stores/settings'
import { SUPPORTED_LOCALES, SupportedLocale } from '@/i18n/config'

type LanguageStepProps = {
  onAdvance: () => void
}

export default function LanguageStep({ onAdvance }: LanguageStepProps) {
  const t = useTranslations()
  const language = useSettingsStore((s) => s.language)
  const setLanguage = useSettingsStore((s) => s.setLanguage)
  const [selected, setSelected] = useState<SupportedLocale>(language)
  const [submitting, setSubmitting] = useState(false)

  async function handleConfirm() {
    setSubmitting(true)
    try {
      await setLanguage(selected)
      onAdvance()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <StepShell
      currentStep={1}
      totalSteps={3}
      title={t('onboarding.step1.title')}
      description={t('onboarding.step1.description')}
      canSkip={false}
      primaryAction={
        <Button
          color="primary"
          className="min-h-11 rounded-xl px-4 text-body font-medium focus-visible:ring-2 focus-visible:ring-ring"
          isLoading={submitting}
          onPress={() => void handleConfirm()}
        >
          {t('common.next')}
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        {SUPPORTED_LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => setSelected(locale)}
            aria-pressed={selected === locale}
            className={`min-h-11 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
              selected === locale
                ? 'border-emphasis bg-emphasis/10 text-foreground'
                : 'border-border bg-background text-foreground hover:border-primary/60 hover:bg-secondary/60'
            }`}
          >
            <span className="text-body font-medium">
              {t(`settings.language.options.${locale}`)}
            </span>
          </button>
        ))}
      </div>
    </StepShell>
  )
}
