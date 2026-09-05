import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, addToast } from '@heroui/react'
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

export default function SettlementRecordDetailPage() {
  const router = useRouter()
  const t = useTranslations()
  const { id, recordId } = router.query
  const accountBookId = typeof id === 'string' ? id : null
  const settlementRecordId = typeof recordId === 'string' ? recordId : null

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode] = useState<TransactionModalMode>('view')
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null)

  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const initializeCategories = useCategoryStore((state) => state.initialize)

  const { records, completeTransfer } = useSettlement(accountBookId)

  const { transactions: recordTransactions } =
    useSettlementRecordTransactions(settlementRecordId)

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

  function openViewModal(transactionId: string) {
    setSelectedTransactionId(transactionId)
    setIsModalOpen(true)
  }

  function handleModalOpenChange(open: boolean) {
    setIsModalOpen(open)
    if (!open) {
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
          record={record}
          sequenceNumber={sequenceNumber}
          transactions={recordTransactions}
          currency={currentAccountBook?.currency ?? null}
          onCompleteTransfer={handleCompleteTransfer}
          onViewTransaction={openViewModal}
        />
      </PageScaffold>

      <TransactionModal
        isOpen={isModalOpen}
        onOpenChange={handleModalOpenChange}
        modalMode={modalMode}
        selectedTransaction={selectedTransaction}
        isSubmitting={false}
        onCreateTransaction={async (t) => t}
        onUpdateTransaction={async () => null}
        onDeleteTransaction={async () => false}
      />
    </div>
  )
}
