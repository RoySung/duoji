## 1. 於 CategorySelector 整合新增子分類功能 (Integrate Add Sub-Category in CategorySelector)

- [x] 1.1 在 `apps/web/src/components/TransactionModal/CategorySelector.tsx` 中引入 `useCategoryStore`、`useAccountBookStore`、`AddCategoryModal` 與 `PiPlus`，並在每個主分類的子分類列表末尾新增一個「+ 新增子分類」的虛線外框按鈕。當點擊時能開啟 Modal。驗證方式：開啟交易表單，確認每個主分類頁籤下的子分類列表末尾皆有顯示「新增子分類」按鈕，且點擊後會開啟 Modal。符合需求 "Users can add sub-categories directly within the transaction form"。
- [x] 1.2 在 `apps/web/src/components/TransactionModal/CategorySelector.tsx` 中實現 Modal 的 `onSubmit` 處理函式，調用 `categoryStore` 的 `addCategory` 將新子分類寫入資料庫，並在成功後直接呼叫 `onSelectCategory` 選中該新建立的子分類。驗證方式：在交易表單中點擊該按鈕新增一個子分類，送出後確認 Modal 關閉、該子分類成功選中、且控制台無錯誤訊息。符合需求 "Users can add sub-categories directly within the transaction form"。
