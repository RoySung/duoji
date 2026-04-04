## 1. Core Entity — Merge into `entities/user.ts`

- [x] 1.1 Rename `UserSchema/User` → `RegisteredUserSchema/RegisteredUser` in `entities/user.ts`; add new `UserSchema/User` discriminated union using `type: 'registered' | 'virtual'`; export `UserType`; implements design decision: rename registered-user discriminant to `'registered'`
- [x] 1.2 Absorb `VirtualUserSchema/VirtualUser` from `entities/person.ts` into `entities/user.ts`; delete `entities/person.ts`; implements design decision: merge into `entities/user.ts`, delete `entities/person.ts`

## 2. Update Dependent Entities

- [x] 2.1 Update `entities/accountBook.ts`: change import of `VirtualUserSchema` from `./person` → `./user`
- [x] 2.2 Update `entities/transaction.ts`: change `PersonTypeSchema` enum from `['user', 'virtual']` to `['registered', 'virtual']` to reflect that participant type stored as `registered`; export `UserTypeSchema` alias if needed

## 3. Dexie Migration — Stored `personType` Values

- [x] 3.1 Add Dexie `version(3)` upgrade in `lib/dexie.ts`: iterate all transactions, rewrite `personType: 'user'` → `'registered'` in `paidByDetail` and `splitDetail` arrays; implements design decision: add Dexie v3 migration for stored `personType` values

## 4. Store and Utils

- [x] 4.1 Update `stores/people/peopleStore.ts`: change import from `@/entities/person` → `@/entities/user`; rename all `Person` → `User`, original `User` → `RegisteredUser`; change `type: 'user' as const` → `type: 'registered' as const`
- [x] 4.2 Update `utils/transactionUtils.ts`: change import from `@/entities/person` → `@/entities/user`; rename all `Person` → `User`
- [x] 4.3 Update `mocks/user.ts`: change `userList: User[]` → `userList: RegisteredUser[]`

## 5. Components

- [x] 5.1 Update `components/TransactionModal/ExpenseForm.tsx`: import from `@/entities/user`; rename `Person` → `User`; change `person.type === 'user'` → `person.type === 'registered'`
- [x] 5.2 Update `components/TransactionModal/IncomeForm.tsx`: same pattern as 5.1
- [x] 5.3 Update `components/TransactionModal/PaidByDetailModal.tsx`: same pattern as 5.1; implements requirement "Users can record income and expense transactions" (paidByDetail participant reference)
- [x] 5.4 Update `components/TransactionModal/SplitDetailModal.tsx`: same pattern as 5.1
- [x] 5.5 Update `components/accountBookSettings/PeopleSection.tsx`: change all `person.type === 'user'` guards → `person.type === 'registered'` (no import change needed)

## 6. Tests

- [x] 6.1 Update `specs/peopleStore.spec.ts`: change `Person` → `User`, `type: 'user'` → `type: 'registered'`
- [x] 6.2 Update `specs/transactionUtils.spec.ts`: change `Person` → `User`, `personType: 'user'` → `personType: 'registered'`
- [x] 6.3 Update `specs/transaction.spec.ts`: change all `personType: 'user'` → `personType: 'registered'` in test fixtures; verifies participant type stored as `registered`
- [x] 6.4 Update `specs/transactionStore.spec.ts`: change all `personType: 'user'` → `personType: 'registered'`
- [x] 6.5 Update `specs/homeTransactions.spec.tsx`: change `Person` → `User`, `type: 'user'` → `type: 'registered'`, `personType: 'user'` → `personType: 'registered'`

## 7. Verification

- [x] 7.1 Run `npx tsc --noEmit` and confirm zero TypeScript errors
- [x] 7.2 Run `npx nx test web` and confirm all tests pass
- [x] 7.3 Confirm no residual references: `grep -r "from.*entities/person" apps/web/` and `grep -r "PersonType" apps/web/src/` both return empty
