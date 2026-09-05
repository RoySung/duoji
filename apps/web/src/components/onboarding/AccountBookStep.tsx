import { addToast } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import StepShell from './StepShell'
import AccountBookForm from '@/components/accountBookSettings/AccountBookForm'
import { useAccountBookStore } from '@/stores/accountBook'
import { useCategoryStore } from '@/stores/category'
import { useSettingsStore } from '@/stores/settings'
import {
  AccountBookFormValues,
  buildAccountBookPayload,
  defaultAccountBookFormValues,
  isAccountBookFormValid,
} from '@/utils/accountBookUtils'

type AccountBookStepProps = {
  ownerId: string
  onCreated: (accountBookId: string) => void
}

export default function AccountBookStep({
  ownerId,
  onCreated,
}: AccountBookStepProps) {
  const t = useTranslations()
  const isLoading = useAccountBookStore((s) => s.isLoading)
  const createAccountBook = useAccountBookStore((s) => s.createAccountBook)
  const seedDefaultCategories = useCategoryStore((s) => s.seedDefaultCategories)
  const language = useSettingsStore((s) => s.language)
  const [values, setValues] = useState<AccountBookFormValues>(
    defaultAccountBookFormValues
  )

  async function handleSubmit() {
    if (!isAccountBookFormValid(values)) {
      addToast({
        title: t('onboarding.step3.cannotSkip'),
        color: 'warning',
      })
      return
    }
    try {
      const created = await createAccountBook(
        buildAccountBookPayload(values, ownerId)
      )
      await seedDefaultCategories(created.id, language)
      onCreated(created.id)
    } catch (err) {
      addToast({
        title: t('accountBook.toast.createFailTitle'),
        color: 'danger',
        description:
          err instanceof Error
            ? err.message
            : t('accountBook.toast.createUnknownError'),
      })
    }
  }

  return (
    <StepShell
      currentStep={3}
      totalSteps={3}
      title={t('onboarding.step3.title')}
      description={t('onboarding.step3.description')}
      canSkip={false}
    >
      <AccountBookForm
        isSubmitting={isLoading}
        onSubmit={() => void handleSubmit()}
        onValuesChange={setValues}
        submitLabel={t('common.create')}
        values={values}
        showCancel={false}
        showSection={false}
      />
    </StepShell>
  )
}
