# account-books Specification

## Purpose

TBD - created by archiving change 'migrate-project-instructions-to-spectra'. Update Purpose after archive.

## Requirements

### Requirement: Users can manage personal account books

The system SHALL allow users to create, rename, edit, and delete private account books for personal expense tracking during Phase 1. The management interface SHALL split account book overview from account-book-specific editing, using a list page for navigation and dedicated settings pages for creating a new account book or editing an existing one.

#### Scenario: Open the account book management interface

- **WHEN** a user opens the account book settings page
- **THEN** the system SHALL display the available personal account books and controls to create a new account book or open an existing account book's settings page

#### Scenario: Open the new account book page

- **WHEN** a user starts the create flow from the account book settings page
- **THEN** the system SHALL navigate to a dedicated new account book settings page with an empty account book form

#### Scenario: Create a personal account book

- **WHEN** a user submits valid details on the new account book settings page
- **THEN** the system SHALL create the account book and make it available for selection

#### Scenario: Open an existing account book settings page

- **WHEN** a user opens the settings page for an existing account book
- **THEN** the system SHALL display that account book's current name, currency, and description in an editable form

#### Scenario: Rename a personal account book

- **WHEN** a user submits a valid new name on an existing account book's settings page
- **THEN** the system SHALL persist the renamed account book in the available account book list

#### Scenario: Update account book details

- **WHEN** a user submits valid changes to an existing personal account book's currency or description on its settings page
- **THEN** the system SHALL persist the updated currency and description

#### Scenario: Delete a personal account book

- **WHEN** a user confirms deletion from an existing account book's settings page
- **THEN** the system SHALL remove that account book from the available account book list


<!-- @trace
source: pageify-account-book-settings-flow
updated: 2026-03-28
code:
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormModal.tsx
  - apps/web/package.json
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/components/accountBookSettings/AccountBookForm.tsx
  - apps/web/src/constants/theme.ts
  - apps/web/tailwind.config.js
  - .impeccable.md
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/test-setup.ts
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/pages/styles.css
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/components/accountBookSettings/AccountBookNavHeader.tsx
  - apps/web/src/pages/_app.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/pages/_document.tsx
tests:
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
-->

---
### Requirement: The application maintains an active account book

The system SHALL maintain one current account book context for transaction creation, transaction listing, and account-book-scoped summaries. After local persistence initializes and personal account books become available, the system SHALL establish a current account book before the user performs account-book-scoped actions.

#### Scenario: Bootstrap the current account book on startup

- **WHEN** the application finishes loading persisted account books and at least one account book exists with no current selection
- **THEN** the system SHALL select the first available account book as the current context for subsequent account-book-scoped views

#### Scenario: Change the current account book from the home page

- **WHEN** a user selects a different account book from the home page selector
- **THEN** the system SHALL use the selected account book as the current context for subsequent account-book-scoped views

#### Scenario: Create the first current account book

- **WHEN** a user creates an account book while no current account book is selected
- **THEN** the system SHALL use the newly created account book as the current context

#### Scenario: Delete the current account book when another account book remains

- **WHEN** a user deletes the currently selected account book and at least one other account book remains
- **THEN** the system SHALL switch the current context to one of the remaining account books

#### Scenario: Delete the last current account book

- **WHEN** a user deletes the currently selected account book and no other account books remain
- **THEN** the system SHALL clear the current account book context until another account book becomes available

<!-- @trace
source: implement-accountbook-settings-page
updated: 2026-03-20
code:
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/utils/accountBookUtils.ts
  - apps/web/src/pages/styles.css
  - apps/web/src/pages/settings.tsx
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - apps/web/src/pages/_app.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormModal.tsx
  - apps/web/src/stores/accountBook/index.ts
tests:
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
-->

---
### Requirement: The account book list indicates the current selection

The system SHALL present an account-book selection interface and clearly indicate which account book is currently selected.

#### Scenario: View the account book selector

- **WHEN** a user opens the home page selector or another account-book selection interface
- **THEN** the system SHALL display the current account book distinctly from the other available account books

<!-- @trace
source: implement-accountbook-settings-page
updated: 2026-03-20
code:
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/utils/accountBookUtils.ts
  - apps/web/src/pages/styles.css
  - apps/web/src/pages/settings.tsx
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - apps/web/src/pages/_app.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormModal.tsx
  - apps/web/src/stores/accountBook/index.ts
tests:
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
-->