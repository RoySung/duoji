# transactions Specification

## Purpose

TBD - created by archiving change 'migrate-project-instructions-to-spectra'. Update Purpose after archive.

## Requirements

### Requirement: Users can record income and expense transactions

The system SHALL allow users to create transactions with a type, amount, date, category, note, and payment method within the active account book.

#### Scenario: Create an expense transaction

- **WHEN** a user submits a valid expense transaction form in the active account book
- **THEN** the system SHALL store the transaction and include it in the active account book transaction list

#### Scenario: Create an income transaction

- **WHEN** a user submits a valid income transaction form in the active account book
- **THEN** the system SHALL store the transaction and include it in the active account book transaction list


<!-- @trace
source: migrate-project-instructions-to-spectra
updated: 2026-03-18
code:
  - .github/prompts/spectra-debug.prompt.md
  - .github/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - .github/prompts/spectra-apply.prompt.md
  - .github/skills/spectra-propose/SKILL.md
  - .github/skills/spectra-ask/SKILL.md
  - .github/skills/spectra-apply/SKILL.md
  - .github/prompts/spectra-ask.prompt.md
  - .github/prompts/spectra-discuss.prompt.md
  - .github/prompts/spectra-ingest.prompt.md
  - .github/prompts/spectra-propose.prompt.md
  - .github/copilot-instructions.md
  - .github/instructions/phase-1-todo.instructions.md
  - .github/skills/spectra-debug/SKILL.md
  - .github/instructions/prd.instructions.md
  - .github/prompts/spectra-audit.prompt.md
  - .github/skills/spectra-archive/SKILL.md
  - .github/skills/spectra-audit/SKILL.md
  - .github/skills/spectra-ingest/SKILL.md
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - .github/prompts/spectra-archive.prompt.md
  - AGENTS.md
-->

---
### Requirement: Users can edit and delete transactions

The system SHALL allow users to modify and remove previously created transactions.

#### Scenario: Edit a transaction

- **WHEN** a user saves changes to an existing transaction
- **THEN** the system SHALL persist the updated transaction details

#### Scenario: Delete a transaction

- **WHEN** a user confirms deletion of an existing transaction
- **THEN** the system SHALL remove the transaction from the active account book transaction list


<!-- @trace
source: migrate-project-instructions-to-spectra
updated: 2026-03-18
code:
  - .github/prompts/spectra-debug.prompt.md
  - .github/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - .github/prompts/spectra-apply.prompt.md
  - .github/skills/spectra-propose/SKILL.md
  - .github/skills/spectra-ask/SKILL.md
  - .github/skills/spectra-apply/SKILL.md
  - .github/prompts/spectra-ask.prompt.md
  - .github/prompts/spectra-discuss.prompt.md
  - .github/prompts/spectra-ingest.prompt.md
  - .github/prompts/spectra-propose.prompt.md
  - .github/copilot-instructions.md
  - .github/instructions/phase-1-todo.instructions.md
  - .github/skills/spectra-debug/SKILL.md
  - .github/instructions/prd.instructions.md
  - .github/prompts/spectra-audit.prompt.md
  - .github/skills/spectra-archive/SKILL.md
  - .github/skills/spectra-audit/SKILL.md
  - .github/skills/spectra-ingest/SKILL.md
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - .github/prompts/spectra-archive.prompt.md
  - AGENTS.md
-->

---
### Requirement: Transactions are presented in an account-book-scoped list

The system SHALL present transactions for the current account book on the home page in a browsable flat list. Each visible transaction row SHALL surface key summary details, including date, category, description, expense payer information for expense transactions, income recipient information for income transactions, tags when present, payment method when present, an equal-split indicator when applicable, and signed amount, and SHALL provide direct access to edit that transaction.

#### Scenario: View the current account book transaction list

- **WHEN** a user opens the home page with a current account book selected
- **THEN** the system SHALL show only transactions that belong to that account book in one flat list ordered by the transaction list's current sort

#### Scenario: View transaction summary details

- **WHEN** a transaction row is rendered in the home-page list
- **THEN** the system SHALL display enough summary information to distinguish the transaction, including its date, category, description or note, expense payer information for expense transactions, income recipient information for income transactions, tags when present, payment method when present, an equal-split indicator when the split detail is even, and signed amount

#### Scenario: Edit a transaction from the visible list

- **WHEN** a user chooses the edit action for a visible transaction row
- **THEN** the system SHALL open the transaction editing flow prefilled with that transaction's current values


<!-- @trace
source: implement-transaction-store-and-home-list
updated: 2026-03-28
code:
  - apps/web/src/repositories/categoryRepo/categoryLocalRepo.ts
  - apps/web/package.json
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/components/categorySettings/CategoryGroupItem.tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/pages/_app.tsx
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/mocks/index.ts
  - apps/web/src/components/accountBookSettings/AccountBookFormModal.tsx
  - apps/web/src/components/categorySettings/index.ts
  - apps/web/src/components/accountBookSettings/AccountBookNavHeader.tsx
  - apps/web/src/stores/category/index.ts
  - .impeccable.md
  - apps/web/src/utils/genUuid.ts
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/components/categorySettings/SubCategoryItem.tsx
  - apps/web/src/components/accountBookSettings/AccountBookForm.tsx
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/components/TransactionModal/CategorySelector.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/entities/category.ts
  - apps/web/src/pages/settings.tsx
  - apps/web/tailwind.config.js
  - apps/web/src/components/categorySettings/DeleteConfirmModal.tsx
  - apps/web/src/components/categorySettings/AddCategoryModal.tsx
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/stores/category/categoryStoreProvider.tsx
  - apps/web/src/constants/defaultCategories.ts
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/pages/styles.css
  - apps/web/src/mocks/category.ts
  - apps/web/src/constants/theme.ts
  - apps/web/src/pages/_document.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/jest.config.ts
  - apps/web/src/constants/categoryIcons.ts
  - apps/web/test-setup.ts
  - apps/web/src/pages/index.tsx
