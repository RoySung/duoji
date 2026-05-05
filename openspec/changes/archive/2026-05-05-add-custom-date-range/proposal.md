## Why

報表頁面目前只提供預設時間區間（全部、1年、3個月、本月），無法讓使用者自訂任意起訖日期，限制了報表的彈性與實用性。

## What Changes

- `TimeRangePreset` 型別新增 `'custom'` 值
- `TimeRangeSelector` 新增「Custom」選項，選取後顯示日期選擇器讓使用者輸入起訖日期
- `useReportTransactions` 支援傳入自訂日期區間（`customRange`），當 preset 為 `'custom'` 時使用
- 報表頁面管理 `customRange` 狀態，並傳遞給 hook

## Capabilities

### New Capabilities

- `report-custom-date-range`: 報表頁面的時間範圍選擇器支援自訂起訖日期區間

### Modified Capabilities

(none)

## Impact

- Affected specs: `report-custom-date-range` (new)
- Affected code:
  - `apps/web/src/components/report/reportTypes.ts`
  - `apps/web/src/components/report/TimeRangeSelector.tsx`
  - `apps/web/src/hooks/useReportTransactions.ts`
  - `apps/web/src/pages/account-books/[id]/report.tsx`
