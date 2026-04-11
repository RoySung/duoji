import { addToast } from '@heroui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAccountBookStore } from '@/stores/accountBook'
import { useCategoryStore } from '@/stores/category'
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
  const isLoading = useAccountBookStore((s) => s.isLoading)
  const createAccountBook = useAccountBookStore((s) => s.createAccountBook)
  const seedDefaultCategories = useCategoryStore((s) => s.seedDefaultCategories)

  const [formValues, setFormValues] = useState<AccountBookFormValues>(defaultAccountBookFormValues)

  async function handleSubmit() {
    if (!isAccountBookFormValid(formValues)) {
      addToast({
        title: 'Missing account book name',
        color: 'warning',
        description: 'Enter a name before saving this account book.',
      })
      return
    }

    try {
      const created = await createAccountBook(buildAccountBookPayload(formValues))
      let seededCategories = true
      try {
        await seedDefaultCategories(created.id)
      } catch {
        seededCategories = false
      }
      addToast({
        title: 'Account book created',
        color: seededCategories ? 'success' : 'warning',
        description: seededCategories
          ? `${created.name} is ready. Configure categories below.`
          : `${created.name} was created, but default categories could not be prepared.`,
      })
      void router.push(`/account-books/${created.id}/settings`)
    } catch (err) {
      addToast({
        title: 'Unable to create account book',
        color: 'danger',
        description: err instanceof Error ? err.message : 'Unexpected account book error',
      })
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-6 px-4 py-6 md:px-6">
        <AccountBookNavHeader
          title="New account book"
          subtitle="Set up a new account book for tracking expenses."
        />
        <AccountBookForm
          cancelLabel="Cancel"
          isSubmitting={isLoading}
          onCancel={() => router.back()}
          onSubmit={() => void handleSubmit()}
          onValuesChange={setFormValues}
          submitLabel="Create"
          values={formValues}
        />
      </div>
    </div>
  )
}
