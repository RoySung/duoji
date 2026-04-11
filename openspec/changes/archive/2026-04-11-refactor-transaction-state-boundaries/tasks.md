## 1. Move account-book transaction queries to page-scoped hooks

- [x] 1.1 Implement a page-owned transaction query hook or feature controller for the home account-book page so the requirement "Transactions are presented in an account-book-scoped list" is fulfilled without the app-level `transactionStore`
- [x] 1.2 Update `apps/web/src/pages/account-books/[id]/index.tsx` and nearby transaction list wiring to consume the new page-owned query state, loading state, and error state
- [x] 1.3 Remove account-book list loading responsibilities from `apps/web/src/stores/transaction/transactionStore.ts` and `apps/web/src/pages/_app.tsx`

## 2. Keep modal session separate from transaction query results

- [x] 2.1 Introduce page-level or feature-level transaction modal session state so the requirement "Transaction editing session is scoped to the active account-book page" is satisfied
- [x] 2.2 Update `apps/web/src/components/TransactionModal/TransactionModal.tsx` to receive selected transaction data and modal session control from the account-book page boundary instead of the global transaction store
- [x] 2.3 Remove the navbar dependency on global transaction modal state in `apps/web/src/components/layout/navbar.tsx`

## 3. Treat retrieval scenarios as repository plus query-hook composition

- [x] 3.1 Keep account-book and settlement transaction reads routed through `apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts`, and document or add the query entry points needed for future by-date and by-category retrieval scenarios
- [x] 3.2 Align settlement pages with the new repository plus query-hook composition boundary so they continue to work without reintroducing shared `transactions[]` state

## 4. Verification

- [x] 4.1 Replace or rewrite transaction store tests so they verify the page-owned contract behind "Transactions are presented in an account-book-scoped list"
- [x] 4.2 Verify create, edit, and delete flows still work when the "Transaction editing session is scoped to the active account-book page"
- [x] 4.3 Run affected web tests covering the account-book transaction list, transaction modal flows, and settlement transaction retrieval behavior
