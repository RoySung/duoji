import { addToast, Button } from '@heroui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { PiCaretRightBold } from 'react-icons/pi'
import { useAccountBookStore } from '@/stores/accountBook'
import { PageScaffold } from '@/components/ui/PageScaffold'
import { SurfaceCard } from '@/components/ui/SurfaceCard'
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

export default function AccountBookEditPage({ accountBookId }: Props) {
  const router = useRouter()
  const t = useTranslations()
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
  }, [accountBookId])

  function toErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return t('accountBook.toast.createUnknownError')
  }

  async function handleSubmit() {
    if (!isAccountBookFormValid(formValues)) {
      addToast({
        title: t('accountBook.toast.missingNameTitle'),
        color: 'warning',
        description: t('accountBook.toast.missingNameDesc'),
      })
      return
    }

    try {
      const updated = await updateAccountBook(
        accountBookId,
        buildAccountBookUpdates(formValues)
      )
      if (!updated)
        throw new Error('Unable to update the selected account book.')
      addToast({
        title: t('accountBook.toast.updatedTitle'),
        color: 'success',
        description: t('accountBook.toast.updatedDesc', { name: updated.name }),
      })
    } catch (err) {
      addToast({
        title: t('accountBook.toast.updateFailTitle'),
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
        title: t('accountBook.toast.deleteFailTitle'),
        color: 'danger',
        description: t('accountBook.toast.deleteFailDesc', {
          name: accountBook.name,
        }),
      })
      return
    }
    addToast({
      title: t('accountBook.toast.deletedTitle'),
      color: 'success',
      description: t('accountBook.toast.deletedDesc', {
        name: accountBook.name,
      }),
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
        <PageScaffold>
          <AccountBookNavHeader
            title={accountBook?.name ?? t('accountBook.editFallback')}
            subtitle={t('accountBook.editSubtitle')}
            backHref={`/account-books/${accountBookId}`}
          />

          <div data-onboarding-anchor="edit-account-book">
            <AccountBookForm
              cancelLabel={t('common.cancel')}
              isSubmitting={isLoading}
              onCancel={() =>
                void router.push(`/account-books/${accountBookId}`)
              }
              onSubmit={() => void handleSubmit()}
              onValuesChange={setFormValues}
              submitLabel={t('common.save')}
              values={formValues}
            />
          </div>

          <div data-onboarding-anchor="add-member">
            <UserSection accountBookId={accountBookId} />
          </div>

          <SurfaceCard
            className="p-5 sm:p-6"
            data-onboarding-anchor="manage-categories"
          >
            <div className="space-y-1">
              <h2 className="text-title font-semibold text-foreground">
                {t('accountBook.categoriesHeading')}
              </h2>
            </div>
            <Button
              className="mt-4 min-h-11 h-auto w-full justify-between rounded-xl bg-secondary px-4 py-3 text-left text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-ring"
              disableRipple
              endContent={
                <PiCaretRightBold className="text-muted-foreground" size={14} />
              }
              variant="light"
              onPress={() => setIsCategoryModalOpen(true)}
            >
              <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                <span className="break-words text-body font-semibold">
                  {t('accountBook.manageCategories')}
                </span>
              </div>
            </Button>
          </SurfaceCard>

          <SurfaceCard className="bg-danger/5 p-5 shadow-none ring-1 ring-inset ring-danger/25 sm:p-6">
            <div className="space-y-1">
              <h2 className="text-title font-semibold text-danger">
                {t('accountBook.deleteSection.title')}
              </h2>
              <p className="text-body text-muted-foreground text-pretty">
                {t('accountBook.deleteSection.description')}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                className="min-h-11 w-full rounded-xl px-4 text-body sm:w-auto"
                color="danger"
                disableRipple
                variant="flat"
                onPress={() => setIsDeleteOpen(true)}
              >
                {t('accountBook.deleteSection.button')}
              </Button>
            </div>
          </SurfaceCard>
        </PageScaffold>
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
