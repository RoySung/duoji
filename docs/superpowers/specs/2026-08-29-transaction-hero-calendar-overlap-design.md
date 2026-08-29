# Transaction Hero and Calendar Overlap Design

## Context

The transaction page currently renders `TransactionHero`, the calendar surface, and the transaction list as separate children of `PageScaffold`. The scaffold gap keeps every section fully separated. The approved reference instead presents the calendar as a raised foreground surface that crosses the Hero's bottom edge while the transaction list continues below it in normal flow.

This is a presentation-only adjustment. Transaction queries, selection, calendar gestures, month expansion, modal behavior, translations, routing, and persisted data remain unchanged.

## Approved Direction

Use a normal-flow negative-margin composition. Group the Hero and calendar surface in one transaction-page layout wrapper, then pull the calendar upward over the Hero with a responsive negative block margin.

- At viewport widths of 360px and above, the calendar overlaps the Hero by 44px.
- Below 360px, reduce the overlap to 28px to preserve the compact text-safe area.
- Inset the calendar 8px from the Hero edges below 640px and 16px at 640px and above.
- Keep the calendar in normal document flow so its expanded month height continues to push the transaction list downward.
- Give the calendar an explicit foreground stacking level so its raised surface and compact shadow remain visually above the Hero artwork.
- Reserve the same vertical area inside the Hero by adding the overlap depth to its existing bottom content padding: 48px below 360px, 64px from 360px through 639px, and 68px at 640px and above. This leaves the current 20px or 24px content gap between the live action row and the calendar boundary. The account-book name, refresh action, and record count must remain unobscured and operable.
- Keep the existing Hero height, page gutters, page width, calendar behavior, and spacing from the Hero/calendar group to the transaction list.

## Component Boundaries

### Transaction page

`apps/web/src/pages/account-books/[id]/index.tsx` owns the relationship between the Hero and calendar. It will introduce a local wrapper around those two siblings and apply the calendar's 8px/16px responsive inset, 28px/44px negative margin, and stacking level. The overlap must not become a global `SurfaceCard` behavior because other route surfaces do not overlap banners.

### Transaction Hero

`apps/web/src/components/transaction/TransactionHero.tsx` keeps all decorative image and fallback behavior. Only its content-safe bottom spacing changes so the action row remains above the calendar foreground at both overlap depths.

### Calendar

`TransactionCalendar` and its week/month children retain their current state and animation contracts. No absolute positioning is introduced, so expanding from week to month increases the group height naturally.

## Responsive and Accessibility Behavior

- At 390px and wider supported widths, the overlap is 44px.
- At 320px through 359px, the overlap is 28px.
- The refresh button and record-count chip remain visible above the calendar's top boundary.
- Existing 44-by-44 CSS pixel touch targets remain unchanged.
- Long English and Traditional Chinese account-book names continue to wrap in the existing text-safe area without being covered by the calendar.
- Dark mode, reduced motion, failed decorative assets, and calendar week/month switching preserve their existing behavior.

## Verification

Add focused assertions that cover the observable layout contract:

1. The transaction page groups the Hero and calendar and applies the approved responsive negative margin and foreground stacking level.
2. The Hero reserves responsive bottom space for the action row without changing its height or touch-target sizing.
3. At 390px, the calendar's top edge is above the Hero's bottom edge while the refresh control's bottom edge is no lower than the calendar's top edge.
4. At 320px, the reduced overlap keeps the same controls unobscured.
5. After expanding the calendar to month mode, the transaction list begins at or below the calendar surface's bottom edge.
6. Existing transaction component tests, web tests, production build, and deterministic visual regression checks continue to pass; affected transaction snapshots are refreshed only after manual comparison with the approved reference.

## Alternatives Considered

### Deeper 64px overlap with a taller Hero

This more closely exaggerates the reference composition, but it changes the approved Hero geometry and increases pressure on long account-book names at narrow widths.

### Absolute positioning

Absolute placement provides exact pixel control, but removes the calendar from normal flow. Month expansion would then require manually synchronizing a reserved spacer height and could cause the transaction list to overlap the calendar.

## Scope Boundaries

- No change to transaction, calendar, account-book, or modal business logic.
- No global change to `PageScaffold` or `SurfaceCard`.
- No change to Hero asset files, theme tokens, typography scale, navigation, or other route families.
- No new dependency or public component API is required.
