## 1. 調整分類圖示選擇元件

- [x] 1.1 修改 `apps/web/src/components/categorySettings/AddCategoryModal.tsx`，以滿足 "Category modal displays icon selection in a grid layout without text labels" 需求。移除原有的 `Select` 下拉選單與文字說明，將其改為 6 欄的網格（Grid）佈局來顯示所有分類圖示，只顯示圖示本身。每個圖示加上 `title` 與 `aria-label` 屬性提供無障礙文字。選中圖示時，該圖示應有高亮邊框/背景的選取狀態。驗證方式：執行 `pnpm test:web` 確保沒有 UI 元件編譯與既有測試錯誤，並手動在網頁點開新增/編輯分類彈窗，確認圖示以 6 欄網格顯示，且點選能正確切換選中的圖示狀態。
