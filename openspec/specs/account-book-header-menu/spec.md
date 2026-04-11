# account-book-header-menu Specification

## Purpose

TBD - created by archiving change 'add-header-with-account-book-dropdown'. Update Purpose after archive.

## Requirements

### Requirement: The header displays the current account book and allows switching

On account book pages, the application header SHALL display the name of the currently active account book and provide a dropdown menu to switch between all available account books.

#### Scenario: View header on an account book page

- **WHEN** a user navigates to an account book page (`/account-books/[id]` or any sub-route)
- **THEN** the system SHALL display the header with the current account book name as the dropdown trigger label

#### Scenario: Open the account book dropdown

- **WHEN** a user clicks the account book menu trigger in the header
- **THEN** the system SHALL display a dropdown list of all available account books with the current account book visually highlighted

#### Scenario: Switch account book via dropdown

- **WHEN** a user selects a different account book from the dropdown
- **THEN** the system SHALL navigate to that account book's page and update the header label accordingly

#### Scenario: Create a new account book via dropdown

- **WHEN** a user clicks "New account book" at the bottom of the dropdown
- **THEN** the system SHALL navigate to the new account book creation page


<!-- @trace
source: add-header-with-account-book-dropdown
updated: 2026-04-11
code:
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/package.json
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/stores/transaction/index.ts
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - .spectra.yaml
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/next.config.js
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/src/components/layout/navbar.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/jest.config.ts
  - apps/web/src/pages/settings.tsx
  - apps/web/src/pages/account-books/new.tsx
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - .github/skills/spectra-debug/SKILL.md
  - .github/prompts/spectra-ingest.prompt.md
  - .github/prompts/spectra-propose.prompt.md
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/src/hooks/useSettlement.ts
  - .github/skills/spectra-propose/SKILL.md
  - apps/web/src/entities/settlement.ts
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - .github/prompts/spectra-debug.prompt.md
  - CLAUDE.md
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/repositories/settlementRepo/index.ts
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/pages/settings/account-books/new.tsx
  - .github/prompts/spectra-ask.prompt.md
  - AGENTS.md
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - GEMINI.md
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/stores/transaction/transactionStore.ts
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/.babelrc
  - apps/web/src/pages/_app.tsx
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/src/utils/settlementUtils.ts
  - .github/skills/spectra-ingest/SKILL.md
  - .github/prompts/spectra-apply.prompt.md
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
tests:
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/transactionUtils.spec.ts
-->

---
### Requirement: The header shows the app title on non-account-book pages

On pages outside the account book area, the application header SHALL display the app title only, without the account book dropdown.

#### Scenario: View header on a non-account-book page

- **WHEN** a user navigates to a page that is not an account book route (e.g., settings, home)
- **THEN** the system SHALL display the header with the app title and no account book dropdown

<!-- @trace
source: add-header-with-account-book-dropdown
updated: 2026-04-11
code:
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/package.json
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/stores/transaction/index.ts
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - .spectra.yaml
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/next.config.js
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/src/components/layout/navbar.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/jest.config.ts
  - apps/web/src/pages/settings.tsx
  - apps/web/src/pages/account-books/new.tsx
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - .github/skills/spectra-debug/SKILL.md
  - .github/prompts/spectra-ingest.prompt.md
  - .github/prompts/spectra-propose.prompt.md
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/src/hooks/useSettlement.ts
  - .github/skills/spectra-propose/SKILL.md
  - apps/web/src/entities/settlement.ts
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - .github/prompts/spectra-debug.prompt.md
  - CLAUDE.md
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/repositories/settlementRepo/index.ts
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/pages/settings/account-books/new.tsx
  - .github/prompts/spectra-ask.prompt.md
  - AGENTS.md
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - GEMINI.md
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/stores/transaction/transactionStore.ts
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/.babelrc
  - apps/web/src/pages/_app.tsx
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/src/utils/settlementUtils.ts
  - .github/skills/spectra-ingest/SKILL.md
  - .github/prompts/spectra-apply.prompt.md
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
tests:
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/transactionUtils.spec.ts
-->