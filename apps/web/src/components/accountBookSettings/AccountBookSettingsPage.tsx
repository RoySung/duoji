import { addToast, Button, Chip } from '@heroui/react'
import { useState } from 'react'
import { AccountBook } from '@/entities/accountBook'
import { useAccountBookStore } from '@/stores/accountBook'
import {
  AccountBookFormValues,
  buildAccountBookPayload,
  buildAccountBookUpdates,
  defaultAccountBookFormValues,
  isAccountBookFormValid,
  toAccountBookFormValues,
} from '@/utils/accountBookUtils'
import AccountBookNavHeader from './AccountBookNavHeader'
import AccountBookFormModal from './AccountBookFormModal'
import DeleteAccountBookModal from './DeleteAccountBookModal'

function toErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected account book error'
}

export default function AccountBookSettingsPage() {
  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const currentAccountBookId = useAccountBookStore(
    (state) => state.currentAccountBookId
  )
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

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAccountBook, setEditingAccountBook] =
    useState<AccountBook | null>(null)
  const [deletingAccountBook, setDeletingAccountBook] =
    useState<AccountBook | null>(null)

  const isEditing = editingAccountBook !== null
  const formValues = toAccountBookFormValues(editingAccountBook)

  function openCreateModal() {
    setEditingAccountBook(null)
    setIsFormOpen(true)
  }

  function openEditModal(accountBook: AccountBook) {
    setEditingAccountBook(accountBook)
    setIsFormOpen(true)
  }

  function closeFormModal() {
    setEditingAccountBook(null)
    setIsFormOpen(false)
  }

  function closeDeleteModal() {
    setDeletingAccountBook(null)
  }

  async function handleSubmit(values: AccountBookFormValues) {
    if (!isAccountBookFormValid(values)) {
      addToast({
        title: 'Missing account book name',
        color: 'warning',
        description: 'Enter a name before saving this account book.',
      })
      return
    }

    try {
      if (editingAccountBook) {
        const updatedAccountBook = await updateAccountBook(
          editingAccountBook.id,
          buildAccountBookUpdates(values)
        )

        if (!updatedAccountBook) {
          throw new Error('Unable to update the selected account book.')
        }

        addToast({
          title: 'Account book updated',
          color: 'success',
          description: `${updatedAccountBook.name} is ready to use.`,
        })
      } else {
        const createdAccountBook = await createAccountBook(
          buildAccountBookPayload(values)
        )

        addToast({
          title: 'Account book created',
          color: 'success',
          description: `${createdAccountBook.name} is now available.`,
        })
      }

      closeFormModal()
    } catch (submissionError) {
      addToast({
        title: isEditing
          ? 'Unable to update account book'
          : 'Unable to create account book',
        color: 'danger',
        description: toErrorMessage(submissionError),
      })
    }
  }

  async function handleDelete() {
    if (!deletingAccountBook) {
      return
    }

    const accountBookName = deletingAccountBook.name
    const deleted = await deleteAccountBook(deletingAccountBook.id)

    if (!deleted) {
      addToast({
        title: 'Unable to delete account book',
        color: 'danger',
        description: `Could not delete ${accountBookName}.`,
      })
      return
    }

    addToast({
      title: 'Account book deleted',
      color: 'success',
      description: `${accountBookName} has been removed.`,
    })
    closeDeleteModal()
  }

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-6 px-4 py-6">
        <AccountBookNavHeader
          title="Account books"
          subtitle="Create, edit, and delete the local account books used across transaction entry and scoped summaries. Switch the current account book from Home."
          backHref="/settings"
          actions={
            <Button color="primary" disableRipple onPress={openCreateModal}>
              Create
            </Button>
          }
        />

        {error ? (
          <div className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger-700">
            {error}
          </div>
        ) : null}

        {accountBooks.length === 0 ? (
          <section className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center shadow-lg shadow-black/5">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                Create your first account book
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Account books organize personal spending, transaction entry, and
                current account-book context.
              </p>
            </div>
            <Button
              className="mt-6"
              color="primary"
              disableRipple
              onPress={openCreateModal}
            >
              Create account book
            </Button>
          </section>
        ) : (
          <section className="grid gap-4 pb-4">
            {accountBooks.map((accountBook) => {
              const isCurrent = accountBook.id === currentAccountBookId

              return (
                <article
                  key={accountBook.id}
                  className={`rounded-3xl border p-5 shadow-lg shadow-black/5 transition ${
                    isCurrent
                      ? 'border-orange-200 bg-orange-50'
                      : 'border-border bg-card'
                  }`}
                  data-testid={`account-book-card-${accountBook.id}`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-semibold text-foreground">
                          {accountBook.name}
                        </h2>
                        {isCurrent ? (
                          <Chip
                            className="bg-orange-100 text-orange-700"
                            size="sm"
                            variant="flat"
                          >
                            Current
                          </Chip>
                        ) : null}
                        <Chip
                          className="bg-muted text-muted-foreground"
                          size="sm"
                          variant="flat"
                        >
                          {accountBook.currency}
                        </Chip>
                      </div>
                      <p className="max-w-2xl text-sm text-muted-foreground">
                        {accountBook.description || 'No description yet.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <Button
                        disableRipple
                        isDisabled={isLoading}
                        variant="flat"
                        onPress={() => openEditModal(accountBook)}
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        disableRipple
                        isDisabled={isLoading}
                        variant="flat"
                        onPress={() => setDeletingAccountBook(accountBook)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })}
          </section>
        )}

        <AccountBookFormModal
          initialValues={isEditing ? formValues : defaultAccountBookFormValues}
          isOpen={isFormOpen}
          isSubmitting={isLoading}
          mode={isEditing ? 'edit' : 'create'}
          onClose={closeFormModal}
          onSubmit={handleSubmit}
        />
        <DeleteAccountBookModal
          accountBookName={deletingAccountBook?.name ?? ''}
          isOpen={deletingAccountBook !== null}
          isSubmitting={isLoading}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  )
}
