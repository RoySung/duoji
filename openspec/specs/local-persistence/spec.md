# local-persistence Specification

## Purpose

TBD - created by archiving change 'migrate-project-instructions-to-spectra'. Update Purpose after archive.

## Requirements

### Requirement: Core domain records persist locally in IndexedDB

The web application SHALL persist account books, transactions, categories, settlements, and user-related local records in IndexedDB. The transactions table SHALL index the `settlementRecordId` field to support efficient unsettled-transaction queries.

#### Scenario: Save a new domain record

- **WHEN** the application creates or updates an account book, transaction, category, settlement record, or other local user record
- **THEN** the system SHALL persist the change in IndexedDB

#### Scenario: Index supports unsettled transaction lookup

- **WHEN** the Dexie schema is initialized
- **THEN** the transactions table SHALL have an index on `settlementRecordId` so that queries filtering by that field do not require a full table scan


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
### Requirement: Local data survives browser sessions

The web application SHALL restore previously saved local records when the same user opens the application in a later browser session on the same device.

#### Scenario: Reopen the application

- **WHEN** a user returns to the application after closing the browser session on the same device
- **THEN** the system SHALL load the previously saved local records from IndexedDB


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
### Requirement: Required local stores are initialized before use

The web application SHALL initialize the required local persistence stores before repository-backed domain operations are executed.

#### Scenario: First launch on a device

- **WHEN** a user opens the application on a device with no existing local data
- **THEN** the system SHALL initialize the required IndexedDB stores before the user performs repository-backed actions

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