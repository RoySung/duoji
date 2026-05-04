## Context

報表頁面的時間範圍目前由 `TimeRangePreset`（`'all' | '1y' | '3m' | 'thisMonth'`）驅動。`TimeRangeSelector` 用 HeroUI `Tabs` 呈現選項；`useReportTransactions` 將 preset 轉換成 `startDate/endDate` 後查詢 IndexedDB。

## Goals / Non-Goals

**Goals:**

- 在現有 Tabs UI 加入「Custom」選項
- 選取 Custom 後顯示起訖日期選擇器
- `useReportTransactions` 在 preset 為 `'custom'` 時使用使用者輸入的日期區間查詢

**Non-Goals:**

- 不儲存自訂區間至 URL 或 localStorage（本次不做持久化）
- 不支援單日選取（起訖日期均必填）
- 不修改現有預設區間邏輯

## Decisions

### 擴充 TimeRangePreset 型別加入 custom

在 `reportTypes.ts` 將 `TimeRangePreset` 改為 `'all' | '1y' | '3m' | 'thisMonth' | 'custom'`。

這讓整個資料流（selector → hook → page）維持單一 preset 型別，不需引入新的 union type，改動最小。

### 日期選擇器 UI 位置

Custom Tab 選取後，在 TimeRangeSelector 下方（或 inline）顯示兩個 `<input type="date">` 欄位（起始日 / 結束日）。
選擇器透過 `onCustomRangeChange` callback 將 `{ start: string, end: string }` 往上傳。

使用原生 `<input type="date">` 避免引入新的 date picker 套件，保持依賴精簡。

### customRange 狀態歸屬

`customRange` 狀態放在 `report.tsx` 頁面層，與 `preset` 狀態並列。
`TimeRangeSelector` 接收 `customRange` 與 `onCustomRangeChange` props，僅負責 UI。
`useReportTransactions` 接收額外的 `customRange?: { startDate: string; endDate: string }` 參數。

### useReportTransactions 擴充方式

新增可選參數 `customRange`，當 `preset === 'custom'` 且 `customRange` 有效時，直接使用該區間查詢，不經過 `resolveTimeRange`。
`queryKey` 加入 `customRange` 以確保日期變更時自動 refetch。

## Risks / Trade-offs

- **原生 date input 外觀差異**：不同作業系統/瀏覽器的原生日期選擇器外觀不一致。→ 可接受，後續若需要再替換為統一元件。
- **custom 狀態下起訖日期未填完整時的行為**：需要決定是否顯示空報表或停用查詢。→ 設計為：`customRange` 未完整時不發出查詢（`enabled: false`），顯示提示文字。
