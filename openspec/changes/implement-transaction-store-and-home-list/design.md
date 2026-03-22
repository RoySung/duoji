## Context

- Approved specs already require transaction creation, editing, deletion, and account-book-scoped browsing, but the current web app only has a partially wired transaction modal and a repository implementation.
- The home page currently manages current account-book selection, which makes it the correct place for the first scoped transaction history experience.
- `TransactionModal` is opened from the shared navbar, while transaction editing needs to start from the home-page list. A shared modal flow therefore needs a state owner that is accessible from both entry points.
- `ExpenseForm` currently owns its entire draft state internally, which prevents the modal footer from orchestrating create and edit submissions. `IncomeForm` is still a stub.
- The current transaction entity reuses expense-oriented participant fields for every transaction, so income records have no dedicated way to identify who received the income.
- The approved transaction spec already references payment method, and the wireframe also shows payment-method labels, but the transaction entity and repository schema do not persist that field yet.

## Goals / Non-Goals

**Goals:**

- Add one transaction feature store that owns transaction collection state, scoped CRUD orchestration, and the shared modal session for create and edit flows.
- Make the transaction modal reusable for both new and existing transactions by lifting draft ownership out of child forms.
- Add a home-page transaction history section that reads from the current account book and renders a reusable flat transaction list with compact summary rows that match the mobile-first wireframe direction.
- Persist a single income recipient independently from expense payer details and prefill it from current-user context when creating income transactions.
- Persist and display payment method as part of transaction creation, editing, and summary rendering.
- Add verification for store orchestration and home-page UI behavior.

**Non-Goals:**

- Add a dedicated transaction detail route or a separate read-only transaction sheet.
- Add visible delete controls to the first home-page transaction list iteration.
- Implement visible-range totals in the first history pass.
- Support multi-recipient income distribution or income-side amount splitting.
- Introduce backend APIs, remote sync, or authenticated user context.

## Decisions

### Use a dedicated transaction feature store as the single transaction state source

The web app SHALL add a transaction feature store, parallel to the existing account-book store, that owns transaction loading, create/update/delete actions, loading and error state, and modal session state for create and edit flows. The store SHALL expose account-book-scoped load actions instead of reaching into the account-book store directly.

Alternative considered: keeping transaction data and modal state local to the navbar and home page. Rejected because create originates from the shared navbar while edit originates from the home page, and duplicating modal/session logic across both entry points would fragment the flow immediately.

Alternative considered: splitting a data store and a separate modal controller. Rejected for this change because the extra indirection does not buy enough value for the current single-feature scope.

### Keep transaction modal create and edit flows on one shared controlled draft

`TransactionModal` SHALL become a shared create/edit surface that receives or derives one transaction draft and one submit path. Draft ownership SHALL move to the modal or a modal-level hook so the modal footer can coordinate validation and submission. `ExpenseForm` and `IncomeForm` SHALL become controlled form sections that render and update slices of the shared draft instead of hiding submission state internally.

Alternative considered: keeping form-local draft state and using imperative refs to pull values on save. Rejected because it would make cross-form validation and edit prefilling brittle.

Alternative considered: separate create and edit modals. Rejected because it would duplicate field composition and diverge the two flows unnecessarily.

### Render the home-page transaction history as a reusable current-account-book-scoped flat list

The first transaction history surface SHALL live on the home page beneath the current account-book selector. The page SHALL own the section chrome, while a reusable `TransactionList` component renders the transaction rows themselves. The list SHALL load transactions for the current account book, display them in one flat list using the store's existing sort order, render compact summary rows with per-row date, expense payer or income recipient information, payment method, and an equal-split chip when applicable, and provide an edit affordance on each visible row. The list SHALL act as the primary read surface, so no separate view action is needed in this change.

Alternative considered: building a dedicated transaction history route. Rejected because the current information architecture already centers current-account-book context on the home page.

Alternative considered: inline editing inside the list. Rejected because the modal already exists and the wireframe favors scanning over persistent inline form state.

### Represent payment method as a persisted string field in the transaction entity

