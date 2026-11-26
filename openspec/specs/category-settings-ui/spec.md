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

The system SHALL use the account book card in the Account Books Settings page as the entry point to that account book's dedicated settings page, and the card SHALL NOT expose a direct Category Settings action.

#### Scenario: Open account book settings from account book card

- **WHEN** a user presses the primary manage action on an account book card
- **THEN** the system SHALL navigate to that account book's dedicated settings page

#### Scenario: Category settings is not shown on account book card

- **WHEN** a user views the available actions on an account book card
- **THEN** the system SHALL NOT display a direct Category Settings action on that card


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

---
### Requirement: Users can navigate to category settings from an account book settings page

The system SHALL provide a Category Settings action inside each account book's dedicated settings page, and that action SHALL lead to the category settings page for the same account book.

#### Scenario: Navigate to category settings from an account book settings page

- **WHEN** a user presses the "Category Settings" action on an existing account book's settings page
- **THEN** the system SHALL navigate to the category settings page for that same account book

#### Scenario: Return from category settings to account book settings

- **WHEN** a user uses back navigation from the category settings page for an account book
- **THEN** the system SHALL return to that account book's settings page

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
### Requirement: Category modal displays icon selection in a grid layout without text labels

For categories in newly created account books, the category modal SHALL offer a choice of a built-in icon or a custom image URL. The built-in choices SHALL appear in a scrollable icon-only grid.

#### Scenario: View icon options in the category modal

- **WHEN** the category modal opens with the built-in icon source selected
- **THEN** the system SHALL display all built-in icons in a scrollable grid and highlight the active icon
- **AND** the system SHALL provide accessible titles and ARIA labels using the corresponding translation keys

#### Scenario: Select an icon from the grid

- **WHEN** a user clicks a built-in icon
- **THEN** the system SHALL select and highlight that icon

#### Scenario: Preview and save a custom image

- **WHEN** a user creating or editing a root or child category chooses the custom source and enters an absolute HTTPS URL without embedded credentials
- **THEN** the system SHALL preview the image from the trimmed URL
- **AND** submitting and saving the category settings SHALL persist that URL as the icon choice

##### Example: Image endpoint with a query string and no file extension

- **GIVEN** `https://images.example.com/icon?id=coffee` returns an image
- **WHEN** the user enters that URL with surrounding whitespace and saves the category
- **THEN** the image SHALL load in preview and the system SHALL store `https://images.example.com/icon?id=coffee`

#### Scenario: Reject invalid custom URL input

- **WHEN** a user submits with the custom source selected and the URL is empty, relative, malformed, uses a scheme other than HTTPS, or contains embedded credentials
- **THEN** the system SHALL display a URL field error and keep the category modal open without submitting

##### Example: Invalid inputs in custom mode

| Input | Expected Output |
| --- | --- |
| Empty or whitespace only | URL field error and no submission |
| `/icons/coffee.svg` | URL field error and no submission |
| `https://` | URL field error and no submission |
| `http://images.example.com/coffee.svg` | URL field error and no submission |
| `https://user@images.example.com/coffee.svg` | URL field error and no submission |

#### Scenario: Save an unavailable custom image URL

- **WHEN** a valid custom image URL fails to load in the preview
- **THEN** the system SHALL show a built-in fallback and indicate the preview could not load
- **AND** the user SHALL be able to save the valid URL and edit it later

#### Scenario: Reopen or switch a saved icon choice

- **WHEN** a user opens a saved category for editing after reloading the app
- **THEN** the form SHALL prefill the saved icon source and its key or URL
- **AND** changing only the name SHALL preserve the saved icon
- **AND** selecting and saving a different source SHALL replace the saved icon with the selected built-in key or custom URL

<!-- @trace
source: customize-category-icons
updated: 2026-11-26
code:
  - .vscode/settings.json
  - apps/web/src/components/categorySettings/SubCategoryItem.tsx
  - apps/web/src/components/categorySettings/AddCategoryModal.tsx
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/report/reportTypes.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/constants/categoryIcons.ts
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/entities/category.ts
  - apps/web/src/components/ui/CategoryIcon.tsx
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/categorySettings/CategoryGroupItem.tsx
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/DESIGN.md
  - apps/web/src/mocks/category.ts
  - apps/web/src/constants/defaultCategories.ts
  - apps/web/src/components/TransactionModal/CategorySelector.tsx
tests:
  - apps/web/specs/categoryMemberPresentation.spec.tsx
  - apps/web/specs/transactionSurfacePresentation.spec.tsx
  - apps/web/specs/categoryIcon.spec.tsx
  - apps/web/specs/transactionCategoryQuickAdd.spec.tsx
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/categorySettingsIcons.spec.tsx
  - apps/web/specs/reportAggregate.spec.ts
  - apps/web/src/utils/csvExport.test.ts
  - apps/web/specs/categoryTransactionsModalPresentation.spec.tsx
  - apps/web/specs/category.spec.ts
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/src/constants/defaultCategories.test.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/categoryStore.spec.ts
  - apps/web-e2e/src/category-icons.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
-->