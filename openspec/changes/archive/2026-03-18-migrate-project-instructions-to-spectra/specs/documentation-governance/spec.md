## ADDED Requirements

### Requirement: Spectra owns canonical project knowledge

The project SHALL store canonical product requirements, shared project context for artifact generation, and approved change planning under `openspec/` so Spectra workflows can operate without depending on agent-only instruction files.

#### Scenario: Contributor asks for project truth

- **WHEN** a contributor uses a Spectra workflow to ask about product scope, architecture expectations, or approved change planning
- **THEN** the answer SHALL be derivable from documents stored under `openspec/`

### Requirement: Agent instructions contain behavior guidance only

Agent instruction files SHALL describe workflow routing, tool constraints, and response behavior, and SHALL NOT be the canonical location for product scope, architecture truth, or backlog status.

#### Scenario: Product knowledge changes

- **WHEN** product scope, architecture truth, or backlog planning changes
- **THEN** the canonical update SHALL occur in `openspec/` before any supporting instruction file is adjusted

### Requirement: Shared project context is centralized for artifact generation

The project SHALL keep reusable repository context, including technology stack, architectural conventions, and modeling patterns needed by Spectra artifact generation, in `openspec/config.yaml`.

#### Scenario: A new change is proposed

- **WHEN** a contributor creates a new Spectra proposal or design artifact
- **THEN** the workflow SHALL be able to derive common project context from `openspec/config.yaml`

### Requirement: Backlog planning is tracked as changes

The project SHALL capture planned work as Spectra changes, including parked changes when delivery is deferred, instead of using a global instruction file as the primary backlog tracker.

#### Scenario: New planned work is identified

- **WHEN** the team identifies a new phase task or follow-up effort
- **THEN** that work SHALL be represented as a Spectra change or parked change rather than only as a global markdown backlog entry