import { useCallback, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { Tabs, Tab, addToast } from '@heroui/react'
import { useAccountBookStore } from '@/stores/accountBook'
import { useCategoryStore } from '@/stores/category'
import {
  haveSameSettlementPreview,
  type SettlementPreview,
  useSettlement,
} from '@/hooks/useSettlement'
import { StaleSettlementReviewError } from '@/entities/settlement'
import { Transaction, TransactionModalMode } from '@/entities/transaction'
import { useUnsettledTransactions } from '@/hooks/useUnsettledTransactions'
import UnsettledTransactionList from '@/components/settlement/UnsettledTransactionList'
import SettlementRecordList from '@/components/settlement/SettlementRecordList'
import SettlementConfirmModal from '@/components/settlement/SettlementConfirmModal'
import { TransactionModal } from '@/components/TransactionModal'
import SplitTutorial from '@/components/onboarding/SplitTutorial'
import { PageScaffold } from '@/components/ui/PageScaffold'
import { useRegisterCreateTransactionHandler } from '@/components/TransactionModal/TransactionModalLauncher'
import { useAccountBookTransactions } from '@/hooks/useAccountBookTransactions'

export default function SettlementPage() {
  const router = useRouter()
  const t = useTranslations()
  const { id } = router.query
  const accountBookId = typeof id === 'string' ? id : null

  const [autoRound, setAutoRound] = useState(true)
  const [openedPreview, setOpenedPreview] = useState<SettlementPreview | null>(
    null
  )
  const [staleConfirmation, setStaleConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<TransactionModalMode>('edit')
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null)
  const [isModalSubmitting, setIsModalSubmitting] = useState(false)

  const accountBooks = useAccountBookStore((state) => state.accountBooks)

  const initializeCategories = useCategoryStore((state) => state.initialize)
  const categories = useCategoryStore((state) => state.expenseCategories)
  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories]
  )

  const { transactions: unsettledTransactions, refresh: refreshUnsettled } =
    useUnsettledTransactions(accountBookId)
  const { createTransaction, updateTransaction, deleteTransaction } =
    useAccountBookTransactions(accountBookId, null)

  const { records, preview, createSettlementRecord, refreshReviewUsers } = useSettlement(
    accountBookId,
    unsettledTransactions
  )

  const isConfirmOpen =
    openedPreview !== null && openedPreview.accountBookId === accountBookId
  const reviewChanged = useMemo(
    () =>
      staleConfirmation ||
      (openedPreview !== null &&
        preview !== null &&
        !haveSameSettlementPreview(openedPreview, preview)),
    [staleConfirmation, openedPreview, preview]
  )

  function openReview() {
    setStaleConfirmation(false)
    setOpenedPreview(preview)
  }

  function closeReview() {
    setOpenedPreview(null)
    setStaleConfirmation(false)
  }

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
    if (!isConfirmOpen || isSubmitting || !preview?.transactions.length) return

    setIsSubmitting(true)
    try {
      await createSettlementRecord(preview)
      closeReview()
      await refreshUnsettled()
      addToast({
        title: t('settlement.toast.created'),
        color: 'success',
      })
    } catch (error) {
      if (error instanceof StaleSettlementReviewError) {
        setStaleConfirmation(true)
        try {
          await Promise.all([refreshUnsettled(), refreshReviewUsers()])
          return
        } catch {
          // Use the existing failure message if the review cannot be refreshed.
        }
      }

      addToast({
        title: t('settlement.toast.failureTitle'),
        color: 'danger',
        description: t('settlement.toast.failureDescription'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openCreateModal = useCallback(() => {
    flushSync(() => {
      setModalMode('create')
      setSelectedTransactionId(null)
      setIsModalOpen(true)
    })
  }, [])

  useRegisterCreateTransactionHandler(openCreateModal)

  function openEditModal(transactionId: string) {
    flushSync(() => {
      setModalMode('edit')
      setSelectedTransactionId(transactionId)
      setIsModalOpen(true)
    })
  }

  function handleModalOpenChange(open: boolean) {
    setIsModalOpen(open)
    if (!open) {
      setModalMode('edit')
      setSelectedTransactionId(null)
    }
  }

  async function handleCreateTransaction(
    transaction: Transaction
  ): Promise<Transaction> {
    setIsModalSubmitting(true)
    try {
      const created = await createTransaction(transaction)
      await refreshUnsettled()
      return created
    } finally {
      setIsModalSubmitting(false)
    }
  }

  async function handleUpdateTransaction(
    id: string,
    updates: Partial<Transaction>
  ): Promise<Transaction | null> {
    setIsModalSubmitting(true)
    try {
      const updated = await updateTransaction(id, updates)
      await refreshUnsettled()
      return updated
    } finally {
      setIsModalSubmitting(false)
    }
  }

  async function handleDeleteTransaction(id: string): Promise<boolean> {
    setIsModalSubmitting(true)
    try {
      const deleted = await deleteTransaction(id)
      await refreshUnsettled()
      return deleted
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
                onConfirm={preview?.transactions.length ? openReview : undefined}
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

        {preview && (
          <SettlementConfirmModal
            isOpen={isConfirmOpen}
            memberStatuses={preview.memberStatuses}
            transferSuggestions={preview.transferSuggestions}
            sharedWalletSummary={preview.sharedWalletSummary}
            transactions={preview.transactions}
            users={preview.users}
            categoryNames={categoryNames}
            currency={currentAccountBook?.currency ?? null}
            autoRound={autoRound}
            onAutoRoundChange={setAutoRound}
            isSubmitting={isSubmitting}
            reviewChanged={reviewChanged}
            onConfirm={handleCreateRecord}
            onClose={closeReview}
          />
        )}

        <TransactionModal
          isOpen={isModalOpen}
          onOpenChange={handleModalOpenChange}
          modalMode={modalMode}
          selectedTransaction={selectedTransaction}
          isSubmitting={isModalSubmitting}
          onCreateTransaction={handleCreateTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </div>
    </SplitTutorial>
  )
}
