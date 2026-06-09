import { Button, Chip } from '@heroui/react'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { PiArrowsClockwiseBold, PiBooksBold } from 'react-icons/pi'
import TransactionCalendar from '@/components/calendar/TransactionCalendar'
import {
  formatCalendarDate,
  getMonthGridVisibleRange,
  parseCalendarDate,
} from '@/components/calendar/calendarUtils'
import TransactionList from '@/components/transaction/TransactionList'
import { TransactionModal } from '@/components/TransactionModal'
import TransactionTutorial from '@/components/onboarding/TransactionTutorial'
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
    refreshTransactions,
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
      await Promise.all([refetch(), refreshTransactions()])
    } finally {
      setIsRefreshing(false)
    }
  }, [refetch, refreshTransactions])

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
        <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col items-center justify-center gap-8 px-4 py-8">
          <div className="w-full rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-lg shadow-black/5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300">
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
        <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-8 px-4 py-8">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/5">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-300">
                  {t('transactions.label')}
                </p>
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    {isAllBooksView
                      ? t('transactions.allBooks')
                      : currentAccountBook?.name ??
                        t('transactions.fallbackName')}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3 self-start">
                <Button
                  aria-label={t('transactions.refreshAria')}
                  className="border border-border bg-background text-foreground hover:bg-accent"
                  disableRipple
                  isDisabled={isLoading || isRefreshing}
                  radius="full"
                  size="sm"
                  startContent={<PiArrowsClockwiseBold size={14} />}
                  variant="flat"
                  onPress={handleRefresh}
                >
                  {isRefreshing
                    ? t('transactions.refreshing')
                    : t('transactions.refresh')}
                </Button>
                <Chip
                  className="bg-accent text-muted-foreground"
                  size="sm"
                  variant="flat"
                >
                  {t('transactions.records', {
                    count: transactions.length,
                  })}
                </Chip>
              </div>
            </div>

            <TransactionCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              calendarSummaries={summariesByDate}
              onDisplayMonthChange={handleDisplayMonthChange}
              onQueryRangeChange={handleQueryRangeChange}
              viewMode={calendarViewMode}
              onViewModeChange={setCalendarViewMode}
            />

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
          </section>
        </div>

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
