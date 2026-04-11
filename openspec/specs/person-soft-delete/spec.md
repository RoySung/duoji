# person-soft-delete Specification

## Purpose

TBD - created by archiving change 'soft-delete-person'. Update Purpose after archive.

## Requirements

### Requirement: Virtual users support soft deletion

The system SHALL support soft deletion of virtual users by setting a `deletedAt` timestamp on the `VirtualUser` record instead of removing it. A virtual user with a `deletedAt` value SHALL be considered deleted. A virtual user without a `deletedAt` value SHALL be considered active.

#### Scenario: Soft-delete a virtual user

- **WHEN** a user triggers the delete action for a virtual user in the account book settings
- **THEN** the system SHALL set `deletedAt` to the current Unix timestamp (ms) on that virtual user record
- **AND** the system SHALL NOT remove the virtual user record from storage

#### Scenario: Active people list excludes deleted virtual users

- **WHEN** the people store resolves the active member list for an account book
- **THEN** the system SHALL exclude all virtual users whose `deletedAt` is set from the active people list

#### Scenario: All people list includes deleted virtual users

- **WHEN** the people store resolves the full member list for an account book
- **THEN** the system SHALL include all virtual users regardless of `deletedAt` status


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
### Requirement: New transaction person selectors exclude deleted members

The system SHALL exclude deleted virtual users from all person selectors when creating a new transaction.

#### Scenario: Paid-by selector in new expense transaction

- **WHEN** a user opens the paid-by selector within a new expense transaction form
- **THEN** the system SHALL only show active (non-deleted) people

#### Scenario: Split selector in new expense transaction

- **WHEN** a user opens the split detail selector within a new expense transaction form
- **THEN** the system SHALL only show active (non-deleted) people

#### Scenario: Recipient selector in new income transaction

- **WHEN** a user opens the recipient selector within a new income transaction form
- **THEN** the system SHALL only show active (non-deleted) people


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
### Requirement: Edit transaction person selectors allow removal of deleted members only

The system SHALL include deleted virtual users in person selectors when editing an existing transaction, but SHALL restrict interaction to removal only.

#### Scenario: Deleted person already on a transaction remains selectable for removal

- **WHEN** a user opens the edit form for a transaction that references a deleted virtual user
- **THEN** the system SHALL display the deleted virtual user in the selector with a strikethrough style and a disabled state
- **AND** the system SHALL allow the user to deselect (remove) that deleted virtual user
- **AND** the system SHALL NOT allow the user to select (re-add) that deleted virtual user if not already present

#### Scenario: Deleted person not on a transaction is not selectable in edit form

- **WHEN** a user opens the edit form for a transaction that does NOT reference a deleted virtual user
- **THEN** the system SHALL NOT allow the user to select that deleted virtual user


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
### Requirement: Transaction views display deleted persons with strikethrough style

The system SHALL render any deleted virtual user referenced in a historical transaction with a strikethrough text style to indicate their deleted status.

#### Scenario: View a transaction referencing a deleted person

- **WHEN** a transaction in the home-page transaction list references a virtual user whose `deletedAt` is set
- **THEN** the system SHALL render that person's name with line-through styling

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