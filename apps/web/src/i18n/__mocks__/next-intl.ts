import { ReactNode } from 'react'
import enMessages from '../messages/en-US.json'

type TranslationValues = Record<string, string | number>

function lookup(path: string): string | undefined {
  const parts = path.split('.')
  let node: any = enMessages
  for (const p of parts) {
    if (node && typeof node === 'object' && p in node) {
      node = node[p]
    } else {
      return undefined
    }
  }
  return typeof node === 'string' ? node : undefined
}

function format(template: string, values?: TranslationValues): string {
  if (!values) return template
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const v = values[key]
    return v === undefined ? `{${key}}` : String(v)
  })
}

export function useTranslations(namespace?: string) {
  return function t(key: string, values?: TranslationValues): string {
    const fullKey = namespace ? `${namespace}.${key}` : key
    const message = lookup(fullKey)
    return format(message ?? fullKey, values)
  }
}

export function NextIntlClientProvider({
  children,
}: {
  children: ReactNode
  locale?: string
  messages?: Record<string, unknown>
  timeZone?: string
}) {
  return children as never
}
