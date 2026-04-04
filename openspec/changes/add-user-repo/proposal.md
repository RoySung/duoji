## Why

`userStore.ts` 直接呼叫 `db.users` 進行資料庫查詢，違反了其他 store 皆透過 repo 層存取 DB 的慣例（`accountBookRepo`、`transactionRepo`、`categoryRepo` 均已有對應 repo）。引入 `UserRepo` 可統一架構，並讓 store 的邏輯更易測試。

## What Changes

- 新增 `UserRepo` interface 定義於 `entities/user.ts`
- 新增 `UserLocalRepo` 實作於 `repositories/userRepo/`
- 重構 `userStore.ts`：移除直接 `db.users` 呼叫，改依賴注入 `UserRepo`

## Capabilities

### New Capabilities

- `user-repo`: 封裝 registered user 的本地持久化讀取操作，提供統一的 `UserRepo` interface 供 store 使用

### Modified Capabilities

(none)

## Impact

- Affected specs: `user-repo` (new), `local-persistence` (implementation detail only, no requirement changes)
- Affected code:
  - `apps/web/src/entities/user.ts` — 新增 `UserRepo` interface
  - `apps/web/src/repositories/userRepo/userLocalRepo.ts` — 新實作
  - `apps/web/src/repositories/userRepo/index.ts` — export
  - `apps/web/src/stores/user/userStore.ts` — 移除直接 db 存取，改用 `UserRepo`
  - `apps/web/src/stores/user/userStoreProvider.tsx` — 更新 store 建立方式（如需要）
  - `apps/web/specs/userStore.spec.ts` — 更新測試以使用 mock UserRepo
