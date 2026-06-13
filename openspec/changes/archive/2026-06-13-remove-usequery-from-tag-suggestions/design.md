## Context

我們此前已將標籤建議（Tag Suggestions）改由 LocalStorage 快取完全管理，這是一個同步的本地操作，不再需要使用非同步的 `useQuery` (React Query) 來抓取與快取。目前使用 `useQuery` 的作法增添了複雜度（例如額外的 `tagSuggestionsQueryKey`、`isLoading` / `isFetching` 狀態以及跨 Hook 的 `invalidateQueries` 呼叫）。

因此，我們決定重構 `useAccountBookTagSuggestions` Hook，使其改為完全同步運作，直接讀取 LocalStorage 快取，並移除 React Query 相關的宣告與失效邏輯。

## Goals / Non-Goals

**Goals:**
- 在 `useAccountBookTagSuggestions` 中移除 `useQuery` 與 `tagSuggestionsQueryKey`。
- 使標籤建議 Hook 成為完全同步的 Hook，依靠 `useMemo` 當 `accountBookId` 與 `selectedTags` 改變時自動重新計算。
- 在交易 mutations 成功時，移除對 `['tags']` query 進行失效通知的邏輯（因為不再有對應的 Query 存在）。
- 調整單元測試以反映同步的 LocalStorage 讀取，免除測試中繁瑣的非同步等待。

**Non-Goals:**
- 不改變 LocalStorage 中標籤資料的寫入與合併邏輯。
- 不改變交易編輯表單既有的 UI 組件與 tag 綁定。

## Decisions

### 1. 使用同步的 useMemo 替換 useQuery

我們將直接在 `useAccountBookTagSuggestions` 內使用 `useMemo`：
```typescript
const suggestions = useMemo(() => {
  const cachedTags = getAccountBookTagsFromCache(accountBookId)
  return filterSelectedTags(cachedTags, selectedTags)
}, [accountBookId, selectedTags])
```
這能保證每當帳本 ID 或已選標籤改變時，建議清單會以最即時的同步方式重新計算並回傳。為了向下相容既有 UI，Hook 依然回傳 `{ suggestions, isLoading: false, isFetching: false }`，但狀態常駐為 `false`。

### 2. 移除 useAccountBookTransactions 中對 tags key 的失效邏輯

在 `useAccountBookTransactions` 的交易 `createTransaction` 與 `updateTransaction` 的 `onSuccess` 回調中，我們只需保留對 LocalStorage 寫入的 `saveAccountBookTagsToCache` 呼叫，並移除 `queryClient.invalidateQueries({ queryKey: ['tags'] })`。

### 3. 同步化單元測試斷言

由於標籤建議已變為同步讀取，單元測試 (`useAccountBookTagSuggestions.spec.ts`) 中不再需要配置 `QueryClientProvider`，也無須使用 `waitFor` 等待 `isLoading` 為 `false` 或呼叫 `invalidateQueries`。測試將改為同步在 `localStorage` 寫入資料後，使用 `renderHook` 或 `rerender` 即可直接進行 `expect` 斷言。

## Implementation Contract

- **行為**：`useAccountBookTagSuggestions` 回傳 `{ suggestions, isLoading: false, isFetching: false }`。其標籤過濾與計算完全由同步的 `useMemo` 負責，直接自 LocalStorage 快取取得。
- **介面/資料結構**：
  - `useAccountBookTagSuggestions(accountBookId, selectedTags)` 函數簽名不變，以維持相容性。
- **驗證標準**：
  - 移除 `useAccountBookTagSuggestions.ts` 中的 `tagSuggestionsQueryKey`。
  - 移除 `useAccountBookTransactions.ts` 的 `onSuccess` 回調中所有對 `['tags']` 的失效通知。
  - 調整並通過 `specs/useAccountBookTagSuggestions.spec.ts` 與 `specs/transactionFormTags.spec.tsx` 的所有單元測試。
- **範圍界限**：此改動僅涉及 Hook 及交易 mutations 中廢棄的 Query 邏輯清理，不改變寫入快取的運作行為。

## Risks / Trade-offs

- **[無實時同步機制]** → 在極端情況下，若同一個畫面上有多處同時編輯標籤，可能因為缺乏 Query 的訂閱機制而無法即時反映在已渲染的建議列表中。然而，標籤建議僅用於表單開啟時，而表單開啟即是新掛載 (Mount)，同步讀取 localStorage 能保證開啟時讀到最新值，因此風險可以忽略。
