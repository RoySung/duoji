## ADDED Requirements

### Requirement: Entity layer is pure and dependency-free

The entity layer SHALL contain only data structures and domain logic. Entities MUST NOT import from repo, hooks, stores, or any UI framework.

#### Scenario: Entity has no external dependencies

- **WHEN** a file under `src/entities/` is inspected
- **THEN** it SHALL NOT import from `src/repositories/`, `src/hooks/`, `src/stores/`, or any React module

### Requirement: Repo layer is accessed only through usecase layer

The repo layer SHALL be the sole point of data access (IndexedDB, API, etc.). UI components and pages MUST NOT import or instantiate repo classes directly. Only hooks and stores (usecase layer) SHALL call repo methods.

#### Scenario: Page component needs transaction data

- **WHEN** a page or UI component needs to read or write transactions
- **THEN** it SHALL use a hook (e.g., `useAccountBookTransactions`) or store, NOT import `TransactionLocalRepo` directly

#### Scenario: Repo import found outside usecase layer

- **WHEN** a file under `src/pages/` or `src/components/` imports from `src/repositories/`
- **THEN** it SHALL be considered a violation of the architecture layering rules

### Requirement: Usecase layer coordinates repo and exposes state to UI

The usecase layer (hooks and stores) SHALL be responsible for coordinating repo calls, managing derived state, and exposing data and actions to the UI layer. Hooks MUST NOT be called inside stores, and stores MUST NOT be called inside hooks in a circular manner.

#### Scenario: Hook encapsulates repo access

- **WHEN** a React hook under `src/hooks/` needs data from storage
- **THEN** it SHALL call a repo method (e.g., `repoRef.current.findByAccountBookId(id)`) and manage local state accordingly

#### Scenario: Store encapsulates cross-component state

- **WHEN** state must be shared across multiple unrelated components
- **THEN** it SHALL be managed in a Zustand store under `src/stores/`, which internally calls repo methods as needed

### Requirement: Dependency direction flows inward only

The dependency rule SHALL be enforced: UI/Page → Usecase (hooks, store) → Repo → Entity. Outer layers SHALL depend only on inner layers. Inner layers MUST NOT depend on outer layers.

#### Scenario: Inner layer attempts to import outer layer

- **WHEN** a file in `src/entities/` or `src/repositories/` imports from `src/hooks/`, `src/stores/`, or `src/pages/`
- **THEN** it SHALL be considered a layering violation and MUST be refactored
