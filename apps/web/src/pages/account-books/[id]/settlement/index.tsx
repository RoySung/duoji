import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
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
import SplitTutorial from '@/components/onboarding/SplitTutorial'
import { PageScaffold } from '@/components/ui/PageScaffold'

export default function SettlementPage() {
  const router = useRouter()
  const t = useTranslations()
  const { id } = router.query
  const accountBookId = typeof id === 'string' ? id : null

  const [autoRound, setAutoRound] = useState(true)
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
    sharedWalletSummary,
    createSettlementRecord,
  } = useSettlement(accountBookId, unsettledTransactions)

  const pendingRecordsCount = records.filter((record) =>
    record.transfers.some((t) => t.status !== 'completed')
  ).length

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
        title: t('settlement.toast.created'),
        color: 'success',
      })
    } catch {
      addToast({
        title: t('settlement.toast.failureTitle'),
        color: 'danger',
        description: t('settlement.toast.failureDescription'),
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
    <SplitTutorial>
      <div className="h-full overflow-y-auto bg-background text-foreground">
        <PageScaffold data-testid="settlement-page">
          <header className="min-w-0 space-y-1">
            <h1 className="text-headline font-semibold leading-tight tracking-[-0.02em] text-foreground text-balance">
              {t('settlement.label')}
            </h1>
            <p className="truncate text-body text-muted-foreground">
              {currentAccountBook?.name ?? t('transactions.fallbackName')}
            </p>
          </header>

          <Tabs
            aria-label={t('settlement.tabsAriaLabel')}
            classNames={{
              base: 'w-full',
              cursor: 'rounded-lg bg-card shadow-none',
              panel: 'px-0 pt-4',
              tab: 'min-h-11',
              tabContent:
                'text-body font-medium text-muted-foreground group-data-[selected=true]:text-foreground',
              tabList: 'w-full rounded-xl bg-muted p-1',
            }}
            data-onboarding-anchor="settlement-tabs"
            fullWidth
          >
            <Tab key="unsettled" title={t('settlement.tabs.unsettled')}>
              <UnsettledTransactionList
                transactions={unsettledTransactions}
                currency={currentAccountBook?.currency ?? null}
                onConfirm={() => setIsConfirmOpen(true)}
                onEditTransaction={openEditModal}
              />
            </Tab>
            <Tab
              key="records"
              title={
                <div className="relative inline-flex items-center">
                  <span>{t('settlement.tabs.history')}</span>
                  {pendingRecordsCount > 0 && (
                    <span className="absolute -right-3.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-label font-bold leading-none text-white">
                      {pendingRecordsCount}
                    </span>
                  )}
                </div>
              }
            >
              <SettlementRecordList
                records={records}
                onSelectRecord={(recordId) =>
                  void router.push(
                    `/account-books/${accountBookId}/settlement/${recordId}`
                  )
                }
              />
            </Tab>
          </Tabs>
        </PageScaffold>

        <SettlementConfirmModal
          isOpen={isConfirmOpen}
          memberStatuses={memberStatuses}
          transferSuggestions={transferSuggestions}
          sharedWalletSummary={sharedWalletSummary}
          currency={currentAccountBook?.currency ?? null}
          autoRound={autoRound}
          onAutoRoundChange={setAutoRound}
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
    </SplitTutorial>
  )
}
