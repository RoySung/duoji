## 1. Data model and transaction state foundation

- [x] 1.1 Represent payment method as a persisted string field in the transaction entity by extending the transaction schema, repository validation, draft defaults, and related mocks with `paymentMethod` support.
- [x] 1.2 Use a dedicated transaction feature store as the single transaction state source by adding a Zustand store and provider with account-book-scoped load, create, update, delete, and modal session actions.
- [x] 1.3 Wire the transaction feature store into the app root and shared navbar create trigger so transaction modal state is not duplicated across pages.

## 2. Shared transaction modal flows

- [x] 2.1 Keep transaction modal create and edit flows on one shared controlled draft by lifting draft ownership into `TransactionModal` or shared helpers and making `ExpenseForm` update a controlled transaction draft.
- [x] 2.2 Bring `IncomeForm` onto the same controlled-draft contract and persist both create and edit submissions through the transaction feature store.
- [x] 2.3 Prefill edit mode from the selected transaction and reset modal state correctly after save or cancel.

## 3. Home-page history and verification

- [x] 3.1 Render the home-page transaction history as a current-account-book-scoped grouped list and implement Transactions are presented in an account-book-scoped list with date groups, summary rows, payment-method visibility, and direct edit actions on the home page.
- [x] 3.2 Verify the transaction flow at store and home-page UI layers with transaction store tests and home-page/modal interaction coverage.
- [x] 3.3 Run `pnpm nx test web --runInBand` and confirm the scoped transaction list, shared modal flow, and edit behavior do not regress existing web tests.
- [x] 3.4 Render the home-page transaction history as a reusable current-account-book-scoped flat list with a page-owned `TransactionList` section chrome and per-row payer and equal-split summary details.

## 4. Income recipient support

- [x] 4.1 Implement Represent income recipient as a single persisted field separate from expense payer details by extending the transaction entity, repository validation, and draft helpers with a `receivedByUserId` income field.
- [x] 4.2 Update Keep transaction modal create and edit flows on one shared controlled draft so Income transactions record a single recipient with a current-user default and active-account-book participant selection.
- [x] 4.3 Update Transactions are presented in an account-book-scoped list coverage to render income recipient summaries and verify default and overridden recipient behavior in store and UI tests.
