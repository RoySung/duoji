import { addToast, Button } from '@heroui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { PiCaretRightBold } from 'react-icons/pi'
import { useAccountBookStore } from '@/stores/accountBook'
import { useCategoryStore } from '@/stores/category'
import {
  AccountBookFormValues,
  buildAccountBookPayload,
  buildAccountBookUpdates,
  defaultAccountBookFormValues,
  isAccountBookFormValid,
  toAccountBookFormValues,
} from '@/utils/accountBookUtils'
import AccountBookForm from './AccountBookForm'
import AccountBookNavHeader from './AccountBookNavHeader'
import DeleteAccountBookModal from './DeleteAccountBookModal'
import UserSection from './UserSection'

type AccountBookFormPageProps = {
  accountBookId?: string
  mode: 'create' | 'edit'
}

function toErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected account book error'
}

export default function AccountBookFormPage({
  accountBookId,
  mode,
}: AccountBookFormPageProps) {
  const router = useRouter()
  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const isLoading = useAccountBookStore((state) => state.isLoading)
  const error = useAccountBookStore((state) => state.error)
  const createAccountBook = useAccountBookStore(
    (state) => state.createAccountBook
  )
  const updateAccountBook = useAccountBookStore(
    (state) => state.updateAccountBook
  )
  const deleteAccountBook = useAccountBookStore(
    (state) => state.deleteAccountBook
  )
  const seedDefaultCategories = useCategoryStore(
    (state) => state.seedDefaultCategories
  )

  const accountBook =
    mode === 'edit'
      ? accountBooks.find((item) => item.id === accountBookId) ?? null
      : null

  const [formValues, setFormValues] = useState<AccountBookFormValues>(
    defaultAccountBookFormValues
  )
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  useEffect(() => {
    if (mode === 'edit') {
      setFormValues(toAccountBookFormValues(accountBook))
      return
    }

    setFormValues(defaultAccountBookFormValues)
  }, [accountBook, mode])

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
      if (mode === 'edit') {
        if (!accountBookId) {
          throw new Error('Missing account book ID.')
        }

        const updatedAccountBook = await updateAccountBook(
          accountBookId,
          buildAccountBookUpdates(formValues)
        )

        if (!updatedAccountBook) {
          throw new Error('Unable to update the selected account book.')
        }

        addToast({
          title: 'Account book updated',
          color: 'success',
          description: `${updatedAccountBook.name} is ready to use.`,
        })

        return
      }

      const createdAccountBook = await createAccountBook(
        buildAccountBookPayload(formValues)
      )

      let seededCategories = true

      try {
        await seedDefaultCategories(createdAccountBook.id)
      } catch {
        seededCategories = false
      }

      addToast({
        title: 'Account book created',
        color: seededCategories ? 'success' : 'warning',
        description: seededCategories
          ? `${createdAccountBook.name} is now available.`
          : `${createdAccountBook.name} was created, but default categories could not be prepared.`,
      })

      await router.push(`/settings/account-books/${createdAccountBook.id}`)
    } catch (submissionError) {
      addToast({
        title:
          mode === 'edit'
            ? 'Unable to update account book'
            : 'Unable to create account book',
        color: 'danger',
        description: toErrorMessage(submissionError),
      })
    }
  }

  async function handleDelete() {
    if (!accountBookId || !accountBook) {
      return
    }

    const deleted = await deleteAccountBook(accountBookId)

    if (!deleted) {
      addToast({
        title: 'Unable to delete account book',
        color: 'danger',
        description: `Could not delete ${accountBook.name}.`,
      })
      return
    }

    addToast({
      title: 'Account book deleted',
      color: 'success',
      description: `${accountBook.name} has been removed.`,
    })
    setIsDeleteOpen(false)
    await router.push('/settings/account-books')
  }

  if (mode === 'edit' && !accountBook) {
    return (
      <div className="h-full overflow-y-auto bg-background text-foreground">
        <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-6 px-4 py-6">
          <AccountBookNavHeader
            backHref="/settings/account-books"
            subtitle="Return to the account book list to choose a valid account book."
            title="Account book not found"
          />
          <section className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/5">
            <p className="text-sm text-muted-foreground">
              This account book is no longer available.
            </p>
          </section>
        </div>
      </div>
    )
  }

  const title =
    mode === 'create'
      ? 'Create account book'
      : accountBook?.name ?? 'Account book'
  const subtitle =
    mode === 'create'
      ? 'Set the basics first. You can configure categories after creating this account book.'
      : 'Update the basics here, then manage categories and other account-book settings below.'

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-6 px-4 py-6">
        <AccountBookNavHeader
          backHref="/settings/account-books"
          subtitle={subtitle}
          title={title}
        />

        {error ? (
          <div className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger-700">
            {error}
          </div>
        ) : null}

        <AccountBookForm
          cancelLabel="Back"
          isSubmitting={isLoading}
          onCancel={() => void router.push('/settings/account-books')}
          onSubmit={() => void handleSubmit()}
          onValuesChange={setFormValues}
          submitLabel={mode === 'create' ? 'Create' : 'Save'}
          values={formValues}
        />

        {mode === 'edit' && accountBookId ? (
          <>
            <UserSection accountBookId={accountBookId} />

            <section className="rounded-3xl border border-border bg-card p-5 shadow-lg shadow-black/5">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">
                  Categories
                </h2>
              </div>

              <Button
                className="mt-3 h-auto w-full justify-between rounded-2xl bg-accent px-4 py-4 text-left text-foreground hover:bg-accent/80"
                disableRipple
                endContent={
                  <PiCaretRightBold className="text-muted-foreground" />
                }
                variant="light"
                onPress={() =>
                  void router.push(
                    `/settings/account-books/${accountBookId}/categories`
                  )
                }
              >
                <div className="flex flex-1 flex-col items-start gap-1">
                  <span className="text-base font-semibold">
                    Manage categories
                  </span>
                </div>
              </Button>
            </section>

            <section className="rounded-3xl border border-danger/20 bg-danger/5 p-5 shadow-lg shadow-black/5">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-danger">
                  Delete account book
                </h2>
                <p className="text-sm text-danger-700/80">
                  Remove this account book only when you no longer need these
                  settings or its categories.
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  color="danger"
                  disableRipple
                  variant="flat"
                  onPress={() => setIsDeleteOpen(true)}
                >
                  Delete account book
                </Button>
              </div>
            </section>
          </>
        ) : null}

        <DeleteAccountBookModal
          accountBookName={accountBook?.name ?? ''}
          isOpen={isDeleteOpen}
          isSubmitting={isLoading}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  )
}
