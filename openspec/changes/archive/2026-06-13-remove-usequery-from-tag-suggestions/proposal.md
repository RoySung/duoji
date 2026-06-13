## Why

因為標籤建議（Tag Suggestions）已改為完全從 LocalStorage 讀取，這是一個同步的本地操作，不再需要使用非同步的 `useQuery` (React Query) 來抓取與快取。移除 `useQuery` 能簡化 Hook 邏輯、減少不必要的非同步狀態開銷，並使標籤建議載入更加即時。

## What Changes

- 在 `useAccountBookTagSuggestions` 中移除 `useQuery` 呼叫與 `tagSuggestionsQueryKey`。
- 將 `useAccountBookTagSuggestions` 改為同步的 React Hook，直接使用 `useMemo` 從 LocalStorage 獲取與過濾標籤。
- 修改 `useAccountBookTransactions` 內 mutations 成功時的 invalidation 邏輯，因為不再需要對 `['tags']` query 進行失效通知。
- 更新相關測試，將標籤建議測試調整為同步斷言，不再需要等待 `isLoading` 或 `invalidateQueries` 的非同步狀態。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `transaction-tag-suggestions`: 標籤建議的載入與獲取流程改為同步讀取 LocalStorage 快取，簡化非同步與讀取狀態。

## Impact

- Affected specs: transaction-tag-suggestions
- Affected code:
  - Modified:
    - `apps/web/src/hooks/useAccountBookTagSuggestions.ts`
    - `apps/web/src/hooks/useAccountBookTransactions.ts`
    - `apps/web/specs/useAccountBookTagSuggestions.spec.ts`
