# Calendar Width and Touch Target Design

## Context

The transaction calendar currently has additional responsive horizontal margins inside the shared page scaffold, while the transaction history surfaces use the scaffold's full content width. This makes their left and right edges appear misaligned. The calendar's upper-right display-mode control is also visually larger than requested.

The product currently documents a 44×44 CSS pixel minimum touch target. This change lowers the site-wide minimum to 24×24 CSS pixels. Existing controls larger than 24×24 pixels remain unchanged unless a requirement explicitly resizes them.

## Approved Design

### Calendar and transaction-history alignment

- Remove the calendar surface's `mx-2` and `sm:mx-4` horizontal margins.
- Keep the current Hero/calendar normal-flow overlap, responsive negative top margin, calendar padding, stacking order, and transaction behavior.
- The calendar surface and each transaction-history state surface SHALL inherit the same full content width from `PageScaffold`, producing identical left and right boundaries at mobile and tablet widths.

### Calendar display-mode control

- Set the upper-right calendar display-mode button to 24×24 CSS pixels.
- Set both display-mode glyph states to 24×24 CSS pixels.
- Preserve the existing accessible name, title, focus treatment, semantic colors, persistence, and dot/amount switching behavior.
- Do not resize the separate week/month expansion control.

### Site-wide minimum touch target

- Change the documented and tested minimum interactive target from 44×44 to 24×24 CSS pixels.
- Treat 24×24 as a minimum, not a universal control size.
- Preserve all existing controls that already exceed the new minimum unless another explicit requirement changes them.
- Retain keyboard focus visibility and all current semantic states.

## Scope

In scope:

- Transaction calendar and transaction-history horizontal alignment.
- The calendar's upper-right display-mode button and its two glyph states.
- Site-wide design documentation, Spectra requirements, and automated assertions that define the minimum touch target.
- Responsive verification at 390×844 and 768×1024.

Out of scope:

- Changing the Hero/calendar overlap depth or calendar padding.
- Resizing the week/month expansion control.
- Shrinking unrelated buttons, navigation items, form controls, or other interactive components that are already larger than 24×24.
- Changing transaction queries, selected-date behavior, display-mode persistence, or business logic.

## Verification

- Component tests assert that the display-mode button and both glyph states are 24×24 pixels while their behavior remains unchanged.
- Transaction-page tests assert that calendar and transaction-history surfaces no longer apply different horizontal insets.
- Deterministic browser checks compare calendar and history bounding boxes at 390×844 and 768×1024.
- Existing touch-target assertions use 24×24 as the minimum and continue accepting larger controls.
- Run the focused transaction tests, the full web test suite, the production build, and relevant Chromium visual regression cases.

