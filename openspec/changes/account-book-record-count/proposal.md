## Why

The account-book hero currently shows an unqualified transaction total, so people cannot tell whether the count corresponds to the visible calendar period or a selected day. The count should describe the same time scope currently represented by the calendar and selection state.

## What Changes

- Add a period-aware record-count label to the account-book home hero.
- When no date is selected, show the count for the displayed calendar week in week view and the displayed calendar month in month view.
- When a date is selected, show the count for that calendar day regardless of the calendar view.
- Localize the period-qualified labels with the explicit displayed period, using Traditional Chinese output such as `2026/09 共 5 筆`, `2026/09/07–2026/09/13 共 5 筆`, and `2026/09/12 共 2 筆`.

## Capabilities

### New Capabilities

- `account-book-record-count`: Displays an account-book hero record count scoped to the selected date or the active calendar period.

### Modified Capabilities

(none)

## Impact

- Affected specs: account-book-record-count
- Affected code:
  - New: none
  - Modified: apps/web/src/pages/account-books/[id]/index.tsx, apps/web/src/i18n/messages/zh-TW.json, apps/web/src/i18n/messages/en-US.json, apps/web-e2e/src/transactions.spec.ts
  - Removed: none
