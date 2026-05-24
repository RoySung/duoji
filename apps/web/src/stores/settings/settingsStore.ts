import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'
import {
  Settings,
  SettingsRepo,
  SETTINGS_ID,
  Language,
} from '@/entities/settings'
import { SettingsLocalRepo } from '@/repositories/settingsRepo'
import { detectLocale } from '@/i18n/config'

type SettingsStoreState = {
  language: Language
  onboardingCompleted: boolean
  initialized: boolean
  isLoading: boolean
  error: string | null
}

type HydrateOptions = {
  hasExistingAccountBooks: boolean
}

type SettingsStoreActions = {
  hydrate: (options: HydrateOptions) => Promise<void>
  setLanguage: (language: Language) => Promise<void>
  markOnboardingComplete: () => Promise<void>
  resetInMemoryState: () => void
}

export type SettingsStore = SettingsStoreState & SettingsStoreActions
export type SettingsStoreApi = ReturnType<typeof createSettingsStore>

const initialSettingsStoreState: SettingsStoreState = {
  language: 'en-US',
  onboardingCompleted: false,
  initialized: false,
  isLoading: false,
  error: null,
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'Unknown settings error'
}

function nowMs() {
  return Date.now()
}

export function createSettingsStore(
  settingsRepo: SettingsRepo = new SettingsLocalRepo(),
  initialState: Partial<SettingsStoreState> = {}
) {
  return createStore<SettingsStore>()(
    devtools(
      (set, get) => ({
        ...initialSettingsStoreState,
        ...initialState,

        hydrate: async ({ hasExistingAccountBooks }) => {
          set({ isLoading: true, error: null })
          try {
            const existing = await settingsRepo.getSettings()
            if (existing) {
              set({
                language: existing.language,
                onboardingCompleted: existing.onboardingCompleted,
                initialized: true,
                isLoading: false,
                error: null,
              })
              return
            }

            const detectedLanguage = detectLocale(
              typeof navigator !== 'undefined' ? navigator.language : null
            )
            const seeded: Settings = {
              id: SETTINGS_ID,
              language: detectedLanguage,
              onboardingCompleted: hasExistingAccountBooks,
              updatedAt: nowMs(),
            }
            await settingsRepo.upsertSettings(seeded)
            set({
              language: seeded.language,
              onboardingCompleted: seeded.onboardingCompleted,
              initialized: true,
              isLoading: false,
              error: null,
            })
          } catch (error) {
            set({
              initialized: true,
              isLoading: false,
              error: toErrorMessage(error),
            })
          }
        },

        setLanguage: async (language) => {
          const previous = get().language
          set({ language })
          try {
            await settingsRepo.upsertSettings({
              id: SETTINGS_ID,
              language,
              onboardingCompleted: get().onboardingCompleted,
              updatedAt: nowMs(),
            })
          } catch (error) {
            set({ language: previous, error: toErrorMessage(error) })
            throw error
          }
        },

        markOnboardingComplete: async () => {
          if (get().onboardingCompleted) return
          set({ onboardingCompleted: true })
          try {
            await settingsRepo.upsertSettings({
              id: SETTINGS_ID,
              language: get().language,
              onboardingCompleted: true,
              updatedAt: nowMs(),
            })
          } catch (error) {
            set({ onboardingCompleted: false, error: toErrorMessage(error) })
            throw error
          }
        },

        resetInMemoryState: () => {
          set(initialSettingsStoreState)
        },
      }),
      { name: 'settings-store' }
    )
  )
}
