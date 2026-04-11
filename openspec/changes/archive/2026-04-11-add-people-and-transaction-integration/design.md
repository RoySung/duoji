## Context

The current `AccountBook` entity has `userIds: string[]` for registered members, and transactions reference `UserSchema` directly in `paidByDetail` and `splitDetail`. There is no concept of a "virtual" participant — someone who participates in expense splitting but hasn't registered. This blocks the core split-expense workflow for groups with mixed registered / non-registered users.

Current transaction split fields:
- `paidByDetail: { user: User, amount: number }[]`
- `splitDetail: { user: User, amount: number }[]`
- `receivedByUserId: string | null`

## Goals / Non-Goals

**Goals:**
- Introduce a `Person` type (`User` | `VirtualUser`) scoped to an account book
- Allow virtual users to be created, named, and managed in the account book settings
- Update transaction paidBy/split/receivedBy to reference `Person` instead of raw `User`
- Transaction form lets users select payers and split participants from the account book's people list

**Non-Goals:**
- Debt calculation or settlement UI
- Invitation / sign-up flow for virtual users to convert to registered users
- Multi-device sync beyond the existing local persistence model

## Decisions

### Person as a discriminated union

A `Person` is either a registered `User` (type: `'user'`) or a `VirtualUser` (type: `'virtual'`). Using a discriminated union keeps the type system clean and allows UI components to render them differently (e.g., show avatar for registered users, initials for virtual).

Alternative considered: a single flattened `Member` type with optional email. Rejected because it loses the distinction needed for future features (e.g., inviting virtual users, syncing balances).

### VirtualUser stored as an embedded array on AccountBook

`AccountBook.virtualUsers: VirtualUser[]` stores custom participants directly on the account book document. Registered members remain `userIds: string[]`.

Alternative: a separate `virtualUsers` collection in Dexie. Rejected for Phase 1 because the volume is small (typically < 20 people per book) and embedding simplifies queries.

### Transaction references PersonId, not the full Person object

`paidByDetail` and `splitDetail` change from `{ user: User, amount: number }` to `{ personId: string, personType: 'user' | 'virtual', amount: number }`. The full person object is resolved at read time via the account book's people list.

Alternative: embed the full Person snapshot in each transaction (current approach with User). Rejected because it creates stale data risk when a virtual user is renamed.

### receivedByUserId → receivedByPersonId

The `receivedByUserId: string | null` field is renamed to `receivedByPersonId: string | null` to accept any Person. This is a **BREAKING** schema change requiring a data migration.

### New peopleStore scoped to active account book

A `peopleStore` provides the combined list of registered users (from `userIds`) and virtual users (from `virtualUsers`) for the active account book. The transaction form and account book settings both consume this store.

## Risks / Trade-offs

- [BREAKING schema change] Existing transactions store a full `User` object in `paidByDetail`/`splitDetail` → Mitigation: write a one-time Dexie migration that converts embedded User objects to `{ personId: user.id, personType: 'user', amount }`.
- [UI complexity] Transaction form must load the people list before rendering payer/participant pickers → Mitigation: eagerly load account book people when the active account book changes.
- [Naming collision] `personId` is ambiguous when `personType` is `'user'` and a real userId exists → Mitigation: `personId` always refers to the canonical user `id` for registered users, or the `VirtualUser.id` (uuid) for virtual users.

## Migration Plan

1. Deploy new schema with `VirtualUser` entity and updated `AccountBook` / `Transaction` schemas.
2. Run migration on app startup: iterate all transactions, convert `paidByDetail[].user` → `{ personId, personType: 'user', amount }` and `splitDetail[].user` → same pattern.
3. Rename `receivedByUserId` → `receivedByPersonId` in migration.
4. No rollback needed for local-only Phase 1 (data lives in IndexedDB on device).

## Open Questions

- Should VirtualUsers have an optional `email` field for future invite flows? → Deferred to a later change.
- Should the People list UI support drag-to-reorder? → Out of scope for this change.
