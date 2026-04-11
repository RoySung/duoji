## Why

The current settlement design stores `transactionIds[]` on `SettlementRecord` and derives "settled" state by loading all settlement records and building a union Set. As settlement history grows, this becomes increasingly expensive on every store initialization. Since settlement deletion is not a planned feature, we can store settled state directly on `Transaction` for efficient indexed queries.

## What Changes

- Add `settlementRecordId: string | null` field to `Transaction` entity — `null` means unsettled
- Remove `transactionIds[]` from `SettlementRecord` entity
- Update settlement creation to batch-update `Transaction.settlementRecordId` instead of writing `transactionIds` to the record
- Update unsettled transaction queries to use an indexed lookup (`settlementRecordId == null`) instead of deriving from settlement records
- Update settlement history view to reverse-query transactions by `settlementRecordId`

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `transactions`: Transaction entity gains `settlementRecordId` field; settled state is now a first-class attribute on the transaction
- `local-persistence`: Dexie schema updated to index `settlementRecordId` on the transactions table

## Impact

- Affected specs: `transactions`, `local-persistence`
- Affected code:
  - `apps/web/src/entities/settlement.ts` — remove `transactionIds` from `SettlementRecord`
  - `apps/web/src/lib/dexie.ts` — add `settlementRecordId` field + index to transactions table
  - `apps/web/src/utils/settlementUtils.ts` — rewrite `computeUnsettledTransactions` to use indexed query
  - `apps/web/src/stores/settlement/settlementStore.ts` — remove `settledTransactionIds` Set; update `initialize` and `createSettlementRecord`
  - `apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts` — update `create` to batch-update transactions; remove `transactionIds` handling
