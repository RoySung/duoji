## Context

The current account-book settings route already provides a dedicated list page, but create and edit still happen inside a modal. That keeps the implementation technically simple, yet it limits form space, makes browser navigation less useful, and prevents account-book-specific secondary actions from living inside a stable detail context. Category Settings currently appears as a list-card action, which exposes an account-book-scoped destination before the user has entered that account book's own settings surface.

## Goals / Non-Goals

**Goals:**

- Replace modal-based account book create and edit interactions with nested settings pages that support direct routing and browser navigation.
- Define a clear split between the account book list page and the per-account-book settings page.
- Move the Category Settings entry into the per-account-book settings page so the navigation stays scoped to the selected account book.
- Preserve existing store contracts and account-book mutation behavior while reshaping the UI flow.

**Non-Goals:**

- Changing account-book persistence, validation rules, or entity shape.
- Redesigning Category Settings behavior beyond its entry point and back-navigation target.
- Introducing server-backed routing or non-local data flows.

## Decisions

### Use nested settings routes for account book create and edit

Create flow SHALL move to a dedicated nested route under the existing settings section, and edit flow SHALL use an account-book-specific nested route. This gives each form a stable URL, enables normal browser back behavior, and creates enough surface area for mobile-first layouts without modal constraints.

Alternative considered: keep the modal and only enlarge its layout. Rejected because it would preserve the same navigation ambiguity and still make account-book-specific actions awkward to place.

### Split account book list and account book detail responsibilities

The account-book list page SHALL become an overview and navigation surface. It will show available account books, a create entry point, and a concise summary for each account book, while edit-specific actions move into the detail page. This reduces cognitive load on the list page and keeps destructive or scoped actions closer to the selected resource.

Alternative considered: keep create on a page but leave edit actions inline on the list. Rejected because the mixed model would force users to learn two different editing patterns for the same resource.

### Scope Category Settings entry to account book detail pages

Category Settings SHALL be launched from the selected account book's settings page rather than from the list card. This keeps category management inside the account-book detail context and lets back navigation return to that same account-book settings page instead of the broader list.

Alternative considered: keep both entry points. Rejected because duplicated navigation would increase maintenance cost and make the canonical account-book management flow less clear.

### Reuse existing form utilities and store mutations

The page-based form flow SHALL continue using the existing account-book form value helpers, validation utilities, and store mutation methods. The refactor is primarily a routing and composition change, so preserving those interfaces minimizes behavioral risk and keeps the proposal focused on user-facing flow.

Alternative considered: introduce a new route-specific form state layer. Rejected because it adds architecture churn without changing the underlying data model.

## Risks / Trade-offs

- [Route expansion increases UI surface area] → Mitigate by keeping all new routes under the existing settings hierarchy and reusing the current form component logic.
- [Changing the Category Settings entry point can break existing tests and user habits] → Mitigate by updating navigation specs and UI tests together so the new canonical path is explicit.
- [List and detail pages can drift visually] → Mitigate by reusing the shared account-book settings header and a common form section layout.