# account-book-routing Specification

## Purpose

TBD - created by archiving change 'split-settlement-feature'. Update Purpose after archive.

## Requirements

### Requirement: Home page displays account book list

The home page (`/`) SHALL display a list of all non-deleted account books owned by or shared with the current user.

If at least one account book exists, the home page SHALL automatically redirect to `/account-books/[firstBookId]` where `firstBookId` is the ID of the first account book in the list.

If no account books exist, the home page SHALL display an empty state with a call-to-action to create a new account book.

#### Scenario: User has account books

- **WHEN** the user navigates to `/` and at least one account book exists
- **THEN** the system SHALL redirect to `/account-books/[firstBookId]` without showing the list

#### Scenario: User has no account books

- **WHEN** the user navigates to `/` and no account books exist
- **THEN** the system SHALL display an empty state with a "新增帳本" affordance


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
### Requirement: Active account book is derived from the URL

The system SHALL determine the active account book from the `[id]` URL parameter on pages under `/account-books/[id]`. The active account book SHALL NOT be stored as persistent state in `AccountBookStore`.

Pages and components that need the active account book SHALL read `router.query.id` and use it to scope their data queries.

#### Scenario: Navigating to an account book page

- **WHEN** the user navigates to `/account-books/abc123`
- **THEN** the transaction list, settlement page, and navbar tabs SHALL all operate in the context of account book `abc123`

#### Scenario: Account book ID not found

- **WHEN** the `[id]` in the URL does not match any account book
- **THEN** the system SHALL display a "找不到帳本" (account book not found) message


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
### Requirement: Transaction list is accessible at the account book route

The transaction list view previously at `/` SHALL be accessible at `/account-books/[id]`. The page SHALL display transactions scoped to the account book identified by `[id]`.

#### Scenario: Viewing transactions for a specific account book

- **WHEN** the user navigates to `/account-books/[id]`
- **THEN** the system SHALL display only transactions belonging to that account book

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