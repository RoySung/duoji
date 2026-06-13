# transaction-storage Specification

## Purpose

TBD - created by archiving change 'implement-transaction-repository'. Update Purpose after archive.

## Requirements

### Requirement: Transaction records persist through a dedicated repository

The system SHALL persist transaction records in IndexedDB through a dedicated transaction repository that validates each record before writing it to local storage.

#### Scenario: Create a valid transaction record

- **WHEN** the application saves a valid transaction for an account book through the repository
- **THEN** the system SHALL persist the transaction and return it from later repository reads

#### Scenario: Update an existing transaction record

- **WHEN** the application saves changes to an existing transaction through the repository
- **THEN** the system SHALL persist the updated record and later reads SHALL return the updated values

#### Scenario: Delete an existing transaction record

- **WHEN** the application deletes an existing transaction through the repository
- **THEN** the system SHALL remove it from local storage and later reads SHALL report that it is missing

#### Scenario: Reject an invalid transaction record

- **WHEN** the application attempts to save a transaction that fails repository validation
- **THEN** the system SHALL reject the write and SHALL NOT persist the invalid transaction record


<!-- @trace
source: implement-transaction-repository
updated: 2026-03-18
code:
  - phase-1.todo.md
  - .github/instructions/prd.instructions.md
  - .github/instructions/phase-1-todo.instructions.md
  - .github/prompts/spectra-debug.prompt.md
  - .github/prompts/spectra-ask.prompt.md
  - roadmap.md
  - .vscode/settings.json
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/repositories/transactionRepo/index.ts
  - .github/skills/spectra-ingest/SKILL.md
  - CLAUDE.md
  - .github/prompts/spectra-apply.prompt.md
  - .github/prompts/spectra-archive.prompt.md
  - .github/prompts/spectra-propose.prompt.md
  - apps/web/src/components/TransactionModal/PaidByDetailModal.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - .github/skills/spectra-apply/SKILL.md
  - .github/copilot-instructions.md
  - .github/skills/spectra-debug/SKILL.md
  - .github/skills/spectra-audit/SKILL.md
  - .github/skills/spectra-propose/SKILL.md
  - apps/web/src/entities/transaction.ts
  - .github/skills/spectra-discuss/SKILL.md
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/TransactionModal/SplitDetailModal.tsx
  - .github/skills/spectra-ask/SKILL.md
  - .github/skills/spectra-archive/SKILL.md
  - .github/prompts/spectra-audit.prompt.md
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - .github/prompts/spectra-discuss.prompt.md
  - AGENTS.md
tests:
  - apps/web/specs/transaction.spec.ts
-->

---
### Requirement: Transaction queries remain scoped to the target account book

The system SHALL allow the application to query locally stored transactions for one account book without returning transactions from other account books.

#### Scenario: Read transactions for one account book

- **WHEN** the application requests transactions for a specific account book
- **THEN** the system SHALL return only transaction records whose accountBookId matches that account book

#### Scenario: Read a transaction by identifier

- **WHEN** the application requests one transaction by its identifier
- **THEN** the system SHALL return that transaction when it exists or null when it does not exist


<!-- @trace
source: cache-tag-suggestions-in-localstorage
updated: 2026-06-13
code:
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/test-setup.ts
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/hooks/transactionQueryUtils.ts
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/components/report/TagFilterSelector.tsx
  - apps/web/src/components/ui/TagInput.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/hooks/useAccountBookTagSuggestions.ts
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
tests:
  - apps/web/specs/useAccountBookTagSuggestions.spec.ts
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/transactionFormTags.spec.tsx
  - apps/web/specs/reportTagFilterSelector.spec.tsx
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/category.spec.ts
-->

---
### Requirement: Local transaction data can be cleared for development workflows

The system SHALL support clearing all locally stored transactions so automated tests and local development can start from a clean state.

#### Scenario: Clear all local transactions

- **WHEN** automated tests or local development call the repository clear operation
- **THEN** the system SHALL remove all stored transaction records from the local transaction store

<!-- @trace
source: implement-transaction-repository
updated: 2026-03-18
code:
  - phase-1.todo.md
  - .github/instructions/prd.instructions.md
  - .github/instructions/phase-1-todo.instructions.md
  - .github/prompts/spectra-debug.prompt.md
  - .github/prompts/spectra-ask.prompt.md
  - roadmap.md
  - .vscode/settings.json
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/repositories/transactionRepo/index.ts
  - .github/skills/spectra-ingest/SKILL.md
  - CLAUDE.md
  - .github/prompts/spectra-apply.prompt.md
  - .github/prompts/spectra-archive.prompt.md
  - .github/prompts/spectra-propose.prompt.md
  - apps/web/src/components/TransactionModal/PaidByDetailModal.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - .github/skills/spectra-apply/SKILL.md
  - .github/copilot-instructions.md
  - .github/skills/spectra-debug/SKILL.md
  - .github/skills/spectra-audit/SKILL.md
  - .github/skills/spectra-propose/SKILL.md
  - apps/web/src/entities/transaction.ts
  - .github/skills/spectra-discuss/SKILL.md
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/TransactionModal/SplitDetailModal.tsx
  - .github/skills/spectra-ask/SKILL.md
  - .github/skills/spectra-archive/SKILL.md
  - .github/prompts/spectra-audit.prompt.md
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - .github/prompts/spectra-discuss.prompt.md
  - AGENTS.md
tests:
  - apps/web/specs/transaction.spec.ts
-->

---
### Requirement: Transactions can be queried by date range

The system SHALL allow the application to query transactions within a date range, optionally scoped to an account book. The repository SHALL return the complete Transaction records (not aggregated summaries) for the requested range.

#### Scenario: Query transactions for a date range within one account book

- **WHEN** the application requests transactions for account book "AB-1" from "2026-04-01" to "2026-04-30"
- **THEN** the system SHALL return all Transaction records whose accountBookId is "AB-1" and whose date falls within that range (inclusive)

#### Scenario: Query a date range with no matching transactions

- **WHEN** the application requests transactions for a date range that contains no records
- **THEN** the system SHALL return an empty array

#### Scenario: Query does not return transactions outside the date range

- **WHEN** the application requests transactions from "2026-04-01" to "2026-04-30"
- **THEN** the system SHALL NOT include transactions with dates before "2026-04-01" or after "2026-04-30"

<!-- @trace
source: reuse-monthly-transactions
updated: 2026-04-17
-->

<!-- @trace
source: reuse-monthly-transactions
updated: 2026-04-17
code:
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/entities/transaction.ts
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/calendar/MonthGrid.tsx
  - apps/web/eslint.config.mjs
  - apps/web/src/lib/dexie.ts
  - apps/web/package.json
  - apps/web/src/hooks/useAppQueryClient.ts
  - apps/web/src/components/calendar/calendarUtils.ts
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/calendar/TransactionCalendar.tsx
  - apps/web/src/hooks/transactionQueryUtils.ts
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/calendar/WeekStrip.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/pages/_app.tsx
tests:
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/transaction.spec.ts
-->