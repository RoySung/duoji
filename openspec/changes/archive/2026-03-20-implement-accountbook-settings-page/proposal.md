## Why

Approved specs already require personal account books, one current account book context, and a visible current selection, but the implementation direction still treats account-book selection as part of settings. That mixes account-book management with operational context selection, which makes the store naming misleading and places the selection control in the wrong part of the app.

## What Changes

- Add a settings landing page and a nested account-book settings page at `/settings/account-books`.
- Keep the settings-based account-book management interface focused on create, edit, and delete flows instead of current-account-book selection.
- Clarify account-book selection as a current account book context rather than an active settings-owned state.
- Add a simple current-account-book selector to the home page and default it to the first available account book after bootstrap.
- Expand account-book editing coverage in the approved behavior to include name, currency, and description updates from the settings interface.
- Apply shared app-shell page title and contextual back navigation to the nested account-book settings page.
- Add UI verification for the home-page selector, nested shell behavior, and account-book CRUD interactions.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `account-books`: Separate current-account-book selection from settings-based account-book management and clarify current-account-book behavior.
- `app-shell-navigation`: Clarify nested settings page title and back-navigation behavior for account-book management.

## Impact

- Affected specs: `account-books`, `app-shell-navigation`
- Affected code: `apps/web/src/pages/index.tsx`, `apps/web/src/pages/settings.tsx`, `apps/web/src/pages/settings/**`, `apps/web/src/components/layout/`, `apps/web/src/stores/accountBook/`, `apps/web/src/entities/accountBook.ts`, `apps/web/src/components/TransactionModal/ExpenseForm.tsx`, `apps/web/specs/`