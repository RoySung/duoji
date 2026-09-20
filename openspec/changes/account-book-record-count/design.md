## Context

The account-book route supplies a `recordCount` node to `TransactionHero`. It currently derives that node from the transaction list, which is a selected-date list when a date is selected and the displayed month list when no date is selected. `TransactionCalendar` already owns the controlled week/month mode and computes the displayed week and month dates; the page retains the current display month and the fetched month-grid transaction range.

The requested behavior adds a distinct semantic count scope. In the unselected week view, the displayed week is the week currently shown by the calendar, not the entire queried month grid. In the unselected month view, the scope is the calendar's displayed calendar month, excluding adjacent-month cells that can appear in the grid. A selected date takes precedence over view mode.

## Goals / Non-Goals

**Goals:**

- Present a record count whose label and value describe the active selection or visible calendar period.
- Reuse the loaded date-range transactions and existing calendar state without altering transaction persistence or repository interfaces.
- Provide localized labels for day, week, and month count scopes.
- Add browser-level coverage for the three count-scope rules.

**Non-Goals:**

- Changing the initial date-selection behavior, calendar navigation, view-mode persistence, or transaction-list filtering.
- Adding aggregate queries, changing transaction schemas, or counting records outside the account book currently being viewed.
- Changing the hero layout, refresh interaction, or calendar cell summary presentation.

## Decisions

### Derive the count from calendar state and loaded range transactions

The route SHALL derive a dedicated record-count value rather than reuse the current transaction-list length. It will filter the existing calendar query results by the selected date, displayed week range, or displayed month range. This keeps the count synchronized with the calendar and avoids a second network or repository query.

Alternative considered: add a repository aggregation method. This would duplicate range filtering already available in the page, expand the repository contract, and provide no benefit for the existing month-grid data volume.

### Give selected date precedence over calendar view mode

When `selectedDate` is non-null, the hero count SHALL use that single date in either week or month view. Only a null selection permits the view mode to determine whether the count uses the displayed week or displayed month.

Alternative considered: preserve the week/month scope while a date is highlighted. This conflicts with the requested day-specific wording and makes the selected date visually misleading.

### Expose semantic labels through existing message catalogs

The route SHALL select a separate localized message for day, week, or month count and pass the rendered message to `TransactionHero`. Each message SHALL include the concrete period supplied by the route so the scope is unambiguous. Traditional Chinese output SHALL use `YYYY/MM 共 {count} 筆` for a month, `YYYY/MM/DD–YYYY/MM/DD 共 {count} 筆` for a week, and `YYYY/MM/DD 共 {count} 筆` for a day. Numeric month and day components SHALL be zero-padded, and the week range SHALL use an en dash (`–`). The English catalog SHALL convey the same concrete period and count.

Alternative considered: construct Chinese text in the component. This bypasses the existing internationalization boundary and would leave English without equivalent state-aware labels.

### Include the concrete date scope in record-count labels

**Supersedes**: account-book-record-count / Expose semantic labels through existing message catalogs

The route SHALL format the active day, week boundaries, or month as stable numeric date text and pass it into the existing localized day, week, and month messages. This keeps date calculation with the route's calendar state while leaving word order and punctuation around the count under locale control.

Alternative considered: keep semantic-only labels such as `該日` and `該月`. Those labels identify the scope type but do not tell the user which actual period is being counted.

## Implementation Contract

**Behavior:** The hero count always reflects the active account book (or the all-books route) within one and only one explicitly named scope. A selected date produces `YYYY/MM/DD 共 X 筆`; no selected date in week view produces `YYYY/MM/DD–YYYY/MM/DD 共 X 筆`; no selected date in month view produces `YYYY/MM 共 X 筆` in Traditional Chinese.

**Interface and data shape:** The account-book route continues to pass a rendered `recordCount` node to `TransactionHero`. It derives the value and explicit date text from `rangeTransactions`, `selectedDate`, `calendarViewMode`, and the calendar's displayed dates. The calendar-to-route interface SHALL expose the current displayed week range or an equivalent stable week anchor in addition to the existing displayed month callback, so navigating weeks changes the unselected week count and range immediately.

**Failure and empty-data behavior:** A loaded scope containing no transactions SHALL render the matching scoped label with count `0`. While transactions are loading, the existing hero refresh-disable behavior remains unchanged; the count can reflect the currently available query data and SHALL NOT produce an error or a missing label. An absent account-book route identifier retains its existing null render.

**Acceptance criteria:** Browser tests SHALL seed transactions in distinct days, weeks, and months, then verify the hero test id renders the appropriate localized label and count after deselecting a date in week view, after changing to month view, and after selecting a date. Manual verification SHALL confirm that moving to another week updates the unselected-week value and that selected-date wording remains unchanged when the display mode is toggled.

**Scope boundaries:** In scope are the account-book route's count derivation, the calendar state information needed by it, locale messages, and focused end-to-end tests. Out of scope are transaction query semantics, storage, hero presentation, and calendar navigation behavior.

## Risks / Trade-offs

- [The current query range is month-grid based while a week can cross a month boundary] → Filter by the calendar's displayed week boundaries and retain the current month-grid query behavior that already covers the calendar view.
- [Calendar callbacks can cause unnecessary state updates] → Update the route's displayed-week state only when its start and end dates change, following the existing query-range and display-month state guards.
- [Localized copy or date punctuation may be inconsistent across supported locales] → Add period parameters to all three semantic keys in both existing message catalogs and assert zero-padded Traditional Chinese output, including the week-range en dash, in focused tests.

## Migration Plan

Deploy as a client-side presentation change with no data migration. Roll back by restoring the existing generic record-count message selection; persisted transactions and calendar preferences remain compatible.
