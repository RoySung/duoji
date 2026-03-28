## Why

The current account-book management experience still relies on modal-based create and edit flows, which makes longer form work feel cramped and weakens navigation clarity inside Settings. Category Settings entry is also tied to the list-card action, instead of living inside the selected account book's own settings context.

## What Changes

- Replace modal-based account book create and edit flows with dedicated settings pages for creating a new account book and editing an existing account book.
- Keep the account book list page focused on overview and navigation, with clear entry points into per-account-book settings.
- Move the Category Settings entry from the account-book list card actions into the account book detail/settings page for that specific account book.
- Define page titles, back navigation, and empty/loading behavior for the new nested settings routes.
- Update UI verification coverage for page-based account book management and the revised category-settings entry point.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `account-books`: Change account book management from modal-based create/edit interactions to dedicated settings pages and clarify the list-versus-detail responsibilities.
- `category-settings-ui`: Change the navigation entry point so Category Settings is accessed from the selected account book's settings page instead of directly from the list card.
- `app-shell-navigation`: Extend nested settings navigation requirements for account book create/edit pages and account-book-scoped back navigation.

## Impact

- Affected specs: `account-books`, `category-settings-ui`, `app-shell-navigation`
- Affected code: `apps/web/src/pages/settings/account-books.tsx`, `apps/web/src/pages/settings/account-books/[id]/**`, `apps/web/src/pages/settings/account-books/new.tsx`, `apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx`, `apps/web/src/components/accountBookSettings/AccountBookFormModal.tsx`, `apps/web/src/components/accountBookSettings/`, `apps/web/specs/accountBookSettings.spec.tsx`, `apps/web/specs/category.spec.ts`, `apps/web/specs/homeTransactions.spec.tsx`