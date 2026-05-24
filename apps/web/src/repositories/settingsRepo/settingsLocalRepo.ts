import { Settings, SettingsRepo, SETTINGS_ID } from '@/entities/settings'
import { db } from '@/lib/dexie'

class SettingsLocalRepo implements SettingsRepo {
  async getSettings(): Promise<Settings | null> {
    try {
      const settings = await db.appSettings.get(SETTINGS_ID)
      return settings ?? null
    } catch (error) {
      console.error('Failed to read settings:', error)
      throw error
    }
  }

  async upsertSettings(settings: Settings): Promise<Settings> {
    const next: Settings = { ...settings, id: SETTINGS_ID }
    await db.appSettings.put(next)
    return next
  }
}

export default SettingsLocalRepo
