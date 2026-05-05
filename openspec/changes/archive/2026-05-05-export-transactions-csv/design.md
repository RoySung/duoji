## Context

Report 頁面已透過 `useReportTransactions` hook 載入篩選後的交易資料（依日期範圍、帳本）。`useCategoryStore` 提供分類名稱對照。所有資料都在前端記憶體中，不需要後端 API 支援。

架構層次：
- **Entity**：`Transaction`（已有）、`Category`（已有）
- **Usecase（hooks）**：新增 `useExportTransactionsCsv`
- **UI**：Report 頁面 header 加入匯出按鈕

## Goals / Non-Goals

**Goals:**

- 使用者可在 Report 頁面將當前篩選的交易記錄匯出為 CSV
- 匯出內容反映當前的日期範圍與帳本篩選
- CSV 欄位涵蓋：日期、類型、分類名稱、金額、付款方式、備註
- 完全前端實現，不依賴後端

**Non-Goals:**

- 不支援 Excel（.xlsx）格式
- 不支援自訂欄位選擇
- 不支援後端排程匯出
- "All books" 視角不在第一版範圍（單一帳本優先）

## Decisions

### CSV 生成方式：Blob + anchor download

使用原生 `Blob` API 產生 CSV 內容，透過動態建立 `<a>` 標籤觸發瀏覽器下載。不引入第三方 CSV 函式庫，因為資料結構固定、欄位不複雜。

**替代方案考慮**：
- `papaparse`：功能完整但此需求不需要 parse 能力，引入僅為 unparse 過於重
- `xlsx`：支援 .xlsx 但依賴較重，超出 non-goals 範圍

**風險**：特殊字元（逗號、換行）需手動用雙引號包裹。由 hook 內處理即可。

### Hook 設計：`useExportTransactionsCsv`

Hook 接收 `transactions`、`categories`、`dateRange`，回傳 `exportCsv()` 函數。不持有 loading 狀態（同步操作），符合 usecase 層職責。

**替代方案考慮**：
- 直接在元件中實作 → 違反架構層次，repo/entity 邏輯不應進入 UI
- 純 utility function → Hook 可以在未來需要 async 時更容易擴充，且介面更一致

### 匯出範圍：以 Report 頁面當前可見資料為準

匯出的交易記錄與畫面上顯示的一致（包含帳本篩選、日期篩選）。不重新查詢 repo。

### 檔名格式

`transactions-YYYY-MM-DD.csv`，日期為匯出當日（`dayjs().format('YYYY-MM-DD')`）。

### CSV 欄位順序

```
Date,Type,Category,Amount,Payment Method,Description
```

- `Date`：`YYYY/MM/DD` 格式（與 entity 一致）
- `Type`：`income` 或 `expense`
- `Category`：從 categories store 查找名稱，找不到則用 category ID
- `Amount`：數字，無貨幣符號
- `Payment Method`：直接輸出 entity 欄位值
- `Description`：備註，特殊字元需 escape

## Risks / Trade-offs

- **特殊字元 escape**：CSV 欄位若含逗號或換行需以雙引號包裹，並將內部雙引號 escape 為 `""`。→ 在 hook 內實作 `escapeCsvField` 工具函數。
- **大量資料效能**：前端同步生成，若資料量極大（>10,000 筆）可能稍有延遲。→ 現階段個人帳本不太可能達到此數量，暫不處理。
- **已刪除交易**：`Transaction.deletedAt` 不為 null 的資料不應匯出。→ Hook 中過濾 `deletedAt === null`。
