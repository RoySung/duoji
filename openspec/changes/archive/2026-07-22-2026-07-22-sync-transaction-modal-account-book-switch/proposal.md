## Why

在新增交易（Transaction）時，如果在交易彈窗（Transaction Modal）中切換帳本（Account Book），與帳本無關的欄位（如金額、日期、描述）應該保持不變，但與帳本相關的欄位（如分類、付款人、分攤人/收款人）應同步更新為該新帳本的預設新增紀錄的值。目前這些與帳本相關的欄位在切換帳本時未能正確同步更新，且使用者無法在新帳本中正確新增子分類。

## What Changes

- 在 `ExpenseForm` 和 `IncomeForm` 中切換帳本時，與帳本相關的欄位（分類 `categoryId`、付款人與分攤人 `paidByDetail`/`splitDetail`、收款人 `receivedByUserId`）會自動同步更新為目標帳本的預設值。
- 切換帳本時，與帳本無關的欄位（金額 `amount`、日期 `date`、描述 `description`）將保持原有的輸入值。
- 引入 `useUsersByAccountBook` hook，用於在表單中動態查詢選定帳本的使用者（成員）列表，確保付款人與分攤人列表正確呈現目標帳本的成員。
- 確保切換帳本後，新增子分類功能（在 `CategorySelector` 中）能正常運作並正確將分類歸屬於選定的帳本。

## Non-Goals (optional)

- 不修改全域當前帳本（currentAccountBookId）的切換邏輯，除非交易成功儲存。
- 不修改非交易彈窗（Transaction Modal）以外的帳本切換邏輯。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- transactions: 更新交易表單在切換帳本時的欄位同步響應邏輯，包括分類、付款人、分攤人/收款人，以及支援在非全域 active 帳本下建立子分類。

## Impact

- Affected code:
  - New:
    - apps/web/src/hooks/useUsersByAccountBook.ts
  - Modified:
    - apps/web/src/components/TransactionModal/ExpenseForm.tsx
    - apps/web/src/components/TransactionModal/IncomeForm.tsx
