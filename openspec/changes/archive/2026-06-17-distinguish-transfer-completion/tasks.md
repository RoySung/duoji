## 1. 介面更新 (UI Updates)

- [x] 1.1 在 `apps/web/src/components/settlement/SettlementRecordList.tsx` 中計算轉帳是否全部完成，並在標題旁渲染對應的狀態標章，滿足 "Users can view settlement record history" 需求。驗證方式：開啟瀏覽器並進入結算歷史列表，手動確認已完成轉帳與未完成轉帳的結算紀錄分別顯示正確顏色與文字的標章。
- [x] 1.2 在 `apps/web/src/components/settlement/SettlementRecordDetail.tsx` 中計算轉帳是否全部完成，並在標題旁邊渲染對應的狀態標章，滿足 "Users can view settlement record detail" 需求。驗證方式：開啟特定結算紀錄的詳細頁面，手動確認標題旁顯示正確顏色與文字的標章。

## 2. 測試與驗證 (Testing & Verification)

- [x] 2.1 執行單元測試並確保專案建置正常。驗證方式：在終端機執行 `pnpm test:web` 確保所有測試成功通過，並執行 `pnpm build:web` 確保沒有 TypeScript 或打包錯誤。
