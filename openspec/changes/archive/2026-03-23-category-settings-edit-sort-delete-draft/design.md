## Context

The Category Settings page (`CategorySettingsPage`) currently supports only adding new categories. Users interact with root groups (`CategoryGroupItem`) and sub-categories (`SubCategoryItem`) but cannot edit or delete them, nor reorder them. Every add action writes immediately to IndexedDB via the category store. There is no "review before saving" mechanism.

The `Category` entity uses a flat model: `{ id, name, imageUrl, description, type, parentId, accountBookId }`. It is stored in Dexie and does not carry an ordering hint. The project already includes `framer-motion` (v12) and HeroUI.

## Goals / Non-Goals

**Goals:**

- Edit category name and icon for both root groups and sub-categories
- Delete categories (root group deletion cascades to sub-categories via existing `CategoryLocalRepo.delete`)
- Drag-to-reorder root groups within a type (expense/income) and sub-categories within a root group
- Persist display order via a `sortOrder: number` field on `Category`
- Draft mode: all mutations are staged in page-local state; a sticky Save/Discard bar appears when dirty; only on Save are the changes written to DB in topological order
- Confirmation modal before deleting a root group that has sub-categories

**Non-Goals:**

- Editing the `type` field of an existing category
- Multi-level nesting beyond the existing two-level model (root → sub)
- Drag-to-move a sub-category to a different root group (reorder within same parent only)
- Undo/redo history

## Decisions

### Draft state lives in CategorySettingsPage

The draft state (`draftCategories`, `isDirty`, `addedIds`, `editedIds`, `deletedIds`) lives entirely in `CategorySettingsPage` local state — not in the Zustand store.

Rationale: Category settings is a standalone management page. Polluting the global store with draft/pending state would complicate the transaction flow (which reads categories from the store). A local state approach keeps the pattern simple and mirrors how form pages handle unsaved changes.

### sortOrder field on Category entity

`sortOrder?: number` is added as an optional field. Default ordering falls back to insertion order (undefined sorts last). Dexie schema bumped to v3 to add the index. `findByAccountBookId` sorts ascending by `sortOrder`, with `undefined` sorted to the end.

Alternative considered: store ordering in a separate `categoryOrder` table keyed by accountBookId. Rejected — overkill for the two-level flat model; adding a field to the entity is simpler and keeps reads O(1).

### Framer Motion Reorder for drag-and-drop

`framer-motion` is already installed (v12). `Reorder.Group` + `Reorder.Item` provide drag-to-reorder with minimal boilerplate and no additional dependency. When the user finishes dragging, `onReorder` fires with the new array order; the page draft-handler assigns new `sortOrder` values (0, 1, 2, …) to the reordered items and marks them edited.

Alternative considered: `@dnd-kit/sortable`. More flexible but adds a new dependency; framer-motion already covers the use case.

### Topological save order

On Save, operations are applied in this order to satisfy referential constraints:
1. Delete non-draft IDs in `deletedIds` (cascades sub-categories in DB)
2. Add root groups (parentId null) from `addedIds`; record `draftId → realId` mapping
3. Add sub-categories from `addedIds`, substituting `draft__` parentId with real ID
4. Update (name/icon/sortOrder) for IDs in `editedIds` that are NOT in `addedIds`

This order ensures sub-categories always reference already-written parent IDs.

### AddCategoryModal extended with edit mode

The existing modal is extended with `mode?: 'add' | 'edit'` and `initialValues?: { name: string; iconKey: CategoryIconKey }` props. In edit mode the type field is hidden (type cannot be changed) and the submit button reads "Save". This avoids duplicating the icon selector and form validation logic.

### DeleteConfirmModal as a separate component

Delete confirmation is a distinct concern (sub-count warning, dangerous action color) worth isolating into `DeleteConfirmModal.tsx` rather than adding conditional logic to an existing sheet.

## Risks / Trade-offs

- [Risk] Concurrent tab usage: two browser tabs editing the same account book concurrently may conflict. → Mitigation: out of scope for Phase 1 (single-user local app, single tab expected).
- [Risk] Draft IDs (`draft__${uuid}`) clashing with real IDs on Save. → Mitigation: real IDs generated in `addCategory` use `Date.now()-random` pattern; `draft__` prefix is structurally distinct.
- [Risk] Dexie v3 migration on first open if user has existing v2 data. → Mitigation: Dexie incremental versioning handles this automatically; `sortOrder` is optional so existing records stay valid and sort to end.
- [Risk] framer-motion Reorder conflicts with HeroUI Tab scroll behaviour on mobile. → Mitigation: drag is axis="y" only; tab scroll is horizontal — no conflict expected.

## Migration Plan

1. `dexie.ts` version(3): add `sortOrder` index — automatic on next DB open
2. Existing categories without `sortOrder` remain valid (field is optional); they sort after seeded defaults that carry explicit `sortOrder` from `seedDefaultCategories`
3. No server migration (local-only persistence)
