## Why

`useAccountBookTagSuggestions` 目前透過 `findTransactionsByAccountBook` 撈取帳本的所有交易紀錄，只為了提取 `tags` 欄位。這使得分片查詢（range query）的設計失去意義——即使行事曆頁面只需要顯示一個月的交易，tag suggestions 仍然會觸發一次全量撈取。同時，`useAccountBookTransactions` 內的 `allTransactionsQuery` 也是同樣問題的另一個來源，而其暴露的 `allTransactions` 和 `totalCount` 實際上已經沒有任何消費者。

## What Changes

- 在 `TransactionRepo` 介面新增 `findTagsByAccountBookId(accountBookId: string): Promise<string[]>` 方法，讓 tag 查詢成為獨立的 repository 操作
- `TransactionLocalRepo` 實作該方法：遍歷 Dexie 中指定帳本的交易，只提取並去重 tags 欄位
- `useAccountBookTagSuggestions` 改用新的 `findTagsByAccountBookId`，使用獨立的 query key（`['tags', accountBookId]`），不再依賴 `transactionListQueryKey`
- 從 `useAccountBookTransactions` 移除 `allTransactionsQuery` 及其暴露的 `allTransactions`、`totalCount`、`refreshTransactions`
- 移除 mutations 中對 `['transactions', 'list']` 的 invalidation，改為 invalidate tag query key `['tags']`
- 頁面 `index.tsx` 的 `handleRefresh` 移除 `refreshTransactions` 呼叫，只保留 `refetch()`
- 清理 `transactionQueryUtils` 中不再被使用的 `transactionListQueryKey` 和 `findTransactionsByAccountBook`

## Non-Goals

- 不引入獨立的 Tag Store（denormalization），目前交易量不需要這種程度的最佳化
- 不改變 range query 的行為或 query key 結構
- 不重構 `useReportTransactions`（它有自己的 query key 和獨立場景）

## Alternatives Considered

- **獨立 Tag Store**（Dexie 新增 tags table）：查詢效能最佳，但引入資料冗餘和 mutation 一致性維護成本，目前規模不需要
- **Cursor-based 漸進式提取**：可控制記憶體峰值，但不保證 tag 完整性，且 IndexedDB cursor 不一定比 toArray 快
- **維持現狀仰賴 React Query Cache 共用**：零改動，但 tag suggestions 和 allTransactionsQuery 耦合，allTransactionsQuery 本身就是要被移除的目標

## Capabilities

### New Capabilities

（無新增 capability）

### Modified Capabilities

- `transaction-storage`: TransactionRepo 介面新增 `findTagsByAccountBookId` 方法

## Impact

- Affected specs: `transaction-storage`（新增 repo 方法的契約）
- Affected code:
  - Modified: `apps/web/src/entities/transaction.ts`（TransactionRepo 介面）
  - Modified: `apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts`（新增方法實作）
  - Modified: `apps/web/src/hooks/useAccountBookTagSuggestions.ts`（獨立 query）
  - Modified: `apps/web/src/hooks/useAccountBookTransactions.ts`（移除 allTransactionsQuery）
  - Modified: `apps/web/src/hooks/transactionQueryUtils.ts`（移除無用 exports）
  - Modified: `apps/web/src/pages/account-books/[id]/index.tsx`（移除 refreshTransactions 使用）
