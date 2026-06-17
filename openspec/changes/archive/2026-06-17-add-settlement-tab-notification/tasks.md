## 1. 語系與分頁更名 (i18n & Tab Renaming)

- [x] 1.1 修改語系檔 `apps/web/src/i18n/messages/zh-TW.json` 與 `apps/web/src/i18n/messages/en-US.json` 中 `settlement.tabs.history` 的值，將其分別更名為「已結算」與「Settled」，作為實現 "Users can view settlement record history" 需求的一部分。驗證方式：確認語系檔修改成功且無語法錯誤。

## 2. 標籤提示點實作 (Tab Notification Indicator)

- [x] 2.1 在 `apps/web/src/pages/account-books/[id]/settlement/index.tsx` 中，計算是否存有任何未完成轉帳的結算紀錄，並在 `Tab key="records"` 的 title 中渲染紅色的提示標記（紅點），實現 "Users can view settlement record history" 的標記提示功能。驗證方式：在瀏覽器中開啟結算頁面，手動確認當有轉帳未完成時「已結算」分頁上有紅點，全部轉帳完成後紅點消失。

## 3. 測試與驗證 (Testing & Verification)

- [x] 3.1 執行專案測試與建置。驗證方式：在終端機執行 `pnpm test:web` 確保沒有破壞現有測試，並執行 `pnpm build:web` 確保打包成功。
