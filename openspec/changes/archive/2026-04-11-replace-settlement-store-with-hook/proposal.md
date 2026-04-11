## Why

`settlementStore` 被掛載在全域 app 層級，但 settlement 狀態只在兩個 settlement 頁面使用，且兩個頁面都各自獨立重新初始化，實際上沒有跨頁面共享狀態的需求。改用 hook 可讓狀態生命週期貼合元件，消除不必要的全域狀態複雜度。

## What Changes

- 新增 `useSettlement` hook，封裝原本 store 的邏輯（`initialize`、`createSettlementRecord`、`completeTransfer`）
- 刪除 `settlementStore.ts`、`settlementStoreProvider.tsx`、`stores/settlement/index.ts`
- 從 `_app.tsx` 移除 `SettlementStoreProvider` 與 `createSettlementStore`
- `settlement/index.tsx` 與 `settlement/[recordId].tsx` 改用 `useSettlement` hook
- 刪除 `resetInMemoryState`（hook unmount 時狀態自動清除）

## Non-Goals

- 不修改 `SettlementRepo` 或 `SettlementLocalRepo`（repo 層維持不變）
- 不調整 settlement 的業務邏輯或計算邏輯（`settlementUtils` 維持不變）
- 不考慮跨頁面快取（目前兩頁都各自重新 fetch，行為一致）

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `architecture-layers`：settlement 狀態從 store（全域）改為 hook（頁面範疇），符合架構規範中「hook = local state」的定義

## Impact

- Affected specs: `architecture-layers`
- Affected code:
  - `apps/web/src/stores/settlement/settlementStore.ts` — 刪除
  - `apps/web/src/stores/settlement/settlementStoreProvider.tsx` — 刪除
  - `apps/web/src/stores/settlement/index.ts` — 刪除
  - `apps/web/src/hooks/useSettlement.ts` — 新增
  - `apps/web/src/pages/_app.tsx` — 移除 SettlementStoreProvider
  - `apps/web/src/pages/account-books/[id]/settlement/index.tsx` — 改用 hook
  - `apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx` — 改用 hook
