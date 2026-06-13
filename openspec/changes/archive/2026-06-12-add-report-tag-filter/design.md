## Context

報表頁目前由 apps/web/src/pages/account-books/[id]/report.tsx 持有 page-local 的 dateRange、excludedBookIds 與 excludedKeys，並將查詢後的交易資料傳入 apps/web/src/components/report/ReportSection.tsx。現有資料流是先由 useReportTransactions 依時間範圍取回交易，再在 page 層套用 all-books 帳本排除，最後在 ReportSection 內用 excludedKeys 排除分類，讓 summary cards 與 monthly trend 使用 activeTransactions，而 category breakdown 維持完整分類清單以便重新納入被排除的分類。

目前 tags 已存在於 Transaction 資料模型，但報表頁沒有任何 tag 篩選能力；此外，舊的 add-report-page 設計文件還把 tag 維度明確列為非目標。這次變更不會引入新的資料模型或外部依賴，但會同時改變報表頁 filter toolbar、filter state、聚合輸入集合與既有 category filter 的組合行為，因此需要 design artifact 作為 apply handoff。

## Goals / Non-Goals

**Goals:**

- 在單一帳本與 all-books 報表頁新增可操作的 tag filter。
- 讓 tag filter 與既有時間範圍、帳本篩選、分類排除一起工作，而且資料範圍定義一致。
- 明確定義包含式 tag filter、untagged 交易保留，以及多 tag any-match 規則。
- 讓 tag options 會隨目前報表資料範圍變化，但不因 category exclusion 或目前已選 tag 而變得不穩定。

**Non-Goals:**

- 不新增 tag 統計排行、tag 趨勢、payment method filter 或 paidBy filter。
- 不把 CSV export 改成跟隨 tag filter 或 category filter；匯出行為維持現況。
- 不新增 synthetic 的「未標記」選項或 tag 管理功能。
- 不更動既有報表時間範圍與分類 filter 的主要互動模型。

## Decisions

### Treat report tag filter as an inclusion scope, not another exclusion list

tag filter 採包含式語意，狀態以 selectedTags 表示，而不是沿用 category filter 的 excludedKeys 模式。當沒有選到任何 tag 時，報表顯示目前時間範圍與帳本篩選下的全部交易；當至少選到一個 tag 時，已標記交易只要命中任一所選 tag 即保留。

這樣的語意符合使用者對「我想看某些 tags」的心理模型，也避免在 tag filter UI 裡複製 category exclusion 的勾選反轉語意。替代方案是做成排除式 tag filter，但那會讓同一條 toolbar 上同時存在兩種「取消勾選」的理解成本，而且和先前對話已確認的需求不一致，因此不採用。

### Keep untagged transactions visible even when selectedTags is non-empty

當 tag filter 啟用時，沒有 tag 的交易仍保留在報表結果中。實作上，tag predicate 只會排除「有 tags 但完全沒有命中 selectedTags」的交易，對 tags 為空陣列的交易一律視為保留。

這個決策讓 tag filter 不會把未標記交易完全藏起來，也避免引入 synthetic 的「Untagged」資料桶與額外 UI。替代方案是把 untagged 視為另一個可勾選項目，但這會擴張需求範圍，因此不採用。

### Derive available tags from the report dataset after time range and book filtering

availableTags 將從 page 層的 bookFilteredTransactions 衍生，也就是已經套用時間範圍與 all-books 帳本排除後的交易集合。這表示 tag options 會隨 dateRange 與 excludedBookIds 更新，和使用者目前正在看的報表資料範圍一致。

availableTags 不會再受 excludedKeys 或 selectedTags 本身影響。category exclusion 是針對報表內容的視覺分析調整，而不是 tag option 來源；若把 category exclusion 也套進 options，使用者很容易在排除分類後看不到原本想重新組合的 tags。替代方案是從完整 transactions 導出 tags，但那會在 all-books 模式下顯示已被帳本 filter 排除的 tags，因此不採用。

### Apply tag filtering before report aggregations and before category breakdown rendering

tag filter 是報表資料範圍的一部分，而不是單純的列表可見性設定。因此 summary cards、monthly trend 與 category breakdown 都必須基於 tag-filtered 交易集合計算。和 category exclusion 不同，tag filter 啟用後 category breakdown 不應再使用完整未過濾交易當作母集合，否則圖表與排名會混入當前報表範圍外的資料。

具體順序是：transactions query → bookFilteredTransactions → tagFilteredTransactions → category exclusion for activeTransactions。category breakdown 的輸入改為 tagFilteredTransactions，而 category exclusion 仍保留既有互動模式，在這個 tag-scoped dataset 內決定哪些分類列為 active。替代方案是讓 breakdown 繼續吃完整交易集合，但那會讓 tag filter 對 breakdown 的含義變得不一致，因此不採用。

### Keep tag filter state page-local and leave CSV export unchanged

