import { NextIntlClientProvider } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import type { ReactNode } from 'react'
import { useSettingsStore } from '@/stores/settings'
import type { Language } from '@/entities/settings'
import enMessages from '@/i18n/messages/en-US.json'
import zhMessages from '@/i18n/messages/zh-TW.json'

const MESSAGES: Record<Language, AbstractIntlMessages> = {
  'en-US': enMessages,
  'zh-TW': zhMessages,
}

export function IntlGate({ children }: { children: ReactNode }) {
  const initialized = useSettingsStore((s) => s.initialized)
  const language = useSettingsStore((s) => s.language)

  if (!initialized) {
    return <div className="fixed inset-0 bg-background" />
  }

  return (
    <NextIntlClientProvider
      locale={language}
      messages={MESSAGES[language]}
      timeZone="UTC"
    >
      {children}
    </NextIntlClientProvider>
  )
}
