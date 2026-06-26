## 1. 核心結算演算法重構

- [x] 1.1 Exclude Shared Wallet from peer-to-peer transfers：在 `apps/web/src/utils/settlementUtils.ts` 中的 `computeMemberStatuses` 函數中，過濾掉共用錢包的 `userId`，實作「Decision 1: 從互轉演算法中剔除共用錢包」。驗證方式：撰寫或修改單元測試，確保當共用錢包代墊時，`computeMinimumTransfers` 不會產生牽涉共用錢包的互轉建議。
- [x] 1.2 計算「共用錢包個人借款 (Shared Wallet Borrowings)」：在 `settlementUtils.ts` 新增一個專屬計算共用錢包的邏輯，當發現 `paidBy` 包含共用錢包且 `splitBy` 成員數 < 真實總人數時，將該筆款項列為該成員對共用錢包的借款。驗證方式：撰寫單元測試驗證給定部分分攤的共用錢包支出，能正確輸出借款對象與金額。

## 2. Hook 與資料流調整

- [x] 2.1 擴充結算資料結構：實作「Decision 3: 結算資料結構新增 Shared Wallet 欄位」，在 `useSettlement.ts` 中引入新的共用錢包計算結果，將額外借款轉換成 `toUserId = 共用錢包` 的 `SettlementTransfer`，並從 `useSettlement` 輸出 `sharedWalletSummary`（包含總支出、每人平均、借款明細）。驗證方式：在 UI 渲染前透過 `console.log` 或 React DevTools 確認 `sharedWalletSummary` 資料結構與數值正確。

## 3. UI 顯示實作

- [x] 3.1 Display Shared Wallet summary in Settlement view：在 `apps/web/src/pages/account-books/[id]/settlement/index.tsx` 或其子組件中，新增「共用錢包」專屬顯示區塊。將 `sharedWalletSummary` 傳入並正確顯示「總支出」、「每人平均」以及「額外個人借款」列表。驗證方式：手動測試頁面或利用 Storybook/單元測試，確保該區塊在有借款時正確顯示數字，無資料時適當隱藏或顯示 0。
- [x] 3.2 過濾一般轉帳列表：確保原有的 `SettlementRecordDetail` 及 `UnsettledTransactionList` 相關的互轉清單，不會渲染出 `toUserId` 為共用錢包的款項。驗證方式：手動在畫面上預覽結算，確認一般轉帳列表中沒有出現共用錢包的身影。
