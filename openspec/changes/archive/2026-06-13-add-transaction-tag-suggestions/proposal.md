## Why

目前交易表單的標籤欄位只支援自由輸入，使用者需要自行回想並重打既有標籤，容易造成同義但格式不一致的重複標籤，也增加建立交易時的輸入成本。這個改善需要現在處理，因為專案已經有完整的交易儲存與快取失效路徑，可以在不引入新資料模型的前提下，直接把目前帳本內已使用過的標籤回饋到表單。

## What Changes

- 在支出與收入交易表單的標籤欄位加入目前帳本已使用標籤的快速選項。
- 新增用例層 hook，以表單當下選定的 accountBookId 為範圍，從既有交易資料快取萃取、整理並提供標籤 suggestions。
- 讓標籤 suggestions 依附既有交易查詢的 cache 與 invalidation；新增、更新、刪除交易後，標籤 suggestions 會同步刷新。
- 保持標籤欄位可自由輸入；當 suggestions 尚未就緒時，不阻塞輸入，也不顯示其他帳本的舊資料。

## Non-Goals

- 不新增獨立的 tag entity、tag 管理頁或跨帳本的標籤推薦。
- 不變更 Transaction tags schema，也不做歷史資料 migration。
- 不導入 autocomplete dropdown；第一版僅提供輸入框下方的可點選快速選項。

## Capabilities

### New Capabilities

- transaction-tag-suggestions: 在交易表單中提供以目前帳本交易資料為來源的標籤快速選項，並定義其快取、刷新與 loading 行為。

### Modified Capabilities

- transactions: 交易表單在建立與編輯流程中支援以既有標籤 suggestions 輔助輸入，但仍保留自由輸入能力。

## Impact

- Affected specs: transaction-tag-suggestions, transactions
- Affected code:
  - New:
    - apps/web/src/hooks/useAccountBookTagSuggestions.ts
    - apps/web/specs/useAccountBookTagSuggestions.spec.ts
  - Modified:
    - apps/web/src/components/ui/TagInput.tsx
    - apps/web/src/components/TransactionModal/ExpenseForm.tsx
    - apps/web/src/components/TransactionModal/IncomeForm.tsx
    - apps/web/src/hooks/useAccountBookTransactions.ts
    - apps/web/specs/transactionFormTags.spec.tsx
    - openspec/specs/transactions/spec.md
  - Removed:
    - none
