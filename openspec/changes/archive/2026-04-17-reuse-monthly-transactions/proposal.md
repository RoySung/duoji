## Why

account-books/[id] 頁面目前有兩條並行的 IndexedDB 資料流：月曆 summary 與當日交易清單。月曆 query 已載入整段範圍的完整 Transaction 記錄，卻在聚合成 summary 後丟棄原始資料，當日清單再用 `findByDate` 重新查一次。這造成不必要的重複 IO。

將月曆 query 改為載入完整 Transaction[]，再由 hook 在 memory 中 derive summaries 與 daily list，可消除重複查詢、簡化 cache patching 邏輯、並讓週/月視圖切換不觸發額外抓取。

## What Changes

- **Repo 層**：移除 `findCalendarSummariesByDateRange` 與 `summarizeTransactionsByDate`；新增 `findByDateRange` 回傳完整 `Transaction[]`。更新 `TransactionRepo` interface。
- **Hook 層**：`useAccountBookTransactionCalendar` 改呼叫 `findByDateRange`，以 `useMemo` 產生 `summariesByDate` 與 `transactionsByDate`。`useAccountBookTransactions` 移除 by-date query，職責收斂為 mutations + allTransactionsQuery。
- **Cache patching**：以 `patchTransactionRangeQueries` 取代現有的 list + calendar-summary 兩套 patch 邏輯。
- **Page 層**：page 計算 `monthRange`（以 selectedDate 所屬整月），傳入 calendar hook。daily list 從 `transactionsByDate[selectedDate]` 取得，不再另外打 repo。
- **測試**：更新 repo/hook/page 相關測試以反映新介面。

## Non-Goals

- 不改 `useHomeTransactions` / home 頁面的資料流。
- 不改 settlement / unsettled expense 相關 repo 方法。
- 不處理跨月切換瞬間 daily list 顯示空的閃爍（接受 loading 態，UX 後續再優化）。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `transaction-storage`: `TransactionRepo` interface 移除 `findCalendarSummariesByDateRange`，新增 `findByDateRange`，改變 repo 層的查詢合約。

## Impact

- Affected specs: `transaction-storage`（repo interface 變更）
- Affected code:
  - `apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts`
  - `apps/web/src/entities/transaction.ts`
  - `apps/web/src/hooks/useAccountBookTransactionCalendar.ts`
  - `apps/web/src/hooks/useAccountBookTransactions.ts`
  - `apps/web/src/hooks/transactionQueryUtils.ts`
  - `apps/web/src/pages/account-books/[id]/index.tsx`
  - `apps/web/specs/transaction.spec.ts`
  - `apps/web/specs/transactionStore.spec.ts`
  - `apps/web/specs/homeTransactions.spec.tsx`
