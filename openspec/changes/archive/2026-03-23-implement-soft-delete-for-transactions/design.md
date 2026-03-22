## Context

Currently, when a user clicks "Delete" on a transaction, the transaction is immediately removed from IndexedDB via `transactionLocalRepo.delete()`. This prevents:

1. Syncing deletions to cloud storage asynchronously
2. Implementing a staged cleanup strategy for deleted records
3. Recovering accidentally deleted data before sync

The approved `transactions` spec and the `implement-transaction-store-and-home-list` change both enforce direct deletion at the storage layer.

## Goals / Non-Goals

**Goals:**

- Implement soft deletion by adding a `deletedAt` timestamp field to transactions
- Change repository `delete()` to perform `update(id, { deletedAt: now })` instead of physical deletion
- Filter soft-deleted transactions from all user-visible queries (`findById`, `findAll`, `findByAccountBookId`)
- Maintain backward compatibility in the store and UI layer — users experience the same immediate removal from lists
- Prepare the data layer for future scheduled tasks that sync deletions to cloud and clean up local soft-deleted records

**Non-Goals:**

- Implement the cloud sync logic (deferred to future change)
- Implement the scheduled cleanup job (deferred to future change)
- Add UI for recovering deleted transactions (not in scope)
- Change the delete confirmation flow or UX (keep existing confirmation modal)

## Decisions

### Decision 1: Use `deletedAt` timestamp instead of `isDeleted` boolean

**Rationale:**

- Timestamps enable future audit logging and scheduled cleanup queries (`WHERE deletedAt < <30-days-ago>`)
- `deletedAt: null` vs `isDeleted: false` provides clearer intent in data
- Supports "soft delete" -> "hard delete" staging pattern

**Implementation:**

- `deletedAt: number | null` in Transaction schema (milliseconds since epoch, or null for active records)
- Update Zod schema to make `deletedAt` optional with default `null`

### Decision 2: Filter in repository queries, not in store

**Rationale:**

- Makes soft deletion a storage implementation detail
- Prevents accidental bugs from forgetting to filter in UI code
- Single source of truth for "is this visible to user?"

**Implementation:**

- Update `transactionLocalRepo` query methods to filter `WHERE deletedAt === null`
- Update in-memory test repos to do the same

### Decision 3: Keep `delete()` method signature unchanged

**Rationale:**

- Maintains compatibility with the store's existing `deleteTransaction` action
- No breaking changes to the TransactionRepo interface

**Implementation:**

- `delete(id)` now calls `update(id, { deletedAt: now })` internally
- Still returns `true` on success, `false` on not found
- Store behavior is identical from the outside (transaction disappears from lists immediately)

## Risks / Trade-offs

**Risk 1: Soft-deleted records occupy disk space indefinitely**

- _Mitigation:_ Future scheduled cleanup job will purge soft-deleted records after retention period

**Risk 2: Accidental re-activation of deleted transactions**

- _Mitigation:_ No UI affordance to un-delete; only administrative internal operations can modify `deletedAt`
- _Future:_ Cloud deletion can be authoritative (deletes from cloud = truly gone)

**Risk 3: Queries become slightly less efficient**

- _Mitigation:_ Index `(accountBookId, deletedAt)` in Dexie to optimize filtered queries

**Trade-off: More database rows**

- _Accepted:_ Mobile/web IndexedDB has ample space for soft-deleted records until cleanup job runs
