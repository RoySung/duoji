## Why

Duoji 目前只提供記帳與結算功能，使用者無法快速了解收支總覽、消費分類、歷月趨勢。缺乏彙整分析頁面時，使用者必須翻閱每筆交易才能理解帳本狀況，體驗薄弱。新增 Report 頁面能回答「這段時間花了多少？」「最大的支出類別是什麼？」「收入與支出趨勢如何？」等核心問題。

## What Changes

- 新增 `/account-books/[id]/report` 報表頁面，`[id]` 可為特定 book id 或 `'all'`（跨帳本聚合）。
- 新增 usecase hook `useReportTransactions(accountBookId, timeRange)`，封裝 repo 查詢與 React Query 快取。
- 新增純函式聚合 utility `reportAggregate`（`groupByCurrency` / `summarize` / `groupByCategory` / `groupByMonth`）。
- 頁面提供：
  - 時間範圍切換（All / 1Y / 3M / This Month，預設 All）。
  - Summary cards：Income / Expense / Net。
  - Category breakdown：Donut chart + ranking list，支援 Expense / Income tab 切換。
  - Monthly Trend：stacked bar chart（income vs expense）。
- 於 bottom navbar 加入 Report 項目，位置位於中央 `+` 按鈕右側、Settings 左側；在 All Books aggregate view 下仍保持可用。
- `All Account Books` 下以「幣別」作為分組邊界，不同幣別的資料分別呈現獨立的 summary + charts，避免跨幣別加總。
- `All Account Books` 下同名分類（跨 book）合併為單一項目（`mergeByName: true`）。
- 依賴新增：`apexcharts`、`react-apexcharts`，以 `next/dynamic({ ssr: false })` 載入避免 SSR 衝突。

## Non-Goals

- 不提供自訂起訖日期（custom date range picker），僅支援 All / 1Y / 3M / This Month 四個 preset。
- 不提供匯出 PDF / CSV 功能。
- 不提供跨幣別匯率換算；All Books 下仍依幣別分組呈現。
- 不提供 tag / payment method / user（paidBy）的分群統計，僅以 category 為維度。
- 不提供預算（budget）對比、目標追蹤等衍生分析。
- 不將 time range 狀態寫入 URL query string；切頁會重置為預設值。

## Capabilities

### New Capabilities

- `reports`: 提供帳本的收支統計、分類分析、歷月趨勢視覺化。支援時間範圍 preset、單一帳本與全帳本聚合、依幣別分組、同名分類合併。

### Modified Capabilities

- `app-shell-navigation`: 底部導覽列新增 Report 項目（第 5 個），位置在中央 `+` 按鈕右側與 Settings 左側之間；Report 項目在 aggregate view (`accountBookId === 'all'`) 下仍保持可用。
- `account-book-routing`: 新增 `/account-books/[id]/report` 子路由，`[id]` 可為特定 book id 或 `'all'`。

## Impact

- Affected specs:
  - New: `reports`
  - Modified: `app-shell-navigation`, `account-book-routing`
- Affected code:
  - New:
    - `apps/web/src/pages/account-books/[id]/report.tsx`
    - `apps/web/src/hooks/useReportTransactions.ts`
    - `apps/web/src/utils/reportAggregate.ts`
    - `apps/web/src/components/report/ReportSection.tsx`
    - `apps/web/src/components/report/ReportSummaryCards.tsx`
    - `apps/web/src/components/report/ReportCategoryBreakdown.tsx`
    - `apps/web/src/components/report/ReportMonthlyTrend.tsx`
    - `apps/web/src/components/report/TimeRangeSelector.tsx`
    - `apps/web/src/components/report/ReportApexChart.tsx`
    - `apps/web/src/components/report/reportTypes.ts`
  - Modified:
    - `apps/web/package.json`（新增 `apexcharts`、`react-apexcharts`）
    - `apps/web/src/components/layout/navbar.tsx`（加入 Report nav item）
- Dependencies: 新增 `apexcharts`、`react-apexcharts`
- Data layer: 沿用既有 `TransactionLocalRepo.findByDateRange` / `findAll`、`useCategoryStore`、`useAccountBookStore`，不修改 repo 或 entity。
