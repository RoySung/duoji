## 1. Schema & Data Layer

- [x] 1.1 Categories carry a sortOrder field for display ordering — add sortOrder field on Category entity: add `sortOrder?: number` to the `Category` type and `CategorySchema` in `apps/web/src/entities/category.ts`
- [x] 1.2 Bump Dexie to version 3 with sortOrder index: add `version(3)` to `apps/web/src/lib/dexie.ts` with `'&id, name, type, parentId, accountBookId, sortOrder'`
- [x] 1.3 Sort by sortOrder in repository: update `findByAccountBookId` in `apps/web/src/repositories/categoryRepo/categoryLocalRepo.ts` to return categories sorted by `sortOrder` ascending (categories without sortOrder sort to end)
- [x] 1.4 Category store assigns sortOrder when seeding and adding categories: update `seedDefaultCategories` in `apps/web/src/stores/category/categoryStore.ts` to assign `sortOrder` equal to the template array index; update `addCategory` to append with `sortOrder` higher than existing max in the same parent scope
- [x] 1.5 Category store returns categories sorted by sortOrder: verify that after `findByAccountBookId` is updated, the store state reflects sorted order on initialize

## 2. AddCategoryModal Extended with Edit Mode

- [x] 2.1 AddCategoryModal extended with edit mode: add `mode?: 'add' | 'edit'` and `initialValues?: { name: string; iconKey: CategoryIconKey }` props; pre-fill form fields in edit mode; hide type selector in edit mode; change title and submit button label (`"Edit Category"` / `"Save"`) — in `apps/web/src/components/categorySettings/AddCategoryModal.tsx`

## 3. DeleteConfirmModal as a Separate Component

- [x] 3.1 DeleteConfirmModal as a separate component: create `apps/web/src/components/categorySettings/DeleteConfirmModal.tsx` with props `isOpen`, `categoryName`, `subCount: number`, `onConfirm`, `onClose`; display sub-category cascade warning when `subCount > 0`; style confirm button as danger color

## 4. SubCategoryItem — Actions and Drag Handle

- [x] 4.1 Users can reorder categories via drag-and-drop (sub-category): add drag handle icon (`PiDotsSixVerticalBold`) on left side of `SubCategoryItem` — `apps/web/src/components/categorySettings/SubCategoryItem.tsx`
- [x] 4.2 Users can edit the name and icon of an existing category (sub): add `onEdit: () => void` prop and edit button (pencil icon) to `SubCategoryItem`
- [x] 4.3 Users can delete a category from the Category Settings page (sub): add `onDelete: () => void` prop and delete button (trash icon) to `SubCategoryItem`

## 5. CategoryGroupItem — Actions, Drag Handle, and Sub-Category Reorder

- [x] 5.1 Users can reorder categories via drag-and-drop (root): add drag handle icon (`PiDotsSixVerticalBold`) on left side of `CategoryGroupItem` header row — `apps/web/src/components/categorySettings/CategoryGroupItem.tsx`
- [x] 5.2 Users can edit the name and icon of an existing category (root group): add `onEdit: () => void` prop and edit button to `CategoryGroupItem`
- [x] 5.3 Users can delete a category from the Category Settings page (root group): add `onDelete: () => void` prop and delete button to `CategoryGroupItem`
- [x] 5.4 Framer Motion Reorder for drag-and-drop (sub-categories): wrap sub-category list with `Reorder.Group axis="y"` and each `SubCategoryItem` with `Reorder.Item`; add `onReorderSubs: (newOrder: Category[]) => void` prop to `CategoryGroupItem`

## 6. CategorySettingsPage — Draft Mode

- [x] 6.1 Draft state lives in CategorySettingsPage: add `draftCategories`, `isDirty`, `addedIds`, `editedIds`, `deletedIds` local state to `CategorySettingsPage`; sync from store when `!isDirty`
- [x] 6.2 Category Settings page uses draft mode for all mutations (add): replace direct `store.addCategory` call with `draftAdd` that generates `draft__` prefixed ID and stages in draft state; set `isDirty = true`
- [x] 6.3 Category Settings page uses draft mode for all mutations (edit): implement `draftEdit` that mutates `draftCategories` and adds to `editedIds`; set `isDirty = true`
- [x] 6.4 Category Settings page uses draft mode for all mutations (delete): implement `draftDelete` that removes the item and all children from `draftCategories` and adds their IDs to `deletedIds`; set `isDirty = true`
- [x] 6.5 Users can view categories organized by root groups for a specific account book (sorted by sortOrder) — Framer Motion Reorder for drag-and-drop (root groups): wrap root group lists per type with `Reorder.Group axis="y"` and each `CategoryGroupItem` with `Reorder.Item`; implement `draftReorder` to assign new `sortOrder` values and add to `editedIds`; implement `draftReorderSubs` for sub-category reorder within a group
- [x] 6.6 Topological save order: implement `handleSave` that applies changes in order — delete non-draft IDs → add root groups (record idMapping) → add sub-categories (resolve draft parentId) → update editedIds excluding addedIds; call `store.initialize` after completion; reset draft state
- [x] 6.7 Category Settings page uses draft mode for all mutations (discard): Discard button resets `draftCategories` from store state and sets `isDirty = false`
- [x] 6.8 Wire edit/delete modals: connect `AddCategoryModal` in edit mode for both root and sub edits; connect `DeleteConfirmModal` for delete actions; set correct `parentForModal` / `categoryForModal` state
- [x] 6.9 Export DeleteConfirmModal: add `DeleteConfirmModal` export to `apps/web/src/components/categorySettings/index.ts`

## 7. Verification

- [ ] 7.1 Verify schema migration: open app in browser, confirm existing categories render correctly after Dexie v3 migration
- [ ] 7.2 Verify draft mode add+discard: add a group → confirm Save bar appears → Discard → confirm no DB change
- [ ] 7.3 Verify draft mode add+save: add a group → Save → reload page → confirm group persists
- [ ] 7.4 Verify users can edit the name and icon of an existing category: edit a root and sub → Save → confirm name/icon updated
- [ ] 7.5 Verify users can delete a category from the Category Settings page: delete sub → Save → confirm removed; delete root with subs → confirm modal warns → Save → confirm cascade removed
- [ ] 7.6 Verify sortOrder persistence: drag reorder roots and subs → Save → reload → confirm display order preserved
- [ ] 7.7 Verify topological save with draft parent: add root → add sub under draft root → Save → confirm both exist with correct parentId
- [ ] 7.8 Run existing tests: `pnpm nx test web` — all existing tests must pass
