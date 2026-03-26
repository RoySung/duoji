# category-settings-ui Specification

## Purpose

TBD - created by archiving change 'add-category-settings'. Update Purpose after archive.

## Requirements

### Requirement: Users can view categories organized by root groups for a specific account book

The system SHALL display a Category Settings page scoped to a specific account book, listing all root categories as expandable accordion groups, each showing its sub-category count, sorted by their `sortOrder` value ascending.

#### Scenario: Open category settings for an account book

- **WHEN** a user navigates to the category settings page for an account book
- **THEN** the system SHALL display the account book name, a subtitle, and a list of root categories as collapsible groups sorted by `sortOrder` ascending

#### Scenario: Expand a root category group

- **WHEN** a user taps the expand control on a root category group
- **THEN** the system SHALL reveal the sub-categories belonging to that root category, sorted by `sortOrder` ascending, and an "ADD SUB-CATEGORY" action

#### Scenario: Collapse a root category group

- **WHEN** a user taps the expand control on an already-expanded root category group
- **THEN** the system SHALL collapse the sub-category list


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
### Requirement: Users can add a new root category group to an account book

The system SHALL provide an "ADD NEW GROUP" action on the category settings page that allows users to create a new root category for the selected account book.

#### Scenario: Add a new root category group

- **WHEN** a user submits a valid name via the add category modal with no parent selected
- **THEN** the system SHALL create a new root category scoped to the account book and display it at the bottom of the group list

#### Scenario: Attempt to add a root category without a name

- **WHEN** a user submits the add category modal with an empty name
- **THEN** the system SHALL prevent submission and display a validation error


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
### Requirement: Users can add a sub-category to an existing root group

The system SHALL provide an "ADD SUB-CATEGORY" action within each expanded root category group that allows users to create a new sub-category under that group.

#### Scenario: Add a sub-category under a root group

- **WHEN** a user submits a valid name via the add category modal with a parent root category pre-selected
- **THEN** the system SHALL create a new sub-category with parentId set to the root category and display it within the expanded group

#### Scenario: Sub-category inherits transaction type from parent

- **WHEN** a user adds a sub-category under a root category of type "expense"
- **THEN** the new sub-category SHALL have type "expense" automatically, without requiring the user to select it


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
### Requirement: Users can navigate to category settings from an account book card

The system SHALL provide a navigation entry point on each account book card in the Account Books Settings page that leads to the category settings page for that account book.

#### Scenario: Navigate to category settings from account book card

- **WHEN** a user presses the "Category Settings" button on an account book card
- **THEN** the system SHALL navigate to the category settings page for that account book

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
### Requirement: Category Settings page uses draft mode for all mutations

The system SHALL stage all category mutations (add, edit, delete, reorder) in page-local draft state and SHALL NOT write to the database until the user explicitly saves.

#### Scenario: Draft mode activates on first mutation

- **WHEN** a user performs any mutation (add, edit, delete, or reorder) on the Category Settings page
- **THEN** the system SHALL display a sticky Save/Discard action bar at the bottom of the page indicating unsaved changes

#### Scenario: Save commits all staged changes

- **WHEN** a user taps the Save button on the Save/Discard bar
- **THEN** the system SHALL write all staged mutations to the database in topological order (deletes → add roots → add sub-categories → updates) and clear the draft state

#### Scenario: Discard reverts to last saved state

- **WHEN** a user taps the Discard button on the Save/Discard bar
- **THEN** the system SHALL revert all staged mutations back to the last saved state from the database and hide the Save/Discard bar

#### Scenario: No unsaved changes on page load

- **WHEN** a user navigates to the Category Settings page
- **THEN** the system SHALL NOT display the Save/Discard bar and the draft state SHALL match the persisted state

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