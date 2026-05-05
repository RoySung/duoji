## Why

報表頁面的時間範圍選擇器目前使用分頁式 UI（Tabs），自訂範圍需切換至「Custom」頁籤才會顯示日期輸入欄位，操作流程不直觀。重構後改為永遠顯示 DateRangePicker，並提供快速選擇按鈕，讓使用者能一步完成範圍設定。

## What Changes

- `TimeRangeSelector` 元件完整重寫：移除 HeroUI `Tabs`，改用永遠顯示的 `DateRangePicker`，搭配 5 個快速選擇按鈕（當週、當月、三個月、一年、全部），預設選取「當週」
- `TimeRangeSelector` 的 props API 簡化：移除 `preset / customRange` 雙狀態設計，改為單一 `value: DateRange | null` + `onChange`
- `TimeRangePreset` 型別更新：`'thisWeek' | 'month' | '3m' | '1y' | 'all'`，移除 `'custom'` 與 `'thisMonth'`
- `useReportTransactions` hook 介面簡化：接受 `dateRange: DateRange | null` 取代原有的 `preset + customRange` 雙參數，移除 `resolveTimeRange`、`isValidCustomRange` 等內部輔助函式
- `report.tsx` 狀態管理簡化：移除 `preset` 與 `customRange` 兩個 state，改為單一 `dateRange` state

## Capabilities

### New Capabilities

- `report-time-range-selector`: 報表頁面的時間範圍選取 UI 行為——永遠顯示的 DateRangePicker、快速選擇按鈕（當週/當月/三個月/一年/全部）、以及預設選取「當週」

### Modified Capabilities

（無現有規格層級的行為變更）

## Impact

- Affected specs: `report-time-range-selector`（新建）
- Affected code:
  - `apps/web/src/components/report/TimeRangeSelector.tsx`
  - `apps/web/src/components/report/reportTypes.ts`
  - `apps/web/src/hooks/useReportTransactions.ts`
  - `apps/web/src/pages/account-books/[id]/report.tsx`
- Dependencies: `@heroui/react` DateRangePicker（已安裝 v2.7.8）、`@internationalized/date` parseDate（已安裝）
