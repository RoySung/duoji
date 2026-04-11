# account-books Specification

## Purpose

TBD - created by archiving change 'migrate-project-instructions-to-spectra'. Update Purpose after archive.

## Requirements

### Requirement: Users can manage personal account books

The system SHALL allow users to create, rename, edit, and delete private account books for personal expense tracking during Phase 1. The management interface SHALL split account book overview from account-book-specific editing, using a list page for navigation and dedicated settings pages for creating a new account book or editing an existing one. The `AccountBook` entity SHALL include a `virtualUsers` field storing embedded `VirtualUser` records scoped to that account book.

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
- **THEN** the system SHALL display that account book's current name, currency, description, and people list in an editable form

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
source: add-people-and-transaction-integration
updated: 2026-04-11
code:
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/stores/user/index.ts
  - apps/web/src/components/layout/navbar.tsx
  - .github/prompts/spectra-apply.prompt.md
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/mocks/user.ts
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - .github/skills/spectra-ingest/SKILL.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/pages/_app.tsx
  - apps/web/src/stores/user/userStore.ts
  - GEMINI.md
  - apps/web/package.json
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/jest.config.ts
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - .github/prompts/spectra-propose.prompt.md
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/components/TransactionModal/SplitDetailModal.tsx
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/entities/user.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - .github/prompts/spectra-ask.prompt.md
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - apps/web/src/entities/settlement.ts
  - apps/web/src/lib/dexie.ts
  - apps/web/src/stores/user/userStoreProvider.tsx
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/repositories/settlementRepo/index.ts
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/utils/settlementUtils.ts
  - AGENTS.md
  - .github/prompts/spectra-debug.prompt.md
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/pages/settings.tsx
  - apps/web/src/components/TransactionModal/PaidByDetailModal.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/stores/transaction/transactionStore.ts
  - CLAUDE.md
  - apps/web/src/entities/accountBook.ts
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/repositories/userRepo/index.ts
  - .github/skills/spectra-propose/SKILL.md
  - phase-1.todo.md
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/stores/transaction/index.ts
  - apps/web/.babelrc
  - apps/web/src/mocks/accountBook.ts
  - apps/web/src/repositories/userRepo/userLocalRepo.ts
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - .spectra.yaml
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/utils/accountBookUtils.ts
  - apps/web/next.config.js
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
tests:
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/userStore.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/settlement.spec.ts
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

---
### Requirement: Account book settings include a People management section

The system SHALL display a People section in the account book settings page that lists all current members (registered users and virtual users) and provides controls to add or remove virtual users.

#### Scenario: View people in account book settings

- **WHEN** a user opens an existing account book's settings page
- **THEN** the system SHALL display the list of registered members and virtual users associated with that account book

#### Scenario: Add a virtual user from settings

- **WHEN** a user submits a name in the Add Virtual User form within account book settings
- **THEN** the system SHALL create the virtual user and include them in the displayed people list

#### Scenario: Remove a virtual user from settings

- **WHEN** a user confirms removal of a virtual user in account book settings
- **THEN** the system SHALL remove that virtual user from the people list

<!-- @trace
source: add-people-and-transaction-integration
updated: 2026-04-11
code:
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/stores/user/index.ts
  - apps/web/src/components/layout/navbar.tsx
  - .github/prompts/spectra-apply.prompt.md
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/mocks/user.ts
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - .github/skills/spectra-ingest/SKILL.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/pages/_app.tsx
  - apps/web/src/stores/user/userStore.ts
  - GEMINI.md
  - apps/web/package.json
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/jest.config.ts
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - .github/prompts/spectra-propose.prompt.md
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/components/TransactionModal/SplitDetailModal.tsx
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/entities/user.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - .github/prompts/spectra-ask.prompt.md
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - apps/web/src/entities/settlement.ts
  - apps/web/src/lib/dexie.ts
  - apps/web/src/stores/user/userStoreProvider.tsx
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/repositories/settlementRepo/index.ts
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/utils/settlementUtils.ts
  - AGENTS.md
  - .github/prompts/spectra-debug.prompt.md
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/pages/settings.tsx
  - apps/web/src/components/TransactionModal/PaidByDetailModal.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/stores/transaction/transactionStore.ts
  - CLAUDE.md
  - apps/web/src/entities/accountBook.ts
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/repositories/userRepo/index.ts
  - .github/skills/spectra-propose/SKILL.md
  - phase-1.todo.md
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/stores/transaction/index.ts
  - apps/web/.babelrc
  - apps/web/src/mocks/accountBook.ts
  - apps/web/src/repositories/userRepo/userLocalRepo.ts
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - .spectra.yaml
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/utils/accountBookUtils.ts
  - apps/web/next.config.js
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
tests:
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/userStore.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/settlement.spec.ts
-->