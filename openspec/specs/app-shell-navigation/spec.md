# app-shell-navigation Specification

## Purpose

TBD - created by archiving change 'migrate-project-instructions-to-spectra'. Update Purpose after archive.

## Requirements

### Requirement: The application provides a shared app shell

The web application SHALL provide a shared app shell that wraps primary pages in a consistent layout.

#### Scenario: Open a primary application page

- **WHEN** a user navigates to a primary page within the web application
- **THEN** the system SHALL render that page within the shared application shell


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
### Requirement: The application provides primary navigation for Phase 1

The web application SHALL provide primary navigation for the account book area, transaction entry flow, and statistics area.

#### Scenario: Use primary navigation

- **WHEN** a user interacts with the main navigation controls
- **THEN** the system SHALL allow movement between the primary Phase 1 areas of the application


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
### Requirement: The shell supports page title and back navigation patterns

The shared app shell SHALL support page title presentation and contextual back navigation where a page is not a top-level destination. Nested account book settings routes SHALL present titles and back targets that reflect whether the user is on the account book list, a new account book page, an existing account book settings page, or that account book's category settings page.

#### Scenario: Open a nested page

- **WHEN** a user navigates to a non-top-level page inside the application shell
- **THEN** the system SHALL present the page title and a contextual back-navigation control

#### Scenario: Open the new account book page

- **WHEN** a user navigates from the account book settings list to the new account book page
- **THEN** the system SHALL present a page title for creating an account book and a back-navigation control that returns to the account book settings list

#### Scenario: Open an existing account book settings page

- **WHEN** a user navigates from the account book settings list to a specific account book's settings page
- **THEN** the system SHALL present that page within the shared shell with a title, account-book-scoped actions, and a back-navigation control that returns to the account book settings list

#### Scenario: Open category settings from account book settings

- **WHEN** a user navigates from an account book's settings page to that account book's category settings page
- **THEN** the system SHALL present a contextual back-navigation control that returns to the originating account book settings page


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
### Requirement: The shell is usable on mobile-first and desktop layouts

The shared app shell SHALL remain usable on mobile-first layouts and on wider desktop viewports.

#### Scenario: Resize the viewport

- **WHEN** the application is viewed on a phone-sized viewport or a desktop-sized viewport
- **THEN** the system SHALL preserve primary navigation access and readable page structure

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