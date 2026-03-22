## Why

Currently, when a user deletes a transaction, it is immediately removed from the database with no way to recover it or sync the deletion with cloud storage. To support a safer deletion flow that allows scheduled syncing with cloud and staged cleanup of local data, we need to implement soft deletion — marking transactions as deleted without removing them from the database.

## What Changes

- Add a `deletedAt` timestamp field to the Transaction entity to mark deleted transactions
- Change the `delete()` repository method to perform a soft delete (set `deletedAt` field) instead of physically removing the record
- Update all transaction query methods (`findById`, `findAll`, `findByAccountBookId`) to filter out soft-deleted transactions from user-visible results
- Update the transaction store to properly handle soft-deleted transactions
- Update the delete-confirmation UI message to reflect the new behavior (mark as deleted, not permanently removed)

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `transactions`: Implement soft deletion with `deletedAt` timestamp to support scheduled cloud sync and staged data cleanup
- `local-persistence`: Support soft deletion pattern in transaction storage

## Impact

- **Affected specs**: `transactions`, `local-persistence`
- **Affected code**:
  - `apps/web/src/entities/transaction.ts` — Add `deletedAt` field to Transaction schema
  - `apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts` — Update delete logic and query filters
  - `apps/web/src/stores/transaction/transactionStore.ts` — Ensure store state handles soft deletion
  - `apps/web/src/components/TransactionModal/TransactionModal.tsx` — Update UI feedback
  - `apps/web/specs/transaction.spec.ts`, `apps/web/specs/transactionStore.spec.ts`, `apps/web/specs/homeTransactions.spec.tsx` — Update tests
  - `apps/web/src/lib/dexie.ts` — Add index for `deletedAt` if needed
