# transactions Specification

## Purpose

TBD - created by archiving change 'migrate-project-instructions-to-spectra'. Update Purpose after archive.

## Requirements

### Requirement: Users can record income and expense transactions

The system SHALL allow users to create transactions with a type, amount, date, category, note, and payment method within the active account book. Transaction split fields (`paidByDetail`, `splitDetail`) SHALL reference `Person` records (by `personId` and `personType`) from the active account book's people list rather than embedding full `User` objects. The `receivedByPersonId` field SHALL replace `receivedByUserId` and SHALL accept any `Person` id from the account book's people list.

#### Scenario: Create an expense transaction

- **WHEN** a user submits a valid expense transaction form in the active account book
- **THEN** the system SHALL store the transaction and include it in the active account book transaction list

#### Scenario: Create an income transaction

- **WHEN** a user submits a valid income transaction form in the active account book
- **THEN** the system SHALL store the transaction and include it in the active account book transaction list


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

The system SHALL present transactions for the current account book on the home page in a browsable flat list. Each visible transaction row SHALL surface key summary details, including date, category, description, expense payer information for expense transactions, income recipient information for income transactions, tags when present, payment method when present, an equal-split indicator when applicable, and the transaction amount, and SHALL provide direct access to edit that transaction. Income amounts SHALL be prefixed with a `+` sign; expense amounts SHALL be displayed without a sign prefix, with expense versus income distinction conveyed through color (danger for expense, success for income). The transaction list query state for that view SHALL be owned by the active account-book page rather than an app-level shared transaction store.

#### Scenario: View the current account book transaction list

- **WHEN** a user opens the home page with a current account book selected
- **THEN** the system SHALL load and show only transactions that belong to that account book in one flat list ordered by the transaction list's current sort, using page-owned query state for that account-book view

#### Scenario: View transaction summary details

- **WHEN** a transaction row is rendered in the home-page list
- **THEN** the system SHALL display enough summary information to distinguish the transaction, including its date, category, description or note, expense payer information for expense transactions, income recipient information for income transactions, tags when present, payment method when present, an equal-split indicator when the split detail is even, and the transaction amount with a `+` prefix for income and no sign prefix for expense
- **AND** the expense payer or income recipient information SHALL be displayed with a LuDollarSign prefix icon and their user avatar(s)

#### Scenario: Edit a transaction from the visible list

- **WHEN** a user chooses the edit action for a visible transaction row
- **THEN** the system SHALL open the transaction editing flow for the current account-book page, prefilled with that transaction's current values, without requiring an app-shell-wide transaction store

#### Scenario: Transaction query cache stays coherent after mutation

- **WHEN** a transaction is created, updated, or deleted from the account-book page
- **THEN** the visible transaction list query state SHALL update the affected cached list results and related calendar-summary query results without waiting for the cache TTL to expire


<!-- @trace
source: add-payer-prefix-icon-and-avatar
updated: 2026-06-13
code:
  - apps/web/src/components/transaction/TransactionList.tsx
tests:
  - apps/web/specs/homeTransactions.spec.tsx
-->

---
### Requirement: Income transactions record a single recipient

The system SHALL record exactly one recipient for each income transaction. The income transaction form SHALL prefill that recipient with the current user and SHALL allow the user to choose a different active (non-deleted) participant from the active account book before saving. When editing an existing income transaction, if the recorded recipient is a deleted virtual user, the system SHALL display that recipient with strikethrough style and SHALL allow removal but SHALL NOT allow re-selection.

#### Scenario: Create an income transaction with the default recipient

- **WHEN** a user opens a new income transaction form and saves a valid income transaction without changing the recipient
- **THEN** the system SHALL persist the current user as the income recipient

#### Scenario: Create an income transaction with a different recipient

- **WHEN** a user selects a different active account book participant (non-deleted) as the income recipient and saves a valid income transaction
- **THEN** the system SHALL persist that selected participant as the income recipient

#### Scenario: Edit the recipient of an income transaction

- **WHEN** a user changes the recipient on an existing income transaction and saves the form
- **THEN** the system SHALL persist the updated income recipient

#### Scenario: Recipient selector in new income transaction excludes deleted persons

- **WHEN** a user opens the recipient selector within a new income transaction form
- **THEN** the system SHALL only show active (non-deleted) people in the selector

