## Context

The repository currently distributes product requirements, architecture conventions, and backlog tracking across `.github/instructions/*.md`, `.github/copilot-instructions.md`, and thin Spectra bootstrap files. Spectra workflows can only rely on `openspec/`, so the current structure leaves Spectra without enough project truth to generate proposals, answer requirement questions, or plan work consistently.

This migration is a documentation-governance change rather than a feature delivery change. It needs to preserve useful agent behavior guidance while moving project truth into Spectra-owned artifacts and avoiding the mistake of turning unresolved roadmap items into current truth.

## Goals / Non-Goals

**Goals:**

- Centralize reusable project context for Spectra artifact generation in `openspec/config.yaml`.
- Define a durable boundary between product truth, change planning, and agent behavior.
- Create initial capability specs for the core Phase 1 personal-finance surface that the team wants Spectra to reason about.
- Replace the phase todo instruction pattern with Spectra change planning, including parked changes for deferred work.
- Keep workflow entrypoint files lightweight and aligned with Spectra usage.

**Non-Goals:**

- Implementing account book, transaction, category, or persistence features.
- Finalizing Phase 2 to Phase 4 scope as current-truth specs.
- Replacing editor-specific agent behavior rules with Spectra artifacts.
- Redesigning the repository structure or changing the Nx workspace layout.

## Decisions

### Centralize project context in openspec/config.yaml

Project-wide background that multiple Spectra artifacts need repeatedly, such as the Nx monorepo structure, Next.js Pages Router usage, HeroUI preference, Zod-first entity design, repository pattern, and mock-first workflow, SHALL move into `openspec/config.yaml`. This keeps proposal, design, and task generation grounded in the same context. The alternative was to keep this knowledge in `.github/copilot-instructions.md`, but that would leave Spectra artifacts blind to the project's actual conventions.

### Separate product truth from agent behavior

Product requirements, architecture truth, and backlog planning SHALL live under `openspec/`, while agent instruction files SHALL keep only workflow routing, tool constraints, and response behavior. This avoids using instruction files as a second specification system. The alternative was to keep a shared hybrid document, but that would preserve the current duplication problem and make it unclear which source wins.

### Bootstrap core capability specs from the validated Phase 1 surface

The migration SHALL introduce capability specs for documentation governance plus the core Phase 1 personal-finance surface: account books, transactions, categories, local persistence, and app shell navigation. This gives Spectra enough structure to reason about the product without importing the entire long-term PRD into current truth. The alternative was to migrate the PRD wholesale, but that would incorrectly elevate future roadmap items such as cloud sync, notifications, and split billing into immediate truth.

### Replace global todo instructions with change-based backlog planning

Phase planning SHALL move from a global instruction file into Spectra changes and parked changes. The implementation will convert the Phase 1 todo from a standing instruction into planned work items, so future work is tracked in the same system used for proposal and implementation. The alternative was to keep the markdown todo as a backlog mirror, but that would reintroduce drift between planning and execution.

### Keep AGENTS.md and CLAUDE.md as thin Spectra entrypoints

`AGENTS.md` and `CLAUDE.md` SHALL remain as lightweight workflow entrypoints that tell agents how to use Spectra in this repository. They SHALL NOT become a second place for product or backlog truth. The alternative was to expand those files with project detail, but that would duplicate the knowledge already being moved into `openspec/`.

## Risks / Trade-offs

- [Risk] Initial capability specs overstate what is already implemented. → Mitigation: keep the scope limited to the agreed Phase 1 surface and leave later phases in change planning rather than main specs.
- [Risk] Contributors continue updating deprecated instruction files out of habit. → Mitigation: add explicit redirect language during implementation and slim the files so duplicated content is removed.
- [Risk] Some architecture guidance does not fit capability-spec language. → Mitigation: store reusable project context in `openspec/config.yaml` instead of forcing it into product specs.
- [Risk] Migration touches several documentation entrypoints at once. → Mitigation: implement in a fixed order: config context, capability specs, instruction slimming, then backlog conversion.

## Migration Plan

1. Enrich `openspec/config.yaml` with shared project context now stored in agent-only instructions.
2. Create and review the new capability specs introduced by this change.
3. Slim `.github/copilot-instructions.md`, `.github/instructions/prd.instructions.md`, and `.github/instructions/phase-1-todo.instructions.md` so they defer to Spectra for product truth and planning.
4. Update `AGENTS.md` and `CLAUDE.md` only as needed to keep them as Spectra workflow pointers.
5. Convert outstanding Phase 1 work into follow-up Spectra changes or parked changes.

Rollback is documentation-only: restore the previous instruction-heavy files from version control and drop the unarchived change if the migration proves too disruptive.

## Open Questions

- Should `README.md` keep a short roadmap summary for human onboarding, or link to Spectra artifacts only?
- Should the Phase 1 backlog be represented as one umbrella parked change, or as multiple parked changes aligned with the new capability boundaries?