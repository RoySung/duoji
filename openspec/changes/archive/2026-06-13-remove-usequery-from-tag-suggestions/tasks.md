## 1. 核心邏輯重構

- [x] 1.1 在 `apps/web/src/hooks/useAccountBookTagSuggestions.ts` 中，實作 `1. 使用同步的 useMemo 替換 useQuery`，移除 `useQuery`、`tagSuggestionsQueryKey` 及其相關 import，使 `Tag suggestions are scoped to the transaction form's selected account book` 改為完全同步地從 LocalStorage 快取取得。驗證方式：確認 Hook 回傳與原本相同的資料格式，且編譯無錯誤。
- [x] 1.2 在 `apps/web/src/hooks/useAccountBookTransactions.ts` 中，實作 `2. 移除 useAccountBookTransactions 中對 tags key 的失效邏輯`，在 `createTransactionMutation` 與 `updateTransactionMutation` 成功時，移除對 `['tags']` query 進行失效通知，以確保 `Tag suggestions stay coherent with transaction mutations` 不再依賴非同步 React Query 機制。驗證方式：確認代碼中不再有 `['tags']` 的 `invalidateQueries` 呼叫，且專案正常編譯。

## 2. 測試重構與驗證

- [x] 2.1 在 `apps/web/specs/useAccountBookTagSuggestions.spec.ts` 中，實作 `3. 同步化單元測試斷言`，移除對 `QueryClientProvider` 與非同步等待 (`waitFor`, `invalidateQueries` 等) 的依賴，以驗證已移除 `Tag suggestion loading SHALL remain non-blocking` 相關 loading 狀態，並確認所有測試可同步執行且通過。驗證方式：執行 `pnpm nx test web --runInBand --testPathPattern=useAccountBookTagSuggestions` 確保測試全數通過。
