## 1. 核心邏輯實作

- [x] 1.1 在 `apps/web/src/hooks/useAccountBookTagSuggestions.ts` 中實現 `1. 使用獨立的 LocalStorage Key 與 Helper 函數`，建立 `getAccountBookTagsFromCache` 與 `saveAccountBookTagsToCache` 兩個輔助方法，針對個別帳本在 localStorage 讀取與寫入標籤陣列。這也完成了 `Tag suggestions are scoped to the transaction form's selected account book` 的要求。驗證方式：透過 Jest 測試這兩個方法在傳入不同帳本 ID 時，是否能正確讀寫對應 key 的 localStorage 快取資料。
- [x] 1.2 修改 `apps/web/src/hooks/useAccountBookTagSuggestions.ts` 中的 `useAccountBookTagSuggestions` 函數，實作 `3. 保留 React Query 層以相容既有的 UI 訂閱與非同步行為`，將 `queryFn` 改為從 `getAccountBookTagsFromCache` 讀取快取標籤，使 `Tag suggestions are scoped to the transaction form's selected account book` 能自 LocalStorage 中獲取。驗證方式：於單元測試中模擬 localStorage 讀取，驗證載入 hook 後 suggestions 能符合預期。
- [x] 1.3 修改 `apps/web/src/hooks/useAccountBookTransactions.ts` 中的交易 mutations，在成功回調中實現 `2. 在交易 mutation 的 onSuccess 中寫入快取`，在建立或更新交易成功時將新標籤存入 LocalStorage，確保 `Tag suggestions stay coherent with transaction mutations` 的一致性。驗證方式：驗證建立或更新交易時，對應帳本在 LocalStorage 內的標籤被正確合併，且調用 `queryClient.invalidateQueries` 以失效 `['tags']`。
- [x] 1.4 在 `apps/web/src/entities/transaction.ts` 與 `apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts` 中移除 `findTagsByAccountBookId` 方法，以實作 `4. 移除 TransactionRepo 中的 findTagsByAccountBookId 方法`，滿足 `Transaction queries remain scoped to the target account book` 的規格要求。驗證方式：確認整個專案編譯正常。

## 2. 測試調適與驗證

- [x] 2.1 修改並執行 `apps/web/specs/useAccountBookTagSuggestions.spec.ts` 內的測試案例以配合 LocalStorage 機制（包含模擬 LocalStorage、驗證建立與更新交易時快取有更新、以及刪除交易時標籤依然保留等行為）。驗證方式：在終端機執行 `pnpm nx test web --runInBand --testPathPattern=useAccountBookTagSuggestions` 確保所有測試皆順利通過。
- [x] 2.2 在 `apps/web/specs/useAccountBookTagSuggestions.spec.ts` 中移除 Mock Repo `InMemoryTransactionRepo` 的 `findTagsByAccountBookId` 實作。驗證方式：在終端機執行 `pnpm nx test web --runInBand --testPathPattern=useAccountBookTagSuggestions` 確保測試全數通過。
