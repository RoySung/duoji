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

type LedgerStepProps = {
  onCreated: (accountBookId: string) => void
}

export default function LedgerStep({ onCreated }: LedgerStepProps) {
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
        title: t('onboarding.step2.cannotSkip'),
        color: 'warning',
      })
      return
    }
    try {
      const created = await createAccountBook(buildAccountBookPayload(values))
      await seedDefaultCategories(created.id, language)
      onCreated(created.id)
    } catch (err) {
      addToast({
        title: t('accountBook.toast.createFailTitle'),
        color: 'danger',
        description:
          err instanceof Error ? err.message : t('accountBook.toast.createUnknownError'),
      })
    }
  }

  return (
    <StepShell
      currentStep={2}
      totalSteps={5}
      title={t('onboarding.step2.title')}
      description={t('onboarding.step2.description')}
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
