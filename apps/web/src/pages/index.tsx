import { Button } from '@heroui/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { PiBooksBold } from 'react-icons/pi'
import { PageScaffold } from '@/components/ui/PageScaffold'
import { SurfaceCard } from '@/components/ui/SurfaceCard'
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
      <PageScaffold className="items-center justify-center">
        <SurfaceCard
          aria-labelledby="empty-account-books-title"
          className="w-full px-6 py-14 text-center sm:px-8 sm:py-16"
          role="region"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-peach text-emphasis-foreground">
            <PiBooksBold size={26} />
          </div>
          <h1
            id="empty-account-books-title"
            className="mt-5 text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-foreground text-balance"
          >
            {t('emptyState.noAccountBooks.title')}
          </h1>
          <p className="mx-auto mt-2 max-w-[65ch] text-sm leading-6 text-muted-foreground text-pretty">
            {t('emptyState.noAccountBooks.description')}
          </p>
          <Button
            className="mt-6 min-h-11 rounded-xl px-5"
            color="primary"
            disableRipple
            onPress={() => void router.push('/account-books/new')}
          >
            {t('emptyState.noAccountBooks.action')}
          </Button>
        </SurfaceCard>
      </PageScaffold>
    </div>
  )
}

export default Index
