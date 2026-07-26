<!--
Each task description MUST state:
- the behavior or contract being delivered (what is observably true when the
  task is complete), and
- the verification target that proves completion (test, CLI invocation,
  analyzer check, manual assertion, or content review).

File paths are supporting context for locating the work, never the task
itself. "Edit file X" is not a valid task — it is missing both behavior and
verification.
-->

## 1. 建立 useUsersByAccountBook Hook

- [x] 1.1 實作 `useUsersByAccountBook` hook，對應決策 `1. 建立 useUsersByAccountBook Hook`，動態獲取指定帳本的成員列表以支持 `Synchronize fields on account book switch in transaction form`，驗證方法是撰寫並執行單體測試程式以驗證動態載入的成員資料是否與資料庫一致。

## 2. 在帳本選擇變更時，觸發狀態更新

- [x] 2.1 實作決策 `2. 在帳本選擇變更時，觸發狀態更新`，修改 `ExpenseForm.tsx`，在選擇不同的 `accountBookId` 時同步更新 `categoryId`、`paidByDetail`、`splitDetail` 等與帳本相關的欄位至目標帳本的預設值，並保留金額、日期、描述等其他欄位。支援 `Allow subcategory creation under newly selected account book` 功能在當前選擇的帳本下新增子分類，驗證方法是在新增交易彈窗中切換帳本手動操作，檢查欄位值更新與子分類新增後的選項展示。
- [x] 2.2 實作決策 `2. 在帳本選擇變更時，觸發狀態更新`，修改 `IncomeForm.tsx`，在選擇不同的 `accountBookId` 時同步更新 `categoryId`、`receivedByUserId` 等與帳本相關的欄位至目標帳本的預設值，並保留金額、日期、描述等其他欄位。支援 `Allow subcategory creation under newly selected account book` 功能在當前選擇的帳本下新增子分類，驗證方法是在新增交易彈窗中切換帳本手動操作，檢查欄位值更新與子分類新增後的選項展示。
