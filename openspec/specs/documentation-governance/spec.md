# documentation-governance Specification

## Purpose

TBD - created by archiving change 'migrate-project-instructions-to-spectra'. Update Purpose after archive.

## Requirements

### Requirement: Spectra owns canonical project knowledge

The project SHALL store canonical product requirements, shared project context for artifact generation, and approved change planning under `openspec/` so Spectra workflows can operate without depending on agent-only instruction files.

#### Scenario: Contributor asks for project truth

- **WHEN** a contributor uses a Spectra workflow to ask about product scope, architecture expectations, or approved change planning
- **THEN** the answer SHALL be derivable from documents stored under `openspec/`


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
### Requirement: Agent instructions contain behavior guidance only

Agent instruction files SHALL describe workflow routing, tool constraints, and response behavior, and SHALL NOT be the canonical location for product scope, architecture truth, or backlog status.

#### Scenario: Product knowledge changes

- **WHEN** product scope, architecture truth, or backlog planning changes
- **THEN** the canonical update SHALL occur in `openspec/` before any supporting instruction file is adjusted


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
### Requirement: Shared project context is centralized for artifact generation

The project SHALL keep reusable repository context, including technology stack, architectural conventions, and modeling patterns needed by Spectra artifact generation, in `openspec/config.yaml`.

#### Scenario: A new change is proposed

- **WHEN** a contributor creates a new Spectra proposal or design artifact
- **THEN** the workflow SHALL be able to derive common project context from `openspec/config.yaml`


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
### Requirement: Backlog planning is tracked as changes

The project SHALL capture planned work as Spectra changes, including parked changes when delivery is deferred, instead of using a global instruction file as the primary backlog tracker.

#### Scenario: New planned work is identified

- **WHEN** the team identifies a new phase task or follow-up effort
- **THEN** that work SHALL be represented as a Spectra change or parked change rather than only as a global markdown backlog entry

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