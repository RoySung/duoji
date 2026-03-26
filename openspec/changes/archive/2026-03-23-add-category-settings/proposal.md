## Why

Each account book should allow users to customize its own category structure, but currently there is no UI to manage categories after they are seeded. Users are locked into the default category set with no way to add, rename, or remove categories.

## What Changes

- Add a Category Settings page per account book (`/settings/account-books/[id]/categories`)
- Add a navigation entry point from each account book card in Account Books Settings
- Display root categories as expandable accordion groups with their sub-categories
- Allow users to add new root category groups and sub-categories
- Add a centralized icon map at `src/constants/categoryIcons.ts` to maintain all available Lucide icons used in category management
- Add CRUD mutation actions (`addCategory`, `updateCategory`, `deleteCategory`) to the category store

## Capabilities

### New Capabilities

- `category-settings-ui`: Per-account-book category management page with two-level hierarchy (root group → sub-category), expandable accordion layout, and add-category flows

### Modified Capabilities

- `categories`: Add requirement scenarios for managing categories within an account book setting (add, view by group)
- `category-store`: Add CRUD mutation actions spec (addCategory, updateCategory, deleteCategory)

## Impact

- Affected specs: `categories`, `category-store`
- Affected code:
  - `apps/web/src/constants/categoryIcons.ts` (new — centralized icon map)
  - `apps/web/src/mocks/category.ts` (refactor to use icon map keys)
  - `apps/web/src/components/categorySettings/CategorySettingsPage.tsx` (new)
  - `apps/web/src/components/categorySettings/CategoryGroupItem.tsx` (new)
  - `apps/web/src/components/categorySettings/SubCategoryItem.tsx` (new)
  - `apps/web/src/components/categorySettings/AddCategoryModal.tsx` (new)
  - `apps/web/src/pages/settings/account-books/[id]/categories.tsx` (new)
  - `apps/web/src/stores/category/categoryStore.ts`
  - `apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx`
