## Why

現行分類管理中的圖示編輯採用下拉選單（Select），並同時顯示圖示與文字說明。此配置在圖示數量較多時不易瀏覽且操作繁瑣，且文字說明在視覺上較為冗餘。改為網格（Grid）配置僅顯示圖示，可提升使用者選取圖示的效率與視覺美感。

## What Changes

- 將「新增／編輯分類」彈窗（`AddCategoryModal`）中的圖示選取器從 `Select` 下拉選單改為網格（Grid）配置。
- 移除圖示選取介面中的文字說明，視覺上僅顯示圖示本身。
- 為圖示網格項目保留 `aria-label` 與 `title`（使用既有的 iconOptions 語系檔），確保無障礙輔助（A11y）體驗。
- 提供滑鼠懸停（hover）與選取（selected）狀態的視覺微互動（例如框線、背景色變化）。

## Non-Goals (optional)

- 不調整預設的分類圖示集合或新增任何圖示。
- 不調整交易新增／編輯彈窗（`TransactionModal`）的分類選擇器。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `category-settings-ui`: 調整分類圖示編輯的 UI 元件，將下拉選單改為網格佈局，移除文案，僅顯示圖示。

## Impact

- Affected specs:
  - `category-settings-ui`
- Affected code:
  - Modified:
    - `apps/web/src/components/categorySettings/AddCategoryModal.tsx`
