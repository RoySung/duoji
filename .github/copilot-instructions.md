# Duoji Project AI Assistant Instructions

## Canonical Sources

- Product requirements, architecture truth, and backlog planning live in `openspec/`.
- Shared project context for Spectra artifacts lives in `openspec/config.yaml`.
- If any instruction file conflicts with `openspec/`, treat `openspec/` as the canonical source.

## Workflow Expectations

- Use Spectra for structured planning and delivery: `discuss → propose → apply → archive` as appropriate.
- Treat parked changes as deferred backlog instead of maintaining separate roadmap or phase todo content in instruction files.
- When scope, requirements, or architecture truth changes, update the relevant Spectra change or spec before adjusting supporting instructions.

## Repo-Specific Agent Guidance

- Preserve the existing Nx monorepo layout and Next.js Pages Router structure.
- Prefer HeroUI for UI work and keep using `@/` absolute imports in the web app.
- Follow the existing Zod-first entity pattern and keep repository interfaces with their entity definitions.
- Keep feature components grouped by feature folder, shared layout code under `src/components/layout`, and UI primitives under `src/components/ui`.
- Prefer mock-first development when extending data flows.
- Keep comments and user-facing copy compatible with the repository's Traditional Chinese and mixed-language conventions.

## What Does Not Belong Here

- Do not use this file as the canonical PRD.
- Do not maintain phase backlog, roadmap state, or feature acceptance criteria here.
- Do not duplicate long-form architecture or product content that already belongs in `openspec/`.
