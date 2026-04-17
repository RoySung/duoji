## Why

在「All Account Books」彙總視圖中，Settlement 與 Add Transaction 功能因無法跨帳本操作而被停用，但目前的停用樣式（透明度降低）視覺回饋不夠明顯，且缺乏任何說明，使用者難以理解為何這些功能無法使用。

## What Changes

- **AccountBookMenu drawer**：在「All Account Books」選項卡片上增加說明文字，明確告知使用者在此視圖下 Settlement 與 Add Transaction 功能不可用
- **NavBar 停用按鈕/圖示**：為 Settlement 導航圖示與 Add Transaction 按鈕加上禁止遮罩（prohibition mask overlay），讓停用狀態更加顯眼，取代目前單純降低透明度的做法

## Non-Goals

- 不變更停用功能的邏輯（仍在 all-books 視圖停用）
- 不新增任何路由或資料層變更
- 不改動 settlement 頁面或 transaction modal 的內部邏輯

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `account-book-header-menu`: AccountBookMenu drawer 中「All Account Books」選項新增說明文字，標示不支援的功能
- `app-shell-navigation`: NavBar 中停用項目改用禁止遮罩視覺樣式，而非單純透明度

## Impact

- Affected specs: `account-book-header-menu`, `app-shell-navigation`
- Affected code:
  - `apps/web/src/components/accountBook/AccountBookMenu.tsx`
  - `apps/web/src/components/layout/navbar.tsx`
