## Why

`entities/user.ts` (registered user) and `entities/person.ts` (Person union + VirtualUser) are split across two files, causing naming confusion: `User` simultaneously means "a database-registered account" and coexists as a sibling to `Person` (the union type). The discriminant value `type: 'user'` compounds the ambiguity — it reads as if `User` is a subtype of itself.

## What Changes

- Merge `entities/person.ts` into `entities/user.ts` and delete `person.ts`
- **BREAKING** Rename `User` → `RegisteredUser` (the registered-account subtype)
- **BREAKING** Rename `Person` → `User` (the union type, replacing Person as the top-level concept)
- **BREAKING** Rename `PersonType` → `UserType`
- **BREAKING** Change union discriminant value: `type: 'user'` → `type: 'registered'`
- Add Dexie v3 migration: update all stored `personType: 'user'` values → `'registered'`
- Update all consumers (stores, utils, components, mocks, tests)

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `transactions`: `PersonTypeSchema` enum changes from `['user', 'virtual']` to `['registered', 'virtual']`; affects stored transaction data and all transaction-related logic

## Impact

- Affected code:
  - `apps/web/src/entities/user.ts` — rewritten
  - `apps/web/src/entities/person.ts` — deleted
  - `apps/web/src/entities/accountBook.ts` — import path update
  - `apps/web/src/entities/transaction.ts` — PersonTypeSchema enum value update
  - `apps/web/src/lib/dexie.ts` — v3 migration for stored personType values
  - `apps/web/src/stores/people/peopleStore.ts` — type renames + discriminant value
  - `apps/web/src/utils/transactionUtils.ts` — type renames
  - `apps/web/src/mocks/user.ts` — type annotation update
  - `apps/web/src/components/TransactionModal/` (4 files) — type renames + discriminant guard
  - `apps/web/src/components/accountBookSettings/PeopleSection.tsx` — discriminant guard
  - `apps/web/specs/` (5 test files) — type renames + discriminant values
