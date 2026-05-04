## 1. 型別與資料層

- [x] 1.1 在 `reportTypes.ts` 的 `TimeRangePreset` 中新增 `'custom'` 值（擴充 TimeRangePreset 型別加入 custom），實現 user can select a custom date range on the report page
- [x] 1.2 在 `useReportTransactions` 新增可選參數 `customRange?: { startDate: string; endDate: string }`，當 preset 為 `'custom'` 且 customRange 有效時使用自訂區間查詢（useReportTransactions 擴充方式）；更新 `queryKey` 包含 customRange
- [x] 1.3 當 preset 為 `'custom'` 但 `customRange` 不完整或結束日期早於起始日期時，設定 `enabled: false` 不發出查詢（report does not fetch while custom range is incomplete；end date must not be before start date）

## 2. TimeRangeSelector UI

- [x] 2.1 在 `TimeRangeSelector` 的 PRESETS 陣列新增 `{ value: 'custom', label: 'Custom' }` 選項（custom option is available）
- [x] 2.2 新增 `customRange` 與 `onCustomRangeChange` props 至 `TimeRangeSelector`（customRange 狀態歸屬）
- [x] 2.3 當選取 Custom 時，在 Tabs 下方顯示起始日期與結束日期的 `<input type="date">` 欄位（date inputs appear after selecting Custom；日期選擇器 UI 位置）
- [x] 2.4 當結束日期早於起始日期時，顯示錯誤提示（end date must not be before start date）

## 3. 報表頁面整合

- [x] 3.1 在 `report.tsx` 新增 `customRange` 狀態（型別 `{ startDate: string; endDate: string } | null`），並傳入 `TimeRangeSelector` 與 `useReportTransactions`
- [x] 3.2 當 preset 為 `'custom'` 且 customRange 不完整時，在報表內容區顯示提示文字引導使用者選擇日期區間（report does not fetch while custom range is incomplete）
- [x] 3.3 當 preset 為 `'custom'` 且 customRange 有效時，報表正常顯示指定區間的交易資料（report updates when both dates are provided）
