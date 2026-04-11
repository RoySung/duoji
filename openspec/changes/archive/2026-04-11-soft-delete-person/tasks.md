## 1. Data Model

- [x] 1.1 Add `deletedAt` to `VirtualUser` schema — update `VirtualUserSchema` in `apps/web/src/entities/person.ts` with optional `deletedAt: z.number().optional()`

## 2. Store Updates

- [x] 2.1 Store exposes `activePeople` and `allPeople` — rename `people` to `allPeople` in `PeopleStoreState` and add derived `activePeople` field that filters out deleted virtual users
- [x] 2.2 `softDeleteVirtualUser` replaces hard delete — rename `removeVirtualUser` to `softDeleteVirtualUser` in `peopleStore.ts`, change implementation to set `deletedAt = Date.now()` instead of filtering the record out
- [x] 2.3 Update `peopleStoreProvider.tsx` and `index.ts` exports to reflect renamed action and new state fields
- [x] 2.4 Virtual users support soft deletion — update `PeopleSection.tsx` to call `softDeleteVirtualUser` instead of `removeVirtualUser`

## 3. Transaction Form — Create Context

- [x] 3.1 New transaction person selectors exclude deleted members — update `PaidByDetailModal.tsx` to source the person list from `activePeople` so deleted members are hidden when creating a new transaction
- [x] 3.2 Person selector context: create vs. edit — update `SplitDetailModal.tsx` to source the person list from `activePeople` so deleted members are hidden when creating a new transaction
- [x] 3.3 Income transactions record a single recipient — update the recipient selector in `IncomeForm.tsx` to source from `activePeople` when creating a new transaction

## 4. Transaction Form — Edit Context

- [x] 4.1 Edit transaction person selectors allow removal of deleted members only — update `PaidByDetailModal.tsx` to use `allPeople` in edit mode and render deleted virtual users as disabled + strikethrough; allow deselection but block new selection
- [x] 4.2 Update `SplitDetailModal.tsx` with the same edit-mode disabled/strikethrough behavior for deleted virtual users
- [x] 4.3 Update `IncomeForm.tsx` recipient selector edit-mode behavior: show deleted recipient with strikethrough and allow removal but not re-addition

## 5. Transaction List Display

- [x] 5.1 Transaction views display deleted persons with strikethrough style — update `TransactionList.tsx` to apply `line-through` text style when rendering a person whose `deletedAt` is set

## 6. Tests

- [x] 6.1 Update `transactionStore.spec.ts` to cover `softDeleteVirtualUser` soft-delete behavior and `activePeople`/`allPeople` filtering
- [x] 6.2 Update `homeTransactions.spec.tsx` to cover strikethrough rendering of deleted persons in transaction list
- [x] 6.3 Update `transaction.spec.ts` to cover selector behavior differences in create vs. edit context
