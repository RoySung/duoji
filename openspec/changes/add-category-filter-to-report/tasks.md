## 1. 建立 CategoryFilterSelector 元件

- [x] 1.1 建立 `apps/web/src/components/report/CategoryFilterSelector.tsx`：接受 `categories: Category[]`、`excludedCategoryIds: Set<string>`、`onChange` props，實作觸發按鈕（漏斗圖示 + 排除數量徽章）與 Drawer 骨架，確保分類篩選按鈕在報表頁面始終可見（滿足 Requirement: Category filter button is always visible on the report page）
- [x] 1.2 在 Drawer 內以「Expense」與「Income」兩個區塊列出分類，父分類正常縮排，子分類加上 `pl-6` 縮排顯示，每列包含 Checkbox、分類圖示（`<img>`）與名稱（滿足 Requirement: Category filter drawer groups categories by type）
- [x] 1.3 在 Drawer 頂部新增「Include all」與「Exclude all」快速操作按鈕，Include all 清空 `excludedCategoryIds`，Exclude all 將所有分類 id 加入排除集合（滿足 Requirement: Category filter provides include-all and exclude-all quick actions）

## 2. 更新 report.tsx 的篩選邏輯

- [x] 2.1 在 `apps/web/src/pages/account-books/[id]/report.tsx` 新增 `excludedCategoryIds` state（`useState<Set<string>>(() => new Set())`），並將現有 `filteredTransactions` useMemo 改名為 `bookFilteredTransactions`
- [x] 2.2 新增 `filteredTransactions` useMemo，以 `bookFilteredTransactions` 為基礎，先展開父分類的排除集合至所有子分類，再過濾掉 `tx.categoryId` 在排除集合內的交易（滿足 Requirement: Excluding a parent category also excludes its child categories 與 Requirement: Category filter excludes selected categories from report data）
- [x] 2.3 將單一帳本視圖的 `<ReportSection>` 從 `transactions={transactions}` 改為 `transactions={filteredTransactions}`，確保分類篩選也適用於單一帳本報表
- [x] 2.4 在標題列的 `flex gap-2` 區塊加入 `<CategoryFilterSelector categories={categories} excludedCategoryIds={excludedCategoryIds} onChange={setExcludedCategoryIds} />`，置於 `<TimeRangeSelector>` 之前
