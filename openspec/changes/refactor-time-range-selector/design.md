## Context

報表頁面（`report.tsx`）目前以 `preset: TimeRangePreset` + `customRange: CustomRange | null` 雙狀態管理時間範圍，透過 `resolveTimeRange()` 將 preset 轉換為日期字串後傳入 `useReportTransactions` hook。`TimeRangeSelector` 元件使用 HeroUI `Tabs` 顯示預設選項，僅在選取「Custom」時才顯示原生 `<input type="date">` 欄位。

目標：改為永遠顯示 HeroUI `DateRangePicker`，搭配快速選擇按鈕列，同時簡化上下層 API。

## Goals / Non-Goals

**Goals:**

- `TimeRangeSelector` 永遠顯示 `DateRangePicker`，快速選擇按鈕可即時更新 picker 值並高亮對應按鈕
- 上層 API 統一為單一 `DateRange | null`，消除 preset/customRange 雙狀態
- 預設選取「當週」（ISO week，週一為第一天）

**Non-Goals:**

- 不實作 i18n 多語系（按鈕標籤直接硬編碼中文，後續另立任務處理）
- 不更動報表資料聚合邏輯（`reportAggregate.ts`）
- 不修改 `DateRangePicker` 以外的 HeroUI 元件樣式

## Decisions

### CalendarDate ↔ 字串橋接

HeroUI `DateRangePicker` 使用 `@internationalized/date` 的 `CalendarDate`，而專案內部統一使用 `'YYYY/MM/DD'` 字串格式。

**決策：** 在 `TimeRangeSelector.tsx` 內定義兩個私有輔助函式進行轉換：

- `stringToCalendarDate(s: string)`: 將 `/` 替換為 `-` 後呼叫 `parseDate()`
- `calendarDateToString(d: CalendarDate)`: 使用 `padStart(2,'0')` 補零，以 `/` 串接

**理由：** `parseDate` 為 `@internationalized/date` 的標準 ISO 8601 解析器，轉換邏輯簡單且集中在元件內，不需新增全域工具函式。

### 週起始日（isoWeek plugin）

**決策：** 使用已安裝的 `dayjs/plugin/isoWeek`（專案在 `calendarUtils.ts` 已引入）。`startOf('isoWeek')` 回傳週一，符合台灣慣例。

**理由：** 與專案現有日期邏輯一致，避免引入 `@internationalized/date` 的 `startOfWeek`（需傳入 locale 字串，增加複雜度）。

### 快速選擇狀態管理

**決策：** `activePreset: TimeRangePreset | null` 作為 `TimeRangeSelector` 的內部 state，不提升至父層。

- 點擊快速按鈕 → 更新 `activePreset` + 呼叫 `onChange(resolvePreset(preset))`
- 手動調整 `DateRangePicker` → 設定 `activePreset(null)` + 呼叫 `onChange`

**理由：** 父層（`report.tsx`）只需知道解析後的日期範圍，不需知道使用者點擊了哪個按鈕。保持元件 API 最小化。

### 預設範圍初始化

**決策：** 元件以 `useEffect(() => { onChange(resolvePreset('thisWeek')) }, [])` 在掛載時向父層發送預設範圍。父層 `dateRange` state 初始值為 `null`。

**理由：** 預設值的邏輯（thisWeek）屬於元件職責，由元件主動通知父層，父層不需重複定義 thisWeek 的計算邏輯。

### 「全部」對應 null

**決策：** `全部` 快速按鈕呼叫 `onChange(null)`，DateRangePicker 顯示空值（無選取範圍）。`useReportTransactions` 接收 `null` 時查詢全部資料。

**理由：** 與現有 hook 行為（`effectiveRange === null` 時不套用日期篩選）完全相符，不需新增特殊處理。

## Risks / Trade-offs

- **[風險] DateRangePicker 佔用較多垂直空間** → 接受此 trade-off，換取操作直覺性提升；若需收合可後續另立 PR
- **[風險] `useEffect` 在嚴格模式下觸發兩次** → `resolvePreset` 為純函式，重複呼叫 `onChange` 無副作用，不影響行為
- **[風險] 手動清空 DateRangePicker（使用者按 × 清除）** → 傳送 `null` 至父層，等同點擊「全部」，行為合理
