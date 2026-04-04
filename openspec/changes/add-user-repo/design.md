## Context

目前 `userStore.ts` 的 `resolveUsers` 函式直接呼叫 `db.users.where('id').anyOf(...).toArray()` 來查詢 registered users。這是整個 stores 層中唯一直接存取 Dexie db 的地方，其他 store（accountBook、transaction、category）均透過對應的 repo interface 進行 DB 操作，且 repo 以依賴注入方式傳入 store factory。

現有 repo 模式：
- `entities/<domain>.ts` — 定義 `<Domain>Repo` interface
- `repositories/<domain>Repo/<domain>LocalRepo.ts` — Dexie 實作
- `repositories/<domain>Repo/index.ts` — 匯出實作

## Goals / Non-Goals

**Goals:**

- 新增 `UserRepo` interface，封裝 `findByIds(ids: string[]): Promise<RegisteredUser[]>` 操作
- 新增 `UserLocalRepo` 作為 Dexie 實作
- 重構 `userStore.ts`，使用注入的 `UserRepo` 取代直接 db 呼叫
- 確保 `userStore.spec.ts` 可透過 mock `UserRepo` 進行單元測試

**Non-Goals:**

- 不引入 write 操作到 `UserRepo`（registered user 目前無本地寫入需求）
- 不修改 `VirtualUser` 的資料儲存方式（仍存於 accountBook.virtualUsers）
- 不重構其他 store 或 repo

## Decisions

### UserRepo interface 定義位置

放在 `entities/user.ts`，與 `AccountBookRepo` 放在 `entities/accountBook.ts` 的慣例一致。

### UserRepo 方法簽名

```ts
interface UserRepo {
  findByIds(ids: string[]): Promise<RegisteredUser[]>
}
```

只需要 `findByIds`，因為 `userStore` 目前唯一的 DB 查詢就是「依 id 陣列取得 registered users」。未來如有更多需求再擴充。

### 不需要 UserRepo 處理 VirtualUser

VirtualUser 儲存在 `accountBook.virtualUsers` 中，由 `accountBookRepo` 管理，`userStore` 已透過 `AccountBookRepo` 存取。無需在 `UserRepo` 重複處理。

## Risks / Trade-offs

- [影響範圍小] `resolveUsers` 是純粹的 internal helper，沒有對外暴露，重構風險低。
- [測試覆蓋] 現有 `userStore.spec.ts` 若有依賴 `db` 的 test，需更新為 mock `UserRepo`；有助提升測試可靠性。
