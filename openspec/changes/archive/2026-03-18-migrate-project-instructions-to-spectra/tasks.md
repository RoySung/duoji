## 1. Governance migration

- [x] 1.1 Implement Centralize project context in openspec/config.yaml and Shared project context is centralized for artifact generation by moving reusable repository context from agent-only instructions into `openspec/config.yaml`.
- [x] 1.2 Implement Separate product truth from agent behavior and Spectra owns canonical project knowledge by relocating product and architecture truth from instruction files into `openspec/`.
- [x] 1.3 Implement Separate product truth from agent behavior and Agent instructions contain behavior guidance only by slimming `.github/copilot-instructions.md` to workflow and agent-operating guidance.
- [x] 1.4 Implement Replace global todo instructions with change-based backlog planning and Backlog planning is tracked as changes by converting the Phase 1 todo into Spectra changes or parked changes.
- [x] 1.5 Implement Keep AGENTS.md and CLAUDE.md as thin Spectra entrypoints by reducing those files to Spectra workflow routing and removing duplicated project truth.
- [x] 1.6 Implement Bootstrap core capability specs from the validated Phase 1 surface by preparing the new capability specs for publication into `openspec/specs/` during archive.

## 2. Core capability publication

- [x] 2.1 Review and publish Users can manage personal account books in the `account-books` capability and map any remaining implementation gaps into follow-up changes.
- [x] 2.2 Review and publish The application maintains an active account book and The account book list indicates the current selection in the `account-books` capability.
- [x] 2.3 Review and publish Users can record income and expense transactions and Users can edit and delete transactions in the `transactions` capability.
- [x] 2.4 Review and publish Transactions are presented in an account-book-scoped list in the `transactions` capability.
- [x] 2.5 Review and publish Default categories exist for income and expense flows and Transactions use typed categories in the `categories` capability.
- [x] 2.6 Review and publish Custom categories support visual metadata in the `categories` capability.
- [x] 2.7 Review and publish Core domain records persist locally in IndexedDB and Local data survives browser sessions in the `local-persistence` capability.
- [x] 2.8 Review and publish Required local stores are initialized before use in the `local-persistence` capability.
- [x] 2.9 Review and publish The application provides a shared app shell and The application provides primary navigation for Phase 1 in the `app-shell-navigation` capability.
- [x] 2.10 Review and publish The shell supports page title and back navigation patterns and The shell is usable on mobile-first and desktop layouts in the `app-shell-navigation` capability.

## 3. Validation and rollout

- [x] 3.1 Verify documentation redirects from `.github/instructions/prd.instructions.md` and `.github/instructions/phase-1-todo.instructions.md` to Spectra-owned sources.
- [x] 3.2 Create the initial parked or follow-up changes needed to carry the retired Phase 1 backlog after the instruction migration lands.
- [x] 3.3 Run `spectra analyze migrate-project-instructions-to-spectra --json` and resolve any Critical or Warning findings.
- [x] 3.4 Run `spectra validate migrate-project-instructions-to-spectra` and confirm the change is ready for archive.