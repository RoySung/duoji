import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { PiBooksBold } from 'react-icons/pi'
import TransactionCalendar from '@/components/calendar/TransactionCalendar'
import {
  formatCalendarDate,
  getMonthGridVisibleRange,
  parseCalendarDate,
} from '@/components/calendar/calendarUtils'
import TransactionList from '@/components/transaction/TransactionList'
import { TransactionHero } from '@/components/transaction/TransactionHero'
import { TransactionModal } from '@/components/TransactionModal'
import TransactionTutorial from '@/components/onboarding/TransactionTutorial'
import { PageScaffold } from '@/components/ui/PageScaffold'
import { SurfaceCard } from '@/components/ui/SurfaceCard'
import { useAccountBookStore } from '@/stores/accountBook'
import { useAccountBookTransactions } from '@/hooks/useAccountBookTransactions'
import { TransactionModalMode } from '@/entities/transaction'
import {
  sortTransactions,
  TransactionCalendarVisibleRange,
} from '@/hooks/transactionQueryUtils'

export default function AccountBookPage() {
  const router = useRouter()
  const t = useTranslations()
  const { id } = router.query
  const accountBookId = typeof id === 'string' ? id : null

  const buildMonthRange = useCallback(
    (anchorDate: dayjs.Dayjs): TransactionCalendarVisibleRange => ({
      startDate: formatCalendarDate(anchorDate.startOf('month')),
      endDate: formatCalendarDate(anchorDate.endOf('month')),
    }),
    []
  )

  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const isAccountBooksInitialized = useAccountBookStore(
    (state) => state.initialized
  )

  const [selectedDate, setSelectedDate] = useState<string | null>(() =>
    formatCalendarDate(dayjs())
  )
  const [queryRange, setQueryRange] = useState<TransactionCalendarVisibleRange>(
    () => getMonthGridVisibleRange(dayjs())
  )
  const [displayMonthRange, setDisplayMonthRange] =
    useState<TransactionCalendarVisibleRange>(() => buildMonthRange(dayjs()))
  const [calendarViewMode, setCalendarViewMode] = useState<'week' | 'month'>(
    'week'
  )
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const touchStartYRef = useRef<number | null>(null)
  const wheelPullDeltaRef = useRef(0)
  const wheelPullResetTimerRef = useRef<number | null>(null)
  const lastNonTopWheelTsRef = useRef(0)

  const handleScrollContainerWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      const now = event.timeStamp
      if (scrollContainerRef.current?.scrollTop !== 0) {
        wheelPullDeltaRef.current = 0
        lastNonTopWheelTsRef.current = now
        return
      }
      if (event.deltaY < 0 && calendarViewMode === 'week') {
        if (now - lastNonTopWheelTsRef.current < 250) {
          wheelPullDeltaRef.current = 0
          return
        }
        wheelPullDeltaRef.current += event.deltaY
        if (wheelPullResetTimerRef.current !== null) {
          window.clearTimeout(wheelPullResetTimerRef.current)
        }
        wheelPullResetTimerRef.current = window.setTimeout(() => {
          wheelPullDeltaRef.current = 0
          wheelPullResetTimerRef.current = null
        }, 200)
        if (wheelPullDeltaRef.current < -400) {
          setCalendarViewMode('month')
          wheelPullDeltaRef.current = 0
        }
      } else if (event.deltaY > 0 && calendarViewMode === 'month') {
        setCalendarViewMode('week')
        wheelPullDeltaRef.current = 0
      }
    },
    [calendarViewMode]
  )

  const handleScrollContainerTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null
    },
    []
  )

  const handleScrollContainerTouchMove = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (
        touchStartYRef.current === null ||
        scrollContainerRef.current?.scrollTop !== 0
      ) {
        return
      }
      const currentY = event.touches[0]?.clientY
      if (currentY === undefined) return
      const delta = currentY - touchStartYRef.current
      if (delta > 40 && calendarViewMode === 'week') {
        setCalendarViewMode('month')
        touchStartYRef.current = null
      } else if (delta < -40 && calendarViewMode === 'month') {
        setCalendarViewMode('week')
        touchStartYRef.current = null
      }
    },
    [calendarViewMode]
  )

  const handleScrollContainerTouchEnd = useCallback(() => {
    touchStartYRef.current = null
  }, [])

  const {
    summariesByDate,
    transactionsByDate,
    rangeTransactions,
    isLoading,
    error,
    refetch,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useAccountBookTransactions(accountBookId, queryRange)

  const monthTransactions = useMemo(
    () =>
      sortTransactions(
        rangeTransactions.filter(
          (transaction) =>
            transaction.date >= displayMonthRange.startDate &&
            transaction.date <= displayMonthRange.endDate
        )
      ),
    [displayMonthRange.endDate, displayMonthRange.startDate, rangeTransactions]
  )

  const transactions = selectedDate
    ? transactionsByDate[selectedDate] ?? []
    : monthTransactions

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<TransactionModalMode>('create')
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const isAllBooksView = accountBookId === 'all'
  const currentAccountBook = isAllBooksView
    ? null
    : accountBooks.find((ab) => ab.id === accountBookId) ?? null
  const selectedTransaction =
    transactions.find((t) => t.id === selectedTransactionId) ?? undefined

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)

    try {
      await refetch()
    } finally {
      setIsRefreshing(false)
    }
  }, [refetch])

  const handleQueryRangeChange = useCallback(
    (range: TransactionCalendarVisibleRange) => {
      setQueryRange((currentRange) => {
        if (
          currentRange.startDate === range.startDate &&
          currentRange.endDate === range.endDate
        ) {
          return currentRange
        }

        return range
      })
    },
    []
  )

  const handleDisplayMonthChange = useCallback(
    (month: string) => {
      const nextRange = buildMonthRange(parseCalendarDate(month))

      setDisplayMonthRange((currentRange) => {
        if (
          currentRange.startDate === nextRange.startDate &&
          currentRange.endDate === nextRange.endDate
        ) {
          return currentRange
        }

        return nextRange
      })
    },
    [buildMonthRange]
  )

  useEffect(() => {
    if (!selectedDate) {
      return
    }

    setQueryRange((currentRange) => {
      const nextRange = getMonthGridVisibleRange(
        parseCalendarDate(selectedDate)
      )

      if (
        currentRange.startDate === nextRange.startDate &&
        currentRange.endDate === nextRange.endDate
      ) {
        return currentRange
      }

      return nextRange
    })
  }, [selectedDate])

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
    if (router.query.modal !== 'create') {
      return
    }

    const baseQuery: Record<string, string> = accountBookId
      ? { id: accountBookId }
      : {}
    if (typeof router.query.onboarding === 'string') {
      baseQuery.onboarding = router.query.onboarding
    }

    if (!accountBookId || isAllBooksView) {
      void router.replace(
        { pathname: router.pathname, query: baseQuery },
        undefined,
        { shallow: true }
      )
      return
    }

    openCreateModal()
    void router.replace(
      { pathname: router.pathname, query: baseQuery },
      undefined,
      { shallow: true }
    )
  }, [
    accountBookId,
    isAllBooksView,
    router,
    router.pathname,
    router.query.modal,
  ])

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

  if (isAccountBooksInitialized && !currentAccountBook && !isAllBooksView) {
    return (
      <div className="h-full overflow-y-auto bg-background text-foreground">
        <PageScaffold className="items-center justify-center">
          <SurfaceCard
            className="w-full px-6 py-14 text-center sm:px-8 sm:py-16"
            role="status"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-peach/70 text-emphasis-foreground dark:bg-peach/15 dark:text-peach-foreground">
              <PiBooksBold size={20} />
            </div>
            <h1 className="mt-5 text-headline font-semibold text-foreground text-balance">
              {t('transactions.notFoundTitle')}
            </h1>
            <p className="mx-auto mt-2 max-w-[65ch] text-body text-muted-foreground text-pretty">
              {t('transactions.notFoundDescription')}
            </p>
          </SurfaceCard>
        </PageScaffold>
      </div>
    )
  }

  return (
    <TransactionTutorial>
      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-auto bg-background text-foreground"
        onWheel={handleScrollContainerWheel}
        onTouchStart={handleScrollContainerTouchStart}
        onTouchMove={handleScrollContainerTouchMove}
        onTouchEnd={handleScrollContainerTouchEnd}
      >
        <PageScaffold>
          <div
            className="flex flex-col"
            data-testid="transaction-hero-calendar-group"
          >
            <TransactionHero
              accountBookName={
                isAllBooksView
                  ? t('transactions.allBooks')
                  : currentAccountBook?.name ?? t('transactions.fallbackName')
              }
              isRefreshDisabled={isLoading}
              isRefreshing={isRefreshing}
              recordCount={t('transactions.records', {
                count: transactions.length,
              })}
              refreshLabel={t('transactions.refreshAria')}
              refreshingLabel={t('transactions.refreshing')}
              sectionLabel={t('transactions.label')}
              scrollContainerRef={scrollContainerRef}
              onRefresh={() => void handleRefresh()}
            />

            <SurfaceCard
              aria-label={t('transactions.label')}
              className="relative z-20 -mt-7 w-full p-3 min-[360px]:-mt-11"
              data-testid="transaction-calendar-surface"
              role="region"
            >
              <TransactionCalendar
                currency={currentAccountBook?.currency ?? 'TWD'}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                calendarSummaries={summariesByDate}
                onDisplayMonthChange={handleDisplayMonthChange}
                onQueryRangeChange={handleQueryRangeChange}
                viewMode={calendarViewMode}
                onViewModeChange={setCalendarViewMode}
              />
            </SurfaceCard>
          </div>

          <TransactionList
            currency={currentAccountBook?.currency ?? null}
            emptyMessage={
              selectedDate ? t('transactions.emptyOnDate') : undefined
            }
            error={error}
            isLoading={isLoading}
            transactions={transactions}
            showAccountBook={isAllBooksView}
            onEditTransaction={openEditModal}
          />
        </PageScaffold>

        <TransactionModal
          isOpen={isModalOpen}
          onOpenChange={handleModalOpenChange}
          modalMode={modalMode}
          defaultDate={selectedDate}
          selectedTransaction={selectedTransaction}
          isSubmitting={isLoading}
          onCreateTransaction={createTransaction}
          onUpdateTransaction={updateTransaction}
          onDeleteTransaction={deleteTransaction}
        />
      </div>
    </TransactionTutorial>
  )
}
