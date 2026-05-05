## Why

AccountBookPage 目前顯示帳本下的所有交易紀錄，缺乏日期導覽與篩選功能。使用者無法快速查看特定日期的交易。需要一個 Calendar 元件，讓使用者透過「當週」或「整月」檢視模式選取日期，篩選下方的交易列表。

## What Changes

- 新增 Calendar 元件，支援兩種檢視模式：
  - **Week strip**（收合，預設）：水平顯示一週 7 天，可左右切換週
  - **Month grid**（展開）：完整月曆，含月份導航
- 頁面首次載入時預設選取今日日期，並直接顯示今日交易
- 點擊日期可篩選 transaction list，僅顯示該日交易
- 點擊已選日期可取消篩選，恢復顯示全部
- 日曆上標示有交易紀錄的日期（小圓點指示）
- calendar 日期 hover 顯示當日交易總金額
- 今日日期有視覺標示
- 透過 chevron toggle 在 week/month 模式間切換，含動畫過渡
- 篩選後記錄筆數 chip 更新為篩選數量
- 移除 expense 金額前的負號（`-`）顯示，僅保留 income 的 `+` 前綴；正負區分改由 `text-danger` / `text-success` 顏色傳達，避免「負支出」造成的閱讀困惑
- 將交易列表篩選與 calendar 摘要資料下沉到 repo/usecase，並使用 `useQuery` 提供短 TTL cache，改善日期與月份切換體驗

## Non-Goals

- 不新增第三方 calendar 套件（react-day-picker 等），自建元件即可
- 不新增 Zustand store — 日期選擇為頁面層級 local state
- 不支援日期範圍選取（僅單日選取）

## Capabilities

### New Capabilities

- `account-book-calendar`: 帳本頁面的日曆導覽與日期篩選功能，支援 week strip 與 month grid 兩種檢視模式

### Modified Capabilities

- `transactions`: 調整交易列表金額顯示規則 — expense 不再加負號前綴，income 維持 `+` 前綴

## Impact

- 新增檔案：
  - `src/components/calendar/TransactionCalendar.tsx`
  - `src/components/calendar/WeekStrip.tsx`
  - `src/components/calendar/MonthGrid.tsx`
  - `src/components/calendar/calendarUtils.ts`
- 修改檔案：
  - `src/pages/account-books/[id]/index.tsx` — 以 usecase/query 消費 calendar 與交易列表資料
  - `src/components/transaction/TransactionList.tsx` — 新增 emptyMessage prop 支援篩選空狀態
  - `src/entities/transaction.ts` — 擴充交易列表查詢與 calendar 摘要 query 契約
  - `src/repositories/transactionRepo/transactionLocalRepo.ts` — 實作日期查詢與 calendar 摘要查詢
  - `src/hooks/useAccountBookTransactions.ts` — 改以 query 封裝交易列表資料
  - `src/hooks/useAccountBookTransactionCalendar.ts` — 新增 calendar 專用 usecase
  - `src/pages/_app.tsx` — 掛入 QueryClientProvider
- 依賴：`dayjs`（已安裝）、`dayjs/plugin/isoWeek`、`framer-motion`（已安裝）、`react-icons/pi`（已使用）、`@tanstack/react-query`
