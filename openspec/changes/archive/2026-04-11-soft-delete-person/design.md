## Context

The current `removeVirtualUser` action permanently deletes the virtual user from the `accountBook.virtualUsers` array. This causes data integrity problems: any existing transaction that references a deleted person's ID still holds the ID, but there is no matching person record to display — leading to broken or missing names in historical transaction views.

Only `VirtualUser` (not registered `User`) can be deleted from an account book in Phase 1, so soft-delete applies to virtual users only.

## Goals / Non-Goals

**Goals:**

- Preserve historical transaction display accuracy when a person is deleted
- Prevent deleted persons from appearing in new-transaction person selectors
- Allow removal-only interaction with deleted persons when editing old transactions
- Visual differentiation of deleted persons in transaction views

**Non-Goals:**

- Soft-delete for registered `User` accounts
- Undo / restore UI for deleted virtual users
- Server-side or cross-device sync considerations (Phase 1 is local-only)

## Decisions

### Add `deletedAt` to `VirtualUser` schema

`VirtualUserSchema` gains an optional `deletedAt: z.number().optional()` field. A virtual user is considered deleted when `deletedAt` is set to a Unix timestamp (ms).

**Alternative considered**: Hard delete + store deleted IDs in a separate table. Rejected — increases schema complexity and makes deletion undoable by accident.

### Store exposes `activePeople` and `allPeople`

`PeopleStore` adds a derived `activePeople` selector that filters out deleted virtual users. The existing `people` field becomes `allPeople` (including deleted ones) to support the edit-modal use case.

**Alternative considered**: Keep `people` as-is and filter at call sites. Rejected — leads to scattered filter logic and easy omissions.

### `softDeleteVirtualUser` replaces hard delete

The store action `removeVirtualUser` is renamed `softDeleteVirtualUser`. It sets `deletedAt = Date.now()` instead of filtering the record out. The record remains in `accountBook.virtualUsers`.

### Person selector context: create vs. edit

- **Create transaction**: person selectors draw from `activePeople` (deleted persons hidden entirely).
- **Edit transaction**: person selectors draw from `allPeople` but deleted persons are rendered as disabled + strikethrough and cannot be newly selected — they can only be deselected if already present on the transaction.

**Alternative considered**: Always show deleted persons but disable adding them. Rejected for create context — unnecessary noise for new records.

### Transaction list display

When rendering a person chip/name in `TransactionList`, check if the resolved `Person` has `deletedAt` set. If so, apply a `line-through` text style. The name is still displayed (no fallback to ID or placeholder).

## Risks / Trade-offs

- [Risk] Existing persisted data has no `deletedAt` field on virtual users → Mitigation: `deletedAt` is `optional`, so old records remain valid; undefined means active.
- [Risk] Edit modal complexity increases — deleted person must be distinguishable in the selector → Mitigation: disabled row with strikethrough visual and tooltip label.

## Migration Plan

No schema migration needed — `deletedAt` is additive and optional. Existing data continues to work without changes.
