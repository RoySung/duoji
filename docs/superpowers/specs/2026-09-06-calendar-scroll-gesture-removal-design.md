# Calendar Scroll Gesture Removal Design

## Context

The account-book transaction page currently changes the calendar between week
and month views in response to gestures on the page scroll container. Pulling
down at the top of the page expands a week calendar to the month view, while
scrolling down or swiping up collapses a month calendar back to the week view.
This makes the calendar's state change as a side effect of normal page
navigation.

## Decision

Remove the page-container wheel and touch gesture handlers that change
`calendarViewMode`. Remove their associated refs and event bindings from the
transaction page.

The calendar retains its existing `calendarViewMode` state and continues to
receive the existing `onViewModeChange` callback. Its explicit, accessible
week/month control remains the only way to switch views.

## Behavior Contract

- Scrolling the transaction page never changes the calendar view.
- At the top of the transaction page, pulling down never expands a week
  calendar to the month view.
- Swiping upward or scrolling downward never collapses a month calendar to the
  week view.
- The calendar's explicit view-mode control continues to switch between week
  and month views.
- Transaction loading, date selection, range queries, Hero parallax scrolling,
  and page layout remain unchanged.

## Implementation

Update `apps/web/src/pages/account-books/[id]/index.tsx` only:

1. Delete the wheel and touch gesture refs and callbacks responsible for
   changing `calendarViewMode`.
2. Remove their event props from the scrolling page container.
3. Keep the scrolling container ref because `TransactionHero` uses it for its
   decorative parallax effect.

## Verification

Run the relevant web tests and type/lint checks. Manually verify that the
calendar retains its selected view while the transaction page is scrolled or
pulled at its top, and that the calendar's own view-mode control still works.
