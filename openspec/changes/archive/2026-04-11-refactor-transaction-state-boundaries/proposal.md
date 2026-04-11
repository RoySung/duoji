## Why

The current transaction store mixes account-book query results, CRUD loading state, and modal session state in one app-level Zustand store. That coupling makes every new retrieval scenario compete for the same global state shape even though the existing settlement flow already proves transaction queries can be handled locally.

## What Changes

- Refactor transaction state ownership so account-book transaction queries move from the app-level store to page-scoped hooks or feature-level controllers
- Separate transaction modal session state from transaction query results so modal control is no longer tied to a global `transactions[]` cache
- Keep the transaction repository as the source of truth for retrieval scenarios, with dedicated query entry points for account-book, settlement, and future filter-specific reads
- Remove the implicit app-shell dependency on transaction creation and editing flows so transaction UI can be owned by the page that renders the relevant list

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `transactions`: Transaction list loading and editing flows become page-owned account-book interactions rather than app-level shared transaction state

## Impact

- Affected specs: `transactions`
- Affected code:
  - `apps/web/src/stores/transaction/transactionStore.ts` — split query state from modal session concerns
  - `apps/web/src/stores/transaction/transactionStoreProvider.tsx` — remove or narrow app-level transaction state exposure
  - `apps/web/src/pages/_app.tsx` — stop wiring transaction state as an unconditional app-wide provider
  - `apps/web/src/pages/account-books/[id]/index.tsx` — own account-book transaction query state at the page level
  - `apps/web/src/components/TransactionModal/TransactionModal.tsx` — accept page-owned transaction session and selected transaction data
  - `apps/web/src/components/layout/navbar.tsx` — remove direct dependency on app-level transaction modal state
  - `apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts` — remain the query source for account-book and future filter-specific retrievals