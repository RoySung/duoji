import { addToast, Button } from '@heroui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { PiCaretRightBold } from 'react-icons/pi'
import { useAccountBookStore } from '@/stores/accountBook'
import {
  AccountBookFormValues,
  buildAccountBookUpdates,
  isAccountBookFormValid,
  toAccountBookFormValues,
} from '@/utils/accountBookUtils'
import CategorySettingsModal from '@/components/categorySettings/CategorySettingsModal'
import AccountBookForm from './AccountBookForm'
import AccountBookNavHeader from './AccountBookNavHeader'
import DeleteAccountBookModal from './DeleteAccountBookModal'
import UserSection from './UserSection'

type Props = {
  accountBookId: string
}

function toErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Unexpected account book error'
}

export default function AccountBookEditPage({ accountBookId }: Props) {
  const router = useRouter()
  const accountBooks = useAccountBookStore((s) => s.accountBooks)
  const isLoading = useAccountBookStore((s) => s.isLoading)
  const updateAccountBook = useAccountBookStore((s) => s.updateAccountBook)
  const deleteAccountBook = useAccountBookStore((s) => s.deleteAccountBook)

  const accountBook = accountBooks.find((ab) => ab.id === accountBookId) ?? null

  const [formValues, setFormValues] = useState<AccountBookFormValues>(
    toAccountBookFormValues(accountBook)
  )
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  useEffect(() => {
    setFormValues(toAccountBookFormValues(accountBook))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountBookId])

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
      const updated = await updateAccountBook(accountBookId, buildAccountBookUpdates(formValues))
      if (!updated) throw new Error('Unable to update the selected account book.')
      addToast({
        title: 'Account book updated',
        color: 'success',
        description: `${updated.name} is ready to use.`,
      })
    } catch (err) {
      addToast({
        title: 'Unable to update account book',
        color: 'danger',
        description: toErrorMessage(err),
      })
    }
  }

  async function handleDelete() {
    if (!accountBook) return
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
    const remaining = accountBooks.filter((ab) => ab.id !== accountBookId)
    if (remaining.length > 0) {
      void router.push(`/account-books/${remaining[0].id}`)
    } else {
      void router.push('/')
    }
  }

  return (
    <>
      <div className="h-full overflow-y-auto bg-background text-foreground">
        <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-6 px-4 py-6 md:px-6">
          <AccountBookNavHeader
            title={accountBook?.name ?? 'Account book'}
            subtitle="Edit this account book's settings."
            backHref={`/account-books/${accountBookId}`}
          />

          <AccountBookForm
            cancelLabel="Cancel"
            isSubmitting={isLoading}
            onCancel={() => void router.push(`/account-books/${accountBookId}`)}
            onSubmit={() => void handleSubmit()}
            onValuesChange={setFormValues}
            submitLabel="Save"
            values={formValues}
          />

          <UserSection accountBookId={accountBookId} />

          <section className="rounded-3xl border border-border bg-card p-5 shadow-lg shadow-black/5">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Categories</h2>
            </div>
            <Button
              className="mt-3 h-auto w-full justify-between rounded-2xl bg-accent px-4 py-4 text-left text-foreground hover:bg-accent/80"
              disableRipple
              endContent={<PiCaretRightBold className="text-muted-foreground" />}
              variant="light"
              onPress={() => setIsCategoryModalOpen(true)}
            >
              <div className="flex flex-1 flex-col items-start gap-1">
                <span className="text-base font-semibold">Manage categories</span>
              </div>
            </Button>
          </section>

          <section className="rounded-3xl border border-danger/20 bg-danger/5 p-5 shadow-lg shadow-black/5">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-danger">Delete account book</h2>
              <p className="text-sm text-danger-700/80">
                Permanently removes all categories and settings in this account book.
                This can&apos;t be undone.
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
        </div>
      </div>

      <CategorySettingsModal
        isOpen={isCategoryModalOpen}
        onOpenChange={setIsCategoryModalOpen}
        accountBookId={accountBookId}
      />

      <DeleteAccountBookModal
        accountBookName={accountBook?.name ?? ''}
        isOpen={isDeleteOpen}
        isSubmitting={isLoading}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  )
}
