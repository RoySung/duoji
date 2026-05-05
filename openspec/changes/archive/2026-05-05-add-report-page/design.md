## Context

Duoji 目前的資料流為 Entity → Repo → Usecase (hook/store) → Page。Transaction repo 已提供 `findByDateRange` 與 `findAll`，categories 由 `useCategoryStore` 管理，帳本由 `useAccountBookStore`（含 `currency` 資訊）管理。頁面佈局採用 rounded-3xl 卡片、orange 強調色、HeroUI 元件（`Button` / `Tabs` / `Chip` / `Avatar`）。

底部 navbar 目前有 4 個項目（Home / Settlement / `+` / Settings），Settlement 在 aggregate view 下會禁用（Settlement 僅針對單一帳本）。Report 是新增項目，需要決定其在 aggregate view 的行為。

專案尚未引入圖表套件，需選擇並安裝一個。時間範圍計算採用 `dayjs`（既有 dep），日期字串格式為 `YYYY/MM/DD`。

## Goals / Non-Goals

**Goals:**

- 提供帳本收支彙總、分類分析、歷月趨勢三大視角。
- 時間範圍以 preset 簡化選擇（All / 1Y / 3M / This Month），預設 All。
- 單一帳本 / 全帳本（`all`）皆可用；All Books 下依幣別分組呈現。
- 遵循現有資料流與 UI tokens，不引入新的架構模式。
- Category 聚合支援兩種模式（依 id 或依 name），以涵蓋單一帳本與跨帳本情境。

**Non-Goals:**

- 不做 custom date range picker。
- 不做 CSV / PDF 匯出。
- 不做跨幣別匯率換算。
- 不做 tag / payment method / paidBy 維度統計。
- 不做 budget / goal 追蹤。
- 不將 time range 寫入 URL query。

## Decisions

### 選用 ApexCharts 作為圖表函式庫

**選擇**：`apexcharts` + `react-apexcharts`，透過 `next/dynamic({ ssr: false })` 動態載入。

**理由**：
- 內建 Donut / Line / Bar 樣式完整、tooltip 與 legend 預設表現佳、animation 符合 Duoji 的視覺質感。
- 使用者明確建議此套件。
- 與 HeroUI / Tailwind 共存無衝突，色彩可透過 option 帶入既有 CSS variable token。

**替代方案**：
- Recharts — 體積較小但 donut 的 tooltip / legend 預設較陽春，需更多自訂。
- Chart.js — API 偏命令式，與 React hook 整合度中等。

**取捨**：ApexCharts 體積較大（~500KB gz），但報表頁是次要路徑、不影響核心流程 LCP；以動態載入進一步降低首屏影響。

### Routing：複用 `/account-books/[id]/*` 路由

**選擇**：路徑為 `/account-books/[id]/report`，`[id]` 沿用 `'all'` 或實際 book id。

**理由**：與 `index` / `settlement` / `settings` 等子頁一致；Header 既有的 `AccountBookMenu` 會自動在此頁顯示，使用者可直接切換帳本。

**替代方案**：`/reports` 頂層頁面 + 自備帳本 selector — 會增加 UI 負擔且與現有模式分歧。

### Time Range：四個 preset，以 local state 管理

**選擇**：`'all' | '1y' | '3m' | 'thisMonth'` segmented control，local `useState`，預設 `'all'`。

**理由**：
- 四個固定區間可涵蓋多數使用情境。
- Local state 實作最簡，避免 URL 序列化的邊界 case。

**計算方式**（使用 dayjs）：
- `all`：不傳入日期範圍，改呼叫 `findByAccountBookId` / `findAll`。
- `1y`：`dayjs().subtract(1, 'year')` 至 `dayjs()`。
- `3m`：`dayjs().subtract(3, 'month')` 至 `dayjs()`。
- `thisMonth`：`dayjs().startOf('month')` 至 `dayjs().endOf('month')`。

### Data Layer：不新增 repo method

**選擇**：Hook `useReportTransactions(accountBookId, timeRange)` 內部根據 preset 與 accountBookId 分派：
- Preset = `all` + 單一帳本：`repo.findByAccountBookId(id)`
- Preset = `all` + `accountBookId === 'all'`：`repo.findAll()`
- 其他 preset + 單一帳本：`repo.findByDateRange({ startDate, endDate, accountBookId })`
- 其他 preset + `'all'`：`repo.findByDateRange({ startDate, endDate })`

