## 1. 交易表單選項邏輯調整 (調整 Payer 與 Split Target 的選項邏輯)

- [x] 1.1 實作 Requirement: Shared wallet can be selected as transaction payer：修改 `TransactionForm` 內的付款人選擇器邏輯，允許共用錢包出現在選項中。驗證方式：手動開啟新增交易表單，確認付款人下拉選單中包含共用錢包。
- [x] 1.2 實作 Requirement: Shared wallet is excluded from transaction split targets：修改 `TransactionForm` 內的分攤對象過濾邏輯，永遠將共用錢包排除。驗證方式：手動開啟新增交易表單，確認分攤對象清單中未顯示共用錢包。

## 2. 交易表單自動連動行為 (Payer 切換時的 UI 連動行為)

- [x] 2.1 實作 Requirement: Selecting shared wallet as payer auto-selects all active members as split targets：在 `TransactionForm` 中監聽付款人變更事件，若切換為共用錢包，則將 `splitDetail` 的對象重置為所有活躍真實成員的均分狀態。驗證方式：手動選擇共用錢包作為付款人，確認下方分攤對象自動勾選所有活躍成員。使用者取消勾選特定成員後不應被系統強迫恢復。

## 3. 報表計算邏輯更新 (移除報表端的平分特例)

- [x] 3.1 移除 Requirement: Report member filter distributes shared wallet amounts to the selected member 的相關邏輯：修改 `reportUtils.ts` (或相應報表計算邏輯)，刪除針對共用錢包的平分特例處理。驗證方式：執行報表相關的 Unit Test 確保功能正常；手動測試報表的特定成員篩選，確認統計金額僅依賴交易的實際 `splitDetail` 而不會出現非預期的均分結果。