tests:
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/categoryStore.spec.ts
  - apps/web/specs/category.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
-->

---
### Requirement: Income transactions record a single recipient

The system SHALL record exactly one recipient for each income transaction. The income transaction form SHALL prefill that recipient with the current user and SHALL allow the user to choose a different participant from the active account book before saving.

#### Scenario: Create an income transaction with the default recipient

- **WHEN** a user opens a new income transaction form and saves a valid income transaction without changing the recipient
- **THEN** the system SHALL persist the current user as the income recipient

#### Scenario: Create an income transaction with a different recipient

- **WHEN** a user selects a different active-account-book participant as the income recipient and saves a valid income transaction
- **THEN** the system SHALL persist that selected participant as the income recipient

#### Scenario: Edit the recipient of an income transaction

- **WHEN** a user changes the recipient on an existing income transaction and saves the form
- **THEN** the system SHALL persist the updated income recipient

<!-- @trace
source: implement-transaction-store-and-home-list
updated: 2026-03-23
code:
  - apps/web/src/stores/category/categoryStoreProvider.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/repositories/categoryRepo/categoryLocalRepo.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/components/TransactionModal/CategorySelector.tsx
  - apps/web/src/pages/_app.tsx
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/entities/category.ts
  - apps/web/src/stores/category/index.ts
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/lib/dexie.ts
  - apps/web/src/mocks/category.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/jest.config.ts
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/pages/index.tsx
tests:
  - apps/web/specs/category.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/homeTransactions.spec.tsx
-->

<!-- @trace
source: implement-transaction-store-and-home-list
updated: 2026-03-28
code:
  - apps/web/src/repositories/categoryRepo/categoryLocalRepo.ts
  - apps/web/package.json
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/components/categorySettings/CategoryGroupItem.tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/pages/_app.tsx
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/mocks/index.ts
  - apps/web/src/components/accountBookSettings/AccountBookFormModal.tsx
  - apps/web/src/components/categorySettings/index.ts
  - apps/web/src/components/accountBookSettings/AccountBookNavHeader.tsx
  - apps/web/src/stores/category/index.ts
  - .impeccable.md
  - apps/web/src/utils/genUuid.ts
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/components/categorySettings/SubCategoryItem.tsx
  - apps/web/src/components/accountBookSettings/AccountBookForm.tsx
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/components/TransactionModal/CategorySelector.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/entities/category.ts
  - apps/web/src/pages/settings.tsx
  - apps/web/tailwind.config.js
  - apps/web/src/components/categorySettings/DeleteConfirmModal.tsx
  - apps/web/src/components/categorySettings/AddCategoryModal.tsx
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/stores/category/categoryStoreProvider.tsx
  - apps/web/src/constants/defaultCategories.ts
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/pages/styles.css
  - apps/web/src/mocks/category.ts
  - apps/web/src/constants/theme.ts
  - apps/web/src/pages/_document.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/jest.config.ts
  - apps/web/src/constants/categoryIcons.ts
  - apps/web/test-setup.ts
  - apps/web/src/pages/index.tsx
tests:
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/categoryStore.spec.ts
  - apps/web/specs/category.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
-->

---
### Requirement: Editing a transaction with a deleted category requires re-selection

When a user opens an existing transaction for editing and the transaction's category no longer exists, the system SHALL preserve the uncategorized state and prevent saving until the user selects a valid replacement category.

#### Scenario: Open edit modal for transaction with deleted category

- **WHEN** a user opens the edit modal for a transaction whose `categoryId` does not exist in the current category store
- **THEN** the system SHALL display the category selector with no category selected
- **AND** the system SHALL disable the save button until the user explicitly selects a category

#### Scenario: User selects a replacement category

- **WHEN** the user selects a valid category in the edit modal where no category was previously resolved
- **THEN** the system SHALL enable the save button
- **AND** the system SHALL save the transaction with the newly selected category when the user confirms

<!-- @trace
source: handle-deleted-category-as-uncategorized
updated: 2026-03-28
code:
  - apps/web/src/entities/transaction.ts
  - apps/web/src/stores/category/categoryStoreProvider.tsx
  - apps/web/src/components/TransactionModal/CategorySelector.tsx
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - .impeccable.md
  - apps/web/src/components/accountBookSettings/AccountBookFormModal.tsx
  - apps/web/src/pages/_document.tsx
  - apps/web/package.json
  - apps/web/src/stores/category/index.ts
  - apps/web/src/components/categorySettings/AddCategoryModal.tsx
  - apps/web/src/pages/index.tsx
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/tailwind.config.js
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/categorySettings/SubCategoryItem.tsx
  - apps/web/src/mocks/category.ts
  - apps/web/src/components/categorySettings/DeleteConfirmModal.tsx
  - apps/web/src/constants/defaultCategories.ts
  - apps/web/src/constants/categoryIcons.ts
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/test-setup.ts
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/utils/genUuid.ts
  - apps/web/src/pages/styles.css
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/jest.config.ts
  - apps/web/src/components/categorySettings/CategoryGroupItem.tsx
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/components/accountBookSettings/AccountBookForm.tsx
  - apps/web/src/constants/theme.ts
  - apps/web/src/repositories/categoryRepo/categoryLocalRepo.ts
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/components/categorySettings/index.ts
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/components/accountBookSettings/AccountBookNavHeader.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/pages/_app.tsx
  - apps/web/src/entities/category.ts
  - apps/web/src/mocks/index.ts
tests:
  - apps/web/specs/categoryStore.spec.ts
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/category.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/homeTransactions.spec.tsx
-->