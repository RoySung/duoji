## 1. Entity 與 Repo 層：新增 findByDateRange，移除 findCalendarSummariesByDateRange

- [x] 1.1 在 `apps/web/src/entities/transaction.ts` 的 `TransactionRepo` interface 中，將 `findCalendarSummariesByDateRange(query: TransactionCalendarSummaryQuery): Promise<TransactionCalendarSummary[]>` 替換為 `findByDateRange(query: TransactionCalendarSummaryQuery): Promise<Transaction[]>`。query 參數型別可沿用 `TransactionCalendarSummaryQuery`（含 `startDate`, `endDate`, `accountBookId?`），或重新命名為 `TransactionDateRangeQuery`。`TransactionCalendarSummary` 型別本身保留（hook 層仍需要）。
- [x] 1.2 在 `apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts` 中，移除 `summarizeTransactionsByDate` 函式與 `findCalendarSummariesByDateRange` 方法。新增 `findByDateRange` 方法：複用現有的 `[accountBookId+date]` compound index `.between()` range query 邏輯（來自被刪除的 `findCalendarSummariesByDateRange` 第 131-141 行），回傳 `excludeSoftDeleted(transactions)` 而非聚合結果。確保符合 spec requirement「Transactions can be queried by date range」：accountBookId 存在時走 compound index，否則走 `date` index；日期範圍為 inclusive。

## 2. Hook 層：useAccountBookTransactionCalendar 載入完整 Transaction[] 並 derive summaries + transactionsByDate

- [x] 2.1 修改 `apps/web/src/hooks/useAccountBookTransactionCalendar.ts`：queryFn 改為呼叫 `repo.findByDateRange({ startDate, endDate, accountBookId })`，回傳 `Transaction[]`。queryKey 改為 `['transactions', 'range', accountBookId, startDate, endDate]`。
- [x] 2.2 在同一 hook 中新增兩個 `useMemo`：(1) `summariesByDate: Record<string, TransactionCalendarSummary>`，從 transactions 聚合（搬入原 `summarizeTransactionsByDate` 的邏輯，改為產生 Record 而非陣列）。(2) `transactionsByDate: Record<string, Transaction[]>`，按 date 分組，每組用 `sortTransactions` 排序。
- [x] 2.3 更新 hook 回傳值：新增 `transactionsByDate` 與 `rangeTransactions`（完整 Transaction[]，供 mutation patching 用）。`summaries` 改為從 `summariesByDate` 取值（`Object.values(summariesByDate)`）。

## 3. Hook 層：useAccountBookTransactions 移除 by-date query，收斂職責

- [x] 3.1 在 `apps/web/src/hooks/useAccountBookTransactions.ts` 中，移除 `transactionListQuery`（整個 useQuery 區塊，第 32-53 行）。`allTransactionsQuery` 改為始終啟用（移除 `selectedDate !== null` 的 enabled 條件），因為它現在是 hook 唯一的 query，負責提供 `totalCount`。
- [x] 3.2 更新 hook 回傳值：移除 `transactions`（由 page 層從 calendar hook 取得）與 `loadTransactions`。保留 `totalCount`（從 `allTransactionsQuery.data`）、`isLoading`（合併 allTransactionsQuery + mutations 的 pending 狀態）、`error`、mutations（`createTransaction`/`updateTransaction`/`deleteTransaction`）、`refreshTransactions`（只 refetch allTransactionsQuery）。

## 4. Cache patching：以 patchTransactionRangeQueries 取代 list + calendar-summary 雙套 patch

- [x] 4.1 在 `apps/web/src/hooks/transactionQueryUtils.ts` 中，移除以下不再需要的函式與型別：`transactionListQueryKey`、`transactionCalendarSummaryQueryKey`、`parseListScope`、`matchesTransactionListScope`、`parseCalendarScope`、`applySummaryDelta`、`patchTransactionListQueries`、`patchTransactionCalendarQueries`、`ListScope`、`CalendarScope` 型別、`ALL_DATES` 常數。
- [x] 4.2 新增 `transactionRangeQueryKey(accountBookId, startDate, endDate)` 函式，回傳 `['transactions', 'range', accountBookId, startDate, endDate]`。
- [x] 4.3 新增 `patchTransactionRangeQueries(queryClient, previousTransaction, nextTransaction)` 函式：掃描所有 `['transactions', 'range']` 前綴的 cache entry，解析 queryKey 取得 `accountBookId`、`startDate`、`endDate`。對每筆 cached `Transaction[]`，若 prev transaction 的 accountBookId + date 落在該 scope 內則移除它；若 next transaction（且 `deletedAt === null`）落在 scope 內則 upsert。寫入更新後的陣列回 cache。保留 `sortTransactions`、`upsertTransaction`、`matchesAccountBookScope`、`isDateInRange` 這些仍需使用的工具函式。
- [x] 4.4 更新 `apps/web/src/hooks/useAccountBookTransactions.ts` 的三個 mutation `onSuccess`：將 `patchTransactionListQueries` + `patchTransactionCalendarQueries` 替換為 `patchTransactionRangeQueries`。invalidateQueries 改為 invalidate `['transactions', 'range']` 與 `['transactions', 'list']`（後者是 allTransactionsQuery）。

## 5. Page 層：從 calendar hook 取 daily transactions

- [x] 5.1 在 `apps/web/src/pages/account-books/[id]/index.tsx` 中新增 `monthRange = useMemo(() => { ... }, [selectedDate])`，以 `selectedDate` 所屬月份計算 `{ startDate, endDate }`（用 dayjs 的 `startOf('month')` / `endOf('month')` + `formatCalendarDate`）。將 `monthRange` 傳入 `useAccountBookTransactionCalendar(accountBookId, monthRange)`，替換原本傳入的 `visibleRange`。
- [x] 5.2 從 calendar hook 解構 `transactionsByDate`，計算 `const dailyTransactions = selectedDate ? (transactionsByDate[selectedDate] ?? []) : []`。將頁面中原本從 `useAccountBookTransactions` 取的 `transactions` 改為使用 `dailyTransactions`（selectedDate 有值時）或 `allTransactionsQuery` 的結果（selectedDate 為 null 時）。
- [x] 5.3 保留 `visibleRange` state 與 `handleVisibleRangeChange`（仍傳給 `TransactionCalendar` 元件控制週/月格子呈現），但它不再驅動資料撈取。更新 `isLoading` 合併 calendar query 與 mutation pending 狀態。`handleRefresh` 呼叫 `refetchCalendar()` + `refreshTransactions()`。

## 6. 測試更新

- [x] 6.1 更新 `apps/web/specs/transaction.spec.ts`：移除 `findCalendarSummariesByDateRange` 相關測試。新增 `findByDateRange` 測試：驗證依 accountBookId + date range 查詢回傳正確 Transaction[]、空範圍回傳空陣列、不回傳範圍外 transactions。
- [x] 6.2 更新 `apps/web/specs/transactionStore.spec.ts` 與 `apps/web/specs/homeTransactions.spec.tsx`：調整對 hook/repo 的 mock 與期待，反映新的 hook 介面（`useAccountBookTransactions` 不再回傳 `transactions`，calendar hook 回傳 `transactionsByDate`）。
- [x] 6.3 執行 `pnpm --filter web typecheck` 確認型別正確、`pnpm --filter web test` 確認所有測試通過。
