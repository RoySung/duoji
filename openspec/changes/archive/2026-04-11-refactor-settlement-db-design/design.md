## Context

The current settlement system derives "settled" state by loading all `SettlementRecord`s for an account book, merging all `transactionIds[]` arrays into a `Set<string>`, then filtering transactions. This O(records × ids) scan runs on every `settlementStore.initialize()` call. The design worked initially but scales poorly as settlement history accumulates.

Separately, a discussion confirmed that **settlement deletion is not a planned feature**. This removes the main reason the settled state was kept external to `Transaction` — there is no need to "undo" a settled flag.

## Goals / Non-Goals

**Goals:**

- Make unsettled transaction queries O(1) via a Dexie index on `Transaction.settlementRecordId`
- Remove `transactionIds[]` from `SettlementRecord` (denormalized array no longer needed)
- Settlement history remains intact — reverse-query transactions by `settlementRecordId`

**Non-Goals:**

- Settlement deletion / undo functionality
- Server-side or multi-device sync (IndexedDB only)
- Migration tooling for existing data (dev-phase app, no production data to migrate)

## Decisions

### Add `settlementRecordId` to Transaction (not `isSettled: boolean`)

A `boolean` flag would work but loses the reference to which settlement record owns this transaction. Storing the record ID enables:

- Reverse lookup: "which transactions belong to settlement X?" — needed for history view
- Consistency check: if a record is found, the transaction ID space is self-consistent

Alternative considered: separate `transactionSettlements` junction table. Rejected — overkill for a client-side IndexedDB app; adds a third entity with no benefit over a direct FK field.

### Remove `transactionIds[]` from SettlementRecord

`SettlementRecord` was carrying `transactionIds[]` as a forward reference for display purposes. With `settlementRecordId` on `Transaction`, this is derivable via reverse query. Keeping both would create a two-source-of-truth problem.

Historical display (e.g., "this settlement covered 12 transactions") uses:

```ts
transactions.where('settlementRecordId').equals(recordId)
```

### Settlement creation: atomic batch update

When creating a settlement:

1. Compute member statuses + transfers from unsettled transactions
2. Write `SettlementRecord` (without `transactionIds`)
3. Batch-update all included `Transaction.settlementRecordId = newRecord.id`

Steps 2 and 3 are not wrapped in a DB transaction (IndexedDB doesn't support cross-table transactions in Dexie without a plugin). If the app crashes between steps, some transactions will be unsettled while the record exists. This is acceptable for a dev-phase prototype — the worst outcome is re-settling already-settled transactions, which the user can identify by looking at the record.

### Unsettled state uses a sentinel only

Transactions persist `settlementRecordId` as a dedicated sentinel string `__unsettled__` when they have not yet been included in any settlement record. This keeps unsettled lookups on an indexable string key and avoids dual semantics between sentinel and nullable values.

Repository queries therefore use the `settlementRecordId` index directly for unsettled expense lookups, without a secondary compatibility pass.

## Risks / Trade-offs

- **Partial write on crash** → Transactions updated before crash keep `settlementRecordId` set; those after do not. Mitigation: acceptable for prototype; production would wrap in a compensating transaction or saga.
