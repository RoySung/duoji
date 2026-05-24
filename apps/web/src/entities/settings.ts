import { z } from 'zod'

export const SUPPORTED_LOCALES = ['en-US', 'zh-TW'] as const

export const SETTINGS_ID = 'app' as const

export const LanguageSchema = z.enum(SUPPORTED_LOCALES)
export type Language = z.infer<typeof LanguageSchema>

export const SettingsSchema = z.object({
  id: z.literal(SETTINGS_ID),
  language: LanguageSchema,
  onboardingCompleted: z.boolean(),
  updatedAt: z.number(),
})
export type Settings = z.infer<typeof SettingsSchema>

export interface SettingsRepo {
  getSettings(): Promise<Settings | null>
  upsertSettings(settings: Settings): Promise<Settings>
}
