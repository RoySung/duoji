export { SUPPORTED_LOCALES } from '@/entities/settings'
import { SUPPORTED_LOCALES } from '@/entities/settings'

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: SupportedLocale = 'en-US'

export function detectLocale(input: string | undefined | null): SupportedLocale {
  if (input?.toLowerCase().startsWith('zh')) {
    return 'zh-TW'
  }
  return 'en-US'
}

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return (
    typeof value === 'string' &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  )
}
