## Why

目前報表頁只有時間、帳本與分類篩選，使用者無法針對已標記的交易快速縮小分析範圍，只能回到交易列表逐筆查找。現在補上 tag filter，可以讓既有 tags 從記錄用途延伸到分析用途，並且正式覆寫舊報表設計中排除 tag 維度的限制。

## What Changes

- 在報表頁 header toolbar 新增 tag filter，單一帳本與 all-books 視圖都可使用。
- tag filter 採包含式語意：未選任何 tag 時不過濾；一旦選擇 tag，只保留命中任一所選 tag 的已標記交易，未標記交易維持保留。
- tag options 來自目前報表資料範圍內已使用過的 tags，並隨時間範圍與 all-books 帳本排除條件同步更新。
- 報表摘要、分類統計與月趨勢都會以 tag filter 後的交易集合重新計算。
- tag filter state 維持 page-local，不寫入 URL，也不改變現有 CSV export 行為。

## Non-Goals

- 不新增 tag 管理頁、tag 統計排行或其他 tag 維度報表。
- 不把 CSV export 改成跟隨 tag filter；此次只調整報表頁內分析視圖。
- 不新增 synthetic 的「未標記」選項；未標記交易固定保留在結果中。

## Capabilities

### New Capabilities

- report-tag-filter: 在報表頁提供以已使用 tags 為來源的包含式篩選，並定義 options 來源、未標記交易處理方式與多 tag 命中規則。

### Modified Capabilities

- reports: 報表頁的摘要卡、分類統計與月趨勢在既有時間與帳本範圍之外，還會反映 tag filter 後的交易集合。

## Impact

- Affected specs: report-tag-filter, reports
- Affected code:
  - New:
    - apps/web/src/components/report/TagFilterSelector.tsx
    - apps/web/specs/reportTagFilterSelector.spec.tsx
  - Modified:
    - apps/web/src/pages/account-books/[id]/report.tsx
    - apps/web/src/components/report/ReportSection.tsx
    - apps/web/src/components/report/ReportCategoryBreakdown.tsx
    - apps/web/src/utils/reportAggregate.ts
    - apps/web/specs/reportSection.spec.tsx
    - apps/web/specs/reportCategoryBreakdown.spec.tsx
    - openspec/specs/reports/spec.md
  - Removed:
    - none