#### Scenario: Edit income transaction with deleted recipient

- **WHEN** a user opens an existing income transaction whose recorded recipient is a deleted virtual user
- **THEN** the system SHALL display the deleted recipient with strikethrough style in the selector
- **AND** the system SHALL allow the user to remove (deselect) the deleted recipient
- **AND** the system SHALL NOT allow the user to re-add a deleted virtual user as the recipient


<!-- @trace
source: soft-delete-person
updated: 2026-04-11
code:
  - apps/web/src/lib/dexie.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/entities/accountBook.ts
  - .github/skills/spectra-propose/SKILL.md
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/next.config.js
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - phase-1.todo.md
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/mocks/user.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - .github/prompts/spectra-ask.prompt.md
  - apps/web/src/repositories/userRepo/index.ts
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - GEMINI.md
  - apps/web/jest.config.ts
  - apps/web/src/components/TransactionModal/PaidByDetailModal.tsx
  - AGENTS.md
  - apps/web/src/stores/user/userStore.ts
  - CLAUDE.md
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/components/TransactionModal/SplitDetailModal.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/pages/_app.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/entities/settlement.ts
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/utils/accountBookUtils.ts
  - apps/web/src/repositories/userRepo/userLocalRepo.ts
  - apps/web/src/stores/accountBook/index.ts
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/repositories/settlementRepo/index.ts
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/stores/transaction/index.ts
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - .github/skills/spectra-ingest/SKILL.md
  - apps/web/package.json
  - apps/web/src/entities/user.ts
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - apps/web/.babelrc
  - apps/web/src/pages/index.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/stores/user/userStoreProvider.tsx
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/stores/user/index.ts
  - apps/web/src/mocks/accountBook.ts
  - .github/prompts/spectra-apply.prompt.md
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - .github/prompts/spectra-debug.prompt.md
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - .spectra.yaml
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/pages/settings.tsx
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - .github/prompts/spectra-propose.prompt.md
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/stores/transaction/transactionStore.ts
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
tests:
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/userStore.spec.ts
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
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

---
### Requirement: Transaction editing session is scoped to the active account-book page

The system SHALL keep transaction creation and editing session state scoped to the account-book page that owns the visible transaction list, unless a separate cross-page requirement is introduced.

#### Scenario: Open a new transaction flow from an account-book page

- **WHEN** a user starts creating a transaction while viewing an account-book page
- **THEN** the system SHALL open a transaction session owned by that page and associate the draft with that active account book

#### Scenario: Switch away from the active account-book page

- **WHEN** a user leaves the account-book page that owns an in-progress transaction session
- **THEN** the system SHALL allow that page-owned session to be disposed without preserving an app-level transaction editing state

<!-- @trace
source: refactor-transaction-state-boundaries
updated: 2026-04-11
code:
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/pages/settings.tsx
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - .github/skills/spectra-propose/SKILL.md
  - apps/web/src/hooks/useSettlement.ts
  - .spectra.yaml
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - CLAUDE.md
  - .github/prompts/spectra-apply.prompt.md
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/.babelrc
  - apps/web/src/stores/transaction/index.ts
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/stores/transaction/transactionStore.ts
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/entities/transaction.ts
  - .github/prompts/spectra-propose.prompt.md
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - apps/web/src/pages/_app.tsx
  - .github/skills/spectra-ingest/SKILL.md
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - .github/prompts/spectra-ask.prompt.md
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/repositories/settlementRepo/index.ts
  - .github/prompts/spectra-debug.prompt.md
  - apps/web/src/utils/settlementUtils.ts
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/package.json
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/next.config.js
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - .github/prompts/spectra-ingest.prompt.md
  - AGENTS.md
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/entities/settlement.ts
  - GEMINI.md
  - apps/web/jest.config.ts
  - apps/web/src/stores/accountBook/index.ts
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
tests:
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
-->

---
### Requirement: Unsettled expense transactions are queryable by index

The system SHALL support efficient lookup of expense transactions that have not been assigned to a settlement record, without loading settlement records.

#### Scenario: Query unsettled transactions

- **WHEN** the settlement store initializes for an account book
- **THEN** the system SHALL retrieve unsettled expense transactions by querying transactions where `settlementRecordId` is null, without reading any settlement record's payload

