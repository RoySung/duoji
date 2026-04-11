import { Switch } from '@heroui/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import {
  PiMoonBold,
  PiSunBold,
} from 'react-icons/pi'

export default function Settings() {
  const [hasHydrated, setHasHydrated] = useState(false)
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  const resolvedTheme = theme === 'dark' ? 'dark' : 'light'

  function handleThemeChange(isSelected: boolean) {
    setTheme(isSelected ? 'dark' : 'light')
  }

  return (
    <div
      id="settings-page"
      className="h-full overflow-y-auto bg-background text-foreground"
    >
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-8 px-4 py-8">
        <section className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-300">
            Settings
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Personal workspace
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Manage the local account books that power transaction entry and
              account-book-scoped views.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-4 shadow-lg shadow-black/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-foreground">
                Appearance
              </h2>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark theme for DuoJi.
              </p>
            </div>

            <Switch
              isDisabled={!hasHydrated}
              isSelected={resolvedTheme === 'dark'}
              size="lg"
              thumbIcon={({ isSelected, className }) =>
                isSelected ? (
                  <PiMoonBold className={className} size={14} />
                ) : (
                  <PiSunBold className={className} size={14} />
                )
              }
              onValueChange={handleThemeChange}
            >
              {resolvedTheme === 'dark' ? 'Dark mode' : 'Light mode'}
            </Switch>
          </div>
        </section>

      </div>
    </div>
  )
}
