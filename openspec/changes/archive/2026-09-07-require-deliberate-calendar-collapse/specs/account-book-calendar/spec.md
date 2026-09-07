## MODIFIED Requirements

### Requirement: Calendar supports month grid view

The calendar SHALL support an expanded month grid view showing the full month with day-of-week headers (Mon–Sun) and navigation arrows to switch between months. Days outside the displayed month SHALL appear visually dimmed. The calendar SHALL change between week strip and month grid views only when the user activates its explicit view-mode control; page scroll-wheel events and touch pull or swipe gestures SHALL NOT change the current view.

#### Scenario: Expand to month view

- **WHEN** the user activates the explicit expand control
- **THEN** the calendar SHALL transition from week strip to month grid with an animated height change
- **THEN** the month grid SHALL display the month containing today's date (or the currently selected date)

#### Scenario: Collapse to week view

- **WHEN** the user activates the explicit collapse control while in month grid mode
- **THEN** the calendar SHALL transition back to the week strip view
- **THEN** the week strip SHALL display the week containing the currently selected date (or today if none selected)

#### Scenario: Scroll does not collapse the month view

- **WHEN** the user scrolls down or swipes upward while the calendar is in month grid mode
- **THEN** the calendar SHALL remain in month grid mode

#### Scenario: Pulling at the page top does not expand the week view

- **WHEN** the user pulls down on the transaction page while its scroll position is at the top and the calendar is in week strip mode
- **THEN** the calendar SHALL remain in week strip mode

#### Scenario: Navigate between months

- **WHEN** the user taps the left or right arrow in the month grid header
- **THEN** the month grid SHALL display the previous or next month respectively
