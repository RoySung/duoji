import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
  ScrollShadow,
  addToast,
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import {
  Transaction,
  TransactionModalMode,
  TransactionType,
} from '@/entities/transaction'
import ExpenseForm from './ExpenseForm'
import IncomeForm from './IncomeForm'
import { useAccountBookStore } from '@/stores/accountBook'
import { useCategoryStore } from '@/stores/category'
import { useUserStore } from '@/stores/user'
import {
  changeTransactionDraftType,
  createTransactionDraft,
} from '@/utils/transactionUtils'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  modalMode: TransactionModalMode
  defaultDate?: string | null
  selectedTransaction: Transaction | undefined
  isSubmitting: boolean
  onCreateTransaction: (transaction: Transaction) => Promise<Transaction>
  onUpdateTransaction: (
    id: string,
    updates: Partial<Transaction>
  ) => Promise<Transaction | null>
  onDeleteTransaction: (id: string) => Promise<boolean>
}

const formMap = {
  expense: ExpenseForm,
  income: IncomeForm,
}

export default function TransactionModal({
  isOpen,
  onOpenChange,
  modalMode,
  defaultDate,
  selectedTransaction,
  isSubmitting,
  onCreateTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}: Props) {
  const router = useRouter()
  const t = useTranslations()
  const isOnboardingActive = Number(router.query.onboarding) === 6
  const currentAccountBookId =
    useAccountBookStore((state) => state.currentAccountBookId) ?? ''
  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const categories = useCategoryStore((state) => state.categories)
  const allUsers = useUserStore((state) => state.allUsers)
  const activeUsers = useUserStore((state) => state.activeUsers)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const isEditMode = modalMode === 'edit'
  const [draft, setDraft] = useState(() =>
    createTransactionDraft({
      accountBookId: currentAccountBookId ?? '',
      accountBooks,
      users: activeUsers,
      categories,
    })
  )

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (
      (modalMode === 'edit' || modalMode === 'view') &&
      selectedTransaction
    ) {
      setDraft(
        createTransactionDraft({
          baseTransaction: selectedTransaction,
          accountBooks,
          users: allUsers,
          categories,
        })
      )
      return
    }

    const next = createTransactionDraft({
      accountBookId: currentAccountBookId ?? '',
      accountBooks,
      users: activeUsers,
      categories,
    })
    setDraft(defaultDate ? { ...next, date: defaultDate } : next)
  }, [
    accountBooks,
    activeUsers,
    allUsers,
    categories,
    currentAccountBookId,
    defaultDate,
    isOpen,
    modalMode,
    selectedTransaction,
  ])

  useEffect(() => {
    if (!isOpen || modalMode !== 'edit' || !selectedTransaction) {
      setIsDeleteConfirmOpen(false)
    }
  }, [isOpen, modalMode, selectedTransaction])

  const Form = formMap[draft.type]
  const isSaveDisabled =
    isSubmitting ||
    draft.amount <= 0 ||
    !draft.accountBookId ||
    !draft.categoryId ||
    (draft.type === 'income' && !draft.receivedByUserId)
  const isDeleteDisabled =
    isSubmitting || modalMode !== 'edit' || !selectedTransaction

  function handleClose() {
    setIsDeleteConfirmOpen(false)
    onOpenChange(false)
  }

  async function handleSave() {
    const timestamp = Date.now()
    const nextDraft = { ...draft }

    try {
      if (modalMode === 'edit') {
        const updatedTransaction = await onUpdateTransaction(nextDraft.id, {
          ...nextDraft,
          updatedAt: timestamp,
        })

        if (!updatedTransaction) {
          throw new Error('Unable to update the selected transaction.')
        }

        addToast({
          title: t('transactionModal.toast.updatedTitle'),
          color: 'success',
          description: t('transactionModal.toast.updatedDesc'),
        })
      } else {
        await onCreateTransaction({
          ...nextDraft,
          updatedAt: timestamp,
        })

        addToast({
          title: t('transactionModal.toast.createdTitle'),
          color: 'success',
          description: t('transactionModal.toast.createdDesc'),
        })
      }

      handleClose()
    } catch (error) {
      addToast({
        title:
          modalMode === 'edit'
            ? t('transactionModal.toast.updateFailTitle')
            : t('transactionModal.toast.createFailTitle'),
        color: 'danger',
        description:
          error instanceof Error ? error.message : t('transactionModal.toast.unknownError'),
      })
    }
  }

  async function handleDelete() {
    if (!selectedTransaction) {
      return
    }

    try {
      const deleted = await onDeleteTransaction(selectedTransaction.id)

      if (!deleted) {
        throw new Error('Unable to delete the selected transaction.')
      }

      setIsDeleteConfirmOpen(false)
      addToast({
        title: t('transactionModal.toast.deletedTitle'),
        color: 'success',
        description: t('transactionModal.toast.deletedDesc'),
      })
      onOpenChange(false)
    } catch (error) {
      addToast({
        title: t('transactionModal.toast.deleteFailTitle'),
        color: 'danger',
        description:
          error instanceof Error ? error.message : t('transactionModal.toast.unknownError'),
      })
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom"
        scrollBehavior="inside"
        isDismissable={!isOnboardingActive}
        isKeyboardDismissDisabled={isOnboardingActive}
        hideCloseButton={isOnboardingActive}
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-col gap-2 items-center w-full">
              <h2>
                {modalMode === 'edit'
                  ? t('transactionModal.titleEdit')
                  : modalMode === 'view'
                    ? t('transactionModal.titleView')
                    : t('transactionModal.titleCreate')}
              </h2>
              <Tabs
                fullWidth
                aria-label={t('transactionModal.typeAriaLabel')}
                selectedKey={draft.type}
                size="md"
                onSelectionChange={(key) => {
                  setDraft((currentDraft) =>
                    changeTransactionDraftType(
                      currentDraft,
                      key as TransactionType,
                      accountBooks,
                      isEditMode ? allUsers : activeUsers,
                      categories
                    )
                  )
                }}
              >
                <Tab key="expense" title={t('transactionModal.tabExpense')}></Tab>
                <Tab key="income" title={t('transactionModal.tabIncome')}></Tab>
              </Tabs>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <ScrollShadow size={50}>
                <Form
                  value={draft}
                  onChange={modalMode === 'view' ? () => {} : setDraft} // eslint-disable-line @typescript-eslint/no-empty-function
                  isEditMode={isEditMode}
                />
              </ScrollShadow>
              {modalMode === 'edit' ? (
                <div className="rounded-large border border-danger-200 bg-danger-50 px-4 py-3">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold text-danger">
                        {t('transactionModal.delete.heading')}
                      </h3>
                      <p className="text-sm text-danger-700">
                        {t('transactionModal.delete.warning')}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        color="danger"
                        isDisabled={isDeleteDisabled}
                        onPress={() => setIsDeleteConfirmOpen(true)}
                      >
                        {t('common.delete')}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </ModalBody>
          <ModalFooter>
            {modalMode === 'view' ? (
              <Button onPress={handleClose}>{t('common.close')}</Button>
            ) : (
              <>
                <Button onPress={handleClose}>{t('common.cancel')}</Button>
                <span data-onboarding-anchor="transaction-form-submit">
                  <Button
                    color="primary"
                    isDisabled={isSaveDisabled}
                    onPress={handleSave}
                  >
                    {modalMode === 'edit' ? t('common.save') : t('common.create')}
                  </Button>
                </span>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onOpenChange={(open) => setIsDeleteConfirmOpen(open)}
      >
        <ModalContent>
          <ModalHeader>
            <h3>{t('transactionModal.delete.confirmTitle')}</h3>
          </ModalHeader>
          <ModalBody>
            <p>{t('transactionModal.delete.confirmBody1')}</p>
            <p>{t('transactionModal.delete.confirmBody2')}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={isSubmitting}
              onPress={() => setIsDeleteConfirmOpen(false)}
            >
              {t('transactionModal.delete.keep')}
            </Button>
            <Button
              color="danger"
              isDisabled={isDeleteDisabled}
              onPress={handleDelete}
            >
              {t('transactionModal.delete.confirm')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
