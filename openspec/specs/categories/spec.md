# categories Specification

## Purpose

TBD - created by archiving change 'migrate-project-instructions-to-spectra'. Update Purpose after archive.

## Requirements

### Requirement: Default categories exist for income and expense flows

The system SHALL provide default category sets for both income and expense transactions scoped to the active account book, so users can record common transaction types without manual setup.

#### Scenario: Start recording a new transaction

- **WHEN** a user opens a new income or expense transaction form
- **THEN** the system SHALL provide category choices sourced from the category store, filtered to the active account book and appropriate to the selected transaction type


<!-- @trace
source: category-store
updated: 2026-03-23
code:
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/pages/_app.tsx
  - apps/web/src/pages/index.tsx
  - apps/web/src/stores/category/categoryStoreProvider.tsx
  - apps/web/src/mocks/category.ts
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/stores/category/index.ts
  - apps/web/src/entities/category.ts
  - apps/web/jest.config.ts
  - apps/web/src/entities/transaction.ts
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/lib/dexie.ts
  - apps/web/src/repositories/categoryRepo/categoryLocalRepo.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/components/TransactionModal/CategorySelector.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
tests:
  - apps/web/specs/category.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
-->

---
### Requirement: Transactions use typed categories

The system SHALL assign each transaction to a category whose type matches the transaction type.

#### Scenario: Choose a category for an expense

- **WHEN** a user selects a category while creating or editing an expense transaction
- **THEN** the system SHALL restrict the available category choices to expense categories


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
### Requirement: Custom categories support visual metadata

The system SHALL support user-defined categories with icon and color metadata so custom categories remain distinguishable in transaction flows.

#### Scenario: Create a custom category

- **WHEN** a user creates a custom category with a name, icon, and color
- **THEN** the system SHALL make that category available in future transaction flows with the configured visual metadata

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
### Requirement: Categories are scoped to an account book

The system SHALL associate each category with exactly one account book via an `accountBookId` field so that categories can be managed independently per book.

#### Scenario: Load categories for the active account book

- **WHEN** the active account book changes or the category store is initialized
- **THEN** the system SHALL load only the categories belonging to that account book

#### Scenario: Seed default categories for a new account book

- **WHEN** an account book has no categories stored
- **THEN** the system SHALL seed a default set of expense and income categories scoped to that account book's ID

#### Scenario: Automatically seed default categories on account book creation

- **WHEN** a new account book is created
- **THEN** the system SHALL immediately seed the default category set (as defined in `mocks/category`) scoped to the newly created account book's ID, so the book is usable for transaction recording without any additional setup

<!-- @trace
source: category-store
updated: 2026-03-23
code:
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/pages/_app.tsx
  - apps/web/src/pages/index.tsx
  - apps/web/src/stores/category/categoryStoreProvider.tsx
  - apps/web/src/mocks/category.ts
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/stores/category/index.ts
  - apps/web/src/entities/category.ts
  - apps/web/jest.config.ts
  - apps/web/src/entities/transaction.ts
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/lib/dexie.ts
  - apps/web/src/repositories/categoryRepo/categoryLocalRepo.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/components/TransactionModal/CategorySelector.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
tests:
  - apps/web/specs/category.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
-->

---
### Requirement: Users can manage categories within an account book

The system SHALL allow users to view all categories for a specific account book organized into root groups and sub-categories, and add new root groups and sub-categories.

#### Scenario: User views categories for an account book

- **WHEN** a user opens the category settings page for an account book
- **THEN** the system SHALL display all categories scoped to that account book, organized as root groups with their sub-categories

#### Scenario: User adds a new root category group

- **WHEN** a user submits a valid name for a new group on the category settings page
- **THEN** the system SHALL persist a new root category with `parentId: null` for the active account book and reflect it in the category list

#### Scenario: User adds a sub-category to a root group

- **WHEN** a user submits a valid name for a new sub-category under an existing root group
- **THEN** the system SHALL persist a new category with the root group's `id` as `parentId` and the same `type` as the parent

<!-- @trace
source: add-category-settings
updated: 2026-03-23
code:
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/categorySettings/AddCategoryModal.tsx
  - apps/web/src/components/categorySettings/SubCategoryItem.tsx
  - apps/web/src/components/categorySettings/index.ts
  - apps/web/src/entities/transaction.ts
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/mocks/index.ts
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/components/TransactionModal/CategorySelector.tsx
  - apps/web/src/repositories/categoryRepo/categoryLocalRepo.ts
  - apps/web/src/stores/category/index.ts
  - apps/web/src/components/categorySettings/CategoryGroupItem.tsx
  - apps/web/src/constants/categoryIcons.ts
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/entities/category.ts
  - apps/web/src/stores/category/categoryStoreProvider.tsx
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/mocks/category.ts
  - apps/web/src/pages/_app.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/jest.config.ts
  - apps/web/src/constants/defaultCategories.ts
tests:
  - apps/web/specs/category.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
-->

---
### Requirement: Categories carry a sortOrder field for display ordering

The system SHALL store a `sortOrder` field on each `Category` entity to determine display order within its parent context (root groups within a type tab, sub-categories within a root group).

#### Scenario: Category sort order is persisted

- **WHEN** a user saves a reordered list of categories
- **THEN** the system SHALL persist the new `sortOrder` values for each affected category in the local database

#### Scenario: Categories without sortOrder sort to end

- **WHEN** the system loads categories that do not have a `sortOrder` value assigned
- **THEN** those categories SHALL be displayed after all categories that have an explicit `sortOrder` value

<!-- @trace
source: category-settings-edit-sort-delete-draft
updated: 2026-03-23
code:
  - apps/web/src/components/categorySettings/index.ts
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/components/categorySettings/CategoryGroupItem.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/constants/categoryIcons.ts
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/categorySettings/AddCategoryModal.tsx
  - apps/web/src/stores/category/categoryStoreProvider.tsx
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/mocks/category.ts
  - apps/web/src/components/categorySettings/DeleteConfirmModal.tsx
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/pages/_app.tsx
  - apps/web/src/mocks/index.ts
  - apps/web/src/components/categorySettings/SubCategoryItem.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/components/TransactionModal/CategorySelector.tsx
  - apps/web/src/entities/category.ts
  - apps/web/src/pages/index.tsx
  - apps/web/src/repositories/categoryRepo/categoryLocalRepo.ts
  - apps/web/src/constants/defaultCategories.ts
  - apps/web/src/entities/transaction.ts
  - apps/web/src/stores/category/index.ts
  - apps/web/jest.config.ts
tests:
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/category.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
-->