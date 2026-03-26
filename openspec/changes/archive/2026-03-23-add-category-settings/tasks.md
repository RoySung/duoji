## 1. Icon Constants

- [x] 1.1 Centralize icons in a typed constants map: create `apps/web/src/constants/categoryIcons.ts` exporting `CategoryIconKey` union type, `CATEGORY_ICONS` record mapping each key to its Iconify URL, and `DEFAULT_CATEGORY_ICON_KEY`
- [x] 1.2 Refactor `apps/web/src/mocks/category.ts` to import and use `CATEGORY_ICONS[key]` lookups instead of raw Iconify URL strings

## 2. Category Store CRUD Mutations

- [x] 2.1 The category store exposes CRUD mutations for managing categories: add `addCategory(payload: Omit<Category, 'id'>): Promise<Category>` action to `CategoryStoreActions` in `categoryStore.ts`, calling `categoryRepo.create` and reloading state
- [x] 2.2 Add `updateCategory(id: string, changes: Partial<Category>): Promise<boolean>` action to `CategoryStoreActions`, calling `categoryRepo.update` and reloading state
- [x] 2.3 Add `deleteCategory(id: string): Promise<boolean>` action to `CategoryStoreActions`, calling `categoryRepo.delete` and reloading state

## 3. Route and Navigation

- [x] 3.1 Route structure: sub-page under account books — create `apps/web/src/pages/settings/account-books/[id]/categories.tsx` dynamic page that reads `id` from router and renders `CategorySettingsPage`
- [x] 3.2 Account book card navigation: add "Category Settings" button/link to each account book card in `AccountBookSettingsPage.tsx` using `next/link` with href `/settings/account-books/{id}/categories` (requirement: Users can navigate to category settings from an account book card)

## 4. Category Settings Components

- [x] 4.1 Component structure: feature folder — create `apps/web/src/components/categorySettings/` folder with `index.ts` barrel export
- [x] 4.2 Create `SubCategoryItem.tsx`: row component showing icon and name for a single sub-category
- [x] 4.3 Create `CategoryGroupItem.tsx`: accordion row for a root category showing icon, name, sub-count badge, expand chevron; expanded state reveals sub-category list (SubCategoryItem) and "ADD SUB-CATEGORY" dashed button (requirement: Users can view categories organized by root groups for a specific account book)
- [x] 4.4 Create `AddCategoryModal.tsx`: HeroUI Modal with name input and icon key selector; when adding a sub-category, type is inherited from parent; validates that name is non-empty
- [x] 4.5 Create `CategorySettingsPage.tsx`: page layout with back-navigation header, account book name, subtitle, list of root CategoryGroupItem components, and "ADD NEW GROUP" dashed button at bottom; initializes category store with `accountBookId` from route (requirement: Users can manage categories within an account book)

## 5. Wire Add Flows

- [x] 5.1 Wire "ADD NEW GROUP" button in `CategorySettingsPage` to open `AddCategoryModal` with no parent, then call `addCategory` with `parentId: null` and selected `type`; refresh list on success (requirement: Users can add a new root category group to an account book)
- [x] 5.2 Wire "ADD SUB-CATEGORY" button in `CategoryGroupItem` to open `AddCategoryModal` with parent pre-filled, then call `addCategory` with parent's `id` and `type`; refresh list on success (requirement: Users can add a sub-category to an existing root group)
