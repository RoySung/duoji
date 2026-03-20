## Context

- Approved specs already require account-book CRUD, one current account book context, and a visible current account-book indication.
- The current web app has an AccountBook Store and an IndexedDB-backed repository, but the implementation direction still mixes account-book selection with account-book management inside settings.
- The chosen information architecture keeps `/settings` as the top-level settings destination and places account-book management under `/settings/account-books`.
- The requested scope includes editing `name`, `currency`, and `description`, while moving current-account-book selection to a simple home-page selector.

## Goals / Non-Goals

**Goals:**

- Add a user-facing account-book settings flow that fits the existing Next.js Pages Router and shared app shell.
- Preserve `/settings` as the settings landing page while adding `/settings/account-books` as a nested page with title and back navigation.
- Reuse the existing AccountBook Store as the single source of truth for account-book list state, current selection, and CRUD orchestration.
- Keep the settings flow focused on create, edit, and delete while moving current-account-book selection to the home page.
- Add UI verification on top of the existing store-level regression coverage.

**Non-Goals:**

- Add a dedicated detail route such as `/settings/account-books/[id]`.
- Introduce backend APIs, remote sync, or authentication changes.
- Add shared account-book membership editing beyond the temporary local owner defaults already implied by the mock-first workflow.
- Redesign the AccountBook Store or repository contracts beyond what is needed for the settings flow.
- Keep current-account-book switching controls inside `/settings/account-books`.

## Decisions

### Keep settings as a two-step flow

The web app SHALL keep `/settings` as the top-level settings destination and expose account-book management from a nested `/settings/account-books` page. This preserves the current top-level navigation shape and gives the shared shell a concrete nested-page use case.

Alternative considered: placing account-book management directly on `/settings`. Rejected because the chosen information architecture keeps `/settings` as a landing page and because the nested shell pattern should be exercised by a real page.

### Use a list page with modal-based create and edit flows

The account-book settings experience SHALL use a list-based management page with modal-based create and edit interactions plus an explicit delete confirmation step. This matches the existing HeroUI modal usage already present in the web app and keeps mobile scanning costs lower than inline expandable editing.

Alternative considered: inline editable cards. Rejected because it would create a denser page with more persistent form state and weaker mobile readability.

Alternative considered: a master-detail route per account book. Rejected because it expands routing and nested shell complexity beyond the current need.

### Keep current account book selection outside settings

The settings flow SHALL manage account-book data only and SHALL NOT own current-account-book selection. The control that changes the current account book SHALL live on the home page so the selection follows day-to-day usage context rather than settings management.

Alternative considered: keeping current-account-book switching inside `/settings/account-books`. Rejected because it mixes operational context selection with account-book administration.

### Use a simple home-page selector for current account book choice

The first version SHALL place a simple current-account-book selector on the home page. It only needs to choose among the available account books and show the current selection clearly; it does not need a more elaborate picker pattern yet.

Alternative considered: introducing a more global selector in the shared shell immediately. Rejected because the user requested a temporary simple home-page control and no broader navigation redesign is needed yet.

### Rename active account book state to current account book terminology

The AccountBook Store and its public selectors and actions SHALL use current-account-book terminology instead of active-account-book terminology. This better matches the actual behavior: the value tracks the currently selected operational context, not a special settings-driven activation step.

Alternative considered: keeping the existing `active` naming while changing only UI placement. Rejected because the naming would continue to imply a different model than the one the user described.

### Reuse AccountBook Store as the only account-book state source

The home-page selector and the settings flow SHALL read account books, current selection, loading state, and errors from the existing AccountBook Store and call its existing actions for create, update, delete, and current-account-book changes. The UI SHALL NOT introduce a parallel account-book state layer.

Alternative considered: reading directly from the repository inside the settings page. Rejected because it would bypass the approved active-account-book orchestration already centralized in the store.

### Shape new account-book payloads at the UI boundary until real user context exists

The create flow SHALL build complete AccountBook payloads at the feature boundary, including id, timestamps, ownerId, and userIds. Until a real authenticated user context exists, the feature SHALL default ownership to the first local mock user and initialize `userIds` with that owner only.

Alternative considered: moving payload construction into the store. Rejected because the current store contract already accepts complete AccountBook entities and the temporary shaping logic is feature-specific.

### Verify current selection and settings behavior at the UI layer

The first verification pass SHALL add UI-oriented tests for the home-page selector, nested title and back behavior, current selection indication, and settings CRUD interactions, while relying on the existing AccountBook Store tests to preserve fallback behavior correctness.

Alternative considered: relying only on existing store tests. Rejected because the new value of this change is primarily in routing, page composition, and settings interactions.

## Risks / Trade-offs

- [The settings flow introduces more app-shell branching] -> Keep the nested header contract minimal and scoped to settings descendants first.
- [The temporary home-page selector may not be the final IA] -> Keep it simple and isolate it so it can move later without renaming the underlying store model again.
- [UI-side payload construction may become stale when real user context appears] -> Isolate the shaping logic so it can be replaced without changing page behavior.
- [Modal flows can hide validation details if over-condensed] -> Keep form fields explicit and surface errors inline.
- [Existing navigation spec language may not fully describe current settings usage] -> Limit the shell change to the nested-page behavior needed by account-book settings and keep home-page selection separate from shell redesign.

## Migration Plan

- Add Spectra deltas for account-book settings behavior and nested app-shell behavior.
- Replace the placeholder settings page with a landing page that links to account-book settings.
- Add the nested account-book settings page and wire it to the AccountBook Store for CRUD only.
- Add a simple home-page selector for the current account book and rename store terminology from active to current.
- Implement modal-based create and edit flows plus delete confirmation.
- Add UI verification and run the existing web test suite.

## Open Questions

- Whether the nested page header should remain settings-local or be extracted into a reusable shared layout helper can stay flexible during implementation as long as the shell requirement is met.
- When real user context is added later, replace the temporary owner defaulting strategy without changing the user-facing settings flow contract.
- Whether the home-page selector should later move into a more global app-shell location can stay open until broader navigation needs become clearer.