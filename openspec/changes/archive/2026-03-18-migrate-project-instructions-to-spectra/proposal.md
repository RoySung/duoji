## Why

Project knowledge is currently split across PRD instructions, phase-specific todo instructions, agent instructions, and lightweight Spectra bootstrap files. This makes Spectra incomplete as the project source of truth and forces contributors to reconcile overlapping documents manually.

## What Changes

- Move project-level product context and architecture conventions from agent-only instructions into Spectra-owned documents.
- Define a clear documentation governance model that separates product truth, change planning, and agent behavior.
- Bootstrap initial Spectra capabilities for the current Phase 1 personal finance experience instead of treating the PRD as a monolithic instruction file.
- Replace the phase todo instruction file with Spectra-managed change planning so future work is tracked as changes rather than global instructions.
- Reduce agent instruction files to workflow and behavior guidance only.

## Capabilities

### New Capabilities

- `documentation-governance`: Defines where product knowledge, project context, backlog planning, and agent behavior SHALL live across openspec and instruction files.
- `account-books`: Defines the current-truth requirements for personal account book management in Phase 1.
- `transactions`: Defines the current-truth requirements for creating, editing, deleting, and listing financial records in Phase 1.
- `categories`: Defines the current-truth requirements for expense and income category management in Phase 1.
- `local-persistence`: Defines the current-truth requirements for IndexedDB-based local storage used by the web application.
- `app-shell-navigation`: Defines the current-truth requirements for the main application shell and primary navigation structure.

### Modified Capabilities

(none)

## Impact

- Affected specs: `documentation-governance`, `account-books`, `transactions`, `categories`, `local-persistence`, `app-shell-navigation`
- Affected code: `openspec/config.yaml`, `openspec/specs/**/*`, `openspec/changes/migrate-project-instructions-to-spectra/**/*`, `.github/copilot-instructions.md`, `.github/instructions/prd.instructions.md`, `.github/instructions/phase-1-todo.instructions.md`, `AGENTS.md`, `CLAUDE.md`, `README.md`