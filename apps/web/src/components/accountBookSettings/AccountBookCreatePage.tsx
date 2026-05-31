import { addToast } from '@heroui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAccountBookStore } from '@/stores/accountBook'
import { useCategoryStore } from '@/stores/category'
import { useSettingsStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'
import {
  AccountBookFormValues,
  buildAccountBookPayload,
  defaultAccountBookFormValues,
  isAccountBookFormValid,
} from '@/utils/accountBookUtils'
import AccountBookForm from './AccountBookForm'
import AccountBookNavHeader from './AccountBookNavHeader'

export default function AccountBookCreatePage() {
  const router = useRouter()
  const t = useTranslations()
  const isLoading = useAccountBookStore((s) => s.isLoading)
  const createAccountBook = useAccountBookStore((s) => s.createAccountBook)
  const registeredUser = useUserStore((s) =>
    s.allUsers.find((u) => u.type === 'registered')
  )
  const seedDefaultCategories = useCategoryStore((s) => s.seedDefaultCategories)
  const language = useSettingsStore((s) => s.language)

  const [formValues, setFormValues] = useState<AccountBookFormValues>(defaultAccountBookFormValues)

  async function handleSubmit() {
    if (!isAccountBookFormValid(formValues)) {
      addToast({
        title: t('accountBook.toast.missingNameTitle'),
        color: 'warning',
        description: t('accountBook.toast.missingNameDesc'),
      })
      return
    }

    if (!registeredUser) {
      addToast({
        title: t('accountBook.toast.createFailTitle'),
        color: 'danger',
        description: t('accountBook.toast.createUnknownError'),
      })
      return
    }

    try {
      const created = await createAccountBook(
        buildAccountBookPayload(formValues, registeredUser.id)
      )
      let seededCategories = true
      try {
        await seedDefaultCategories(created.id, language)
      } catch {
        seededCategories = false
      }
      addToast({
        title: t('accountBook.toast.createdTitle'),
        color: seededCategories ? 'success' : 'warning',
        description: seededCategories
          ? t('accountBook.toast.createdReady', { name: created.name })
          : t('accountBook.toast.createdSeedFailed', { name: created.name }),
      })
      void router.push(`/account-books/${created.id}/settings`)
    } catch (err) {
      addToast({
        title: t('accountBook.toast.createFailTitle'),
        color: 'danger',
        description: err instanceof Error ? err.message : t('accountBook.toast.createUnknownError'),
      })
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-6 px-4 py-6 md:px-6">
        <AccountBookNavHeader
          title={t('accountBook.createTitle')}
          subtitle={t('accountBook.createSubtitle')}
        />
        <AccountBookForm
          cancelLabel={t('common.cancel')}
          isSubmitting={isLoading}
          onCancel={() => router.back()}
          onSubmit={() => void handleSubmit()}
          onValuesChange={setFormValues}
          submitLabel={t('common.create')}
          values={formValues}
        />
      </div>
    </div>
  )
}
