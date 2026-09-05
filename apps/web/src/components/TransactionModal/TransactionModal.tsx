import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab,
  addToast,
} from '@heroui/react'
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
} from 'react'
import { useLatest } from 'react-use'
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
import {
  confirmModalClassNames,
  transactionModalClassNames,
  transactionTabsClassNames,
} from './formControlStyles'
import { AppButton } from '@/components/ui/AppButton'

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
  const setCurrentAccountBookId = useAccountBookStore(
    (state) => state.setCurrentAccountBookId
  )
  const categories = useCategoryStore((state) => state.categories)
  const allUsers = useUserStore((state) => state.allUsers)
  const activeUsers = useUserStore((state) => state.activeUsers)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [keyboardInset, setKeyboardInset] = useState(0)
  const keyboardBaseViewportHeightRef = useRef(0)
  const isEditMode = modalMode === 'edit'
  const categoriesRef = useLatest(categories)
  const accountBooksRef = useLatest(accountBooks)
  const activeUsersRef = useLatest(activeUsers)
  const allUsersRef = useLatest(allUsers)
  const selectedTransactionRef = useLatest(selectedTransaction)

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
      selectedTransactionRef.current
    ) {
      setDraft(
        createTransactionDraft({
          baseTransaction: selectedTransactionRef.current,
          accountBooks: accountBooksRef.current,
          users: allUsersRef.current,
          categories: categoriesRef.current,
        })
      )
      return
    }

    const next = createTransactionDraft({
      accountBookId: currentAccountBookId ?? '',
      accountBooks: accountBooksRef.current,
      users: activeUsersRef.current,
      categories: categoriesRef.current,
    })
    setDraft(defaultDate ? { ...next, date: defaultDate } : next)
  }, [
    currentAccountBookId,
    defaultDate,
    isOpen,
    modalMode,
    // Use id as dep (not the whole object) so draft resets when switching
    // to a different transaction in edit/view mode, but NOT when the object
    // reference changes due to unrelated store updates (e.g. adding a subcategory).
    selectedTransaction?.id,
  ])

  useEffect(() => {
    if (!isOpen || modalMode !== 'edit' || !selectedTransaction) {
      setIsDeleteConfirmOpen(false)
    }
  }, [isOpen, modalMode, selectedTransaction])

  useEffect(() => {
    if (!isOpen) {
      setKeyboardInset(0)
      return
    }

    const { body, documentElement } = document
    const previousStyles = {
      htmlOverflow: documentElement.style.overflow,
      htmlScrollBehavior: documentElement.style.scrollBehavior,
      htmlOverscrollBehavior: documentElement.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyOverscrollBehavior: body.style.overscrollBehavior,
    }

    documentElement.style.overflow = 'hidden'
    documentElement.style.scrollBehavior = 'auto'
    documentElement.style.overscrollBehavior = 'none'
    body.style.overflow = 'hidden'
    body.style.overscrollBehavior = 'none'

    return () => {
      documentElement.style.overflow = previousStyles.htmlOverflow
      documentElement.style.scrollBehavior = previousStyles.htmlScrollBehavior
      documentElement.style.overscrollBehavior =
        previousStyles.htmlOverscrollBehavior
      body.style.overflow = previousStyles.bodyOverflow
      body.style.overscrollBehavior = previousStyles.bodyOverscrollBehavior
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      keyboardBaseViewportHeightRef.current = 0
      setKeyboardInset(0)
      return
    }

    const viewport = window.visualViewport

    if (!viewport) {
      keyboardBaseViewportHeightRef.current = 0
      setKeyboardInset(0)
      return
    }

    const updateKeyboardInset = () => {
      const currentViewportHeight = viewport.height

      keyboardBaseViewportHeightRef.current = Math.max(
        keyboardBaseViewportHeightRef.current,
        currentViewportHeight
      )

      const nextInset = Math.max(
        0,
        keyboardBaseViewportHeightRef.current -
          currentViewportHeight -
          viewport.offsetTop
      )

      setKeyboardInset(nextInset)
    }

    updateKeyboardInset()

    viewport.addEventListener('resize', updateKeyboardInset)
    viewport.addEventListener('scroll', updateKeyboardInset)

    return () => {
      viewport.removeEventListener('resize', updateKeyboardInset)
      viewport.removeEventListener('scroll', updateKeyboardInset)
      keyboardBaseViewportHeightRef.current = 0
    }
  }, [isOpen])

  const Form = formMap[draft.type]
  const isSaveDisabled =
    isSubmitting ||
    draft.amount <= 0 ||
    !draft.accountBookId ||
    !draft.categoryId ||
    (draft.type === 'income' && !draft.receivedByUserId)
  const isDeleteDisabled =
    isSubmitting || modalMode !== 'edit' || !selectedTransaction

  function scrollFocusedFieldIntoView(
    container: HTMLDivElement,
    target: HTMLElement
  ) {
    if (!container.isConnected || !target.isConnected) {
      return
    }

    const targetRect = target.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const visualViewportHeight =
      window.visualViewport?.height ?? window.innerHeight
    const padding = 24
    const visibleTop = containerRect.top + padding
    const visibleBottom = Math.min(
      containerRect.bottom - padding,
      visualViewportHeight - padding
    )

    if (targetRect.bottom > visibleBottom) {
      container.scrollTop += targetRect.bottom - visibleBottom
      return
    }

    if (targetRect.top < visibleTop) {
      container.scrollTop -= visibleTop - targetRect.top
    }
  }

  function handleModalBodyFocusCapture(event: FocusEvent<HTMLDivElement>) {
    const container = event.currentTarget
    const target = event.target

    if (!(target instanceof HTMLElement)) {
      return
    }

    const role = target.getAttribute('role')
    const isFocusableField =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      role === 'combobox'

    if (!isFocusableField) {
      return
    }

    const schedule = [0, 150, 300, 450].map((delay) =>
      window.setTimeout(() => {
        if (document.activeElement !== target) {
          return
        }

        scrollFocusedFieldIntoView(container, target)
      }, delay)
    )

    const viewport = window.visualViewport

    if (!viewport) {
      return
    }

    const handleViewportResize = () => {
      if (document.activeElement !== target) {
        return
      }

      scrollFocusedFieldIntoView(container, target)
    }

    const cleanup = () => {
      viewport.removeEventListener('resize', handleViewportResize)
      schedule.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }

    viewport.addEventListener('resize', handleViewportResize)
    target.addEventListener('blur', cleanup, { once: true })
    window.setTimeout(cleanup, 800)
  }

  function handleClose() {
    setIsDeleteConfirmOpen(false)
    onOpenChange(false)
  }

  const modalViewportStyle = {
    '--transaction-modal-keyboard-inset': `${keyboardInset}px`,
  } as CSSProperties

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

        if (
          nextDraft.accountBookId &&
          nextDraft.accountBookId !== currentAccountBookId
        ) {
          setCurrentAccountBookId(nextDraft.accountBookId)
          void router.push(`/account-books/${nextDraft.accountBookId}`)
        }

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
          error instanceof Error
            ? error.message
            : t('transactionModal.toast.unknownError'),
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
          error instanceof Error
            ? error.message
            : t('transactionModal.toast.unknownError'),
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
        disableAnimation
        isDismissable={!isOnboardingActive}
        isKeyboardDismissDisabled={isOnboardingActive}
        hideCloseButton={isOnboardingActive}
        classNames={transactionModalClassNames}
      >
        <ModalContent
          style={modalViewportStyle}
          className="flex min-h-0 max-h-[calc(100vh-env(safe-area-inset-top))] flex-col overflow-hidden overscroll-contain bg-card pb-[calc(100vh-100dvh+env(safe-area-inset-bottom)+var(--transaction-modal-keyboard-inset))] text-card-foreground sm:max-h-[calc(100vh-4rem)] sm:pb-0"
        >
          <ModalHeader className="shrink-0 border-b border-border px-5 py-4 sm:px-6">
            <div className="flex w-full flex-col items-center gap-3">
              <h2 className="text-title font-semibold text-foreground">
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
                classNames={transactionTabsClassNames}
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
                <Tab
                  key="expense"
                  title={t('transactionModal.tabExpense')}
                ></Tab>
                <Tab key="income" title={t('transactionModal.tabIncome')}></Tab>
              </Tabs>
            </div>
          </ModalHeader>
          <ModalBody
            className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain px-5 py-5 [-webkit-overflow-scrolling:touch] sm:px-6"
            onFocusCapture={handleModalBodyFocusCapture}
          >
            <div className="flex flex-col gap-4">
              <Form
                value={draft}
                onChange={modalMode === 'view' ? () => {} : setDraft} // eslint-disable-line @typescript-eslint/no-empty-function
                isEditMode={isEditMode}
              />
              {modalMode === 'edit' ? (
                <div className="rounded-xl bg-danger-50 px-4 py-4 ring-1 ring-danger-200 dark:bg-danger-50/10 dark:ring-danger-400/30">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-body font-semibold text-danger">
                        {t('transactionModal.delete.heading')}
                      </h3>
                      <p className="text-body text-danger-700 dark:text-danger-300">
                        {t('transactionModal.delete.warning')}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <AppButton
                        className="min-h-11 rounded-xl text-body"
                        tone="danger"
                        isDisabled={isDeleteDisabled}
                        onPress={() => setIsDeleteConfirmOpen(true)}
                      >
                        {t('common.delete')}
                      </AppButton>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </ModalBody>
          <ModalFooter
            className={`shrink-0 border-t border-border bg-card px-5 py-4 sm:px-6 ${
              modalMode === 'view'
                ? 'flex justify-end'
                : 'grid grid-cols-2 gap-3'
            }`}
          >
            {modalMode === 'view' ? (
              <AppButton
                className="min-h-11 rounded-xl px-5 text-body"
                appearance="flat"
                tone="neutral"
                onPress={handleClose}
              >
                {t('common.close')}
              </AppButton>
            ) : (
              <>
                <AppButton
                  className="min-h-11 w-full rounded-xl text-body"
                  appearance="flat"
                  tone="neutral"
                  onPress={handleClose}
                >
                  {t('common.cancel')}
                </AppButton>
                <span
                  className="block w-full"
                  data-onboarding-anchor="transaction-form-submit"
                >
                  <AppButton
                    className="min-h-11 w-full rounded-xl text-body"
                    tone="primary"
                    isDisabled={isSaveDisabled}
                    onPress={handleSave}
                  >
                    {modalMode === 'edit'
                      ? t('common.save')
                      : t('common.create')}
                  </AppButton>
                </span>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onOpenChange={(open) => setIsDeleteConfirmOpen(open)}
        classNames={confirmModalClassNames}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-title font-semibold text-foreground">
              {t('transactionModal.delete.confirmTitle')}
            </h3>
          </ModalHeader>
          <ModalBody>
            <p>{t('transactionModal.delete.confirmBody1')}</p>
            <p>{t('transactionModal.delete.confirmBody2')}</p>
          </ModalBody>
          <ModalFooter>
            <AppButton
              className="min-h-11 rounded-xl text-body"
              appearance="flat"
              tone="neutral"
              isDisabled={isSubmitting}
              onPress={() => setIsDeleteConfirmOpen(false)}
            >
              {t('transactionModal.delete.keep')}
            </AppButton>
            <AppButton
              className="min-h-11 rounded-xl text-body"
              tone="danger"
              isDisabled={isDeleteDisabled}
              onPress={handleDelete}
            >
              {t('transactionModal.delete.confirm')}
            </AppButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
