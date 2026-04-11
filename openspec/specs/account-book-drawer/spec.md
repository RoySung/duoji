# account-book-drawer Specification

## Purpose

TBD - created by archiving change 'account-book-menu-drawer'. Update Purpose after archive.

## Requirements

### Requirement: The account book menu opens as a drawer

The system SHALL provide a drawer panel that opens from the right side of the screen when the user activates the account book menu button in the header.

#### Scenario: Open the account book drawer

- **WHEN** a user taps the account book menu button in the header
- **THEN** the system SHALL open a drawer panel from the right side of the screen

#### Scenario: Close the account book drawer

- **WHEN** a user taps the backdrop or a close control while the drawer is open
- **THEN** the system SHALL close the drawer panel


<!-- @trace
source: account-book-menu-drawer
updated: 2026-04-11
code:
  - CLAUDE.md
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/jest.config.ts
  - .github/skills/spectra-ingest/SKILL.md
  - AGENTS.md
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/stores/transaction/transactionStore.ts
  - .spectra.yaml
  - .github/prompts/spectra-debug.prompt.md
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/pages/settings/account-books/new.tsx
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - .github/skills/spectra-propose/SKILL.md
  - GEMINI.md
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/next.config.js
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/repositories/settlementRepo/index.ts
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/package.json
  - apps/web/src/pages/_app.tsx
  - .github/prompts/spectra-propose.prompt.md
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - .github/prompts/spectra-ask.prompt.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/entities/settlement.ts
  - apps/web/src/entities/transaction.ts
  - apps/web/src/pages/index.tsx
  - apps/web/.babelrc
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - .github/prompts/spectra-apply.prompt.md
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - apps/web/src/stores/transaction/index.ts
tests:
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/transaction.spec.ts
-->

---
### Requirement: The drawer lists all account books for switching

The drawer SHALL display all account books and allow the user to switch to any of them. The currently active account book SHALL be visually highlighted.

#### Scenario: View account books in drawer

- **WHEN** the drawer is open
- **THEN** the system SHALL list all account books with the active one visually distinguished

#### Scenario: Switch account book from drawer

- **WHEN** a user selects a different account book in the drawer
- **THEN** the system SHALL navigate to that account book's page and close the drawer


<!-- @trace
source: account-book-menu-drawer
updated: 2026-04-11
code:
  - CLAUDE.md
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/jest.config.ts
  - .github/skills/spectra-ingest/SKILL.md
  - AGENTS.md
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/stores/transaction/transactionStore.ts
  - .spectra.yaml
  - .github/prompts/spectra-debug.prompt.md
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/pages/settings/account-books/new.tsx
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - .github/skills/spectra-propose/SKILL.md
  - GEMINI.md
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/next.config.js
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/repositories/settlementRepo/index.ts
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/package.json
  - apps/web/src/pages/_app.tsx
  - .github/prompts/spectra-propose.prompt.md
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - .github/prompts/spectra-ask.prompt.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/entities/settlement.ts
  - apps/web/src/entities/transaction.ts
  - apps/web/src/pages/index.tsx
  - apps/web/.babelrc
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - .github/prompts/spectra-apply.prompt.md
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - apps/web/src/stores/transaction/index.ts
tests:
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/transaction.spec.ts
-->

---
### Requirement: The drawer provides inline account book management actions

The drawer SHALL allow users to create a new account book, rename an existing account book, and delete an existing account book without leaving the current page.

#### Scenario: Create a new account book from the drawer

- **WHEN** a user activates the "New account book" action in the drawer
- **THEN** the system SHALL present a way to enter a name and create a new account book

#### Scenario: Rename an account book from the drawer

- **WHEN** a user activates the rename action on an account book row in the drawer
- **THEN** the system SHALL allow the user to edit the name of that account book

#### Scenario: Delete an account book from the drawer

- **WHEN** a user activates the delete action on an account book row in the drawer
- **THEN** the system SHALL prompt for confirmation before deleting the account book

<!-- @trace
source: account-book-menu-drawer
updated: 2026-04-11
code:
  - CLAUDE.md
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/jest.config.ts
  - .github/skills/spectra-ingest/SKILL.md
  - AGENTS.md
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/stores/transaction/transactionStore.ts
  - .spectra.yaml
  - .github/prompts/spectra-debug.prompt.md
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/pages/settings/account-books/new.tsx
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - .github/skills/spectra-propose/SKILL.md
  - GEMINI.md
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/next.config.js
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/repositories/settlementRepo/index.ts
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/package.json
  - apps/web/src/pages/_app.tsx
  - .github/prompts/spectra-propose.prompt.md
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - .github/prompts/spectra-ask.prompt.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/entities/settlement.ts
  - apps/web/src/entities/transaction.ts
  - apps/web/src/pages/index.tsx
  - apps/web/.babelrc
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - .github/prompts/spectra-apply.prompt.md
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - apps/web/src/stores/transaction/index.ts
tests:
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/transaction.spec.ts
-->