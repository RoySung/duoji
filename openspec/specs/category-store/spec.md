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

#### Scenario: Category store is initialized automatically when the active account book changes

- **WHEN** `currentAccountBookId` changes in `accountBookStore`
- **THEN** a centralized `CategoryStoreWatcher` in `_app.tsx` SHALL call `categoryStore.initialize(currentAccountBookId)` automatically, without requiring individual pages to trigger initialization


<!-- @trace
source: add-category-store-watcher
updated: 2026-04-11
code:
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/package.json
  - .github/prompts/spectra-apply.prompt.md
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/jest.config.ts
  - apps/web/src/stores/transaction/index.ts
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - .github/prompts/spectra-ask.prompt.md
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - .github/prompts/spectra-debug.prompt.md
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/stores/transaction/transactionStore.ts
  - .github/skills/spectra-ingest/SKILL.md
  - CLAUDE.md
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/pages/index.tsx
  - .github/skills/spectra-ask/SKILL.md
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/.babelrc
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - AGENTS.md
  - apps/web/src/pages/settings.tsx
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - .spectra.yaml
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/entities/settlement.ts
  - apps/web/src/repositories/settlementRepo/index.ts
  - apps/web/src/entities/transaction.ts
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - .github/prompts/spectra-propose.prompt.md
  - apps/web/src/hooks/useSettlement.ts
  - GEMINI.md
  - .github/skills/spectra-propose/SKILL.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/pages/_app.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/next.config.js
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/stores/accountBook/index.ts
tests:
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/transactionStore.spec.ts
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