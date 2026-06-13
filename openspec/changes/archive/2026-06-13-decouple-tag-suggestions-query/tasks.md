## 1. Repository 層：新增 findTagsByAccountBookId

- [x] 1.1 在 `TransactionRepo` 介面（`apps/web/src/entities/transaction.ts`）新增 `findTagsByAccountBookId(accountBookId: string): Promise<string[]>` 方法。行為契約：呼叫此方法時，回傳指定帳本中所有非刪除交易的去重、非空、trimmed tag 字串陣列。當 accountBookId 為 "all" 時回傳所有帳本的 tags。驗證：TypeScript 編譯通過，且 `TransactionLocalRepo` 實作此介面方法後不會出現型別錯誤。

- [x] 1.2 在 `TransactionLocalRepo`（`apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts`）實作 `findTagsByAccountBookId`。行為契約：透過 Dexie 查詢指定帳本的交易，僅提取 `tags` 欄位，過濾空字串、trim 後去重回傳。accountBookId 為 "all" 時查詢所有交易。無交易時回傳空陣列。驗證：滿足 spec「Transaction queries remain scoped to the target account book」中「Retrieve distinct tags for one account book」、「Retrieve tags for an account book with no transactions」及「Retrieve tags across all account books」三個 scenario——可透過既有的 transaction spec 測試框架撰寫對應測試案例確認。

## 2. Hook 層：解耦 useAccountBookTagSuggestions

- [x] 2.1 將 `useAccountBookTagSuggestions`（`apps/web/src/hooks/useAccountBookTagSuggestions.ts`）改用 `findTagsByAccountBookId`，使用獨立 query key `['tags', accountBookId]`，移除對 `transactionListQueryKey` 和 `findTransactionsByAccountBook` 的依賴。行為契約：tag suggestions 的資料來源改為輕量的 tag-only 查詢，不再載入完整的 Transaction 物件陣列；query cache 與交易列表 cache 完全獨立。驗證：在瀏覽器中開啟帳本頁面，開啟 React Query DevTools 確認存在 `['tags', '<accountBookId>']` query，且不存在 `['transactions', 'list', ...]` query。

## 3. Hook 層：移除 allTransactionsQuery

- [x] 3.1 從 `useAccountBookTransactions`（`apps/web/src/hooks/useAccountBookTransactions.ts`）移除 `allTransactionsQuery`（useQuery 呼叫）及其暴露的 `allTransactions`、`totalCount`、`refreshTransactions` 屬性。行為契約：hook 不再發出 `transactionListQueryKey` 對應的全量查詢；回傳型別中不再包含 `allTransactions`、`totalCount`、`refreshTransactions`。`isLoading` 改為只依賴 `rangeQuery` 和 mutations 的 pending 狀態。驗證：TypeScript 編譯通過，無消費端因缺少這三個屬性而出現型別錯誤。

- [x] 3.2 將三個 mutation（create/update/delete）中的 `queryClient.invalidateQueries({ queryKey: ['transactions', 'list'] })` 替換為 `queryClient.invalidateQueries({ queryKey: ['tags'] })`。行為契約：mutation 完成後會 invalidate tag suggestions cache，使新增、編輯或刪除交易後 tag suggestions 自動更新。驗證：在瀏覽器中新增一筆帶有新 tag 的交易後，tag suggestions 下拉選單出現該 tag。

## 4. 頁面層：移除 refreshTransactions 使用

- [x] 4.1 更新帳本頁面（`apps/web/src/pages/account-books/[id]/index.tsx`）的 destructure 和 `handleRefresh`，移除 `refreshTransactions`。行為契約：`handleRefresh` 只呼叫 `refetch()`（range query 的 refetch），不再觸發全量交易查詢。重新整理按鈕的行為不變——仍然會重新載入當前可見月份的交易資料。驗證：TypeScript 編譯通過，點擊重新整理按鈕後行事曆和交易清單正常更新。

## 5. 清理：移除無用的 query utilities

- [x] 5.1 從 `transactionQueryUtils.ts`（`apps/web/src/hooks/transactionQueryUtils.ts`）移除 `transactionListQueryKey` 函式和 `findTransactionsByAccountBook` 函式（若已無其他消費者）。行為契約：這兩個 export 不再存在於模組中，所有先前的 import 已在前置任務中移除。驗證：TypeScript 編譯通過（`npx tsc --noEmit`），grep 搜尋專案中不再有任何檔案 import 這兩個函式。
