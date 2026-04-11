## MODIFIED Requirements

### Requirement: Usecase layer coordinates repo and exposes state to UI

The usecase layer consists of hooks (under `src/hooks/`) and stores (under `src/stores/`). Hooks SHALL be used for component-lifecycle-bound local state (i.e., state that is only needed within a single page or component subtree), while stores SHALL be used for shared global state that must persist across multiple unrelated pages or components. The usecase layer SHALL be responsible for coordinating repo calls, managing derived state, and exposing data and actions to the UI layer. Hooks MUST NOT be called inside stores, and stores MUST NOT be called inside hooks in a circular manner.

#### Scenario: Hook encapsulates repo access for local state

- **WHEN** a React hook under `src/hooks/` needs data from storage
- **THEN** it SHALL call a repo method (e.g., `repoRef.current.findByAccountBookId(id)`) and manage local state accordingly

#### Scenario: Store encapsulates cross-component state

- **WHEN** state must be shared across multiple unrelated components or pages
- **THEN** it SHALL be managed in a Zustand store under `src/stores/`, which internally calls repo methods as needed

#### Scenario: Page-scoped state does not use a global store

- **WHEN** state is only consumed within a single page or its direct child components
- **THEN** it SHALL be managed in a hook under `src/hooks/`, NOT in a Zustand store under `src/stores/`
