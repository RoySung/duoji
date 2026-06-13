## Context

目前交易表單的 tags 欄位由 apps/web/src/components/ui/TagInput.tsx 提供自由輸入能力，並同時被 apps/web/src/components/TransactionModal/ExpenseForm.tsx 與 apps/web/src/components/TransactionModal/IncomeForm.tsx 共用。現有實作沒有任何 suggestions 或 autocomplete 機制，因此使用者只能手動重打既有標籤。

專案已經有一條穩定的交易資料路徑：usecase 層的 apps/web/src/hooks/useAccountBookTransactions.ts 透過 React Query 讀取帳本交易，並在 create、update、delete 後主動 invalidation 相關 list 與 range queries。依據 architecture-layers 規格，資料查詢與快取協調應該留在 hook/repo 邊界，而不是塞進共用 UI 元件。

這次變更會同時觸及共用 TagInput、兩個交易表單，以及交易查詢快取的衍生資料使用方式。它雖然不引入新資料模型，但有明確的快取、loading、stale data 與責任分層決策，因此需要 design artifact 作為 apply 的 durable handoff。

## Goals / Non-Goals

**Goals:**

- 在支出與收入交易表單中提供目前帳本既有標籤的快速選項。
- 讓標籤 suggestions 重用既有交易查詢快取與 mutation invalidation，而不是建立平行資料同步路徑。
- 保持 tags 欄位可自由輸入，避免 loading 或錯帳本 stale data 干擾表單操作。
- 讓 create 與 edit 流程在相同元件上共享同一套 suggestions 行為。

**Non-Goals:**

- 不建立獨立 tag entity、tag repository 或 tag 管理頁。
- 不變更 Transaction tags 的資料 schema，也不做歷史資料 migration。
- 不導入 autocomplete dropdown 或新的外部依賴；第一版僅提供輸入框下方可點選 suggestions。
- 不在這個 change 中清洗既有歷史 tags 的大小寫或拼字差異，只處理 suggestions 顯示邏輯。

## Decisions

### Reuse the existing transaction list cache for tag suggestions

標籤 suggestions 將由新的 usecase hook 從目前帳本交易資料衍生，而不是新增一條只查 tags 的獨立同步機制。這個 hook 會站在既有 transaction list query 或同一組 query key 邊界上，讓新增、更新、刪除交易時，既有 invalidation 就能自然驅動 suggestions 刷新。

這個做法的好處是避免雙重快取帶來的 stale data。若另外建立 tags-only query key，就必須手動維護第二套 invalidation 規則，未來很容易出現交易已更新但 suggestions 沒同步的情況。

替代方案是新增 repo 層的 findUsedTagsByAccountBookId。這雖然可減少前端 derivation 的資料量，但目前 IndexedDB 資料規模與需求複雜度都不足以支撐這個額外抽象，因此本次不採用。

### Scope suggestions by the form-selected account book instead of global current account book

suggestions 的 scope 以交易草稿當下的 accountBookId 為準，而不是只依賴 account book store 的 currentAccountBookId。原因是交易表單本身允許使用者在表單中切換帳本；若 suggestions 仍綁在全域 current account book，就會在表單切換帳本後短暫顯示錯誤來源的 tags。

因此 ExpenseForm 與 IncomeForm 只負責把 value.accountBookId 傳給 hook；hook 在 accountBookId 改變時，必須停止顯示前一個帳本的 suggestions，直到新帳本資料可用。

替代方案是由表單先同步 current account book 再查 suggestions。這會把資料邊界與 UI 狀態耦合在一起，增加 race condition 風險，因此不採用。

### Keep TagInput presentational and render suggestion chips below the input

TagInput 仍然是共用 presentational component，只接收目前 tags、onTagsChange，以及新的 suggestions 資料，不負責查詢 repo 或管理 cache。這可維持 clean architecture，讓 UI 元件只專注於輸入、顯示與點選 suggestion 互動。

UI 形式採輸入框下方的可點選 chips。已經選入目前草稿的 tags 不再重複顯示於 suggestions 區。當使用者在輸入框中輸入文字時，suggestions 僅在記憶體中做前端過濾，不觸發額外查詢。

替代方案是使用 autocomplete dropdown。這需要額外處理 focus、keyboard navigation 與 modal 內層疊互動，對第一版來說改動面過大，因此不採用。

### Keep loading and failure states non-blocking

當 suggestions 正在 loading 或 refetching 時，tags 欄位仍可自由輸入與提交。若 hook 尚未取得結果，UI 只是不顯示 suggestions 區塊，不出現阻塞式 spinner，也不顯示上一個帳本的 stale suggestions。

