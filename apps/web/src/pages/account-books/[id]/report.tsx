import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import dayjs from 'dayjs'
import { Button } from '@heroui/react'
import { PiBooksBold, PiCheckBold, PiDownloadSimpleBold } from 'react-icons/pi'
import BookFilterSelector from '@/components/report/BookFilterSelector'
import ReportSection from '@/components/report/ReportSection'
import TagFilterSelector from '@/components/report/TagFilterSelector'
import MemberFilterSelector from '@/components/report/MemberFilterSelector'
import TimeRangeSelector from '@/components/report/TimeRangeSelector'
import { useExportTransactionsCsv } from '@/hooks/useExportTransactionsCsv'
import { useReportTransactions } from '@/hooks/useReportTransactions'
import { useAccountBookTransactions } from '@/hooks/useAccountBookTransactions'
import { useAccountBookStore } from '@/stores/accountBook'
import { useCategoryStore } from '@/stores/category'
import { useUserStore } from '@/stores/user'
import { isSharedWalletUser, isDeletedUser } from '@/entities/user'
import { extractReportTags, groupByCurrency, filterTransactionsByMember } from '@/utils/reportAggregate'
import { Currency } from '@/entities/accountBook'
import ReportTutorial from '@/components/onboarding/ReportTutorial'
import { TransactionModal } from '@/components/TransactionModal'
import { TransactionModalMode } from '@/entities/transaction'

type DateRange = { startDate: string; endDate: string }

function getDefaultReportDateRange(): DateRange {
  const today = dayjs()
  return {
    startDate: today.startOf('month').format('YYYY/MM/DD'),
    endDate: today.endOf('month').format('YYYY/MM/DD'),
  }
}

