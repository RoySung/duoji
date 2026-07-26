## Context

當使用者在交易彈窗（Transaction Modal）中切換帳本時，`useUsersByAccountBook` 與 `useCategoriesByAccountBook` 在第一個 Render 中會返回 `isLoading: false`，導致表單提前將欄位重設為舊帳本成員/分類，且提早更新了 `lastBookIdRef.current`，從而阻礙了後續真實資料載入完成後的第二次正確重設。

## Goals / Non-Goals

**Goals:**
- 修復切換帳本後的競態條件，確保 `isLoading` 在切換的第一個 Render 立即為 `true`。
- 切換帳本後，付款人成功更新為新帳本的第一位成員，分攤人更新為新帳本的所有成員（均分）。

**Non-Goals:**
- 不改變其他非交易表單的狀態。

## Decisions

### 1. 修正 useUsersByAccountBook 與 useCategoriesByAccountBook 的載入狀態
在 hook 中引入 `loadedBookId` 或比較邏輯。當 `accountBookId` 與當前已加載的 `loadedBookId`（或 Store 的 `scopedAccountBookId`）不一致時，即便非同步載入尚未啟動，亦強制將 `isLoading` 返回 `true`。直到 IndexedDB 載入完成並更新 `loadedBookId` 為目標帳本 ID 後，`isLoading` 才會變為 `false`。

## Implementation Contract

- **行為**: 交易彈窗中切換帳本，付款人為該帳本的第一位成員，分攤人為該帳本的所有成員（均分）。
- **介面與資料格式**:
  - `isLoading` 在選定不同 `accountBookId` 的那一刻起，立刻為 `true`，直至異步查詢完成。
- **驗證條件**:
  - 手動/自動測試驗證，切換帳本後，新帳本的預設成員選項正確呈現，無競態條件問題。
