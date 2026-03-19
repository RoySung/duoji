## Why

Approved specs already require personal account books and one active account book context, but the web app still relies on mock account-book options and lacks a client-side orchestration layer between the UI and the IndexedDB-backed repository. That leaves startup, active account book selection, and post-mutation fallback behavior underspecified in practice, which blocks a reliable foundation for later category and transaction state work.

## What Changes

- Introduce an AccountBook Store for the web app as the first store-oriented implementation slice.
- Define deterministic active account book behavior during startup, manual switching, creation, and deletion.
- Bootstrap account book state only after local persistence is initialized so account-book-scoped flows read from IndexedDB-backed data instead of hard-coded mocks.
- Establish a clean composition boundary so the store can orchestrate account-book use cases while depending on the AccountBookRepo contract.
- Add focused tests for account book state loading, active selection, and fallback behavior before follow-up store changes.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `account-books`: Clarify how the application establishes, switches, and recovers the active account book context during startup and account-book mutations.

## Impact

- Affected specs: `account-books`
- Affected code: `apps/web/package.json`, `apps/web/src/entities/accountBook.ts`, `apps/web/src/repositories/accountBookRepo/`, `apps/web/src/lib/dexie.ts`, `apps/web/src/pages/_app.tsx`, `apps/web/src/components/TransactionModal/ExpenseForm.tsx`, `apps/web/src/**/store*`, `apps/web/specs/`