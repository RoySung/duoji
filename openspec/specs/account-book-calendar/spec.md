# account-book-calendar Specification

## Purpose

TBD - created by archiving change 'account-book-calendar'. Update Purpose after archive.

## Requirements

### Requirement: Calendar displays a week strip by default

The AccountBookPage SHALL render a calendar component in week strip mode by default, showing the current week (Monday through Sunday) as a horizontal row of day cells. Each cell SHALL display the abbreviated day-of-week label and the day number.

#### Scenario: Initial page load

- **WHEN** the user navigates to the AccountBookPage
- **THEN** the calendar SHALL display in week strip mode showing the current week (Monday to Sunday)
- **THEN** today's date SHALL be selected by default
- **THEN** the transaction list SHALL initially display only today's transactions

#### Scenario: Navigate to previous week

- **WHEN** the user taps the left chevron on the week strip
- **THEN** the week strip SHALL display the previous week's dates

#### Scenario: Navigate to next week

- **WHEN** the user taps the right chevron on the week strip
- **THEN** the week strip SHALL display the next week's dates


<!-- @trace
source: account-book-calendar
updated: 2026-05-05
code:
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/hooks/transactionQueryUtils.ts
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/tsconfig.spec.json
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/calendar/MonthGrid.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/src/components/calendar/calendarUtils.ts
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/package.json
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/hooks/useAppQueryClient.ts
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/calendar/WeekStrip.tsx
  - apps/web/src/pages/styles.css
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/calendar/TransactionCalendar.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/eslint.config.mjs
  - apps/web/src/components/report/reportTypes.ts
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/pages/_app.tsx
tests:
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/reportAggregate.spec.ts
  - apps/web/specs/timeRangeSelector.spec.tsx
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/transaction.spec.ts
-->

---
### Requirement: Calendar supports month grid view

The calendar SHALL support an expanded month grid view showing the full month with day-of-week headers (Mon–Sun) and navigation arrows to switch between months. Days outside the displayed month SHALL appear visually dimmed.

#### Scenario: Expand to month view

- **WHEN** the user taps the expand chevron toggle
- **THEN** the calendar SHALL transition from week strip to month grid with an animated height change
- **THEN** the month grid SHALL display the month containing today's date (or the currently selected date)

#### Scenario: Collapse to week view

- **WHEN** the user taps the collapse chevron toggle while in month grid mode
- **THEN** the calendar SHALL transition back to the week strip view
- **THEN** the week strip SHALL display the week containing the currently selected date (or today if none selected)

#### Scenario: Navigate between months

- **WHEN** the user taps the left or right arrow in the month grid header
- **THEN** the month grid SHALL display the previous or next month respectively


<!-- @trace
source: account-book-calendar
updated: 2026-05-05
code:
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/hooks/transactionQueryUtils.ts
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/tsconfig.spec.json
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/calendar/MonthGrid.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/src/components/calendar/calendarUtils.ts
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/package.json
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/hooks/useAppQueryClient.ts
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/calendar/WeekStrip.tsx
  - apps/web/src/pages/styles.css
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/calendar/TransactionCalendar.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/eslint.config.mjs
  - apps/web/src/components/report/reportTypes.ts
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/pages/_app.tsx
tests:
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/reportAggregate.spec.ts
  - apps/web/specs/timeRangeSelector.spec.tsx
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/transaction.spec.ts
-->

---
### Requirement: Selecting a date filters the transaction list

The user SHALL be able to select a single date on the calendar to filter the transaction list. Only transactions matching the selected date SHALL appear in the list below. Selecting the already-selected date SHALL deselect it and restore the full unfiltered list.

#### Scenario: Select a date with transactions

- **WHEN** the user taps a date that has one or more transactions
- **THEN** the date cell SHALL be visually highlighted with the primary color
- **THEN** the transaction list SHALL display only transactions with that date
- **THEN** the record count chip SHALL reflect the filtered count

#### Scenario: Select a date with no transactions

- **WHEN** the user taps a date that has no transactions
- **THEN** the date cell SHALL be visually highlighted
- **THEN** the transaction list SHALL display an empty state message indicating no transactions exist on that date

#### Scenario: Deselect a date

- **WHEN** the user taps the currently selected date
- **THEN** the date selection SHALL be cleared
- **THEN** the transaction list SHALL display all transactions


