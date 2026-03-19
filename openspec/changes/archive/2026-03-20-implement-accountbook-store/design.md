## Context

- Approved specs already require personal account books, one active account book context, and IndexedDB-backed local persistence.
- The current web app has an AccountBook entity contract and a Dexie-backed local repository, but presentation code still relies on mock account-book options instead of a reusable account-book state layer.
- This change is the first store-oriented slice for the web app, so its structure will influence how later Category Store and Transaction Store work is composed.
- The user requested a clean-architecture direction where repositories remain infrastructure adapters and the Zustand store operates at the usecase or application layer through dependency injection.

## Goals / Non-Goals

**Goals:**

- Introduce an AccountBook Store that orchestrates account-book use cases without coupling UI components directly to repository implementations.
- Keep the AccountBookRepo interface as the dependency boundary and inject the concrete repository through an explicit composition layer.
- Define deterministic active account book behavior for startup, manual switching, creation without an existing active account book, and deletion fallback.
- Keep IndexedDB initialization order explicit so the store hydrates only after persistence is ready.
- Add tests that verify store behavior with injected dependencies before later store work expands the pattern.

**Non-Goals:**

- Implement Category Store or Transaction Store in the same change.
- Introduce a second durable persistence layer such as Zustand persist or localStorage.
- Rework account book UI flows beyond the minimum integration needed to prove the architecture.
- Redesign repository interfaces outside the consistency constraints already present in the AccountBookRepo contract.

## Decisions

### Keep AccountBookRepo as the usecase boundary

The store SHALL depend on the existing AccountBookRepo contract from the entity module rather than on AccountBookLocalRepo directly. This keeps the usecase layer aligned with clean architecture and allows tests to inject fakes without importing Dexie infrastructure.

Alternative considered: letting the store import and instantiate AccountBookLocalRepo internally. Rejected because that would couple usecase orchestration to IndexedDB details and make store tests depend on infrastructure by default.

### Inject the default repository through a composition root

Runtime wiring SHALL happen in a small composition boundary that creates the default AccountBookLocalRepo instance and passes it into the store factory. The store implementation itself SHALL remain DI-friendly and free of hidden infrastructure singletons.

Alternative considered: exporting only one pre-wired module-scope store singleton. Rejected because it hides dependencies, complicates tests, and makes later multi-store composition harder to reason about.

### Model the AccountBook Store as usecase-level orchestration

The AccountBook Store SHALL own accountBooks, activeAccountBookId, initialized, isLoading, and error state together with usecase actions for load, set active account book, create, update, delete, and reset. It SHALL re-read repository state after mutations in the first version so the repository remains the source of truth while the store pattern is still being established.

Alternative considered: a thinner wrapper that only proxies repository methods. Rejected because it would not centralize active account book behavior or remove mock-data coupling from presentation code.

### Bootstrap the active account book after local persistence initializes

Store hydration SHALL run only after IndexedDB initialization completes. When hydrated account books exist and no active selection is present, the store SHALL choose a deterministic fallback account book. If the active account book is deleted, the store SHALL select a remaining account book when available or clear the active state when none remain.

Alternative considered: hydrating the store before persistence initialization or deferring active account book choice entirely to components. Rejected because both approaches would make account-book-scoped behavior inconsistent and spread fallback logic across the UI.

### Verify the store with injected test repositories first

Primary tests SHALL exercise the store through injected fake repositories so usecase behavior can be validated without Dexie setup noise. A smaller integration-oriented test path can then verify that the composition root works with the Dexie-backed repository and initialization order.

Alternative considered: testing only through the Dexie implementation. Rejected because it would blur usecase failures with infrastructure failures and make fast store iteration harder.

## Risks / Trade-offs

- [A DI boundary adds one more layer to a still-small app] → Keep the composition surface minimal and focused on AccountBookRepo only.
- [The first store may overfit later Category and Transaction needs] → Reuse only the dependency injection and bootstrap principles; let later stores shape their own state details.
- [Re-reading after every mutation adds extra repository calls] → Accept the cost in the first slice to keep correctness simple, then revisit if a later approved change needs optimization.
- [Mock-backed UI code may still leak account-book assumptions] → Limit the first integration point to replacing one real consumer path and let later changes remove the remaining mock dependencies.

## Migration Plan

- Add Zustand and the new AccountBook Store implementation behind a clean composition boundary.
- Keep the existing repository implementation intact and use it as the default injected dependency.
- Update app bootstrap to initialize persistence first and hydrate the AccountBook Store second.
- Migrate one minimal consumer path away from hard-coded account-book options if needed to prove the new composition works.
- If rollback is needed during development, remove the composition boundary and store while leaving the existing repository behavior unchanged.

## Open Questions

- Whether the first proof-point consumer should be the transaction expense form or a smaller account-book-specific UI path can stay flexible during implementation.
- Whether later store work should share one application-level composition module or feature-local composition files can be decided after this first slice lands.