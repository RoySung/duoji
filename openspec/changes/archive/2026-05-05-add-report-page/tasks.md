## 1. Setup

- [x] 1.1 新增依賴並安裝：在 `apps/web/package.json` 中加入 `apexcharts` 與 `react-apexcharts`，執行 `pnpm install`，對應設計決策「選用 ApexCharts 作為圖表函式庫」
- [x] 1.2 新增 `apps/web/src/components/report/reportTypes.ts`，定義 `TimeRangePreset` (`'all' | '1y' | '3m' | 'thisMonth'`)、`CategorySummary`、`CurrencyGroup`、`MonthlyTrendPoint` 等共用型別
- [x] 1.3 新增動態包裝元件 `apps/web/src/components/report/ReportApexChart.tsx`，使用 `next/dynamic({ ssr: false })` 載入 `react-apexcharts`，對應設計決策「選用 ApexCharts 作為圖表函式庫」

## 2. Data Layer（usecase + utility）

- [x] 2.1 建立純函式 utility `apps/web/src/utils/reportAggregate.ts`，匯出 `groupByCurrency`、`summarize`、`groupByCategory`、`groupByMonth`，對應設計決策「聚合為純函式 utility」
- [x] 2.2 `groupByCategory` 支援 `mergeByName` 選項（單一 book: false，all: true），對應設計決策「Category 聚合：兩種模式」
- [x] 2.3 實作 usecase hook `apps/web/src/hooks/useReportTransactions.ts`，依 `accountBookId` 與 preset 分派呼叫 `findByDateRange` / `findByAccountBookId` / `findAll`；query key 使用 `['transactions', 'report', accountBookId, preset]`；對應設計決策「Data Layer：不新增 repo method」

## 3. Time Range 與頁面骨架

- [x] 3.1 實作 `apps/web/src/components/report/TimeRangeSelector.tsx`，提供 All / 1Y / 3M / This Month 四個 segmented control 選項（預設 All），對應 spec requirement "Report page supports time range presets" 與設計決策「Time Range：四個 preset，以 local state 管理」
- [x] 3.2 以 `dayjs` 計算各 preset 的 `startDate` / `endDate`（YYYY/MM/DD 格式），`all` preset 不傳日期改呼叫 `findByAccountBookId` / `findAll`
- [x] 3.3 建立頁面 `apps/web/src/pages/account-books/[id]/report.tsx`，從 `router.query.id` 取得 accountBookId，對應 spec requirements "Report page is available at the account book report route" 與 "Report page is accessible at the account book route"；沿用 Header 的 AccountBookMenu 進行帳本切換
- [x] 3.4 頁面處理「找不到帳本」狀態，與 `/account-books/[id]/index.tsx` 現有錯誤卡片一致，對應設計決策「Routing：複用 `/account-books/[id]/*` 路由」

## 4. Report 區塊元件

- [x] 4.1 `apps/web/src/components/report/ReportSummaryCards.tsx`：Income / Expense / Net 三張 stats card，對應 spec requirement "Report page displays income, expense, and net summary"
- [x] 4.2 `apps/web/src/components/report/ReportCategoryBreakdown.tsx`：Donut chart + ranking list，含 Expense / Income Tab 切換，對應 spec requirement "Report page displays category breakdown"
- [x] 4.3 `apps/web/src/components/report/ReportMonthlyTrend.tsx`：stacked bar chart（income vs expense），對應 spec requirement "Report page displays a monthly trend chart"
- [x] 4.4 `apps/web/src/components/report/ReportSection.tsx`：封裝單一 currency scope 下的 summary + category + trend，供頁面 loop 使用
- [x] 4.5 頁面在 `accountBookId === 'all'` 時 loop currency groups，每 currency 一組 `ReportSection`，依該幣別 transaction 筆數降序排列，對應 spec requirement "Aggregate view groups results by currency" 與設計決策「Currency：All Books 下依幣別分組」
- [x] 4.6 各區塊的 empty / loading state 比照現有 `TransactionList` dashed card 樣式，於資料為空時以 empty card 取代圖表

## 5. Navigation 整合

- [x] 5.1 更新 `apps/web/src/components/layout/navbar.tsx`：加入 Report nav item（icon `PiChartPieSliceFill`）位於中央 `+` 按鈕右側、Settings 左側，對應 spec requirement "Navbar includes a report tab" 與設計決策「Navbar：加入 Report，保留 aggregate view 可用」
- [x] 5.2 Report nav item 在 aggregate view 下保持可用（**不**套用 prohibition overlay、不禁用），點擊時導向 `/account-books/<currentAccountBookId | 'all'>/report`
- [x] 5.3 Report nav item 的 active 狀態偵測：當 `router.pathname` 匹配 `/account-books/[id]/report` 時標示為 active

## 6. 視覺與主題整合

- [x] 6.1 `ReportApexChart` 依 `next-themes` 的 `resolvedTheme` 切換 ApexCharts `theme.mode`（light / dark），確保 dark mode 可讀性
- [x] 6.2 圖表 color palette 採用 `hsl(var(--chart-1))` ~ `--chart-5`，expense 強調 `orange-400`、income 強調 `success`
- [x] 6.3 頁面 layout 遵循既有 rounded-3xl + border + shadow tokens，與 `account-books/[id]/index.tsx` 視覺一致

## 7. 驗證

- [x] 7.1 跑 `pnpm --filter @duoji/web dev`（port 3010），以 MCP Preview 驗證單一 book view：All / 1Y / 3M / This Month 切換、donut 總和、trend bar 數值、Expense / Income tab 切換
- [x] 7.2 準備兩本不同幣別 account book（TWD、JPY），切到 `All Account Books` 驗證依幣別分組，並驗證同名分類跨 book 合併為單一條目
- [x] 7.3 驗證 Report nav item 在 aggregate view 下可點擊（Settlement 則禁用），且 active 狀態於 report 路由下正確高亮
- [x] 7.4 驗證空資料帳本進入 Report 呈現 empty state 而非空圖表
- [x] 7.5 切換 Light / Dark theme 驗證圖表對比可讀
