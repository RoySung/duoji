## Why

Account books need to support split-expense workflows among multiple participants, including non-registered users. The current `userIds` field only references registered users, and transaction `paidByDetail`/`splitDetail` hardcode `UserSchema`, making it impossible to track virtual participants (e.g., a friend who hasn't signed up).

## What Changes

- Introduce a `Person` entity that unifies registered users (`User`) and custom virtual users (`VirtualUser`) within an account book
- Add a `people` field to the `AccountBook` entity replacing/extending `userIds`
- Add People management UI to the account book settings page (add, remove, view members)
- Update transaction `paidByDetail`, `splitDetail`, and `receivedByUserId` to reference `Person` instead of `User`, so both registered and virtual participants can be selected in the transaction form

## Capabilities

### New Capabilities

- `people`: Person entity (User | VirtualUser) scoped to an account book, with CRUD operations and store

### Modified Capabilities

- `account-books`: Add `people` field to AccountBook entity and people management UI to settings page
- `transactions`: Replace `UserSchema` references in `paidByDetail`, `splitDetail`, and `receivedByUserId` with `PersonSchema` so virtual users can participate

## Impact

- Affected specs: `people` (new), `account-books` (delta), `transactions` (delta)
- Affected code:
  - `apps/web/src/entities/accountBook.ts` — add `people` field
  - `apps/web/src/entities/transaction.ts` — update `PaidByDetailItemSchema`, `SplitDetailItemSchema`, `receivedByUserId` to use `PersonSchema`
  - `apps/web/src/stores/accountBook/accountBookStore.ts` — expose people management actions
  - `apps/web/src/stores/transaction/transactionStore.ts` — use person references
  - `apps/web/src/components/TransactionModal/` — update payer/participant pickers to show account book people
  - New: `apps/web/src/entities/person.ts` — `PersonSchema`, `VirtualUserSchema`
  - New: `apps/web/src/stores/people/` — people store scoped to active account book
  - New: account book settings UI section for People management
