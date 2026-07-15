# categories Specification

## Purpose

TBD - created by archiving change 'migrate-project-instructions-to-spectra'. Update Purpose after archive.

## Requirements

### Requirement: Default categories exist for income and expense flows

The system SHALL provide default category sets for both income and expense transactions scoped to the active account book, so users can record common transaction types without manual setup. When initiating a new transaction form without an existing selected category, the system SHALL default to selecting the first sub-category under the first root category of the matching transaction type.

#### Scenario: Start recording a new transaction

- **WHEN** a user opens a new income or expense transaction form
- **THEN** the system SHALL provide category choices sourced from the category store, filtered to the active account book and appropriate to the selected transaction type, and SHALL default the selection to the first sub-category under the first root category of that type even if custom categories are present in the account book


<!-- @trace
source: fix-category-selector-default
updated: 2026-07-15
code:
  - apps/web/src/utils/transactionUtils.ts
tests:
  - apps/web/specs/transactionUtils.spec.ts
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

The system SHALL support user-defined categories with icon and color metadata so custom categories remain distinguishable in transaction flows. The system SHALL support icons for pets (e.g. dog, cat, paw-print), supplies (e.g. package, box, wrench, sparkles), activities (e.g. calendar, ticket, trophy, activity), and other daily items (e.g. home, droplet, zap, phone, wifi, baby, plane, map-pin, receipt, scissors) in addition to other pre-configured icons.

#### Scenario: Create a custom category

- **WHEN** a user creates a custom category with a name, icon, and color
- **THEN** the system SHALL make that category available in future transaction flows with the configured visual metadata


<!-- @trace
source: add-more-category-icons
updated: 2026-07-15
code:
  - apps/web/src/constants/categoryIcons.ts
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/components/categorySettings/AddCategoryModal.tsx
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/i18n/messages/zh-TW.json
tests:
  - apps/web/specs/transactionUtils.spec.ts
-->

---
### Requirement: Categories are scoped to an account book

The system SHALL associate each category with exactly one account book via an `accountBookId` field so that categories can be managed independently per book. When seeding default categories on account book creation, the system SHALL use the active locale (`Settings.language`) to choose the language of seeded category names and descriptions.

#### Scenario: Load categories for the active account book

- **WHEN** the active account book changes or the category store is initialized
- **THEN** the system SHALL load only the categories belonging to that account book

#### Scenario: Seed default categories for a new account book

- **WHEN** an account book has no categories stored
- **THEN** the system SHALL seed a default set of expense and income categories scoped to that account book's ID, with names and descriptions taken from the i18n message catalog of the active locale

#### Scenario: Automatically seed default categories on account book creation

- **WHEN** a new account book is created
- **THEN** the system SHALL immediately seed the default category set scoped to the newly created account book's ID, using the active locale at creation time to translate category names and descriptions, so the book is usable for transaction recording without any additional setup

#### Scenario: Existing categories are not retranslated when the locale changes

- **WHEN** the user changes the active locale after an account book's default categories have been seeded
- **THEN** the system SHALL NOT rename, retranslate, or otherwise mutate the existing category records


<!-- @trace
source: add-i18n-and-onboarding
updated: 2026-05-11
code:
  - apps/web/src/components/onboarding/TransactionTutorial.tsx
  - apps/web/src/components/onboarding/LanguageStep.tsx
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/onboarding/StepShell.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/repositories/settingsRepo/index.ts
  - apps/web/src/constants/defaultCategories.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/package.json
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/onboarding/SplitTutorial.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/i18n/__mocks__/next-intl.ts
  - apps/web/src/repositories/settingsRepo/settingsLocalRepo.ts
  - apps/web/jest.config.ts
  - apps/web/src/stores/settings/settingsStore.ts
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/entities/settings.ts
  - apps/web/src/stores/settings/index.ts
  - apps/web/test-setup.ts
  - apps/web/src/i18n/config.ts
  - apps/web/src/components/onboarding/OnboardingTutorial.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/components/onboarding/ReportTutorial.tsx
  - apps/web/src/components/accountBookSettings/AccountBookForm.tsx
  - apps/web/src/stores/settings/settingsStoreProvider.tsx
  - apps/web/tsconfig.json
  - apps/web/src/components/onboarding/LedgerStep.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/pages/onboarding/index.tsx
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/pages/_app.tsx
  - apps/web/next.config.js
tests:
  - apps/web-e2e/src/onboarding.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/src/stores/settings/settingsStore.test.ts
  - apps/web/src/constants/defaultCategories.test.ts
  - apps/web/specs/homeTransactions.spec.tsx
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

---
### Requirement: Transactions with a deleted category display as uncategorized

When a transaction's `categoryId` no longer exists in the category store (because the category was deleted), the system SHALL display the transaction as "未分類" rather than hiding the transaction or silently using another category.

#### Scenario: Display transaction with deleted category

- **WHEN** the transaction list renders a transaction whose `categoryId` does not match any category in the category store
- **THEN** the system SHALL display "未分類" as the category label for that transaction

#### Scenario: Display transaction with empty categoryId

- **WHEN** the transaction list renders a transaction whose `categoryId` is an empty string
- **THEN** the system SHALL display "未分類" as the category label for that transaction

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