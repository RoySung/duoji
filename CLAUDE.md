<!-- SPECTRA:START v1.0.2 -->

# Spectra Instructions

This project uses Spectra for Spec-Driven Development(SDD). Specs live in `openspec/specs/`, change proposals in `openspec/changes/`.

## Use `/spectra-*` skills when:

- A discussion needs structure before coding → `/spectra-discuss`
- User wants to plan, propose, or design a change → `/spectra-propose`
- Tasks are ready to implement → `/spectra-apply`
- There's an in-progress change to continue → `/spectra-ingest`
- User asks about specs or how something works → `/spectra-ask`
- Implementation is done → `/spectra-archive`
- Commit only files related to a specific change → `/spectra-commit`

## Workflow

discuss? → propose → apply ⇄ ingest → archive

- `discuss` is optional — skip if requirements are clear
- Requirements change mid-work? Plan mode → `ingest` → resume `apply`

## Parked Changes

Changes can be parked（暫存）— temporarily moved out of `openspec/changes/`. Parked changes won't appear in `spectra list` but can be found with `spectra list --parked`. To restore: `spectra unpark <name>`. The `/spectra-apply` and `/spectra-ingest` skills handle parked changes automatically.

<!-- SPECTRA:END -->

# Architecture Layers

This project follows a clean architecture with three layers. See [`openspec/specs/architecture-layers/spec.md`](openspec/specs/architecture-layers/spec.md) for the full spec.

**Dependency rule:** UI/Page → Usecase (hooks, store) → Repo → Entity

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Entity | `src/entities/` | Data structures and domain logic. No external dependencies. |
| Usecase | `src/hooks/`, `src/stores/` | Coordinates repo calls, manages state. Hooks = local state; stores = global/shared state. |
| Repo | `src/repositories/` | Data access (IndexedDB, API). Called only by usecase layer. |

**Violations to avoid:**
- Pages/components importing from `src/repositories/` directly
- Entities importing from hooks, stores, or React

# Others Notes

- `roadmap.md` and `phase-1.todo.md` are planning and record-keeping documents for ideation, prioritization, and historical notes.
- They are not canonical sources for approved requirements, official backlog state, or implementation truth.
- If either file conflicts with `openspec/`, `openspec/` wins.
- When a plan becomes approved work, capture it in `openspec/changes/`.
