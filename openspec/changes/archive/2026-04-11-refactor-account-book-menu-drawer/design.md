## Context

`AccountBookMenu` is a right-side drawer rendered in the app header on all `/account-books/[id]/*` routes. It currently handles account book switching plus inline CRUD (rename, delete, create). The settings pages (`/settings/account-books`) already provide a full-featured management UI. The goal is to simplify the drawer to a read-only switcher with navigation links to settings.

## Goals / Non-Goals

**Goals:**

- Remove all inline editing state and handlers from `AccountBookMenu`
- Replace list items with card-style layout matching `AccountBookSettingsPage`
- Preserve account book switching functionality
- Route all CRUD to the existing settings pages

**Non-Goals:**

- Changes to settings pages (`AccountBookSettingsPage`, `AccountBookFormPage`)
- Changes to the store or data layer
- Any new route or page creation

## Decisions

### Remove inline CRUD, delegate to settings

Replace inline rename/delete/create with navigation buttons. The settings pages already implement these flows with proper forms and confirmations — duplicating them in the drawer adds complexity without user benefit.

Alternatives considered:
- Keep inline create in the footer → rejected; the full form page handles currency and description which quick-create ignores
- Keep inline delete in the drawer → rejected; the dedicated delete modal in settings is safer and already tested

### Card-style layout per account book

Each item becomes a `<article>` card (matching `AccountBookSettingsPage` visual language):
- Name + currency `<Chip>` in a row
- Description (if present) as secondary text
- Active book: `border-primary/30 bg-primary/5` highlight, no "Switch" button
- Non-active books: "Switch" button + "View settings" button

### Footer: navigation-only

Replace the inline create form with a single full-width `Button` that navigates to `/settings/account-books/new` and closes the drawer.

## Risks / Trade-offs

- [Users lose quick inline rename] → Mitigation: "View settings" is one tap away; acceptable given the settings page is already linked from the main nav
- [Drawer no longer self-contained for CRUD] → Mitigation: Navigation is fast (Next.js client-side routing); the tradeoff favors consistency over convenience