若查詢失敗，行為與 loading 類似：表單保留自由輸入能力，suggestions 視為不可用，不額外拋出 toast。原因是這個能力屬於輸入輔助，而不是建立交易的必要條件。

替代方案是把 suggestions 視為必要資料，loading 時禁用欄位。這會直接影響建立交易流程，不符合此次變更「輔助而非阻塞」的目標。

### Normalize suggestion candidates for display only

hook 會在衍生 suggestions 時做一致化處理：去除空字串、trim 前後空白、以 case-insensitive 方式去重並保留第一個可見字串、最後做穩定排序。這些規則只影響 suggestions 顯示，不會回頭修改已儲存交易中的原始 tag 值。

這個決策可以減少相同 tag 因大小寫或前後空白差異而重複出現在 suggestions 的問題，同時避免把歷史資料清洗納入本次 scope。

替代方案是完全精確比對既有字串。這會讓 suggestions 很容易出現視覺上重複的項目，因此不採用。

## Implementation Contract

**Behavior**

- 在新建或編輯 expense transaction form 與 income transaction form 時，tags 欄位 SHALL 顯示來自該表單 selected accountBookId 的既有標籤 suggestions。
- suggestions SHALL 以可點選 chips 形式顯示在輸入框下方，且不重複列出目前草稿已選取的 tags。
- 使用者從 suggestions 點選 tag 後，系統 SHALL 將其加入目前草稿 tags，並保留其他手動輸入的 tags。
- 當使用者變更表單中的 accountBookId 時，系統 SHALL 停止顯示舊帳本 suggestions，直到新帳本 suggestions 可用。
- 當交易 create、update、delete 改變某帳本的已使用 tags 集合時，系統 SHALL 在既有 transaction query invalidation 後刷新該帳本的 suggestions。

**Interface / data shape**

- 新的 usecase hook 名稱為 useAccountBookTagSuggestions，輸入為 accountBookId，輸出至少包含 suggestions、isLoading，以及可供 UI 判斷背景刷新狀態的 fetching flag。
- TagInput 擴充為接收 suggestions 類型資料，但不接收 repo 或 query client。
- ExpenseForm 與 IncomeForm 都以交易草稿的 value.accountBookId 作為唯一資料來源，把 suggestions 傳入 TagInput。

**Failure modes**

- 若 accountBookId 為空、帳本不存在，或該帳本目前沒有任何已使用 tags，suggestions SHALL 為空集合。
- 若 suggestions 查詢尚未完成或 refetch 中，tags 欄位 SHALL 保持可輸入。
- 若 suggestions 來源查詢失敗，表單 SHALL 不因 suggestions 失敗而阻止建立或編輯交易。

**Acceptance criteria**

- 單元測試覆蓋 suggestions derivation：只取指定帳本、去空值、trim、去重、排序。
- 元件或整合測試覆蓋 ExpenseForm 與 IncomeForm：顯示 suggestions、點選 suggestion 新增 tag、已選 tag 不重複顯示、切換 accountBookId 不顯示舊 suggestions。
- 針對 mutation coherence 的測試或明確驗證覆蓋：新增交易帶入新 tag、更新或刪除最後一筆 tag 使用紀錄後 suggestions 刷新。
- 手動驗證 modal 內 tags 區塊在手機 viewport 下仍可捲動，不因 suggestions 區塊新增而阻塞輸入。

**Scope boundaries**

- In scope: usecase hook、TagInput suggestions UI、ExpenseForm/IncomeForm 接線、對應測試。
- Out of scope: report page tag filter、tag analytics、tag rename/merge workflow、跨帳本 suggestions、autocomplete dropdown。

## Risks / Trade-offs

- [Large account books increase in-memory derivation cost] → 透過重用既有 query 結果與 memoized normalization，先避免新增第二條資料查詢路徑；若未來資料量成長，再考慮 repo 層 tags 聚合 API。
- [Case-insensitive dedupe can hide stylistic differences in historical tags] → 僅將這個規則用於 suggestions 顯示，不修改既有儲存值，降低破壞性。
- [Two forms sharing one presentational component can regress differently] → 以共用 TagInput 測試加上 ExpenseForm/IncomeForm 整合測試覆蓋兩條接線路徑。
- [Incorrect stale display during account-book switch] → hook 在 accountBookId 改變時清空上一個帳本的可見 suggestions，避免錯誤輔助資訊停留在 UI 上。

## Migration Plan

- No data migration is required because the stored transaction schema does not change.
- Rollback is limited to removing the suggestions hook wiring and UI props from the transaction forms and TagInput.

## Open Questions

- None. The scope, cache strategy, and loading behavior are fixed for this proposal.
