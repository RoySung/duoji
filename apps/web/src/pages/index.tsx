import { Button } from '@heroui/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { PiBooksBold } from 'react-icons/pi'
import { useAccountBookStore } from '@/stores/accountBook'
import { useSettingsStore } from '@/stores/settings'

export function Index() {
  const router = useRouter()
  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const initialized = useAccountBookStore((state) => state.initialized)
  const settingsInitialized = useSettingsStore((s) => s.initialized)
  const onboardingCompleted = useSettingsStore((s) => s.onboardingCompleted)
  const t = useTranslations()

  useEffect(() => {
    if (!initialized || !settingsInitialized) {
      return
    }

    if (!onboardingCompleted && accountBooks.length === 0) {
      void router.replace('/onboarding?step=1')
      return
    }

    if (accountBooks.length > 0) {
      void router.replace(`/account-books/${accountBooks[0].id}`)
    }
  }, [
    initialized,
    settingsInitialized,
    onboardingCompleted,
    accountBooks,
    router,
  ])

  if (
    !initialized ||
    !settingsInitialized ||
    accountBooks.length > 0 ||
    !onboardingCompleted
  ) {
    return null
  }

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col items-center justify-center gap-8 px-4 py-8">
        <div className="w-full rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-lg shadow-black/5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300">
            <PiBooksBold size={26} />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
            {t('emptyState.noAccountBooks.title')}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('emptyState.noAccountBooks.description')}
          </p>
          <Button
            className="mt-6"
            color="primary"
            disableRipple
            onPress={() => void router.push('/account-books/new')}
          >
            {t('emptyState.noAccountBooks.action')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Index