The transaction entity, repository validation, and UI draft model SHALL add a persisted `paymentMethod` string field. The first version SHALL use a plain string rather than a constrained enum so the app can reflect labels such as cash and wallet providers without introducing a premature taxonomy. The home-page summary row SHALL render the stored payment method when present.

Alternative considered: using an enum immediately. Rejected because no approved payment-method vocabulary exists in the repo today and the wireframe already implies open-ended labels.

### Represent income recipient as a single persisted field separate from expense payer details

The transaction entity, repository validation, and UI draft model SHALL add a persisted `receivedByUserId` field for income transactions. The field SHALL represent exactly one recipient, SHALL default to the current user when a new income draft is created, and SHALL remain editable when a user changes the income recipient before saving. Until authenticated user context exists, the draft helper SHALL resolve the effective current user from the active account book owner so the default stays deterministic in local-first flows. Expense-only participant fields such as `paidByDetail` and `splitDetail` SHALL remain expense semantics and SHALL NOT be reused to infer income recipients. The home-page summary row SHALL render recipient information for income transactions from this dedicated field.

Because this recipient model is still in active development, the implementation does not need migration-specific handling for legacy income rows with missing recipients. Such rows are treated as out of scope for this change.

Alternative considered: reusing `paidByDetail`. Rejected because payer semantics become incorrect for income records and would make list summaries misleading.

Alternative considered: adding an income-side `receivedByDetail` array immediately. Rejected because the current requirement only needs one recipient and a multi-recipient model would add unnecessary complexity to the first iteration.

### Verify the transaction flow at store and home-page UI layers

The change SHALL add focused transaction store tests for scoped loading and CRUD state updates, then add UI tests for the home-page list and edit flow. Existing repository tests SHALL remain the persistence safety net rather than being duplicated at the UI layer.

Alternative considered: relying only on repository tests. Rejected because the main risk in this change is orchestration between current account-book selection, modal state, and home-page rendering.

## Risks / Trade-offs

- [Store-owned modal session mixes feature data state with UI session state] -> Keep the store API narrow and limit modal state to mode, open/closed status, and the editing transaction identifier or draft seed.
- [Controlled-form refactoring touches multiple transaction modal subcomponents] -> Introduce shared transaction-draft helpers and keep child components focused on presentation and field updates.
- [No authenticated current-user context exists yet for the default income recipient] -> Centralize recipient default resolution and use the active account-book owner as the temporary fallback until user context exists.
- [A string payment-method field can drift without normalization] -> Centralize default values and field parsing so a later taxonomy change only touches one boundary.
- [The home-page list can become dense on small screens] -> Keep the first layout compact, flat, and limited to summary metadata that helps scanning without reintroducing nested grouping.
- [Removing totals from the first history pass narrows an existing approved requirement] -> Capture the narrowed scope in the transactions spec delta and treat totals as follow-up work rather than leaving the requirement ambiguous.

## Migration Plan

- Add the `transactions` spec delta for the home-page list presentation and edit affordance.
- Add the `transactions` spec delta for the income-recipient requirement and the home-page list presentation updates.
- Introduce the transaction feature store and provider wiring in the app root.
- Extend the transaction entity, repository-backed draft defaults, and income form model with `receivedByUserId` and current-user default resolution.
- Extend the transaction entity, repository-backed draft defaults, and modal field model with payment method support.
- Refactor `TransactionModal`, `ExpenseForm`, and `IncomeForm` into a shared controlled create/edit flow.
- Add the current-account-book-scoped home-page transaction list and wire its edit action into the shared modal flow.
- Add store and UI verification, then run the web test suite.

## Open Questions

- When authenticated user context arrives, replace the owner-based fallback for default income recipients as a follow-up behavior change.
- Whether the first payment-method input should be a free-text field or a lightweight preset selector can stay flexible during implementation as long as it persists a string value.
- When delete is surfaced in the UI, prefer reusing the edit modal footer or a separate confirmation pattern instead of changing the store contract again.
- If visible-range totals return later, add them as a dedicated follow-up change instead of expanding this first list iteration mid-implementation.
