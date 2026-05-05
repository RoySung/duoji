## 1. CSV 工具函數

- [x] 1.1 在 `apps/web/src/utils/` 建立 `csvExport.ts`，實作 `escapeCsvField` 函數（處理含逗號、雙引號、換行的欄位，確保 CSV fields are safely encoded）
- [x] 1.2 實作 `transactionsToCsv(transactions, categories)` 函數，依照 CSV 欄位順序（Date, Type, Category, Amount, Payment Method, Description）轉換交易陣列為 CSV 字串；category name is resolved；軟刪除排除

## 2. Usecase Hook

- [x] 2.1 Hook 設計：`useExportTransactionsCsv` — 在 `apps/web/src/hooks/` 建立此 hook，接收 `transactions`、`categories`，回傳 `exportCsv()` 函數（CSV 生成方式：Blob + anchor download；檔名格式 `transactions-YYYY-MM-DD.csv`）

## 3. Report 頁面整合

- [x] 3.1 匯出範圍：以 Report 頁面當前可見資料為準 — 在 `apps/web/src/pages/account-books/[id]/report.tsx` 引入 `useExportTransactionsCsv` hook，將 `bookFilteredTransactions`（已套用帳本篩選）與 `categories` 傳入（user can export visible transactions as CSV）
- [x] 3.2 在 Report 頁面 header 的篩選按鈕旁加入「Export CSV」按鈕，點擊呼叫 `exportCsv()`（export button is present on the report page）
