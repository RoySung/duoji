## Why

Normal scrolling and pull-to-refresh-like gestures on the transaction page currently change the calendar between week and month views. This makes a user's chosen calendar view unstable and can change the page layout unexpectedly while they navigate transaction history.

## What Changes

- Remove scroll-wheel and touch-swipe gesture transitions between the transaction calendar's week and month views.
- Keep the calendar's explicit view-mode control as the only way a user changes the view.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `account-book-calendar`: The calendar view SHALL remain unchanged during page scrolling and touch pull gestures, and SHALL change only through its explicit view-mode control.

## Impact

- Affected specs: `account-book-calendar`
- Affected code:
  - Modified: `apps/web/src/pages/account-books/[id]/index.tsx`
  - New: none
  - Removed: none
