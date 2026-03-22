## 1. Update Transaction entity schema

- [x] 1.1 Add `deletedAt: number | null` field to TransactionFieldsSchema and Transaction interface in `apps/web/src/entities/transaction.ts`
- [x] 1.2 Update TransactionSchema validation to include `deletedAt` with default `null` value
- [x] 1.3 Update any related TypeScript types and exported interfaces

## 2. Update transaction repository implementation

- [x] 2.1 Modify `TransactionLocalRepo.delete()` to call `update(id, { deletedAt: now })` instead of physical deletion
- [x] 2.2 Update `TransactionLocalRepo.findById()` to filter by `deletedAt === null`
- [x] 2.3 Update `TransactionLocalRepo.findAll()` to filter by `deletedAt === null`
- [x] 2.4 Update `TransactionLocalRepo.findByAccountBookId()` to filter by `deletedAt === null`
- [x] 2.5 Add/update Dexie index in `apps/web/src/lib/dexie.ts` to optimize `(accountBookId, deletedAt)` queries if needed

## 3. Update test mocks and specs

- [x] 3.1 Update `InMemoryTransactionRepo` in test files to mirror the soft-delete logic
- [x] 3.2 Update `apps/web/specs/transaction.spec.ts` — verify delete returns soft-deleted record instead of null
- [x] 3.3 Update `apps/web/specs/transactionStore.spec.ts` — verify store removes soft-deleted transactions from state
- [x] 3.4 Update `apps/web/specs/homeTransactions.spec.tsx` — verify deleted transactions don't appear in UI list
- [x] 3.5 Update test fixtures and setup to handle `deletedAt` field

## 4. Verify store and UI layer integration

- [x] 4.1 Verify `TransactionStore.deleteTransaction()` works unchanged (it calls repo.delete)
- [x] 4.2 Verify `TransactionModal` UI feedback shows "Transaction deleted" as before
- [x] 4.3 Run all transaction-related tests to ensure no regressions
- [x] 4.4 Manual test: create, delete, and verify deleted transaction doesn't appear in home list

## 5. Documentation update (deferred tasks)

- [ ] 5.1 Add note to `openspec/specs/transactions/spec.md` explaining soft-delete behavior
- [ ] 5.2 Document the future cloud-sync and cleanup job design (separate change)

