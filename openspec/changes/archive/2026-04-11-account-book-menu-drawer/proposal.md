## Why

The current AccountBookMenu uses a dropdown, which has limited space for content and cannot accommodate the account book settings. Replacing it with a drawer provides a richer, more focused interaction surface that can host both account book switching and settings in one place.

## What Changes

- Replace the `Dropdown` in `AccountBookMenu` with a `Drawer` (slide-in panel)
- The drawer trigger remains the same button in the header
- Inside the drawer: list of account books for switching + inline account book settings (create, rename, delete)
- Remove the navigation to `/settings/account-books` from the drawer's "New account book" action — create flow now lives inside the drawer

## Capabilities

### New Capabilities

- `account-book-drawer`: A drawer panel triggered from the header that combines account book switching and settings management in a single overlay

### Modified Capabilities

- `app-shell-navigation`: The header's AccountBookMenu interaction changes from dropdown to drawer

## Impact

- Affected specs: `account-book-drawer` (new), `app-shell-navigation` (modified)
- Affected code:
  - `apps/web/src/components/accountBook/AccountBookMenu.tsx` — replace Dropdown with Drawer
  - `apps/web/src/components/layout/header.tsx` — minor update if needed
  - `apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx` — extract reusable inner content for drawer use
