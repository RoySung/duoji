## Context

目前交易彈窗（Transaction Modal）在切換帳本時，表單狀態未能同步更新與帳本關聯的欄位。特別是分類（categoryId）、付款人與分攤細節（paidByDetail、splitDetail、receivedByUserId）。這會導致存檔時資料錯誤或對不上。

## Goals / Non-Goals

**Goals:**
- 提供 `useUsersByAccountBook` hook 動態獲取指定帳本的成員。
- 當使用者在 `ExpenseForm` 或 `IncomeForm` 中切換帳本時，同步更新帳本相關欄位，並保留金額、日期、描述等無關欄位。
- 確保子分類的新增功能在切換帳本後能正常運作並歸屬於正確的帳本。

**Non-Goals:**
- 不改變其他非交易彈窗的狀態管理邏輯。

## Decisions

### 1. 建立 useUsersByAccountBook Hook
為了在交易表單中獲取目標帳本的成員，需要從資料庫（IndexedDB）中查詢。當前全域帳本的成員已在 `useUserStore` 中，當目標帳本為當前全域帳本時直接返回 Store 狀態，否則使用 `UserLocalRepo` 與 `AccountBookLocalRepo` 從 DB 動態載入，回傳 `allUsers` 與 `activeUsers`。

### 2. 在帳本選擇變更時，觸發狀態更新
當在 `ExpenseForm` 及 `IncomeForm` 中的帳本下拉選單（Select）變更 `accountBookId` 時：
- 更新 `accountBookId`。
- 重設 `categoryId` 為空字串。
- 重設 `paidByDetail` 為新帳本第一個 active 成員（如果是 expense）或者 `receivedByUserId`（如果是 income）。
- 重設 `splitDetail` 為新帳本所有 active 成員均分（排除共享錢包）。
- 保留 amount, date, description。

## Implementation Contract

- **行為**: 交易彈窗切換帳本時，分類選擇器與分攤、付款人列表會立即變更為目標帳本的內容，且對應的表單值自動同步為預設值。新增子分類時，子分類正確歸屬於目標帳本。
- **介面與資料格式**:
  - `useUsersByAccountBook` 接收 `accountBookId` (string)，返回 `{ allUsers: User[], activeUsers: User[], isLoading: boolean, refetch: () => void }`。
- **驗證條件**:
  - 在新增交易彈窗切換帳本，確認分類、付款人、分攤人等欄位已更換為目標帳本的對應預設值。
  - 金額、日期、描述等欄位在切換帳本後不變。
  - 新增子分類後，下拉選單能顯示新分類。
