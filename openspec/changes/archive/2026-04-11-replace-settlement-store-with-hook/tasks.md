## 1. 建立 useSettlement hook

- [x] 1.1 在 `src/hooks/useSettlement.ts` 建立 `useSettlement` hook，實作 useSettlement hook 的介面設計（接收 `accountBookId` 與可選 `transactions`，內部以 `useState` 管理本地狀態——對應內部狀態管理方式的決策——回傳 `records`、`memberStatuses`、`transferSuggestions`、`isLoading`、`error`）
- [x] 1.2 在 hook 內以 `useEffect` 監聽 `accountBookId` 和 `transactions` 變化，自動觸發 fetch（對應初始化觸發方式的決策），不再暴露 `initialize` action；hook 的設計符合 Usecase layer coordinates repo and exposes state to UI 的規範
- [x] 1.3 實作 `createSettlementRecord` action，邏輯對應原本 store 的同名方法
- [x] 1.4 實作 `completeTransfer` action，邏輯對應原本 store 的同名方法

## 2. 更新 settlement 頁面，改為 page-scoped 狀態不使用全域 store

- [x] 2.1 更新 `settlement/index.tsx`：移除所有 `useSettlementStore` 呼叫，改用 `useSettlement(accountBookId, unsettledTransactions)`
- [x] 2.2 更新 `settlement/[recordId].tsx`：移除所有 `useSettlementStore` 呼叫，改用 `useSettlement(accountBookId)`（不傳 transactions）

## 3. 移除 settlementStore 基礎設施

- [x] 3.1 從 `_app.tsx` 移除 `SettlementStoreProvider`、`createSettlementStore` 的 import 與使用
- [x] 3.2 刪除 `src/stores/settlement/settlementStore.ts`
- [x] 3.3 刪除 `src/stores/settlement/settlementStoreProvider.tsx`
- [x] 3.4 刪除 `src/stores/settlement/index.ts`

## 4. 驗證

- [x] 4.1 確認兩個 settlement 頁面功能正常（列表、建立結算記錄、完成轉帳）
- [x] 4.2 確認 TypeScript 無型別錯誤（`tsc --noEmit`）
- [x] 4.3 確認 Usecase 層協調 repo 並暴露狀態給 UI 的規範（hook 封裝 repo 存取）符合 `architecture-layers` spec