#### Scenario: Transaction marked as settled

- **WHEN** a settlement record is successfully created
- **THEN** the system SHALL update each included expense transaction's `settlementRecordId` to the new settlement record's ID


<!-- @trace
source: refactor-settlement-db-design
updated: 2026-04-11
code:
  - apps/web/src/entities/settlement.ts
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/pages/settings/account-books.tsx
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/jest.config.ts
  - apps/web/src/stores/transaction/transactionStore.ts
  - GEMINI.md
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/package.json
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - CLAUDE.md
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/src/pages/account-books/[id]/index.tsx
  - .spectra.yaml
  - apps/web/src/pages/_app.tsx
  - .github/prompts/spectra-debug.prompt.md
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/pages/settings.tsx
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/.babelrc
  - apps/web/src/hooks/useSettlement.ts
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - .github/prompts/spectra-apply.prompt.md
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - .github/prompts/spectra-propose.prompt.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - .github/prompts/spectra-ask.prompt.md
  - apps/web/src/stores/transaction/index.ts
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/repositories/settlementRepo/index.ts
  - .github/skills/spectra-ingest/SKILL.md
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/next.config.js
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - AGENTS.md
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/entities/transaction.ts
  - .github/skills/spectra-propose/SKILL.md
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
tests:
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlementPage.spec.tsx
-->

---
### Requirement: Settlement record transactions are queryable by reverse lookup

The system SHALL allow retrieving all transactions belonging to a specific settlement record by querying `settlementRecordId` on the transactions table.

#### Scenario: Load transactions for a settlement record

- **WHEN** the application needs to display which transactions were included in a settlement record
- **THEN** the system SHALL retrieve those transactions by querying `transactions.where('settlementRecordId').equals(recordId)` rather than reading a stored `transactionIds` array from the settlement record

<!-- @trace
source: refactor-settlement-db-design
updated: 2026-04-11
code:
  - apps/web/src/entities/settlement.ts
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/pages/settings/account-books.tsx
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/jest.config.ts
  - apps/web/src/stores/transaction/transactionStore.ts
  - GEMINI.md
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/package.json
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - CLAUDE.md
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/src/pages/account-books/[id]/index.tsx
  - .spectra.yaml
  - apps/web/src/pages/_app.tsx
  - .github/prompts/spectra-debug.prompt.md
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/pages/settings.tsx
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/.babelrc
  - apps/web/src/hooks/useSettlement.ts
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - .github/prompts/spectra-apply.prompt.md
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - .github/prompts/spectra-propose.prompt.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - .github/prompts/spectra-ask.prompt.md
  - apps/web/src/stores/transaction/index.ts
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/repositories/settlementRepo/index.ts
  - .github/skills/spectra-ingest/SKILL.md
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/next.config.js
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - AGENTS.md
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/entities/transaction.ts
  - .github/skills/spectra-propose/SKILL.md
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
tests:
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlementPage.spec.tsx
-->

---
### Requirement: Settled transactions display a settled badge

A transaction that has been included in any non-deleted `SettlementRecord.transactionIds` SHALL display a "已結算" badge in the transaction list view.

The badge SHALL be visible without expanding or opening the transaction.

#### Scenario: Transaction included in a settlement record

- **WHEN** a transaction's ID appears in a non-deleted settlement record's `transactionIds`
- **THEN** the transaction list item SHALL display a "已結算" badge

#### Scenario: Transaction not yet settled

- **WHEN** a transaction's ID does not appear in any non-deleted settlement record's `transactionIds`
- **THEN** the transaction list item SHALL NOT display a settled badge

#### Scenario: Settlement record is soft-deleted

- **WHEN** the settlement record referencing a transaction is soft-deleted
- **THEN** the "已結算" badge SHALL be removed from that transaction

