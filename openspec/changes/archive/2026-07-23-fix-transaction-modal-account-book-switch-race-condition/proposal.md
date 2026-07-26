## Why

在交易彈窗（Transaction Modal）中切換帳本時，由於 `useUsersByAccountBook` 和 `useCategoriesByAccountBook` 存在競態條件（Race Condition）——在帳本 ID 切換的第一個 Render 中 `isLoading` 為 `false`，導致表單的 `useEffect` 立即以舊帳本的成員和分類資料進行重設，並提早更新了 `lastBookIdRef.current`，從而阻礙了後續資料真正加載完成時的重新載入。這導致切換帳本後，付款人與分攤人未能成功更新為目標帳本的預設成員（付款人為第一個，分攤人為所有成員）。

## What Changes

- 修正 `useUsersByAccountBook` 與 `useCategoriesByAccountBook`，引入 `loadedBookId` 或類似狀態，確保當傳入的 `accountBookId` 與當前已載入的帳本資料不匹配時，`isLoading` 於第一個 Render 立即返回 `true`，防止表單提前以舊資料進行錯誤重設。
- 修正 `ExpenseForm.tsx`，確保當切換帳本後，付款人與分攤人正確同步為目標帳本的預設值（付款人為第一位 active 成員，分攤人為所有 active 成員，排除共享錢包）。

## Non-Goals (optional)

- 不修改全域當前帳本（currentAccountBookId）的切換邏輯。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- transactions: 修正交易表單在切換帳本時，付款人與分攤人狀態的同步更新邏輯，解決因 Hook 異步載入導致的競態條件問題。

## Impact

- Affected code:
  - Modified:
    - apps/web/src/hooks/useUsersByAccountBook.ts
    - apps/web/src/hooks/useCategoriesByAccountBook.ts
    - apps/web/src/components/TransactionModal/ExpenseForm.tsx
