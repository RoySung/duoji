## 1. Define UserRepo interface

- [x] 1.1 Add `UserRepo` interface to `apps/web/src/entities/user.ts` (UserRepo interface 定義位置: co-locate with entity per convention) with method signature `findByIds(ids: string[]): Promise<RegisteredUser[]>` (UserRepo 方法簽名) — satisfies "UserRepo interface encapsulates registered user reads"

## 2. Implement UserLocalRepo

- [x] 2.1 Create `apps/web/src/repositories/userRepo/userLocalRepo.ts` implementing `UserRepo` via `db.users` Dexie query with `anyOf` — satisfies "UserLocalRepo persists to IndexedDB"
- [x] 2.2 Create `apps/web/src/repositories/userRepo/index.ts` exporting `UserLocalRepo`

## 3. Refactor userStore to use UserRepo via dependency injection

- [x] 3.1 Update `createUserStore` in `apps/web/src/stores/user/userStore.ts` to accept `UserRepo` as an injected dependency and replace direct `db.users` calls — satisfies "userStore uses UserRepo via dependency injection" and "Store resolves users via repo"
- [x] 3.2 Remove the `db` import from `userStore.ts` (不需要 UserRepo 處理 VirtualUser — VirtualUser 仍由 accountBookRepo 管理，無需改動)
- [x] 3.3 Update `apps/web/src/stores/user/userStoreProvider.tsx` (if needed) to pass `new UserLocalRepo()` when calling `createUserStore`

## 4. Update tests

- [x] 4.1 Update `apps/web/specs/userStore.spec.ts` to inject a mock `UserRepo`, removing any real IndexedDB dependency — satisfies "Store is testable with a mock repo"
