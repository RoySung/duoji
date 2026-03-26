## Why

The Category Settings page only supports adding categories. Users cannot edit names or icons, delete categories, or reorder them. All changes apply immediately with no review step — making accidental edits hard to recover from.

## What Changes

- Category items gain edit (name, icon) and delete actions directly on the settings page
- Root category groups and sub-categories can be reordered via drag-and-drop using framer-motion `Reorder`
- Sorting is persisted via a new `sortOrder` field on the `Category` entity (Dexie schema v3)
- A **draft mode** is introduced: all mutations (add, edit, delete, reorder) are staged locally; a Save/Discard sticky bar appears when the page has unsaved changes
- Deleting a root group with sub-categories requires explicit confirmation via a modal
- The `AddCategoryModal` is extended with an edit mode (`initialValues` + `mode: 'edit'`)
- A new `DeleteConfirmModal` component is introduced

## Capabilities

### New Capabilities

- `category-settings-edit-sort-delete`: Edit (name/icon), delete with cascade confirmation, and drag-to-reorder for category groups and sub-categories

### Modified Capabilities

- `category-settings-ui`: Draft mode — mutations are staged locally and committed only on explicit Save; adds item-level edit/delete/reorder actions
- `categories`: `sortOrder` field added to `Category` entity and persisted via `CategoryRepo`
- `category-store`: `seedDefaultCategories` and `addCategory` assign `sortOrder`; `findByAccountBookId` returns results sorted by `sortOrder` ASC

## Impact

- Affected specs: `category-settings-ui`, `categories`, `category-store`
- Affected code:
  - `apps/web/src/entities/category.ts`
  - `apps/web/src/lib/dexie.ts`
  - `apps/web/src/repositories/categoryRepo/categoryLocalRepo.ts`
  - `apps/web/src/stores/category/categoryStore.ts`
  - `apps/web/src/components/categorySettings/CategorySettingsPage.tsx`
  - `apps/web/src/components/categorySettings/CategoryGroupItem.tsx`
  - `apps/web/src/components/categorySettings/SubCategoryItem.tsx`
  - `apps/web/src/components/categorySettings/AddCategoryModal.tsx`
  - `apps/web/src/components/categorySettings/DeleteConfirmModal.tsx` (new)
  - `apps/web/src/components/categorySettings/index.ts`
