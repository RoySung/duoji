## 1. 更新型別定義

- [x] 1.1 更新 `reportTypes.ts` 中的 `TimeRangePreset`：改為 `'thisWeek' | 'month' | '3m' | '1y' | 'all'`，移除 `'custom'` 與 `'thisMonth'`

## 2. 簡化 useReportTransactions Hook

- [x] 2.1 移除 `resolveTimeRange`、`isValidCustomRange` 輔助函式，將 hook 簽名改為接受 `dateRange: { startDate: string; endDate: string } | null`（「全部」對應 null）
- [x] 2.2 更新 query key 改用 `dateRange.startDate / endDate`，移除 `customValid` 邏輯，`enabled` 條件簡化為 `accountBookId !== null`

## 3. 重寫 TimeRangeSelector 元件

- [x] 3.1 新增 CalendarDate ↔ 字串橋接私有輔助函式：`stringToCalendarDate`（parseDate + slash→dash）與 `calendarDateToString`（補零 + slash 串接）
- [x] 3.2 新增 `resolvePreset` 函式，依設計決策「週起始日（isoWeek plugin）」使用 dayjs isoWeek 外掛（`startOf('isoWeek')` / `endOf('isoWeek')`）計算當週範圍，並實作其他四種預設（當月、三個月、一年、全部）的日期計算
- [x] 3.3 實作 DateRangePicker is always visible on the report page：以 `DateRangePicker` 取代 `Tabs`，元件永遠顯示 picker，`pickerValue` 由 `props.value` 透過 `useMemo` 轉換而來
- [x] 3.4 實作 Quick-select buttons set the date range：新增快速選擇狀態管理（`activePreset` 內部 state），點擊按鈕時更新 activePreset 並呼叫 `onChange(resolvePreset(preset))`；手動調整 picker 時清除 activePreset
- [x] 3.5 實作 Default selection is 當週 (this ISO week)：以 `useEffect(() => { onChange(resolvePreset('thisWeek')) }, [])` 完成預設範圍初始化，確保掛載時向父層發送當週範圍
- [x] 3.6 實作 全部 shows all transactions without a date filter：「全部」按鈕呼叫 `onChange(null)`，DateRangePicker 傳入 `null` 顯示空值（「全部」對應 null）
- [x] 3.7 更新 props 型別：移除 `preset / customRange` 雙狀態，改為 `value: DateRange | null` + `onChange: (range: DateRange | null) => void`

## 4. 更新 report.tsx

- [x] 4.1 移除 `preset` 與 `customRange` state，新增 `dateRange: DateRange | null` state（初始值 `null`）
- [x] 4.2 更新 `useReportTransactions` 呼叫改用 `dateRange`，移除 `TimeRangePreset` import
- [x] 4.3 更新 `<TimeRangeSelector>` 使用新 props（`value={dateRange}` `onChange={setDateRange}`），移除 `preset === 'custom'` 的空狀態提示區塊

## 5. 驗證

- [x] 5.1 執行 `pnpm tsc --noEmit`（在 `apps/web`），確認無 TypeScript 錯誤
- [x] 5.2 手動測試：開啟報表頁，確認 DateRangePicker 永遠可見、預設高亮「當週」、各快速按鈕正常切換且 picker 值同步更新
- [x] 5.3 手動測試：手動調整 DateRangePicker 日期，確認快速按鈕高亮清除、報表資料依新範圍更新
- [x] 5.4 手動測試：點擊「全部」，確認 picker 清空、報表載入全部資料
