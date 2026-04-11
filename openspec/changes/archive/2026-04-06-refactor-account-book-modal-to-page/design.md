## Context

Account book create and edit currently uses `AccountBookFormModal`, an overlay that opens inline in multiple places:
- `AccountBookMenu` (drawer in the app header) — "Edit" and "New account book" buttons
- `AccountBookSettingsPage` (`/settings/account-books`) — "View settings" and "New account book" buttons
- `pages/index.tsx` — shown when no account books exist and the user starts creation

The `/settings` page has an "Account books" button that navigates to `/settings/account-books` (the `AccountBookSettingsPage`). The `AccountBookFormModal` holds all create/edit/delete logic and category linking.

A previous change (`pageify-account-book-settings-flow`) had implemented page-based routes under `/settings/account-books/new` and `/settings/account-books/[id]/`, but those pages were deleted and the code reverted to the modal approach.

## Goals / Non-Goals

**Goals:**

- Replace `AccountBookFormModal` with two dedicated Next.js pages:
  - `/account-books/new` for creating an account book
  - `/account-books/[id]/settings` for editing an existing account book
- Update all call sites to navigate (`router.push`) to these pages instead of opening a modal
- Remove the "Account books" section from `/settings.tsx`
- Remove `/settings/account-books.tsx` and `AccountBookSettingsPage` as they become redundant
- Delete `AccountBookFormModal.tsx` after all usages are migrated

**Non-Goals:**

- Changing the form fields or business logic inside `AccountBookForm`
- Changing how categories or users are managed within the account book settings
- Redesigning the `AccountBookMenu` drawer beyond replacing modal open calls with navigation

## Decisions

### Page routes placed under /account-books/ instead of /settings/account-books/

The previous implementation used `/settings/account-books/new` and `/settings/account-books/[id]/`. These pages are now placed under `/account-books/` to match the existing pattern (`/account-books/[id]/`, `/account-books/[id]/settlement/`), keeping account-book-scoped routes co-located.

- `/account-books/new` — create form
- `/account-books/[id]/settings` — edit form (uses `settings` segment to avoid collision with the existing `/account-books/[id]/index.tsx` transaction view)

### AccountBookSettingsPage removed, not repurposed

`AccountBookSettingsPage` served as the list UI under `/settings/account-books`. With the settings entry removed, the page becomes unreachable. Users can switch and access account books via the `AccountBookMenu` drawer. Removing the page avoids dead code.

### AccountBookFormModal deleted after migration

All three call sites will be updated in a single pass. The modal file and its `AccountBookFormPage.tsx` dependency (if re-added) are removed after the migration is complete.

### Back navigation from pages

- From `/account-books/new` → back to `/account-books/[firstId]` or `/` if no account books exist
- From `/account-books/[id]/settings` → back to `/account-books/[id]`

The new pages reuse `AccountBookNavHeader` for consistent back navigation.

## Risks / Trade-offs

- [Risk] Existing bookmarks to `/settings/account-books` will 404 → Mitigation: This is a local-only app; no external links expected
- [Risk] `AccountBookMenu` currently closes the drawer before opening the modal; with page navigation the drawer closes naturally → No mitigation needed

## Migration Plan

1. Create `/account-books/new.tsx` page wrapping a `AccountBookCreatePage` component
2. Create `/account-books/[id]/settings.tsx` page wrapping a `AccountBookEditPage` component
3. Update `AccountBookMenu` — replace `openCreateModal`/`openEditModal` with `router.push`
4. Update `pages/index.tsx` — replace `AccountBookFormModal` usage with `router.push('/account-books/new')`
5. Remove `AccountBookSettingsPage`, `/settings/account-books.tsx`
6. Remove "Account books" section from `/settings.tsx`
7. Delete `AccountBookFormModal.tsx`
