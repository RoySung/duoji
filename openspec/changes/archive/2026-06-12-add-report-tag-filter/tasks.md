## 1. Toolbar 與 filter state

- [x] 1.1 交付 Tag filter is available on the report page 與 Reuse the existing drawer filter pattern for TagFilterSelector，讓 apps/web/src/components/report/TagFilterSelector.tsx 在單一帳本與 all-books 報表 header 都可開啟並顯示正向的 selected-tags 語意；完成後以 apps/web/specs/reportTagFilterSelector.spec.tsx 驗證按鈕可見性、badge 與基本選取互動。
- [x] 1.2 交付 Tag filter options are derived from the current report dataset 與 Derive available tags from the report dataset after time range and book filtering，讓 apps/web/src/pages/account-books/[id]/report.tsx 只從 time-range 與 book-filter 後的交易集合導出 availableTags，並在 tags 離開 scope 時清理無效 selectedTags；完成後以 apps/web/specs/reportTagFilterSelector.spec.tsx 或相鄰整合測試驗證 time range 變更、all-books 帳本排除與失效選項清理。
- [x] 1.3 交付 Tag filter state is page-local 與 Keep tag filter state page-local and leave CSV export unchanged，讓 selectedTags 維持 page-local state、不寫入 URL，且現有 CSV export scope 不受 tag filter 影響；完成後以手動檢查與報表頁整合測試驗證重新進入頁面時 tag selection 會重置，並確認 export 仍只跟隨既有 bookFilteredTransactions。

## 2. 聚合與報表輸出

- [x] 2.1 交付 Treat report tag filter as an inclusion scope, not another exclusion list 與 Tag filter uses inclusive matching and preserves untagged transactions，讓 ReportSection 以 selectedTags 套用 any-match 的包含式 predicate，並在 tag filter 啟用時保留 untagged 交易；完成後以 apps/web/specs/reportSection.spec.tsx 驗證空 selection、不同比對 tag、以及 untagged 保留行為。
- [x] 2.2 交付 Apply tag filtering before report aggregations and before category breakdown rendering 與 Report outputs reflect the active tag filter，讓 summary cards、category breakdown 與 monthly trend 全都使用 tag-filtered dataset，且 category exclusion 只在該 tag-scoped dataset 內繼續生效；完成後以 apps/web/specs/reportSection.spec.tsx 與 apps/web/specs/reportCategoryBreakdown.spec.tsx 驗證 summary、trend、breakdown 都會跟著 tag filter 改變。
- [x] 2.3 交付 Keep untagged transactions visible even when selectedTags is non-empty，讓 tag filter 啟用後不會把未標記交易從 breakdown 與 totals 中排除；完成後以 apps/web/specs/reportSection.spec.tsx 的組合情境驗證包含式 tag filter 與 category exclusion 疊加時 totals 仍正確。

## 3. 驗證與一致性

- [x] 3.1 交付 report-tag-filter 與 reports 兩份 specs 的實作驗證證據，確認 apps/web/specs/reportTagFilterSelector.spec.tsx、apps/web/specs/reportSection.spec.tsx 與 apps/web/specs/reportCategoryBreakdown.spec.tsx 都通過；完成後以 pnpm nx test web --runInBand --testPathPattern=reportTagFilterSelector、pnpm nx test web --runInBand --testPathPattern=reportSection、pnpm nx test web --runInBand --testPathPattern=reportCategoryBreakdown 的結果驗證。
- [x] 3.2 交付 design 與 tasks 的一致性檢查，確認 Treat report tag filter as an inclusion scope, not another exclusion list、Apply tag filtering before report aggregations and before category breakdown rendering，以及 Keep tag filter state page-local and leave CSV export unchanged 都有對應實作與驗證目標；完成後以 spectra analyze add-report-tag-filter --json 與 spectra validate add-report-tag-filter 的通過結果驗證。
