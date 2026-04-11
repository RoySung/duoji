import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Tabs, Tab, addToast } from '@heroui/react'
import { useAccountBookStore } from '@/stores/accountBook'
import { useCategoryStore } from '@/stores/category'
import { useSettlement } from '@/hooks/useSettlement'
import { Transaction, TransactionModalMode } from '@/entities/transaction'
import { useUnsettledTransactions } from '@/hooks/useUnsettledTransactions'
import UnsettledTransactionList from '@/components/settlement/UnsettledTransactionList'
import SettlementRecordList from '@/components/settlement/SettlementRecordList'
import SettlementConfirmModal from '@/components/settlement/SettlementConfirmModal'
import { TransactionModal } from '@/components/TransactionModal'

export default function SettlementPage() {
  const router = useRouter()
  const { id } = router.query
  const accountBookId = typeof id === 'string' ? id : null

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<TransactionModalMode>('edit')
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null)
  const [isModalSubmitting, setIsModalSubmitting] = useState(false)

  const accountBooks = useAccountBookStore((state) => state.accountBooks)

  const initializeCategories = useCategoryStore((state) => state.initialize)

  const {
    transactions: unsettledTransactions,
    refresh: refreshUnsettled,
    updateTransaction,
    deleteTransaction,
  } = useUnsettledTransactions(accountBookId)

  const {
    records,
    memberStatuses,
    transferSuggestions,
    createSettlementRecord,
  } = useSettlement(accountBookId, unsettledTransactions)

  const currentAccountBook =
    accountBooks.find((ab) => ab.id === accountBookId) ?? null

  const selectedTransaction =
    unsettledTransactions?.find((t) => t.id === selectedTransactionId) ??
    undefined

  useEffect(() => {
    void initializeCategories(accountBookId)
  }, [accountBookId, initializeCategories])

  async function handleCreateRecord() {
    if (!accountBookId || !unsettledTransactions) return

    setIsSubmitting(true)
    try {
      await createSettlementRecord(unsettledTransactions)
      await refreshUnsettled()
      setIsConfirmOpen(false)
      addToast({
        title: 'Settlement record created',
        color: 'success',
      })
    } catch {
      addToast({
        title: 'Unable to create settlement',
        color: 'danger',
        description: 'Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function openEditModal(transactionId: string) {
    setModalMode('edit')
    setSelectedTransactionId(transactionId)
    setIsModalOpen(true)
  }

  function handleModalOpenChange(open: boolean) {
    setIsModalOpen(open)
    if (!open) {
      setSelectedTransactionId(null)
    }
  }

  async function handleUpdateTransaction(
    id: string,
    updates: Partial<Transaction>
  ): Promise<Transaction | null> {
    setIsModalSubmitting(true)
    try {
      return await updateTransaction(id, updates)
    } finally {
      setIsModalSubmitting(false)
    }
  }

  async function handleDeleteTransaction(id: string): Promise<boolean> {
    setIsModalSubmitting(true)
    try {
      return await deleteTransaction(id)
    } finally {
      setIsModalSubmitting(false)
    }
  }

  if (!accountBookId || unsettledTransactions === null) return null

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-6 px-4 py-8">
        <div className="space-y-1">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-300">
            Settlement
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {currentAccountBook?.name ?? 'Account book'}
          </h1>
        </div>

        <Tabs aria-label="Settlement tabs" fullWidth>
          <Tab key="unsettled" title="Unsettled">
            <div className="pt-4">
              <UnsettledTransactionList
                transactions={unsettledTransactions}
                currency={currentAccountBook?.currency ?? null}
                onConfirm={() => setIsConfirmOpen(true)}
                onEditTransaction={openEditModal}
              />
            </div>
          </Tab>
          <Tab key="records" title="History">
            <div className="pt-4">
              <SettlementRecordList
                records={records}
                onSelectRecord={(recordId) =>
                  void router.push(
                    `/account-books/${accountBookId}/settlement/${recordId}`
                  )
                }
              />
            </div>
          </Tab>
        </Tabs>
      </div>

      <SettlementConfirmModal
        isOpen={isConfirmOpen}
        memberStatuses={memberStatuses}
        transferSuggestions={transferSuggestions}
        currency={currentAccountBook?.currency ?? null}
        isSubmitting={isSubmitting}
        onConfirm={handleCreateRecord}
        onClose={() => setIsConfirmOpen(false)}
      />

      <TransactionModal
        isOpen={isModalOpen}
        onOpenChange={handleModalOpenChange}
        modalMode={modalMode}
        selectedTransaction={selectedTransaction}
        isSubmitting={isModalSubmitting}
        onCreateTransaction={async (t) => t}
        onUpdateTransaction={handleUpdateTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />
    </div>
  )
}
