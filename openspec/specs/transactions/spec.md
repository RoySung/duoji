# transactions Specification

## Purpose

TBD - created by archiving change 'migrate-project-instructions-to-spectra'. Update Purpose after archive.

## Requirements

### Requirement: Users can record income and expense transactions

The system SHALL allow users to create transactions with a type, amount, date, category, note, and payment method within the active account book.

#### Scenario: Create an expense transaction

- **WHEN** a user submits a valid expense transaction form in the active account book
- **THEN** the system SHALL store the transaction and include it in the active account book transaction list

#### Scenario: Create an income transaction

- **WHEN** a user submits a valid income transaction form in the active account book
- **THEN** the system SHALL store the transaction and include it in the active account book transaction list


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

The system SHALL present transactions for the active account book in a browsable list grouped by date and accompanied by relevant totals for the visible range.

#### Scenario: View the transaction list

- **WHEN** a user opens the transaction history for the active account book
- **THEN** the system SHALL show only transactions that belong to the active account book and organize them by date

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