## Why

Transaction creation and editing flows are already part of the approved specifications, but the web app still lacks a dedicated transaction repository and IndexedDB transaction store. This leaves transaction persistence unfinished and blocks the data layer work needed before transaction UI can save and reload records reliably.

The recent transaction entity refactor also exposed duplicated typing between the persisted Transaction model and the expense-form-only Expense alias. Keeping those shapes separate would make the newly added repository contract easier to drift from the transaction modal components that will eventually save through it.

## What Changes

- Introduce a transaction storage capability for the web app's local data layer.
- Define a Zod-first transaction entity and repository contract that matches the existing repository pattern used by account books and categories.
- Align transaction-related form typing with the persisted Transaction entity by removing the standalone Expense alias and reusing Transaction and TransactionType in transaction modal components.
- Add an IndexedDB transactions table and a local repository implementation that supports create, read, update, delete, and account-book-scoped queries.
- Add focused repository tests so transaction persistence behavior is verified before UI integration work continues.

## Capabilities

### New Capabilities

- `transaction-storage`: Local transaction records can be validated, persisted, queried by account book, updated, and removed through a dedicated repository abstraction.

### Modified Capabilities

(none)

## Impact

- Affected specs: `transaction-storage`
- Affected code: `apps/web/src/entities/transaction.ts`, `apps/web/src/lib/dexie.ts`, `apps/web/src/repositories/transactionRepo/`, `apps/web/src/components/TransactionModal/ExpenseForm.tsx`, `apps/web/src/components/TransactionModal/PaidByDetailModal.tsx`, `apps/web/src/components/TransactionModal/SplitDetailModal.tsx`, `apps/web/src/components/TransactionModal/TransactionModal.tsx`, `apps/web/specs/`
