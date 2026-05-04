## Why

報表頁面目前只支援時間範圍和帳本篩選，使用者無法聚焦在特定分類（如餐飲、交通）進行統計分析。加入分類篩選讓使用者可以更精準地檢視支出或收入結構。

## What Changes

- 在報表頁面標題列新增「Filter categories」按鈕，點擊開啟 Drawer
- Drawer 中顯示所有分類，依「Expense」與「Income」分組，並支援父子層級縮排顯示
- 使用者可勾選／取消各分類，排除的分類不出現在報表中
- 排除父分類時，其所有子分類的交易也一併排除
- 提供「Include all」與「Exclude all」快速操作
- 適用於單一帳本及全部帳本（all-books）兩種檢視模式

## Capabilities

### New Capabilities

- `report-category-filter`: 報表頁面的分類篩選功能，包含 CategoryFilterSelector 元件與 report.tsx 的篩選邏輯

### Modified Capabilities

(none)

## Impact

- Affected specs: `report-category-filter` (new)
- Affected code:
  - `apps/web/src/components/report/CategoryFilterSelector.tsx` (new)
  - `apps/web/src/pages/account-books/[id]/report.tsx`
