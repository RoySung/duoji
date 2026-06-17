## 1. 調整提示標章為未完成筆數 (Notification Badge Count Adjustment)

- [x] 1.1 修改 `apps/web/src/pages/account-books/[id]/settlement/index.tsx`，將 `hasPendingRecord` 改成計算未完成轉帳的結算紀錄個數 `pendingRecordsCount`。當個數大於 0 時，於「已結算」分頁 Tab 標題右上角渲染顯示該筆數的紅色 `Badge`（例如「1」、「2」等），實現 "Users can view settlement record history" 需求所定義的數字提示標章規格。驗證方式：在瀏覽器中開啟結算頁面，手動確認當有 2 筆未完成轉帳的紀錄時，分頁右上角顯示數字標章「2」。

## 2. 測試與驗證 (Testing & Verification)

- [x] 2.1 執行專案測試與建置。驗證方式：在終端機執行 `pnpm test:web` 確保沒有破壞現有測試，並執行 `pnpm build:web` 確保打包成功。
