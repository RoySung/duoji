## Why

The account book switcher is currently a horizontal pill-button row embedded inside the account book page, making it invisible on other pages. Moving it to a persistent header gives users one-click access to switch account books from anywhere in the app.

## What Changes

- Add a top `Header` component to the global layout with app title on the left and an account book dropdown menu on the right
- Replace `AccountBookSwitch` (horizontal pill row) with `AccountBookMenu` (dropdown trigger + popover list)
- Remove the inline account book switcher from `pages/account-books/[id]/index.tsx`
- Delete `AccountBookSwitch.tsx` (superseded by `AccountBookMenu`)
- Adjust `<main>` content area height to account for the new header (56 px)

## Capabilities

### New Capabilities

- `account-book-header-menu`: Persistent header with account book dropdown menu for switching between account books from any page

### Modified Capabilities

- `app-shell-navigation`: The app shell now includes a top header bar in addition to the bottom navigation bar

## Impact

- Affected specs: `app-shell-navigation` (header added to shell), new `account-book-header-menu`
- Affected code:
  - `apps/web/src/components/layout/layout.tsx`
  - `apps/web/src/components/layout/header.tsx` (new)
  - `apps/web/src/components/accountBook/AccountBookMenu.tsx` (new)
  - `apps/web/src/components/accountBook/AccountBookSwitch.tsx` (deleted)
  - `apps/web/src/pages/account-books/[id]/index.tsx`