**理由**：既有 repo method 已滿足需求，避免重複介面。

**Query key**：`['transactions', 'report', accountBookId, preset]`，與 `useAccountBookTransactions` 的 key space 隔離，但複寫同一資料來源時 React Query cache 可重用。`staleTime: 10_000` / `gcTime: 60_000` 與既有 hook 一致。

### Currency：All Books 下依幣別分組

**選擇**：All Books view 以 `accountBook.currency` 為分組邊界。頁面 loop 每個 currency group 並 render 一組獨立的 `ReportSection`（包含 summary cards / category breakdown / monthly trend）。

**理由**：
- 避免 TWD + JPY 錯誤加總呈現誤導性數字。
- 保留各幣別獨立分析視角。

**顯示順序**：依該幣別 transaction 筆數降序（資料多的在前）。

**取捨**：若使用者跨多幣別帳本量大，頁面會變長；接受此代價，換取正確性。

### Category 聚合：兩種模式

**選擇**：`groupByCategory(transactions, categories, type, { mergeByName })`：
- 單一 book view：`mergeByName: false`，以 `categoryId` 聚合；`displayName = category.name`，`imageUrl` 來自 category。
- All Books view：`mergeByName: true`，以 `category.name` 為 key 合併（忽略 id 差異）；`imageUrl` 取第一筆遇到的。

**理由**：
- 單一 book 下 categoryId 是精確標識，直接用最簡單。
- 跨 book 時 categoryId 無意義（每本獨立一組），且使用者期望「食物」一類能跨本合併看總量。

**邊界**：若某 transaction 的 categoryId 查無對應 category（資料髒或 category 已刪），以 `categoryId` 為 fallback key 並顯示 `Uncategorized`。

### Navbar：加入 Report，保留 aggregate view 可用

**選擇**：Report 為第 5 個 nav item，位置在中央 `+` 按鈕右側、Settings 左側。最終順序：Home / Settlement / `+` / Report / Settings。

**關鍵差異**：不同於 Settlement 在 aggregate view 禁用，Report **仍可用**，因為聚合視角正是 Report 要解決的核心需求之一。

**Icon**：使用 `PiChartPieSliceFill`（from `react-icons/pi`），符合現有 `Pi*Fill` 風格。

### 聚合為純函式 utility

**選擇**：`reportAggregate.ts` 輸出純函式，無副作用、不依賴 React。

**理由**：
- 易於單元測試。
- 符合專案既有 architecture-layers 規範（entity / repo / usecase / UI 四層外，utility 屬於 entity 可接受範圍）。

## Risks / Trade-offs

- **ApexCharts 體積**：~500KB gz。 → `next/dynamic({ ssr: false })` 僅在進入 report 頁面時載入，不影響其他頁面。
- **All Books × 多幣別 × 全時段資料量**：`findAll()` 可能回傳大量 transactions。 → 目前 Dexie 查詢快，且 Duoji 屬個人 / 小群組記帳 scale，暫不需分頁；之後若出問題，可加 time range 預設為 `thisMonth` 或加 limit。
- **同名分類合併的語意模糊**：不同 book 的「食物」未必相同意義。 → 明確僅在 `all` view 合併，且在 tooltip 中保留出處資訊（顯示 `count` 與來源 book 數）；若使用者回饋混淆，後續可再加 namespace 前綴。
- **SSR 不相容**：react-apexcharts 直接 import 會在 Next.js build 階段失敗。 → 統一包裝於 `ReportApexChart.tsx` 內部呼叫 `next/dynamic`；業務組件只 import 此 wrapper。
- **Dark mode 色彩對比**：Donut / Bar 的預設色若落在背景近色值會難辨識。 → 色彩改用 `hsl(var(--chart-1..5))` 既有 tokens，並以 `next-themes` 的 `resolvedTheme` 切換 ApexCharts `theme: { mode }`。
- **Empty state / Loading state**：避免圖表元件在無資料時呈現空框。 → 資料為 0 筆時以比照 `TransactionList` 的 dashed empty card 取代圖表；載入中顯示相同樣式 loading card。
