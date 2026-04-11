## 1. Entity & Schema Updates

- [x] 1.1 Add `settlementRecordId: string | null` to `Transaction` entity (`apps/web/src/entities/transaction.ts`) — add `settlementRecordId` to the Zod schema so users can record income and expense transactions with settled state tracked (add `settlementRecordId` to Transaction (not `isSettled: boolean`))
- [x] 1.2 Remove `transactionIds[]` from `SettlementRecord` entity in `apps/web/src/entities/settlement.ts` (remove `transactionIds[]` from SettlementRecord)
- [x] 1.3 Update Dexie schema in `apps/web/src/lib/dexie.ts` — add `settlementRecordId` to the transactions table index string; no Dexie schema version bump required during development — in-place modification is sufficient; core domain records persist locally in IndexedDB including settlement data (index supports unsettled transaction lookup)

## 2. Repository Layer

- [x] 2.1 Update `settlementLocalRepo.ts` — remove handling for `transactionIds` in `create()` and `update()`; settlement creation uses atomic batch update: write record first, then bulk-set `settlementRecordId` on each included transaction (transaction marked as settled; settlement creation: atomic batch update)
- [x] 2.2 Add a `findTransactionsBySettlementId(recordId)` helper or update the transaction repo to support querying by `settlementRecordId` for settlement record reverse lookup (settlement record transactions are queryable by reverse lookup)

## 3. Utility Layer

- [x] 3.1 Rewrite `computeUnsettledTransactions` in `apps/web/src/utils/settlementUtils.ts` — replace Set-based derivation with a filter on `transaction.settlementRecordId == null` (unsettled expense transactions are queryable by index); remove `settlementRecords` parameter from function signature

## 4. Store Updates

- [x] 4.1 Remove `settledTransactionIds: Set<string>` state from `settlementStore.ts`; the store no longer needs to maintain this derived set
- [x] 4.2 Update `initialize(accountBookId, transactions)` in `settlementStore.ts` — call updated `computeUnsettledTransactions` using the `settlementRecordId == null` filter; remove loading of settlement records for the purposes of deriving unsettled state; settlement records are still loaded for history display
- [x] 4.3 Update `createSettlementRecord` in `settlementStore.ts` — after successful creation, update local `transactions` state to reflect new `settlementRecordId` values so UI stays consistent without re-initialization
- [x] 4.4 Remove `deleteSettlementRecord` action from `settlementStore.ts` if it exists (settlement deletion is not a planned feature); remove `deletedAt` from `SettlementRecord` entity if unused

## 5. Verification

- [x] 5.1 Verify unsettled transaction query returns correct results after store initialization
- [x] 5.2 Verify creating a settlement record correctly sets `settlementRecordId` on all included transactions
- [x] 5.3 Verify settlement history view loads the correct transactions via reverse lookup
- [x] 5.4 Run existing tests — `apps/web/specs/transactionUtils.spec.ts`, `apps/web/specs/homeTransactions.spec.tsx` — and fix any failures caused by the schema change
