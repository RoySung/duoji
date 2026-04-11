## Why

The current account book create/edit flow uses a modal (`AccountBookFormModal`), which limits screen space and navigation clarity. Moving to dedicated pages provides more room for form content, clearer back-navigation, and a consistent pattern with other settings pages. Additionally, the Account Books entry in the `/settings` page becomes redundant once users can access account book management directly from the AccountBookMenu drawer.

## What Changes

- Replace `AccountBookFormModal` with two dedicated pages:
  - `/account-books/new` — create a new account book
  - `/account-books/[id]/settings` — edit an existing account book
- Update all `AccountBookFormModal` call sites (`AccountBookMenu`, `AccountBookSettingsPage`, `pages/index.tsx`) to use `router.push()` instead of opening a modal
- Remove the "Account books" entry (button linking to `/settings/account-books`) from the `/settings` page
- Remove or simplify `AccountBookSettingsPage` and its route `/settings/account-books` since account book management is now accessed via the AccountBookMenu drawer and dedicated pages
- Delete `AccountBookFormModal.tsx` once all usages are migrated

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `account-books`: Account book create/edit navigation changes from modal to dedicated pages; the `/settings/account-books` list route is removed

## Impact

- Affected specs: `account-books`
- Affected code:
  - `apps/web/src/components/accountBookSettings/AccountBookFormModal.tsx` — deleted
  - `apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx` — removed or simplified
  - `apps/web/src/components/accountBook/AccountBookMenu.tsx` — replace modal open with `router.push`
  - `apps/web/src/pages/index.tsx` — replace modal open with `router.push`
  - `apps/web/src/pages/settings.tsx` — remove Account Books section
  - `apps/web/src/pages/settings/account-books.tsx` — removed
  - `apps/web/src/pages/account-books/new.tsx` — new page (create)
  - `apps/web/src/pages/account-books/[id]/settings.tsx` — new page (edit)