export default function AccountBookReportPage() {
  const router = useRouter()
  const t = useTranslations()
  const { id } = router.query
  const accountBookId = typeof id === 'string' ? id : null

  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const isAccountBooksInitialized = useAccountBookStore(
    (state) => state.initialized
  )
  const categories = useCategoryStore((state) => state.categories)

  const [dateRange, setDateRange] = useState<DateRange | null>(() =>
    getDefaultReportDateRange()
  )
  const [excludedBookIds, setExcludedBookIds] = useState<Set<string>>(
    () => new Set()
  )
  const [excludedKeys, setExcludedKeys] = useState<Set<string>>(() => new Set())
  const [selectedTags, setSelectedTags] = useState<Set<string>>(() => new Set())
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<TransactionModalMode>('view')
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null)

  const {
    transactions,
    isLoading,
    isFetching,
    error,
  } = useReportTransactions(accountBookId, dateRange)

  const {
    updateTransaction,
    deleteTransaction,
    createTransaction,
    isMutating,
  } = useAccountBookTransactions(accountBookId, null)

  const selectedTransaction =
    transactions.find((t) => t.id === selectedTransactionId) ?? undefined

  function openEditModal(transactionId: string) {
    setModalMode('edit')
    setSelectedTransactionId(transactionId)
    setIsModalOpen(true)
  }

  function handleModalOpenChange(open: boolean) {
    setIsModalOpen(open)
    if (!open) {
      setModalMode('view')
      setSelectedTransactionId(null)
    }
  }

  const isAllBooksView = accountBookId === 'all'
  const currentAccountBook = isAllBooksView
    ? null
    : accountBooks.find((ab) => ab.id === accountBookId) ?? null

  const bookFilteredTransactions = useMemo(() => {
    if (!isAllBooksView || excludedBookIds.size === 0) return transactions
    return transactions.filter((tx) => !excludedBookIds.has(tx.accountBookId))
  }, [isAllBooksView, transactions, excludedBookIds])

  const allUsers = useUserStore((state) => state.allUsers)

  const sharedWalletIds = useMemo(
    () => new Set(allUsers.filter(isSharedWalletUser).map((u) => u.id)),
    [allUsers]
  )


  const availableMembers = useMemo(() => {
    const memberIds = new Set<string>()
    for (const tx of bookFilteredTransactions) {
      if (tx.type === 'expense') {
        for (const item of tx.splitDetail) {
          memberIds.add(item.userId)
        }
      } else if (tx.type === 'income' && tx.receivedByUserId) {
        memberIds.add(tx.receivedByUserId)
      }
    }

    return Array.from(memberIds)
      .map((id) => {
        const found = allUsers.find((u) => u.id === id)
        if (found) return found
        return {
          id,
          name: `Member (${id.substring(0, 4)})`,
          type: 'virtual' as const,
          accountBookId: accountBookId ?? '',
          createdAt: 0,
          updatedAt: 0,
        }
      })
      .filter((u) => !isSharedWalletUser(u))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [bookFilteredTransactions, allUsers])

  useEffect(() => {
    if (
      selectedMemberId &&
      !availableMembers.some((m) => m.id === selectedMemberId)
    ) {
      setSelectedMemberId(null)
    }
  }, [availableMembers, selectedMemberId])

  const realMembersCountMap = useMemo(() => {
    const map = new Map<string, number>()

    for (const book of accountBooks) {
      map.set(book.id, book.userIds?.length ?? 0)
    }

    for (const user of allUsers) {
      if (
        user.type === 'virtual' &&
        user.accountBookId &&
        !isDeletedUser(user) &&
        !isSharedWalletUser(user)
      ) {
        const currentCount = map.get(user.accountBookId) || 0
        map.set(user.accountBookId, currentCount + 1)
      }
    }

    return map
  }, [accountBooks, allUsers])

  const memberFilteredTransactions = useMemo(() => {
    return filterTransactionsByMember(
      bookFilteredTransactions,
      selectedMemberId,
      realMembersCountMap,
      sharedWalletIds
    )
  }, [
    bookFilteredTransactions,
    selectedMemberId,
    realMembersCountMap,
    sharedWalletIds,
  ])

  const currencyGroups = useMemo(() => {
    if (!isAllBooksView) return []
    return groupByCurrency(memberFilteredTransactions, accountBooks)
  }, [isAllBooksView, memberFilteredTransactions, accountBooks])

  const availableTags = useMemo(
    () => extractReportTags(bookFilteredTransactions),
    [bookFilteredTransactions]
  )

  useEffect(() => {
    const availableTagSet = new Set(availableTags)

    setSelectedTags((prev) => {
      const next = new Set(
        Array.from(prev).filter((tag) => availableTagSet.has(tag))
      )

      if (next.size === prev.size) {
        return prev
      }

      return next
    })
  }, [availableTags])

  const { exportCsv } = useExportTransactionsCsv(
    bookFilteredTransactions,
    categories
  )

  const [justExported, setJustExported] = useState(false)

  function handleExportCsv() {
    exportCsv()
    setJustExported(true)
    setTimeout(() => setJustExported(false), 1500)
  }

  function toggleKey(key: string) {
    setExcludedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  if (!accountBookId) {
    return null
  }

  if (isAccountBooksInitialized && !currentAccountBook && !isAllBooksView) {
    return (
      <div className="h-full overflow-y-auto bg-background text-foreground">
        <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col items-center justify-center gap-8 px-4 py-8">
          <div className="w-full rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-lg shadow-black/5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary-300">
              <PiBooksBold size={26} />
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
              {t('transactions.notFoundTitle')}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('transactions.notFoundDescription')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const singleCurrency: Currency = currentAccountBook?.currency ?? 'TWD'

  return (
    <ReportTutorial>
      <div className="h-full overflow-y-auto bg-background text-foreground">
        <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-6 px-4 py-8">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary-300">
                {t('report.label')}
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {isAllBooksView
                  ? t('transactions.allBooks')
                  : currentAccountBook?.name ?? t('transactions.fallbackName')}
              </h1>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Button
                variant="flat"
                size="sm"
                startContent={
                  justExported ? (
                    <PiCheckBold size={14} />
                  ) : (
                    <PiDownloadSimpleBold size={14} />
                  )
                }
                isDisabled={
                  isLoading ||
                  isFetching ||
                  bookFilteredTransactions.length === 0
                }
                onPress={handleExportCsv}
                aria-label={`Export ${bookFilteredTransactions.length} transactions as CSV`}
                className="bg-accent/60 text-foreground"
              >
                {justExported ? t('report.exported') : t('report.exportCsv')}
              </Button>
              <div
                className="flex flex-wrap items-start gap-2"
                data-onboarding-anchor="report-filters"
              >
                {isAllBooksView ? (
                  <BookFilterSelector
                    accountBooks={accountBooks}
                    excludedBookIds={excludedBookIds}
                    onChange={setExcludedBookIds}
                  />
                ) : null}
                <TagFilterSelector
                  allTags={availableTags}
                  selectedTags={selectedTags}
                  onChange={setSelectedTags}
                />
                <MemberFilterSelector
                  availableMembers={availableMembers}
                  selectedMemberId={selectedMemberId}
                  onChange={setSelectedMemberId}
                />
                <TimeRangeSelector value={dateRange} onChange={setDateRange} />
              </div>
            </div>
          </header>

          {error ? (
            <div className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger-700">
              {error}
            </div>
          ) : null}

          {isLoading ? (
            <div className="flex items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-background px-5 py-10 text-center text-sm text-muted-foreground">
              <span
                aria-hidden
                className="h-4 w-4 animate-spin rounded-full border-2 border-primary-300 border-t-transparent"
              />
              {t('report.loading')}
            </div>
          ) : (
            <div className="relative">
              {isFetching ? (
                <div
                  className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center pt-6"
                  aria-live="polite"
                  aria-busy="true"
                >
                  <div className="flex items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur">
                    <span
                      aria-hidden
                      className="h-3 w-3 animate-spin rounded-full border-2 border-primary-300 border-t-transparent"
                    />
                    {t('report.updating')}
                  </div>
                </div>
              ) : null}
              <div
                className={
                  isFetching
                    ? 'flex flex-col gap-6 opacity-60 transition-opacity duration-200'
                    : 'flex flex-col gap-6 transition-opacity duration-200'
                }
              >
                {isAllBooksView ? (
                  currencyGroups.length === 0 ? (
                    <ReportSection
                      transactions={[]}
                      categories={categories}
                      mergeByName
                      currency="TWD"
                      selectedTags={selectedTags}
                      excludedKeys={excludedKeys}
                      onToggleKey={toggleKey}
                      onEditTransaction={openEditModal}
                    />
                  ) : (
                    currencyGroups.map((group) => (
                      <ReportSection
                        key={group.currency}
                        transactions={group.transactions}
                        categories={categories}
                        mergeByName
                        currency={group.currency}
                        selectedTags={selectedTags}
                        showCurrencyHeading
                        label={group.currency}
                        excludedKeys={excludedKeys}
                        onToggleKey={toggleKey}
                        onEditTransaction={openEditModal}
                      />
                    ))
                  )
                ) : (
                  <ReportSection
                    transactions={memberFilteredTransactions}
                    categories={categories}
                    mergeByName={false}
                    currency={singleCurrency}
                    selectedTags={selectedTags}
                    accountBook={currentAccountBook}
                    excludedKeys={excludedKeys}
                    onToggleKey={toggleKey}
                    onEditTransaction={openEditModal}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onOpenChange={handleModalOpenChange}
        modalMode={modalMode}
        defaultDate={null}
        selectedTransaction={selectedTransaction}
        isSubmitting={isMutating}
        onCreateTransaction={createTransaction}
        onUpdateTransaction={updateTransaction}
        onDeleteTransaction={deleteTransaction}
      />
    </ReportTutorial>
  )
}