<!-- @trace
source: split-settlement-feature
updated: 2026-04-11
code:
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - CLAUDE.md
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/jest.config.ts
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/repositories/settlementRepo/index.ts
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/components/transaction/TransactionList.tsx
  - .github/skills/spectra-propose/SKILL.md
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - apps/web/src/pages/index.tsx
  - GEMINI.md
  - apps/web/package.json
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/next.config.js
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - .spectra.yaml
  - AGENTS.md
  - apps/web/src/stores/transaction/transactionStore.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/pages/_app.tsx
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/.babelrc
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - .github/skills/spectra-ingest/SKILL.md
  - apps/web/src/components/layout/navbar.tsx
  - .github/prompts/spectra-propose.prompt.md
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/entities/settlement.ts
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/utils/transactionUtils.ts
  - .github/prompts/spectra-ask.prompt.md
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/stores/transaction/index.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - .github/skills/spectra-ask/SKILL.md
  - .github/prompts/spectra-apply.prompt.md
  - .github/prompts/spectra-debug.prompt.md
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
tests:
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlement.spec.ts
-->

---
### Requirement: Transaction form allows selecting people from the account book

The system SHALL populate the payer and split-participant pickers in the transaction form with the active account book's people list, including both registered users and virtual users.

#### Scenario: Select a registered user as payer

- **WHEN** a user opens the payer picker in the transaction form
- **THEN** the system SHALL display all registered members of the active account book as selectable options

#### Scenario: Select a virtual user as payer

- **WHEN** a user opens the payer picker in the transaction form
- **THEN** the system SHALL display all virtual users of the active account book as selectable options alongside registered users

#### Scenario: Select participants for expense split

- **WHEN** a user configures split participants in the transaction form
- **THEN** the system SHALL display all people (registered and virtual) from the active account book as selectable participants


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
### Requirement: Data migration converts embedded user objects to person references

The system SHALL migrate existing transaction records on first run after upgrade, converting `paidByDetail[].user` and `splitDetail[].user` embedded `User` objects to `{ personId, personType: 'user', amount }` references. The `receivedByUserId` field SHALL be migrated to `receivedByPersonId`.

#### Scenario: Migrate existing transactions on startup

- **WHEN** the application starts and detects unmigrated transaction records
- **THEN** the system SHALL convert all `paidByDetail` and `splitDetail` entries from embedded user format to person-reference format without data loss

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
### Requirement: Transaction forms support tag suggestions without removing manual tag entry

The transaction form SHALL allow users to add tags either by typing manually or by selecting from the available suggestions for the form's selected account book. This behavior SHALL apply to both expense and income transaction forms in create and edit flows.

#### Scenario: Create a transaction with a suggested tag

- **WHEN** a user selects one or more available tag suggestions in a new transaction form and saves a valid transaction
- **THEN** the system SHALL persist the selected tags together with any manually entered tags on the saved transaction

#### Scenario: Edit a transaction with suggested and manual tags

- **WHEN** a user opens an existing transaction form, keeps some existing tags, adds another tag from the available suggestions, and saves the form
- **THEN** the system SHALL persist the updated combined tag list on that transaction

#### Scenario: Manual tag entry remains available without suggestions

- **WHEN** no tag suggestions are available for the selected account book
- **THEN** the transaction form SHALL still allow the user to enter and save tags manually

<!-- @trace
source: add-transaction-tag-suggestions
updated: 2026-06-13
code:
  - apps/web/src/hooks/transactionQueryUtils.ts
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/ui/TagInput.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/hooks/useAccountBookTagSuggestions.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/test-setup.ts
  - apps/web/src/components/report/TagFilterSelector.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
tests:
  - apps/web/specs/category.spec.ts
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/reportTagFilterSelector.spec.tsx
  - apps/web/specs/transactionFormTags.spec.tsx
  - apps/web/specs/useAccountBookTagSuggestions.spec.ts
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/reportSection.spec.tsx
-->

---
### Requirement: Synchronize fields on account book switch in transaction form
When the user switches the account book in the transaction modal during creation, the system SHALL update all account book-dependent fields to their defaults for the newly selected account book.
Account book-dependent fields:
- categoryId (SHALL reset to the default category of the newly selected account book, or empty if none)
- paidByDetail and splitDetail for expenses (SHALL reset to the default payer and split detail for the newly selected account book based on its members)
- receivedByUserId/paidByDetail/splitDetail for incomes (SHALL reset to the default recipient for the newly selected account book based on its members)

Unrelated fields:
- amount, date, and description SHALL remain unchanged.

#### Scenario: Switching account book for expense resets dependent fields
- **WHEN** the user switches the account book in the expense modal from Book A to Book B
- **THEN** categoryId SHALL be updated to the default category of Book B
- **AND** paidByDetail SHALL be updated to the default payer (the first active member of Book B)
- **AND** splitDetail SHALL be updated to all active members of Book B (except the shared wallet)
- **AND** amount, date, and description SHALL preserve their original inputs

