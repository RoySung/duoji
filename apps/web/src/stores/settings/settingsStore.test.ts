import { createSettingsStore } from './settingsStore'
import type { Settings, SettingsRepo } from '@/entities/settings'

function createFakeRepo(initial: Settings | null = null): SettingsRepo & {
  reads: number
  writes: Settings[]
} {
  let current = initial
  const repo = {
    reads: 0,
    writes: [] as Settings[],
    async getSettings() {
      this.reads += 1
      return current
    },
    async upsertSettings(next: Settings) {
      current = next
      this.writes.push(next)
      return next
    },
  }
  return repo
}

describe('settingsStore', () => {
  it('hydrates with detected locale when no record exists and no account books', async () => {
    const repo = createFakeRepo(null)
    const store = createSettingsStore(repo)
    await store.getState().hydrate({ hasExistingAccountBooks: false })

    expect(store.getState().initialized).toBe(true)
    expect(store.getState().onboardingCompleted).toBe(false)
    expect(repo.writes).toHaveLength(1)
  })

  it('marks onboardingCompleted on first hydration when account books already exist', async () => {
    const repo = createFakeRepo(null)
    const store = createSettingsStore(repo)
    await store.getState().hydrate({ hasExistingAccountBooks: true })

    expect(store.getState().onboardingCompleted).toBe(true)
    expect(repo.writes[0].onboardingCompleted).toBe(true)
  })

  it('uses persisted settings if a record already exists', async () => {
    const repo = createFakeRepo({
      id: 'app',
      language: 'zh-TW',
      onboardingCompleted: true,
      updatedAt: 1,
    })
    const store = createSettingsStore(repo)
    await store.getState().hydrate({ hasExistingAccountBooks: false })

    expect(store.getState().language).toBe('zh-TW')
    expect(store.getState().onboardingCompleted).toBe(true)
    expect(repo.writes).toHaveLength(0)
  })

  it('setLanguage updates state and persists', async () => {
    const repo = createFakeRepo(null)
    const store = createSettingsStore(repo)
    await store.getState().hydrate({ hasExistingAccountBooks: false })

    await store.getState().setLanguage('zh-TW')
    expect(store.getState().language).toBe('zh-TW')
    expect(repo.writes[repo.writes.length - 1].language).toBe('zh-TW')

    await store.getState().setLanguage('en-US')
    expect(store.getState().language).toBe('en-US')
  })

  it('markOnboardingComplete persists the flag', async () => {
    const repo = createFakeRepo(null)
    const store = createSettingsStore(repo)
    await store.getState().hydrate({ hasExistingAccountBooks: false })

    expect(store.getState().onboardingCompleted).toBe(false)
    await store.getState().markOnboardingComplete()
    expect(store.getState().onboardingCompleted).toBe(true)
    expect(
      repo.writes[repo.writes.length - 1].onboardingCompleted
    ).toBe(true)
  })
})
