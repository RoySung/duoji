## 1. Create new account book page

- [x] 1.1 Create `/account-books/new.tsx` page route (page routes placed under /account-books/ instead of /settings/account-books/) and an `AccountBookCreatePage` component that wraps `AccountBookForm` for creating a personal account book
- [x] 1.2 Implement back navigation from pages — back control on new account book page navigates back without creating an account book
- [x] 1.3 After successful creation, navigate to `/account-books/[id]/settings` to support the open the new account book page and create a personal account book flows

## 2. Create account book settings (edit) page

- [x] 2.1 Create `/account-books/[id]/settings.tsx` page route (page routes placed under /account-books/ instead of /settings/account-books/) and an `AccountBookEditPage` component for editing an existing account book
- [x] 2.2 Load account book data from store and populate the form to support open an existing account book settings page, rename a personal account book, and update account book details scenarios
- [x] 2.3 Implement back navigation from the settings page — back control navigates to `/account-books/[id]`
- [x] 2.4 Wire up delete confirmation to support the delete a personal account book scenario — on deletion, navigate away from the deleted account book

## 3. Update AccountBookMenu call sites

- [x] 3.1 Update `AccountBookMenu` — replace `openEditModal` with `router.push('/account-books/[id]/settings')` so users can manage personal account books from the drawer (open an existing account book settings page)
- [x] 3.2 Update `AccountBookMenu` — replace `openCreateModal` with `router.push('/account-books/new')` so users can manage personal account books from the drawer (open the new account book page)
- [x] 3.3 Remove `AccountBookFormModal` import and state from `AccountBookMenu`

## 4. Update index.tsx call site

- [x] 4.1 Update `pages/index.tsx` — replace `AccountBookFormModal` usage with `router.push('/account-books/new')` for the empty-state create flow

## 5. Remove /settings page entry and AccountBookSettingsPage

- [x] 5.1 Remove the "Account books" button section from `/settings.tsx` so the /settings page provides an entry to account book management no longer exists (removed)
- [x] 5.2 Remove `AccountBookSettingsPage` component and its route `/settings/account-books.tsx` (AccountBookSettingsPage removed, not repurposed)

## 6. Delete AccountBookFormModal

- [x] 6.1 Delete `AccountBookFormModal.tsx` after all usages are migrated (AccountBookFormModal deleted after migration)
- [x] 6.2 Verify no remaining imports of `AccountBookFormModal` exist in the codebase
