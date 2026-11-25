import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { useRouter } from 'next/router'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  addToast,
} from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { PiArrowLeftBold } from 'react-icons/pi'
import { useAccountBookStore } from '@/stores/accountBook'
import { useCategoryStore } from '@/stores/category'
import { useSettlement } from '@/hooks/useSettlement'
import SettlementRecordDetail from '@/components/settlement/SettlementRecordDetail'
import { TransactionModalMode } from '@/entities/transaction'
import { TransactionModal } from '@/components/TransactionModal'
import { useSettlementRecordTransactions } from '@/hooks/useSettlementRecordTransactions'
import { PageScaffold } from '@/components/ui/PageScaffold'
import { SurfaceCard } from '@/components/ui/SurfaceCard'
import { useAccountBookTransactions } from '@/hooks/useAccountBookTransactions'
import { useRegisterCreateTransactionHandler } from '@/components/TransactionModal/TransactionModalLauncher'
import { confirmModalClassNames } from '@/components/TransactionModal/formControlStyles'
import { AppButton } from '@/components/ui/AppButton'

export default function SettlementRecordDetailPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const t = useTranslations()
  const { id, recordId } = router.query
  const accountBookId = typeof id === 'string' ? id : null
  const settlementRecordId = typeof recordId === 'string' ? recordId : null

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCancelOpen, setIsCancelOpen] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const [modalMode, setModalMode] = useState<TransactionModalMode>('view')
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null)

  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const initializeCategories = useCategoryStore((state) => state.initialize)

  const { records, cancelSettlementRecord, completeTransfer } =
    useSettlement(accountBookId)

  const {
    transactions: recordTransactions,
    status: transactionStatus,
    isLoading: isLoadingTransactions,
    loadTransactions,
  } = useSettlementRecordTransactions(settlementRecordId)
  const { createTransaction, isMutating } = useAccountBookTransactions(
    accountBookId,
    null
  )

  const currentAccountBook =
    accountBooks.find((ab) => ab.id === accountBookId) ?? null
  const record = records.find((r) => r.id === settlementRecordId) ?? null
  const activeRecords = [...records].sort((a, b) => b.createdAt - a.createdAt)
  const recordIndex = record
    ? activeRecords.findIndex((r) => r.id === record.id)
    : -1
  const sequenceNumber =
    recordIndex >= 0 ? activeRecords.length - recordIndex : 0

  const selectedTransaction =
    recordTransactions.find((t) => t.id === selectedTransactionId) ?? undefined

  useEffect(() => {
    void initializeCategories(accountBookId)
  }, [accountBookId, initializeCategories])

  const openCreateModal = useCallback(() => {
    flushSync(() => {
      setModalMode('create')
      setSelectedTransactionId(null)
      setIsModalOpen(true)
    })
  }, [])

  useRegisterCreateTransactionHandler(openCreateModal)

  function openViewModal(transactionId: string) {
    flushSync(() => {
      setModalMode('view')
      setSelectedTransactionId(transactionId)
      setIsModalOpen(true)
    })
  }

  function handleModalOpenChange(open: boolean) {
    setIsModalOpen(open)
    if (!open) {
      setModalMode('view')
      setSelectedTransactionId(null)
    }
  }

  if (!accountBookId || !settlementRecordId) return null

  if (!record) {
    return (
      <div className="h-full overflow-y-auto bg-background text-foreground">
        <PageScaffold className="items-center justify-center">
          <SurfaceCard
            className="w-full px-6 py-12 text-center sm:px-8 sm:py-14"
            role="status"
          >
            <p className="text-body leading-6 text-muted-foreground">
              {t('settlement.recordPage.notFound')}
            </p>
            <Button
              className="mt-5 min-h-11 rounded-xl bg-primary px-4 text-body text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
              onPress={() =>
                void router.push(`/account-books/${accountBookId}/settlement`)
              }
            >
              {t('settlement.recordPage.back')}
            </Button>
          </SurfaceCard>
        </PageScaffold>
      </div>
    )
  }

  const canCancel = record.transfers.every(
    (transfer) => transfer.status !== 'completed'
  )

  async function handleCancelSettlement() {
    if (!record || !canCancel || isCanceling) return

    setIsCanceling(true)
    try {
      await cancelSettlementRecord(record.id)
    } catch {
      addToast({
        title: t('settlement.cancel.error'),
        color: 'danger',
        description: t('settlement.cancel.errorDescription'),
      })
      return
    } finally {
      setIsCanceling(false)
    }

    setIsCancelOpen(false)
    void queryClient.invalidateQueries({ queryKey: ['transactions'] })
    addToast({ title: t('settlement.cancel.success'), color: 'success' })
    void router.replace(`/account-books/${record.accountBookId}/settlement`)
  }

  async function handleCompleteTransfer(
    transferId: string,
    actualAmount: number,
    note: string
  ) {
    try {
      await completeTransfer(
        settlementRecordId!,
        transferId,
        actualAmount,
        note
      )
      addToast({
        title: t('settlement.recordPage.toastSuccess'),
        color: 'success',
      })
    } catch {
      addToast({
        title: t('settlement.recordPage.toastErrorTitle'),
        color: 'danger',
        description: t('settlement.toast.failureDescription'),
      })
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <PageScaffold data-testid="settlement-record-page">
        <Button
          className="min-h-11 self-start rounded-xl px-3 text-body text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          size="sm"
          variant="light"
          startContent={<PiArrowLeftBold size={14} />}
          onPress={() =>
            void router.push(`/account-books/${accountBookId}/settlement`)
          }
        >
          {t('settlement.recordPage.back')}
        </Button>

        <SettlementRecordDetail
          key={record.id}
          record={record}
          sequenceNumber={sequenceNumber}
          transactions={recordTransactions}
          transactionStatus={transactionStatus}
          onRetryTransactions={() => void loadTransactions(record.id)}
          currency={currentAccountBook?.currency ?? null}
          onCompleteTransfer={handleCompleteTransfer}
          onViewTransaction={openViewModal}
          onRequestCancel={canCancel ? () => setIsCancelOpen(true) : undefined}
          isCancelDisabled={isLoadingTransactions || isCanceling}
        />
      </PageScaffold>

      <Modal
        classNames={confirmModalClassNames}
        hideCloseButton={isCanceling}
        isDismissable={!isCanceling}
        isKeyboardDismissDisabled={isCanceling}
        isOpen={isCancelOpen && canCancel}
        onOpenChange={(open) => !isCanceling && setIsCancelOpen(open)}
        placement="center"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-title font-semibold text-foreground">
              {t('settlement.cancel.action')}
            </h2>
          </ModalHeader>
          <ModalBody>
            <p className="text-body text-muted-foreground">
              {t('settlement.cancel.description', {
                count: recordTransactions.length,
              })}
            </p>
          </ModalBody>
          <ModalFooter className="flex-wrap">
            <AppButton
              appearance="light"
              className="min-h-11 rounded-xl text-body"
              isDisabled={isCanceling}
              tone="neutral"
              onPress={() => setIsCancelOpen(false)}
            >
              {t('settlement.cancel.keep')}
            </AppButton>
            <AppButton
              className="min-h-11 rounded-xl text-body"
              disableRipple
              isLoading={isCanceling}
              tone="danger"
              onPress={() => void handleCancelSettlement()}
            >
              {t('settlement.cancel.confirm')}
            </AppButton>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <TransactionModal
        isOpen={isModalOpen}
        onOpenChange={handleModalOpenChange}
        modalMode={modalMode}
        selectedTransaction={selectedTransaction}
        isSubmitting={isMutating}
        onCreateTransaction={createTransaction}
        onUpdateTransaction={async () => null}
        onDeleteTransaction={async () => false}
      />
    </div>
  )
}
