# account-books Specification

## Purpose

TBD - created by archiving change 'migrate-project-instructions-to-spectra'. Update Purpose after archive.

## Requirements

### Requirement: Users can manage personal account books

The system SHALL allow users to create, rename, and delete private account books for personal expense tracking during Phase 1.

#### Scenario: Create a personal account book

- **WHEN** a user submits valid details for a new personal account book
- **THEN** the system SHALL create the account book and make it available for selection

#### Scenario: Delete a personal account book

- **WHEN** a user confirms deletion of an existing personal account book
- **THEN** the system SHALL remove that account book from the available account book list


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
### Requirement: The application maintains an active account book

The system SHALL maintain one active account book context for transaction creation, transaction listing, and account-book-scoped summaries. After local persistence initializes and personal account books become available, the system SHALL establish an active account book before the user performs account-book-scoped actions.

#### Scenario: Bootstrap the active account book on startup

- **WHEN** the application finishes loading persisted account books and at least one account book exists with no current active selection
- **THEN** the system SHALL select a deterministic active account book for subsequent account-book-scoped views

#### Scenario: Switch the active account book

- **WHEN** a user selects a different account book from the account book picker
- **THEN** the system SHALL use the selected account book as the active context for subsequent account-book-scoped views

#### Scenario: Create the first active account book

- **WHEN** a user creates an account book while no active account book is currently selected
- **THEN** the system SHALL use the newly created account book as the active context

#### Scenario: Delete the active account book when another account book remains

- **WHEN** a user deletes the currently active account book and at least one other account book remains
- **THEN** the system SHALL switch the active context to one of the remaining account books

#### Scenario: Delete the last active account book

- **WHEN** a user deletes the currently active account book and no other account books remain
- **THEN** the system SHALL clear the active account book context until another account book becomes available


<!-- @trace
source: implement-accountbook-store
updated: 2026-03-20
code:
  - apps/web/src/pages/_app.tsx
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/mocks/index.ts
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - apps/web/src/lib/dexie.ts
  - apps/web/package.json
  - apps/web/src/mocks/accountBook.ts
  - apps/web/src/stores/accountBook/accountBookStoreProvider.tsx
tests:
  - apps/web/specs/accountBookStore.spec.ts
-->

---
### Requirement: The account book list indicates the current selection

The system SHALL present the available personal account books and clearly indicate which account book is currently active.

#### Scenario: View the account book list

- **WHEN** a user opens the account book management or selection interface
- **THEN** the system SHALL display the active account book distinctly from inactive account books

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