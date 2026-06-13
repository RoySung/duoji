## Context

目前的標籤建議（tag suggestions）在每次載入或重新整理時，都會呼叫 `TransactionRepo.findTagsByAccountBookId`。這在背後會對 IndexedDB (Dexie) 執行一次針對該帳本所有交易紀錄的查詢，並在記憶體中進行標籤的提取與去重。當使用者的交易紀錄累積到成千上萬筆時，此操作會造成明顯的效能遲延。

為了優化效能，我們決定改變資料流：改為在 LocalStorage 中快取已輸入過的標籤，並在交易建立與更新成功時將新的標籤加入快取。

## Goals / Non-Goals

**Goals:**
- 將標籤建議的來源改為 LocalStorage，避免每次都需要撈取全量交易。
- 實現 LocalStorage 標籤建議的寫入邏輯：在交易建立或更新成功時，將標籤合併至 LocalStorage 中。
- 確保標籤快取是依據 `accountBookId` 進行隔離的。
- 移除 `TransactionRepo` 介面及其實作中已經不需要的 `findTagsByAccountBookId` 查詢方法。
- 更新單元測試以反映基於 LocalStorage 的標籤建議機制與 Repo 介面修改。

**Non-Goals:**
- 當交易被刪除時，不主動從 LocalStorage 快取中移除該標籤（符合「記憶使用者輸入過的標籤」需求）。
- 不實作跨裝置的標籤同步（快取僅留於本地端瀏覽器中）。
- 不改變 Transaction 表單既有的標籤選擇與輸入 UI。

## Decisions

### 1. 使用獨立的 LocalStorage Key 與 Helper 函數

我們將使用 `duoji_tag_suggestions_${accountBookId}` 作為快取的 Key。
我們會實作兩個主要的 Helper 函數：
- `getAccountBookTagsFromCache(accountBookId: string): string[]`
- `saveAccountBookTagsToCache(accountBookId: string, tags: string[]): void`

這兩個函數將存放在 `apps/web/src/hooks/useAccountBookTagSuggestions.ts` 中（或相關的 utilities 檔案中），以利 hook 與 mutation 進行呼叫。

### 2. 在交易 mutation 的 onSuccess 中寫入快取

在 `useAccountBookTransactions` 中，`createTransactionMutation` 與 `updateTransactionMutation` 執行成功後：
1. 呼叫 `saveAccountBookTagsToCache`，將該交易的新增/更新標籤寫入 LocalStorage。
2. 呼叫 `queryClient.invalidateQueries({ queryKey: ['tags'] })` 以更新 React Query 快取，進而通知 UI 重新整理標籤建議。

### 3. 保留 React Query 層以相容既有的 UI 訂閱與非同步行為

我們繼續在 `useAccountBookTagSuggestions` 中使用 React Query，但將其 `queryFn` 改為從 LocalStorage 讀取。這有助於維持對 React Query loading/fetching 狀態與 queryKey 機制的相容性，且方便進行快取失效通知。

### 4. 移除 TransactionRepo 中的 findTagsByAccountBookId 方法

由於標籤建議改由 LocalStorage 快取完全負責，不再調用 `findTagsByAccountBookId`。為了清理廢棄代碼，我們將從 `TransactionRepo` 介面及其實作 `TransactionLocalRepo` 中徹底移除該方法，並相應調整所有 Mock 類別（例如單元測試中的 `InMemoryTransactionRepo`）。

## Implementation Contract

- **行為**：標籤建議由 `useAccountBookTagSuggestions` 提供，其資料來源為 LocalStorage 快取。當使用者新增或更新交易時，輸入的標籤會被加入該帳本的快取中。
- **介面/資料結構**：
  - LocalStorage 中的資料格式為：`duoji_tag_suggestions_<accountBookId>` -> `["tag1", "tag2", ...]` (JSON 字串化的字串陣列)。
- **異常處理**：若 LocalStorage 寫入或讀取失敗（如無痕模式或空間不足），應採用 `try-catch` 包裝，讀取失敗時回傳空陣列 `[]`，寫入失敗時安靜忽略，確保不影響核心交易功能。
- **驗證標準**：
  - `apps/web/specs/useAccountBookTagSuggestions.spec.ts` 內的測試需全面更新，確保能模擬 LocalStorage 行為並通過測試。
  - 新增/更新交易時，確認 LocalStorage 內對應帳本的標籤快取有被正確寫入與更新。
  - 刪除交易時，標籤仍保留於 LocalStorage 中。
  - 確認整個專案中不再存在對 `findTagsByAccountBookId` 的呼叫與實作。
- **範圍界限**：此修改僅限於標籤建議的存取與快取邏輯，以及清理 Repo 中的 unused tag 查詢方法，不修改 Dexie 內的其他核心欄位。

## Risks / Trade-offs

- **[LocalStorage 空間限制]** → 一般瀏覽器有 5MB 的 localStorage 限制，但標籤數量極少，此限制影響極微。
- **[LocalStorage 唯讀環境/異常]** → 於 `try-catch` 中進行讀寫操作，失敗時優雅降級回傳空陣列。
