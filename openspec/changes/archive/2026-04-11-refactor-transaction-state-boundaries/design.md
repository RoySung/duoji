## Context

Transaction state is currently initialized in the app shell through `TransactionStoreProvider` in `_app.tsx`, then consumed by both the account-book home page and the shared navbar modal trigger. The same store owns `transactions`, scope tracking, loading flags, CRUD actions, and modal session state (`isModalOpen`, `modalMode`, `selectedTransactionId`).

That design made the first home-page transaction list easy to ship, but it does not match how the rest of the product is already evolving. The settlement page reads transactions directly from `TransactionLocalRepo` and keeps its own query result in component state. Planned retrieval scenarios such as by date, by account book, and by category would further increase pressure on a single shared store, even though those queries do not need a single global cache.

## Goals / Non-Goals

**Goals:**

- Make transaction query results page-scoped by default, keyed by the page's retrieval intent
- Separate modal session ownership from transaction query ownership
- Preserve the repository as the source of truth for transaction reads and writes
- Keep the home account-book list and transaction editing flow working without relying on an app-level transaction provider

**Non-Goals:**

- Introducing a new client cache library such as SWR or React Query in this change
- Redesigning transaction form fields, validation rules, or repository persistence semantics
- Changing settlement query behavior beyond aligning it with the new state boundary pattern

## Decisions

### Move account-book transaction queries to page-scoped hooks

The home account-book page SHALL own the transaction list it renders. A page-scoped hook or feature controller will load transactions for the current `accountBookId`, keep local loading and error state, and expose CRUD-triggered refresh behavior to nearby components.

This keeps the query boundary aligned with the route boundary and avoids expanding a global store every time a new retrieval scenario appears.

Alternative considered: keep one global transaction store and add more scoped selectors or filter-specific actions. Rejected because each new query mode would still compete for shared cache shape, invalidation rules, and loading semantics.

### Keep modal session separate from transaction query results

Transaction modal state SHALL no longer depend on a global `transactions[]` array. If the account-book page still needs a shared modal across sibling components, it can host a feature-level controller or provider that stores only session data such as open state, mode, and selected transaction identity.

This keeps modal orchestration available without forcing unrelated pages to subscribe to or initialize transaction list state.

Alternative considered: leave modal state inside the existing transaction store while moving only queries out. Rejected because it keeps the mental model confusing and preserves an app-level transaction dependency in `_app.tsx` and the navbar.

### Treat retrieval scenarios as repository plus query-hook composition

Transaction retrieval variants such as by account book, by settlement status, by date, and by category SHALL be modeled as repository entry points composed into dedicated hooks or controllers. Shared concerns such as transaction sorting and date parsing remain reusable utilities, but query results do not become app-global by default.

Alternative considered: introduce a generalized filter object in a single transaction store. Rejected because it centralizes unrelated concerns and makes concurrent views harder to reason about.

## Risks / Trade-offs

- App-shell create affordance becomes page-owned instead of global convenience → Mitigation: scope creation actions to the account-book page and only reintroduce a higher-level controller if a real cross-page requirement returns
- CRUD refresh logic may become duplicated across pages if hooks diverge → Mitigation: keep repository writes centralized and extract shared query-hook helpers where duplication appears
- Tests currently target the Zustand store contract → Mitigation: replace store-centric tests with page hook or feature controller tests that reflect the new ownership model

## Migration Plan

1. Introduce a page-owned transaction query hook or controller for the account-book page.
2. Move transaction modal session ownership out of the app-level store and into the account-book feature boundary.
3. Update navbar and `TransactionModal` integration so transaction creation/editing no longer depends on an app-wide provider.
4. Remove the app-level transaction provider once all remaining consumers have been moved.
5. Rewrite tests to target the new page-owned contract and keep settlement retrieval behavior intact.

## Open Questions

- Should transaction modal session live directly in the account-book page component tree or in a small feature-level provider under the account-book route layout?
- Do future filtered transaction views need URL-backed filter state, or can they remain local component state for now?