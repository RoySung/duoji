## Why

Approved specs already require account-book-scoped transaction creation, editing, deletion, and browsing, but the current web app still lacks the state orchestration and home-page history flow that make those behaviors usable. The transaction modal is not wired to persistence, the home page has no transaction list, and the current implementation cannot support edit flows from a visible history.

The current transaction model also treats income like a lightly customized expense flow, which leaves income records without an explicit way to capture who actually received that money.

## What Changes

- Add a transaction feature store that orchestrates account-book-scoped transaction loading, create/update/delete actions, and modal session state for create and edit flows.
- Rework the shared transaction modal so the same entry surface can create new transactions and edit existing ones instead of keeping draft state isolated inside the expense form.
- Add a home-page transaction history section for the current account book with a reusable flat transaction list, signed amounts, richer summary metadata, and edit actions that follow the approved mobile-first wireframe direction.
- Add a single income-recipient field to income transactions, default it to the current user in the draft flow, and persist it independently from expense payer details.
- Align transaction entry and summary rendering with payment method support already required by the approved transaction behavior and reflected in the wireframe.
- Add store-level and UI-level verification for scoped transaction loading, modal editing, income-recipient defaults, and home-page list updates.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `transactions`: Clarify the first transaction history experience as a home-page, account-book-scoped flat list with reusable rows, expense payer and income recipient summary visibility, payment-method visibility, direct edit access from each visible transaction, and a single-recipient requirement for income transactions.

## Impact

- Affected specs: `transactions`
- Affected code: `apps/web/src/entities/transaction.ts`, `apps/web/src/repositories/transactionRepo/`, `apps/web/src/stores/`, `apps/web/src/utils/transactionUtils.ts`, `apps/web/src/components/TransactionModal/`, `apps/web/src/components/transaction/TransactionList.tsx`, `apps/web/src/components/layout/navbar.tsx`, `apps/web/src/pages/_app.tsx`, `apps/web/src/pages/index.tsx`, `apps/web/specs/`