#### Scenario: Switching account book for income resets recipient and category
- **WHEN** the user switches the account book in the income modal from Book A to Book B
- **THEN** categoryId SHALL be updated to the default category of Book B
- **AND** receivedByUserId, paidByDetail, and splitDetail SHALL be updated to the default recipient of Book B (the first active member of Book B)
- **AND** amount, date, and description SHALL preserve their original inputs


<!-- @trace
source: 2026-07-22-sync-transaction-modal-account-book-switch
updated: 2026-07-22
code:
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/hooks/useUsersByAccountBook.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
tests:
  - apps/web/specs/useUsersByAccountBook.spec.tsx
-->

---
### Requirement: Allow subcategory creation under newly selected account book
When the user switches the account book in the transaction modal and then creates a subcategory, the newly created subcategory SHALL be associated with the selected account book.

#### Scenario: Creating a subcategory under selected account book
- **WHEN** the user switches the account book in the modal and adds a subcategory
- **THEN** the system SHALL create the subcategory in the selected account book
- **AND** the category selector SHALL display the new subcategory

<!-- @trace
source: 2026-07-22-sync-transaction-modal-account-book-switch
updated: 2026-07-22
code:
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/hooks/useUsersByAccountBook.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
tests:
  - apps/web/specs/useUsersByAccountBook.spec.tsx
-->

---
### Requirement: Prevent race condition on account book switch in transaction form
When the user switches the account book in the transaction modal, the system SHALL immediately set the loading state to true for categories and users of the newly selected account book, preventing the form from rendering or resetting fields with stale data from the previously selected account book.
Once categories and users for the new account book are fully loaded:
- categoryId SHALL be updated to the default category of the newly selected account book
- paidByDetail SHALL be updated to the default payer (the first active member of the newly selected account book)
- splitDetail SHALL be updated to all active members of the newly selected account book (except the shared wallet)

#### Scenario: Switching account book correctly loads new book defaults
- **WHEN** the user switches the account book in the expense modal from Book A to Book B
- **THEN** the system SHALL immediately set loading to true
- **AND** once loading finishes, the categoryId, paidByDetail, and splitDetail SHALL be updated to Book B defaults (first member for payer, all members for split)

<!-- @trace
source: fix-transaction-modal-account-book-switch-race-condition
updated: 2026-07-23
code:
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/hooks/useUsersByAccountBook.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/hooks/useCategoriesByAccountBook.ts
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
tests:
  - apps/web/specs/useUsersByAccountBook.spec.tsx
-->

---
### Requirement: Transaction submission controls use a readable primary foreground

The transaction modal's primary create and save controls SHALL render their text in white over the primary surface, including while validation or submission state leaves the control disabled. The controls SHALL retain their existing localized label, disabled behavior, and submission behavior.

#### Scenario: Open a new transaction modal before all required values are valid

- **WHEN** a user opens the transaction modal and the primary create control is disabled
- **THEN** the control's label SHALL render in white over its primary surface
- **THEN** the control SHALL remain disabled until the existing validation conditions are met

#### Scenario: Save an editable transaction

- **WHEN** a user opens an existing transaction in edit mode
- **THEN** the primary save control's label SHALL render in white over its primary surface
- **THEN** activating an enabled control SHALL preserve the existing save workflow

