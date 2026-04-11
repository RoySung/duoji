## Context

The header currently embeds `AccountBookMenu`, which uses a HeroUI `Dropdown` to show account book options when on an account book route. The dropdown is space-constrained and cannot host settings actions inline. Account book settings (create, rename, delete) currently live in a separate page tree under `/settings/account-books`.

The goal is to replace the dropdown with a `Drawer` that opens from the right, giving more vertical space to list account books and expose settings actions without leaving the current page.

## Goals / Non-Goals

**Goals:**

- Replace the `Dropdown` in `AccountBookMenu` with a slide-in `Drawer`
- Show all account books in the drawer for switching
- Include inline settings actions: create new account book, and per-book rename/delete
- Keep the existing header trigger button identical in appearance

**Non-Goals:**

- Removing the `/settings/account-books` page routes — they remain accessible from the main settings screen
- Changing account book data storage or store logic
- Adding category settings to the drawer

## Decisions

### Use HeroUI Drawer component

HeroUI (the existing UI library) provides a `Drawer` component. Using it avoids adding a new dependency and stays consistent with the design system.

Alternative considered: a custom slide-in panel — rejected because HeroUI Drawer handles focus trap, backdrop, and animation out of the box.

### Drawer contains account book list + settings actions inline

Each account book row shows a select action (highlight current) and secondary actions (rename, delete) via icon buttons. A "New account book" action sits at the bottom.

Alternative considered: keeping a separate settings page link inside the drawer — rejected because it adds unnecessary navigation hop. The drawer provides enough space for inline management.

### AccountBookMenu component is fully rewritten

Rather than layering drawer logic on top of the existing Dropdown-based component, `AccountBookMenu.tsx` is rewritten from scratch to use Drawer. This avoids accumulating dead Dropdown imports.

### AccountBookSettingsPage inner content remains as-is

The drawer does not reuse `AccountBookSettingsPage` components. It implements its own lightweight list with inline actions. `AccountBookSettingsPage` continues to serve the `/settings/account-books` route unchanged.

## Risks / Trade-offs

- [Rename/delete inline in drawer] → drawer needs to handle confirmation UI for destructive actions (e.g., inline confirm prompt or a small modal). Mitigation: use a simple `window.confirm` or an inline confirmation row as the simplest approach; can be improved later.
- [Drawer on mobile] → drawers from the right edge work well on mobile. No special handling needed, but ensure tap targets are large enough.
