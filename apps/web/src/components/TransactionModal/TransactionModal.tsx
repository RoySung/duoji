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
import { TransactionType } from '@/entities/transaction'
import ExpenseForm from './ExpenseForm'
import IncomeForm from './IncomeForm'
import { useTransactionStore } from '@/stores/transaction'
import { useAccountBookStore } from '@/stores/accountBook'
import {
  changeTransactionDraftType,
  createTransactionDraft,
} from '@/utils/transactionUtils'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const formMap = {
  expense: ExpenseForm,
  income: IncomeForm,
}

export default function TransactionModal({ isOpen, onOpenChange }: Props) {
  const modalMode = useTransactionStore((state) => state.modalMode)
  const selectedTransaction = useTransactionStore((state) =>
    state.transactions.find(
      (transaction) => transaction.id === state.selectedTransactionId
    )
  )
  const createTransaction = useTransactionStore(
    (state) => state.createTransaction
  )
  const updateTransaction = useTransactionStore(
    (state) => state.updateTransaction
  )
  const deleteTransaction = useTransactionStore(
    (state) => state.deleteTransaction
  )
  const isSubmitting = useTransactionStore((state) => state.isLoading)
  const currentAccountBookId = useAccountBookStore(
    (state) => state.currentAccountBookId
  )
  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [draft, setDraft] = useState(() =>
    createTransactionDraft({
      accountBookId: currentAccountBookId ?? '',
      accountBooks,
    })
  )

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (modalMode === 'edit' && selectedTransaction) {
      setDraft(
        createTransactionDraft({
          baseTransaction: selectedTransaction,
          accountBooks,
        })
      )
      return
    }

    setDraft(
      createTransactionDraft({
        accountBookId: currentAccountBookId ?? '',
        accountBooks,
      })
    )
  }, [
    accountBooks,
    currentAccountBookId,
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
        const updatedTransaction = await updateTransaction(nextDraft.id, {
          ...nextDraft,
          updatedAt: timestamp,
        })

        if (!updatedTransaction) {
          throw new Error('Unable to update the selected transaction.')
        }

        addToast({
          title: 'Transaction updated',
          color: 'success',
          description: 'The transaction changes have been saved.',
        })
      } else {
        await createTransaction({
          ...nextDraft,
          updatedAt: timestamp,
        })

        addToast({
          title: 'Transaction created',
          color: 'success',
          description:
            'The transaction has been added to the current account book.',
        })
      }

      handleClose()
    } catch (error) {
      addToast({
        title:
          modalMode === 'edit'
            ? 'Unable to update transaction'
            : 'Unable to create transaction',
        color: 'danger',
        description:
          error instanceof Error ? error.message : 'Unknown transaction error',
      })
    }
  }

  async function handleDelete() {
    if (!selectedTransaction) {
      return
    }

    try {
      const deleted = await deleteTransaction(selectedTransaction.id)

      if (!deleted) {
        throw new Error('Unable to delete the selected transaction.')
      }

      setIsDeleteConfirmOpen(false)
      addToast({
        title: 'Transaction deleted',
        color: 'success',
        description: 'The transaction has been removed from the account book.',
      })
      onOpenChange(false)
    } catch (error) {
      addToast({
        title: 'Unable to delete transaction',
        color: 'danger',
        description:
          error instanceof Error ? error.message : 'Unknown transaction error',
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
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-col gap-2 items-center w-full">
              <h2>
                {modalMode === 'edit' ? 'Edit Transaction' : 'New Transaction'}
              </h2>
              <Tabs
                fullWidth
                aria-label="Transaction Type"
                selectedKey={draft.type}
                size="md"
                onSelectionChange={(key) => {
                  setDraft((currentDraft) =>
                    changeTransactionDraftType(
                      currentDraft,
                      key as TransactionType,
                      accountBooks
                    )
                  )
                }}
              >
                <Tab key="expense" title="Expense"></Tab>
                <Tab key="income" title="Income"></Tab>
              </Tabs>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <ScrollShadow size={50}>
                <Form value={draft} onChange={setDraft} />
              </ScrollShadow>
              {modalMode === 'edit' ? (
                <div className="rounded-large border border-danger-200 bg-danger-50 px-4 py-3">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold text-danger">
                        Delete transaction
                      </h3>
                      <p className="text-sm text-danger-700">
                        This action cannot be undone. Are you sure you want to
                        delete it?
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        color="danger"
                        isDisabled={isDeleteDisabled}
                        onPress={() => setIsDeleteConfirmOpen(true)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={handleClose}>Cancel</Button>
            <Button
              color="primary"
              isDisabled={isSaveDisabled}
              onPress={handleSave}
            >
              {modalMode === 'edit' ? 'Save' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onOpenChange={(open) => setIsDeleteConfirmOpen(open)}
      >
        <ModalContent>
          <ModalHeader>
            <h3>Delete Transaction</h3>
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this transaction?</p>
            <p>This action cannot be undone.</p>
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={isSubmitting}
              onPress={() => setIsDeleteConfirmOpen(false)}
            >
              Keep Transaction
            </Button>
            <Button
              color="danger"
              isDisabled={isDeleteDisabled}
              onPress={handleDelete}
            >
              Confirm Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
