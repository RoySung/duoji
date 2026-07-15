## 1. 核心邏輯修改 (Core Implementation)

- [x] 1.1 修改 `apps/web/src/utils/transactionUtils.ts` 中的 `getDefaultTransactionCategoryId` 函數，當建立交易草稿或切換類型時，若有自訂分類存在，預設仍會選擇第一個大分類下的第一個小分類，以滿足 "Default categories exist for income and expense flows" 的需求。驗證方式：撰寫單元測試驗證此行為。

## 2. 測試與驗證 (Testing and Verification)

- [x] 2.1 修改 `apps/web/specs/transactionUtils.spec.ts` 檔案，新增單元測試來模擬當帳本中含有自訂大分類與自訂小分類時，`getDefaultTransactionCategoryId` 是否正確返回第一個預設大分類底下的第一個子分類。驗證方式：執行 `npm run test:web` 以通過所有測試。