<!-- @trace
source: account-book-calendar
updated: 2026-05-05
code:
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/hooks/transactionQueryUtils.ts
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/tsconfig.spec.json
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/calendar/MonthGrid.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/src/components/calendar/calendarUtils.ts
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/package.json
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/hooks/useAppQueryClient.ts
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/calendar/WeekStrip.tsx
  - apps/web/src/pages/styles.css
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/calendar/TransactionCalendar.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/eslint.config.mjs
  - apps/web/src/components/report/reportTypes.ts
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/pages/_app.tsx
tests:
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/reportAggregate.spec.ts
  - apps/web/specs/timeRangeSelector.spec.tsx
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/transaction.spec.ts
-->

---
### Requirement: Calendar indicates dates with transactions

The calendar SHALL visually indicate which dates have at least one transaction by displaying a small dot indicator beneath the day number. This indicator SHALL appear in both week strip and month grid views.

#### Scenario: Date has transactions

- **WHEN** a date has one or more transactions in the current account book
- **THEN** the calendar SHALL display a dot indicator beneath that date's number

#### Scenario: Date has no transactions

- **WHEN** a date has no transactions in the current account book
- **THEN** no dot indicator SHALL appear beneath that date's number


<!-- @trace
source: account-book-calendar
updated: 2026-05-05
code:
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/hooks/transactionQueryUtils.ts
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/tsconfig.spec.json
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/calendar/MonthGrid.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/src/components/calendar/calendarUtils.ts
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/package.json
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/hooks/useAppQueryClient.ts
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/calendar/WeekStrip.tsx
  - apps/web/src/pages/styles.css
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/calendar/TransactionCalendar.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/eslint.config.mjs
  - apps/web/src/components/report/reportTypes.ts
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/pages/_app.tsx
tests:
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/reportAggregate.spec.ts
  - apps/web/specs/timeRangeSelector.spec.tsx
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/transaction.spec.ts
-->

---
### Requirement: Calendar exposes daily totals for visible dates

The calendar SHALL provide a hover affordance for dates in the visible week or month grid that shows the total transaction amount for that day. This total SHALL be sourced from the account-book page's calendar data query rather than derived only from the currently rendered transaction list.

#### Scenario: Hover a date with transactions

- **WHEN** a visible date has one or more transactions and the user hovers that date
- **THEN** the calendar SHALL display the day's total transaction amount

#### Scenario: A transaction changes after the calendar is cached

- **WHEN** a transaction is created, updated, or deleted for a visible date
- **THEN** the calendar's daily-total and dot indicator data SHALL update without waiting for cache TTL expiry


<!-- @trace
source: account-book-calendar
updated: 2026-05-05
code:
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/hooks/transactionQueryUtils.ts
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/tsconfig.spec.json
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/calendar/MonthGrid.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/src/components/calendar/calendarUtils.ts
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/package.json
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/hooks/useAppQueryClient.ts
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/calendar/WeekStrip.tsx
  - apps/web/src/pages/styles.css
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/calendar/TransactionCalendar.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/eslint.config.mjs
  - apps/web/src/components/report/reportTypes.ts
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/pages/_app.tsx
tests:
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/reportAggregate.spec.ts
  - apps/web/specs/timeRangeSelector.spec.tsx
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/transaction.spec.ts
-->

---
### Requirement: Calendar highlights today's date

The calendar SHALL visually distinguish today's date from other dates using a distinct visual indicator (such as a ring or outline), separate from the selected-date highlight. When today is also the selected date, the selected-date style SHALL take precedence.

#### Scenario: Today is visible but not selected

- **WHEN** today's date is visible in the calendar and not selected
- **THEN** today's date cell SHALL have a distinct visual indicator differentiating it from other unselected dates

#### Scenario: Today is selected

- **WHEN** today's date is the selected date
- **THEN** the selected-date highlight SHALL take precedence over the today indicator

<!-- @trace
source: account-book-calendar
updated: 2026-05-05
code:
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/hooks/transactionQueryUtils.ts
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/tsconfig.spec.json
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/calendar/MonthGrid.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/src/components/calendar/calendarUtils.ts
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/package.json
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/hooks/useAppQueryClient.ts
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/calendar/WeekStrip.tsx
  - apps/web/src/pages/styles.css
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/calendar/TransactionCalendar.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/eslint.config.mjs
  - apps/web/src/components/report/reportTypes.ts
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/pages/_app.tsx
tests:
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/reportAggregate.spec.ts
  - apps/web/specs/timeRangeSelector.spec.tsx
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/transaction.spec.ts
-->