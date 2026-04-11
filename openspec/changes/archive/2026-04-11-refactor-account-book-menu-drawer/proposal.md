## Why

The `AccountBookMenu` drawer in the app header currently supports inline rename and delete of account books, duplicating CRUD functionality that already exists in the settings pages. This creates maintenance burden and inconsistent UX — the drawer UI style does not match the polished card layout used in `AccountBookSettingsPage`.

## What Changes

- **Remove** inline rename (input field + confirm/cancel) from the drawer list
- **Remove** inline delete (danger card + confirm/cancel) from the drawer list
- **Remove** inline create (input field in footer) from the drawer
- **Modify** each account book list item to a card-style layout: name, currency chip, description (if present), active state highlight
- **Add** "View settings" button per card → navigates to `/settings/account-books/[id]`
- **Add** "Switch" button per non-active card → switches the active account book and closes drawer
- **Modify** footer "New account book" button → navigates to `/settings/account-books/new` instead of showing inline input

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `app-shell-navigation`: The account book menu drawer UI changes — CRUD actions are removed from the drawer and delegated to the settings pages; switching and navigation behavior is preserved

## Impact

- Affected specs: `app-shell-navigation`
- Affected code: `apps/web/src/components/accountBook/AccountBookMenu.tsx`
