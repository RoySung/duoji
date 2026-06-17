## 1. 調整紅點位置 (Notification Dot Position Adjustment)

- [x] 1.1 修改 `apps/web/src/pages/account-books/[id]/settlement/index.tsx` 中的已結算分頁 Tab 標題，使用絕對定位（如 `absolute -right-2 -top-1`）將提示紅點置於標題文字的右上角，以實現 "Users can view settlement record history" 需求所定義的紅點右上角顯示規格。驗證方式：在瀏覽器中開啟網頁，確認有未完成轉帳時，紅點完美置於「已結算」文字右上角。

## 2. 測試與驗證 (Testing & Verification)

- [x] 2.1 執行專案測試與建置。驗證方式：在終端機執行 `pnpm test:web` 確保沒有破壞現有測試，並執行 `pnpm build:web` 確保打包成功。
