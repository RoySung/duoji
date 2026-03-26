# category-store Specification

## Purpose

TBD - created by archiving change 'category-store'. Update Purpose after archive.

## Requirements

### Requirement: A reactive category store loads categories for the active account book

The system SHALL provide a Zustand-based category store that loads categories scoped to the current account book and exposes them to the React component tree via a context provider.

#### Scenario: Initialize category store with an account book

- **WHEN** the category store is initialized with a valid `accountBookId`
- **THEN** the store SHALL fetch all categories for that account book from the local repository and make them available as reactive state

#### Scenario: Separate expense and income categories

- **WHEN** a component accesses the category store
- **THEN** the store SHALL expose filtered lists for `expense` and `income` category types derived from the loaded categories

#### Scenario: Components replace mock imports with store data

- **WHEN** a transaction form component renders category options
- **THEN** the component SHALL source its category list from the category store instead of importing static mock arrays

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
### Requirement: The category store exposes CRUD mutations for managing categories

The system SHALL provide `addCategory`, `updateCategory`, and `deleteCategory` actions in the category store so that UI components can create, modify, and remove categories without directly calling the repository layer.

#### Scenario: Add a new category

- **WHEN** a component calls `addCategory` with a valid category payload
- **THEN** the store SHALL persist the new category via the repository and update the in-memory category state to include the new entry

#### Scenario: Update an existing category

- **WHEN** a component calls `updateCategory` with a valid id and partial updates
- **THEN** the store SHALL persist the changes via the repository and reflect the updated category in the in-memory state

#### Scenario: Delete a category

- **WHEN** a component calls `deleteCategory` with a valid category id
- **THEN** the store SHALL delete the category and all its descendants via the repository and remove them from the in-memory state

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
### Requirement: Category store assigns sortOrder when seeding and adding categories

The system SHALL assign sequential `sortOrder` values when seeding default categories and SHALL append new categories after existing ones by assigning a `sortOrder` value higher than the current maximum.

#### Scenario: Seed default categories with sortOrder

- **WHEN** the category store seeds default categories for a new account book
- **THEN** each seeded category SHALL receive a `sortOrder` value equal to its index in the seed template array

#### Scenario: Add a new category appends to end

- **WHEN** a new category is added via `addCategory` without an explicit `sortOrder`
- **THEN** the store SHALL assign a `sortOrder` value greater than all existing categories in the same account book and parent scope


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
### Requirement: Category store returns categories sorted by sortOrder

The system SHALL return categories from `findByAccountBookId` sorted by `sortOrder` ascending, with categories lacking a `sortOrder` value placed at the end.

#### Scenario: Load categories in display order

- **WHEN** the category store initializes for an account book
- **THEN** the categories in store state SHALL be ordered by `sortOrder` ascending, enabling components to render them in the correct display order without client-side sorting

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