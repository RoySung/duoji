## Context

The codebase currently has two entity files for person-related types:
- `entities/user.ts`: defines `UserSchema/User` as a registered-account model (id, name, email, avatarUrl, timestamps)
- `entities/person.ts`: defines `VirtualUserSchema/VirtualUser`, and `PersonSchema/Person` as a discriminated union of both

The `type` discriminant in `PersonSchema` uses `'user'` to identify registered users, which creates a circular-sounding reference: `User` is a subtype of `Person`, and you tell them apart by checking `type === 'user'`.

The `transactions` entity defines `PersonTypeSchema = z.enum(['user', 'virtual'])` independently; it must also change to match the renamed discriminant.

Stored transaction data in IndexedDB contains `personType: 'user'` values in `paidByDetail` and `splitDetail` arrays, which requires a Dexie version migration to stay consistent.

## Goals / Non-Goals

**Goals:**

- Single source of truth for all user-related types in `entities/user.ts`
- `User` becomes the top-level union type (replacing `Person`)
- `RegisteredUser` is the unambiguous name for the registered-account subtype
- Discriminant value `'registered'` matches the type name `RegisteredUser`
- All consumers updated; no behavioral changes

**Non-Goals:**

- No functional behavior changes (add, edit, delete operations remain unchanged)
- No backend or API changes
- No UI copy changes (the "Registered" badge text in PeopleSection already reads correctly)
- No changes to VirtualUser shape or storage location

## Decisions

### Rename registered-user discriminant to `'registered'`

Current value `'user'` reads ambiguously: it can mean "this is a User" (the union) or "this is a registered user" (the subtype). Using `'registered'` aligns the enum value with the new subtype name `RegisteredUser`, making type guards self-explanatory (`user.type === 'registered'`).

Alternative considered: keep `'user'` and only rename the TypeScript type. Rejected because the stored discriminant value `personType: 'user'` in IndexedDB would still be misleading and would diverge from the new type name.

### Merge into `entities/user.ts`, delete `entities/person.ts`

The split into two files had no conceptual advantage once `Person` is renamed to `User`. A single file reduces import surface and makes the type hierarchy obvious at a glance.

Alternative considered: keep two files, rename `person.ts` to `userTypes.ts`. Rejected because it still requires two imports for related concepts with no benefit.

### Add Dexie v3 migration for stored `personType` values

Transactions stored in IndexedDB have `paidByDetail[].personType` and `splitDetail[].personType` set to `'user'`. After this change, the valid value becomes `'registered'`. A Dexie upgrade hook rewrites these values on first open post-deployment.

The migration is a data-only upgrade (no schema index changes), so the `.stores({})` definition is identical to v2.

## Risks / Trade-offs

- [Risk] Dexie migration runs lazily on first open → Mitigation: Zod schema still accepts existing stored data until migration runs; transaction writes after deploy use `'registered'`, reads are migrated on first access.
- [Risk] Missed `type: 'user'` guards in components become type errors → Mitigation: TypeScript compiler will catch exhaustiveness failures; CI enforces `tsc --noEmit`.
- [Risk] Test data with `personType: 'user'` may be stale in test fixtures → Mitigation: update all spec fixtures as part of this change.

## Migration Plan

1. Rewrite `entities/user.ts` (RegisteredUser, VirtualUser, User union)
2. Delete `entities/person.ts`
3. Update `entities/accountBook.ts` and `entities/transaction.ts` (import paths + enum)
4. Add Dexie v3 upgrade to rewrite stored `personType: 'user'` → `'registered'`
5. Update stores, utils, mocks, components (type renames + discriminant guards)
6. Update all test fixtures
7. Run `tsc --noEmit` and full test suite to verify

Rollback: revert all files; Dexie upgrade is non-destructive (original values are overwritten, not deleted), so no IndexedDB rollback is needed.