<!-- @trace
source: fix-transaction-submit-button-foreground
updated: 2026-08-31
code:
  - apps/web/src/components/onboarding/LanguageStep.tsx
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/components/onboarding/AccountBookStep.tsx
  - apps/web/src/components/onboarding/OnboardingWelcomeModal.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-mobile-dark-chromium-darwin.png
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/report/TagFilterSelector.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-mobile-dark-chromium-darwin.png
  - apps/web/src/components/settlement/SettlementMarkdownModal.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-tablet-light-chromium-darwin.png
  - apps/web/src/components/TransactionModal/PaidByDetailModal.tsx
  - apps/web/src/components/ui/AppButton.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-tablet-light-chromium-darwin.png
  - apps/web/DESIGN.md
  - apps/web/src/components/onboarding/EntryShell.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-tablet-dark-chromium-darwin.png
  - apps/web-e2e/src/helpers/onboarding.ts
  - apps/web/src/components/categorySettings/SubCategoryItem.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-mobile-light-chromium-darwin.png
  - apps/web/public/images/ui/duoji-banner-travel.webp
  - apps/web/.impeccable/live/config.json
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-mobile-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-mobile-dark-chromium-darwin.png
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web/src/components/categorySettings/DeleteConfirmModal.tsx
  - apps/web/src/components/onboarding/StepShell.tsx
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/tailwind.config.js
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-mobile-light-chromium-darwin.png
  - apps/web/src/components/TransactionModal/CategorySelector.tsx
  - apps/web/src/components/ui/TagInput.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-mobile-light-chromium-darwin.png
  - apps/web/src/pages/settings.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-tablet-light-chromium-darwin.png
  - apps/web/src/components/TransactionModal/amountInputStyles.ts
  - apps/web/src/components/accountBookSettings/AccountBookNavHeader.tsx
  - apps/web/src/components/TransactionModal/SplitDetailModal.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-tablet-dark-chromium-darwin.png
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/components/categorySettings/CategoryGroupItem.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-tablet-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-tablet-light-chromium-darwin.png
  - apps/web/src/components/calendar/WeekStrip.tsx
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-tablet-dark-chromium-darwin.png
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-mobile-dark-chromium-darwin.png
  - apps/web/src/pages/index.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-tablet-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-tablet-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-tablet-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-tablet-light-chromium-darwin.png
  - apps/web/src/pages/styles.css
  - apps/web/src/components/report/MemberFilterSelector.tsx
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/public/images/ui/duoji-banner-background.webp
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/components/layout/header.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-narrow-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-mobile-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-mobile-dark-chromium-darwin.png
  - apps/web/.impeccable/design.json
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/calendar/TransactionCalendar.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/components/ui/SurfaceCard.tsx
  - docs/superpowers/specs/2026-08-30-calendar-width-and-touch-target-design.md
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-mobile-dark-chromium-darwin.png
  - apps/web/src/components/onboarding/ProfileStep.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-mobile-light-chromium-darwin.png
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/src/components/categorySettings/AddCategoryModal.tsx
  - apps/web/src/components/TransactionModal/DetailBalanceNotice.tsx
  - apps/web/src/components/calendar/MonthGrid.tsx
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/components/settlement/settlementModalStyles.ts
  - apps/web/src/components/transaction/TransactionHero.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-tablet-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-tablet-dark-chromium-darwin.png
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-tablet-dark-chromium-darwin.png
  - apps/web/src/components/accountBookSettings/AccountBookForm.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/components/TransactionModal/formControlStyles.ts
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-mobile-dark-chromium-darwin.png
  - apps/web/src/components/ui/PageScaffold.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-mobile-light-chromium-darwin.png
  - apps/web/src/pages/onboarding/index.tsx
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/pages/login.tsx
  - docs/superpowers/specs/2026-08-30-transaction-hero-parallax-design.md
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-tablet-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-mobile-light-chromium-darwin.png
  - apps/web/PRODUCT.md
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-mobile-dark-chromium-darwin.png
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-tablet-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-mobile-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-mobile-dark-chromium-darwin.png
  - apps/web/src/components/onboarding/OnboardingTutorial.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-tablet-light-chromium-darwin.png
  - apps/web/scripts/process-banner-assets.mjs
tests:
  - apps/web/specs/transactionSurfacePresentation.spec.tsx
  - apps/web/specs/bannerAssets.spec.ts
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/routeFamilyVisualContract.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/transactionCalendarPresentation.spec.tsx
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/transactionHero.spec.tsx
  - apps/web/specs/categoryTransactionsModalPresentation.spec.tsx
  - apps/web/specs/onboardingPresentation.spec.tsx
  - apps/web/specs/AppButton.spec.tsx
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/reportChartsPresentation.spec.tsx
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlementModals.spec.tsx
  - apps/web/specs/categoryMemberPresentation.spec.tsx
  - apps/web/specs/visualPrimitives.spec.tsx
  - apps/web-e2e/src/transaction-modal-mobile.spec.ts
  - apps/web-e2e/src/ui-visual-regression.spec.ts
-->