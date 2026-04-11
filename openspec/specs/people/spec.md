# people Specification

## Purpose

TBD - created by archiving change 'add-people-and-transaction-integration'. Update Purpose after archive.

## Requirements

### Requirement: Account books support a people list with registered and virtual users

The system SHALL represent participants in an account book as a `Person` discriminated union: either a registered `User` (type: `'user'`) or a `VirtualUser` (type: `'virtual'`). A `VirtualUser` SHALL have an `id`, `name`, `accountBookId`, `createdAt`, and `updatedAt`. The combined people list for an account book SHALL be accessible through a `peopleStore` that merges registered `userIds` with `virtualUsers`.

#### Scenario: Retrieve people list for an account book

- **WHEN** the active account book changes
- **THEN** the system SHALL load and expose the merged list of registered users and virtual users for that account book


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
### Requirement: Users can create a virtual user in an account book

The system SHALL allow users to add a named virtual participant to an account book's people list without requiring that person to have a registered account.

#### Scenario: Create a virtual user

- **WHEN** a user submits a valid name for a new virtual user in the account book settings
- **THEN** the system SHALL create a `VirtualUser` record scoped to that account book and include it in the people list


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
### Requirement: Users can rename a virtual user

The system SHALL allow users to update the name of an existing virtual user.

#### Scenario: Rename a virtual user

- **WHEN** a user submits a new name for an existing virtual user
- **THEN** the system SHALL persist the updated name and reflect it in the people list


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
### Requirement: Users can remove a virtual user from an account book

The system SHALL allow users to remove a virtual user from an account book's people list.

#### Scenario: Remove a virtual user

- **WHEN** a user confirms removal of a virtual user from the account book settings
- **THEN** the system SHALL delete the virtual user from the account book's `virtualUsers` list

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