selectedTags 與其 UI 開關都維持在 report page local state，不寫入 URL，也不共享到其他頁面。這與現有 dateRange 與 excludedBookIds 的狀態模型一致。

同時，CSV export 保持吃現有的 bookFilteredTransactions，不跟著 tag filter 或 category filter 變更。這個 change 只負責報表頁內分析視圖，不擴張到 export 合約。替代方案是讓 export 完全跟隨可見結果，但這需要同步修改 transaction-csv-export 能力與驗證，因此在本 change 中不採用。

### Reuse the existing drawer filter pattern for TagFilterSelector

TagFilterSelector 會沿用 BookFilterSelector 的 filter button + drawer + checkbox list 模式，以減少新的互動學習成本。差別在於 tag filter 採包含式語意，所以文案、badge 意義與快捷操作必須改成「已選取幾個 tags」與「Select all / Clear selection」之類的正向語意，而不是「Exclude all」。

這個做法能讓 toolbar 維持一致的視覺節奏，也能避免再引入新的 overlay 模式。替代方案是直接把 tags 做成 inline chips 多選，但當 tags 過多時會擠壓 header 區域，因此不採用。

## Implementation Contract

**Behavior**

- 報表頁 SHALL 在現有 filter toolbar 中提供 tag filter，單一帳本與 all-books 視圖都可使用。
- 當 selectedTags 為空時，報表結果 SHALL 與未啟用 tag filter 時相同。
- 當 selectedTags 非空時，summary cards、category breakdown 與 monthly trend SHALL 只使用命中任一 selectedTags 的已標記交易，並同時保留所有 untagged 交易。
- 在 all-books 視圖下，若使用者調整帳本排除條件，tag options SHALL 根據剩餘帳本的交易集合更新。
- tag filter state SHALL 不寫入 URL，也 SHALL NOT 改變 CSV export 的輸出範圍。

**Interface / data shape**

- report page 新增 selectedTags: Set<string> 之類的 page-local state，並把 availableTags、selectedTags 與 setter 傳給新的 TagFilterSelector。
- ReportSection 擴充介面以接收 selectedTags，並在內部產生 tagFilteredTransactions 與 activeTransactions。
- reportAggregate 可新增專用 helper 來抽取唯一 tags，但不新增 repo method 或額外 query hook。

**Failure modes**

- 若目前資料範圍內沒有任何已使用 tags，tag filter UI SHALL 仍可開啟，但 options 列表為空且不影響報表結果。
- 若交易資料正在 refetch，tag options 與報表結果 SHALL 隨 query 回傳一起更新；不需要額外阻塞式 loading。
- 若使用者選到的 tag 因時間範圍或帳本排除而不再存在於 availableTags，page 層 SHALL 清理不再有效的 selectedTags，避免 filter state 卡住不可見選項。

**Acceptance criteria**

- 元件測試覆蓋 TagFilterSelector 的 badge、選取、清空，以及空 options 狀態。
- reportSection.spec.tsx 覆蓋：selectedTags 為空不過濾、單一 tag 過濾、多 tag any-match、untagged 保留、category exclusion 與 tag filter 疊加。
- 若 category breakdown 改以 tagFilteredTransactions 為輸入，reportCategoryBreakdown.spec.tsx 或相鄰整合測試 SHALL 驗證 tag filter 生效時 breakdown 只顯示 tag-scoped dataset 的分類資料。
- 手動驗證單一帳本與 all-books 視圖：時間範圍與帳本排除改變後，availableTags 會更新；CSV export 行為維持不變。

**Scope boundaries**

- In scope: report page tag filter UI、page-local state、tag option derivation、ReportSection 的 tag-filtered aggregation、對應測試與 specs。
- Out of scope: CSV export contract 變更、tag management、synthetic untagged option、其他新 filter 維度。

## Risks / Trade-offs

- [Too many tags make the drawer hard to scan] → 先沿用既有 drawer 模式並支援穩定排序；若實際資料量過大，再另開 change 做搜尋或分組。
- [Keeping untagged transactions visible may surprise users who expect strict inclusion] → 在 spec 與 selector microcopy 明確說明 tag filter 僅縮小已標記交易，未標記交易固定保留。
- [Combining tag inclusion with category exclusion can create confusing totals if predicates differ] → 在 page 與 ReportSection 明確固定過濾順序，並以 reportSection.spec.tsx 覆蓋組合情境。
- [Selected tags can become stale after range or book changes] → page 層在 availableTags 更新後同步清理失效的 selectedTags。

## Migration Plan

- No data migration is required because transactions already store tags and this change only affects report-page filtering.
- Rollback is limited to removing TagFilterSelector, selectedTags state, and the tag-filter predicate from report aggregations.

## Open Questions

- None. The filter semantics, untagged behavior, option source, and CSV boundary are fixed for this proposal.
