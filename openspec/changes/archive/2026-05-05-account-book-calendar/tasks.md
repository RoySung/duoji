## 1. Calendar 工具函式

- [x] 1.1 建立 `src/components/calendar/calendarUtils.ts`，實作 `getWeekDays(date)` 函式：接受 `dayjs.Dayjs`，回傳該週 Mon-Sun 共 7 個 `dayjs.Dayjs` 物件陣列。使用 `dayjs/plugin/isoWeek`，在檔案內 import 並 extend。同時實作 `formatCalendarDate(date)` 將 `dayjs.Dayjs` 轉為 `YYYY/MM/DD` 字串（使用 `transactionUtils.ts` 的 `TransactionDateFormat` 常數）。
- [x] 1.2 在 `calendarUtils.ts` 中實作 `getMonthGrid(year, month)` 函式：回傳 `dayjs.Dayjs[][]` 二維陣列，每列代表一週（Mon-Sun），第一週與最後一週以相鄰月份的日期補齊。同時實作 `isToday(date)` 與 `isSameMonth(date, ref)` 輔助函式。

## 2. WeekStrip 元件

- [x] 2.1 建立 `src/components/calendar/WeekStrip.tsx`，接受 props: `selectedDate: string | null`、`currentWeekDate: dayjs.Dayjs`、`onSelectDate: (date: string | null) => void`、`transactionDates: Set<string>`。以 `grid grid-cols-7` 排列 7 天，每格顯示星期縮寫（Mon-Sun）與日期數字。實作「Calendar displays a week strip by default」需求中的日期顯示邏輯。
- [x] 2.2 在 WeekStrip 中實作日期選取與視覺樣式：選中日期使用 `bg-primary text-primary-foreground rounded-full`；今日未選中時使用 `ring-2 ring-primary/50`（「Calendar highlights today's date」需求）；有交易日期顯示小圓點（「Calendar indicates dates with transactions」需求）。點擊已選日期呼叫 `onSelectDate(null)` 取消選取。
- [x] 2.3 在 WeekStrip 左右兩側加入 chevron 按鈕（`PiCaretLeftBold` / `PiCaretRightBold`），點擊時透過 `onChangeWeek` callback 切換前後一週，實作「Navigate to previous/next week」scenario。

## 3. MonthGrid 元件

- [x] 3.1 建立 `src/components/calendar/MonthGrid.tsx`，接受 props: `selectedDate: string | null`、`displayMonth: dayjs.Dayjs`、`onSelectDate: (date: string | null) => void`、`onChangeMonth: (month: dayjs.Dayjs) => void`、`transactionDates: Set<string>`。頂部渲染月份標題（e.g. "April 2026"）與左右導航按鈕（`PiCaretLeftBold` / `PiCaretRightBold`），實作「Calendar supports month grid view」需求與「Navigate between months」scenario。
- [x] 3.2 在 MonthGrid 中以 `grid grid-cols-7` 渲染星期標題列（Mon-Sun）與日期格。非當月日期使用 `text-muted-foreground/40` 淡化。選中日期、今日指示、交易指示的視覺處理邏輯與 WeekStrip 一致。

## 4. TransactionCalendar 主元件

- [x] 4.1 建立 `src/components/calendar/TransactionCalendar.tsx`，接受 props: `selectedDate: string | null`、`onSelectDate: (date: string | null) => void`、`transactionDates: Set<string>`。內部管理 `viewMode: 'week' | 'month'`（預設 `'week'`）與 `displayMonth: dayjs.Dayjs`（預設 selectedDate 或 today）。根據 viewMode 渲染 WeekStrip 或 MonthGrid。
- [x] 4.2 在 TransactionCalendar 底部中央加入 chevron toggle 按鈕（`PiCaretDownBold` 收合時 / `PiCaretUpBold` 展開時），點擊切換 viewMode。使用 `framer-motion` 的 `motion.div` 與 `AnimatePresence` 實作展開收合的高度動畫過渡，實作「Expand to month view」與「Collapse to week view」scenario。
- [x] 4.3 處理 view 切換的日期同步：從 month 切換到 week 時，week strip 顯示包含當前 selectedDate（或 today）的那一週；在 month view 選取日期時，同步更新 displayMonth。

## 5. 頁面整合與篩選

- [x] 5.1 修改 `src/pages/account-books/[id]/index.tsx`：新增 `selectedDate` state 與 `filteredTransactions` / `transactionDates` useMemo。將 `filteredTransactions` 傳給 TransactionList 取代原本的 `transactions`，實作「Selecting a date filters the transaction list」需求，並讓 `Transactions are presented in an account-book-scoped list` 保持由帳本頁面擁有查詢狀態。
- [x] 5.2 在 AccountBookPage 的 header 與 TransactionList 之間插入 `<TransactionCalendar>` 元件。更新記錄筆數 chip：篩選時顯示 `{filtered} / {total} records`，未篩選時顯示 `{total} records`。
- [x] 5.3 修改 `src/components/transaction/TransactionList.tsx`：新增 optional `emptyMessage: string` prop，當 transactions 為空時顯示此訊息。AccountBookPage 在有 selectedDate 時傳入 "No transactions on this date"，實作「Select a date with no transactions」scenario。

## 6. Repo / Usecase 查詢下沉

- [x] 6.1 在 `src/entities/transaction.ts` 擴充交易列表與 calendar 摘要查詢型別與 repo 介面，分離 list query 與 calendar summary query 的資料契約
- [x] 6.2 更新 `src/lib/dexie.ts` 與 `src/repositories/transactionRepo/transactionLocalRepo.ts`，加入支援日期查詢與可見範圍摘要查詢的索引與 repo 方法
- [x] 6.3 新增或拆分 usecase，讓交易列表與 calendar 分別透過 hook 封裝 repo 查詢，而不是由頁面自行從完整列表推導

## 7. Query Cache 與頁面整合

- [x] 7.1 在 `apps/web/package.json` 與 `src/pages/_app.tsx` 導入 `@tanstack/react-query` 與 `QueryClientProvider`，設定短 TTL query defaults
- [x] 7.2 修改 `src/pages/account-books/[id]/index.tsx` 與 calendar 元件 props，改為消費 repo/usecase 提供的交易列表與 calendar 摘要資料，移除 page-level `filteredTransactions` / `transactionDates` 推導
- [x] 7.3 在 `TransactionCalendar`、`WeekStrip`、`MonthGrid` 加入日期 hover 顯示總金額，並由 calendar 專用 query 提供資料，完成 `Calendar exposes daily totals for visible dates` requirement

## 8. Mutation Cache 更新

- [x] 8.1 以 query mutation 實作 create / update / delete 後的 cache patch 規則，確保列表 query 與 calendar summary query 在 TTL 內仍保持一致
- [x] 8.2 新增或更新測試，覆蓋 repo query、query cache 命中、mutation 後列表與 calendar 資料同步更新等情境
