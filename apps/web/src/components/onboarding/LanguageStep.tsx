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
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              selected === locale
                ? 'border-orange-300 bg-orange-300/10'
                : 'border-border bg-background hover:border-orange-300/60'
            }`}
          >
            <span className="text-base font-medium">{t(`settings.language.options.${locale}`)}</span>
          </button>
        ))}
      </div>
    </StepShell>
  )
}
