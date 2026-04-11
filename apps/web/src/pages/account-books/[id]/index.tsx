import { Chip, Button } from '@heroui/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { PiBooksBold, PiListPlusFill } from 'react-icons/pi'
import TransactionList from '@/components/transaction/TransactionList'
import { TransactionModal } from '@/components/TransactionModal'
import { useAccountBookStore } from '@/stores/accountBook'
import { useAccountBookTransactions } from '@/hooks/useAccountBookTransactions'
import { TransactionModalMode } from '@/entities/transaction'

export default function AccountBookPage() {
  const router = useRouter()
  const { id } = router.query
  const accountBookId = typeof id === 'string' ? id : null

  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const isAccountBooksInitialized = useAccountBookStore(
    (state) => state.initialized
  )

  const {
    transactions,
    isLoading: isTransactionsLoading,
    error: transactionError,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useAccountBookTransactions(accountBookId)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<TransactionModalMode>('create')
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null)

  const currentAccountBook =
    accountBooks.find((ab) => ab.id === accountBookId) ?? null
  const selectedTransaction =
    transactions.find((t) => t.id === selectedTransactionId) ?? undefined

  function openCreateModal() {
    setModalMode('create')
    setSelectedTransactionId(null)
    setIsModalOpen(true)
  }

  function openEditModal(transactionId: string) {
    setModalMode('edit')
    setSelectedTransactionId(transactionId)
    setIsModalOpen(true)
  }

  useEffect(() => {
    if (router.query.modal === 'create') {
      openCreateModal()
      void router.replace(
        { pathname: router.pathname, query: { id: accountBookId } },
        undefined,
        { shallow: true }
      )
    }
  }, [router.query.modal])

  function handleModalOpenChange(open: boolean) {
    setIsModalOpen(open)
    if (!open) {
      setModalMode('create')
      setSelectedTransactionId(null)
    }
  }

  if (!accountBookId) {
    return null
  }

  if (isAccountBooksInitialized && !currentAccountBook) {
    return (
      <div className="h-full overflow-y-auto bg-background text-foreground">
        <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col items-center justify-center gap-8 px-4 py-8">
          <div className="w-full rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-lg shadow-black/5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300">
              <PiBooksBold size={26} />
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
              Account book not found
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This account book does not exist or has been deleted.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-8 px-4 py-8">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/5">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-300">
                Transactions
              </p>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {currentAccountBook?.name ?? 'Account book'}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-3 self-start">
              <Chip
                className="bg-accent text-muted-foreground"
                size="sm"
                variant="flat"
              >
                {transactions.length} records
              </Chip>
              <Button
                size="sm"
                color="primary"
                startContent={<PiListPlusFill size={16} />}
                onPress={openCreateModal}
              >
                New Transaction
              </Button>
            </div>
          </div>

          <TransactionList
            currency={currentAccountBook?.currency ?? null}
            error={transactionError}
            isLoading={isTransactionsLoading}
            transactions={transactions}
            onEditTransaction={openEditModal}
          />
        </section>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onOpenChange={handleModalOpenChange}
        modalMode={modalMode}
        selectedTransaction={selectedTransaction}
        isSubmitting={isTransactionsLoading}
        onCreateTransaction={createTransaction}
        onUpdateTransaction={updateTransaction}
        onDeleteTransaction={deleteTransaction}
      />
    </div>
  )
}
