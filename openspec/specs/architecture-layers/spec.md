# architecture-layers Specification

## Purpose

Define the three-layer clean architecture for this project: entity, usecase (hooks and stores), and repo. This spec establishes the dependency rules and responsibility boundaries for each layer, serving as the reference for code review and future development.

## Requirements

### Requirement: Entity layer is pure and dependency-free

The entity layer SHALL contain only data structures and domain logic. Entities MUST NOT import from repo, hooks, stores, or any UI framework.

#### Scenario: Entity has no external dependencies

- **WHEN** a file under `src/entities/` is inspected
- **THEN** it SHALL NOT import from `src/repositories/`, `src/hooks/`, `src/stores/`, or any React module

---
### Requirement: Repo layer is accessed only through usecase layer

The repo layer SHALL be the sole point of data access (IndexedDB, API, etc.). UI components and pages MUST NOT import or instantiate repo classes directly. Only hooks and stores (usecase layer) SHALL call repo methods.

#### Scenario: Page component needs transaction data

- **WHEN** a page or UI component needs to read or write transactions
- **THEN** it SHALL use a hook (e.g., `useAccountBookTransactions`) or store, NOT import `TransactionLocalRepo` directly

#### Scenario: Repo import found outside usecase layer

- **WHEN** a file under `src/pages/` or `src/components/` imports from `src/repositories/`
- **THEN** it SHALL be considered a violation of the architecture layering rules

---
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


<!-- @trace
source: replace-settlement-store-with-hook
updated: 2026-04-11
code:
  - apps/web/jest.config.ts
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/.babelrc
  - GEMINI.md
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/next.config.js
  - apps/web/src/stores/transaction/index.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/repositories/settlementRepo/index.ts
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/components/layout/layout.tsx
  - .spectra.yaml
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - AGENTS.md
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/entities/settlement.ts
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - CLAUDE.md
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/pages/_app.tsx
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - .github/skills/spectra-apply/SKILL.md
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - .github/prompts/spectra-ingest.prompt.md
  - .github/skills/spectra-ingest/SKILL.md
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/hooks/useSettlement.ts
  - .github/prompts/spectra-debug.prompt.md
  - .github/prompts/spectra-apply.prompt.md
  - apps/web/package.json
  - apps/web/src/stores/transaction/transactionStore.ts
  - apps/web/src/entities/transaction.ts
  - apps/web/src/utils/transactionUtils.ts
  - .github/prompts/spectra-ask.prompt.md
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - .github/skills/spectra-propose/SKILL.md
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - .github/prompts/spectra-propose.prompt.md
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/pages/settings.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - .github/skills/spectra-ask/SKILL.md
tests:
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
-->

---
### Requirement: Dependency direction flows inward only

The dependency rule (依賴方向採單向內縮) SHALL be enforced: UI/Page → Usecase (hooks, store) → Repo → Entity. Outer layers SHALL depend only on inner layers. Inner layers MUST NOT depend on outer layers.

#### Scenario: Inner layer attempts to import outer layer

- **WHEN** a file in `src/entities/` or `src/repositories/` imports from `src/hooks/`, `src/stores/`, or `src/pages/`
- **THEN** it SHALL be considered a layering violation and MUST be refactored