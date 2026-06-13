# reports Specification

## Purpose

TBD - created by archiving change 'add-report-page'. Update Purpose after archive.

## Requirements

### Requirement: Report page is available at the account book report route

The system SHALL provide a report page at `/account-books/[id]/report`, where `[id]` is either a specific account book ID or the literal string `all` representing the aggregate view across all non-deleted account books.

The report page SHALL render within the shared app shell so the header and bottom navigation remain visible and functional.

#### Scenario: User navigates to a specific account book report

- **WHEN** the user navigates to `/account-books/abc123/report`
- **THEN** the system SHALL display the report page scoped to account book `abc123`

#### Scenario: User navigates to the aggregate report

- **WHEN** the user navigates to `/account-books/all/report`
- **THEN** the system SHALL display the report page aggregating data across all non-deleted account books

#### Scenario: Account book ID not found

- **WHEN** the `[id]` in the URL does not match any existing account book and is not the literal `all`
- **THEN** the system SHALL display an "account book not found" state consistent with the existing account book routes


<!-- @trace
source: add-report-page
updated: 2026-05-05
code:
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/tsconfig.spec.json
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/package.json
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/report/reportTypes.ts
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/src/pages/styles.css
tests:
  - apps/web/specs/reportAggregate.spec.ts
  - apps/web/specs/timeRangeSelector.spec.tsx
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
-->

---
### Requirement: Report page supports time range presets

The report page SHALL provide a time range selector with exactly four presets: `All`, `1Y` (past one year), `3M` (past three months), and `This Month` (current calendar month). The default preset SHALL be `All`.

Selecting a preset SHALL scope all statistics, charts, and lists on the page to transactions whose `date` falls within the resolved range.

Time range state SHALL be maintained as page-local state and SHALL NOT be persisted in the URL or across navigations.

#### Scenario: Page loads with default preset

- **WHEN** the user opens the report page
- **THEN** the time range selector SHALL default to `All` and the page SHALL include every non-deleted transaction available to the current scope

#### Scenario: User selects a time range preset

- **WHEN** the user selects a preset other than the current one
- **THEN** the system SHALL recompute all summary cards, category breakdowns, and trend charts using only transactions whose date falls within the preset range

#### Scenario: `This Month` preset boundary

- **WHEN** the user selects `This Month`
- **THEN** the range SHALL be from the first day of the current calendar month through the last day of the current calendar month, inclusive


<!-- @trace
source: add-report-page
updated: 2026-05-05
code:
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/tsconfig.spec.json
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/package.json
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/report/reportTypes.ts
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/src/pages/styles.css
tests:
  - apps/web/specs/reportAggregate.spec.ts
  - apps/web/specs/timeRangeSelector.spec.tsx
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
-->

---
### Requirement: Report page displays income, expense, and net summary

For each resolved scope (single account book, or a single currency group in aggregate view), the report page SHALL display three summary values: total income, total expense, and net (income minus expense). Each value SHALL include the associated currency code.

Summary values SHALL reflect only transactions within the selected time range.

#### Scenario: Summary values reflect the selected time range

- **WHEN** transactions exist within the selected time range
- **THEN** the summary SHALL display total income, total expense, and net, each expressed in the corresponding currency

#### Scenario: Empty scope

- **WHEN** no transactions fall within the selected time range for the current scope
- **THEN** the system SHALL display an empty state indicating no data and SHALL NOT render empty charts


<!-- @trace
source: add-report-page
updated: 2026-05-05
code:
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/tsconfig.spec.json
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/package.json
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/report/reportTypes.ts
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/src/pages/styles.css
tests:
  - apps/web/specs/reportAggregate.spec.ts
  - apps/web/specs/timeRangeSelector.spec.tsx
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
-->

---
### Requirement: Report page displays category breakdown

The report page SHALL display a category breakdown for each scope, with separate views for expense and income categories accessible via a tab control.

The breakdown SHALL include:
- A donut chart visualizing each category's proportion of the total.
- A ranking list showing each category's display name, total amount, transaction count, and percentage of the total, sorted by amount descending.

When the scope is a single account book, categories SHALL be grouped by `categoryId` and display the category's `name` and `imageUrl`.

When the scope is the aggregate view (`all`), categories SHALL be grouped by `category.name` so that identically named categories across different account books MUST merge into a single entry. The merged entry's image MUST be taken from the first occurrence encountered during aggregation.

Transactions whose `categoryId` cannot be resolved to a known category SHALL be grouped under a single `Uncategorized` entry.

#### Scenario: Expense tab shows only expense categories

- **WHEN** the user activates the `Expense by Category` tab
- **THEN** only categories whose transactions have `type === 'expense'` SHALL be included in the chart and ranking list

#### Scenario: Income tab shows only income categories

- **WHEN** the user activates the `Income by Category` tab
- **THEN** only categories whose transactions have `type === 'income'` SHALL be included in the chart and ranking list

#### Scenario: Aggregate view merges same-name categories across books

- **WHEN** the scope is the aggregate view and two distinct account books each contain a category named `Food`
- **THEN** the breakdown SHALL present a single `Food` entry whose total and transaction count are the sum of both books' `Food` transactions within the selected time range


<!-- @trace
source: add-report-page
updated: 2026-05-05
code:
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/tsconfig.spec.json
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/package.json
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/report/reportTypes.ts
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/src/pages/styles.css
tests:
  - apps/web/specs/reportAggregate.spec.ts
  - apps/web/specs/timeRangeSelector.spec.tsx
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
-->

---
### Requirement: Report page displays a monthly trend chart

The report page SHALL display a monthly trend chart for each scope, showing income and expense totals grouped by calendar month over the selected time range.

Months without any transactions within the selected range SHALL NOT be rendered as empty placeholders.

When the selected preset is `All` and no transactions exist in the scope, the trend chart SHALL be replaced with the same empty state used by the summary section.

#### Scenario: Trend chart renders income and expense per month

- **WHEN** transactions span multiple calendar months within the selected range
- **THEN** the chart SHALL display one data point per month for each type (income and expense) using the month as the x-axis value


<!-- @trace
source: add-report-page
updated: 2026-05-05
code:
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/tsconfig.spec.json
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/package.json
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/report/reportTypes.ts
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/src/pages/styles.css
tests:
  - apps/web/specs/reportAggregate.spec.ts
  - apps/web/specs/timeRangeSelector.spec.tsx
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
-->

---
### Requirement: Aggregate view groups results by currency

When the scope is the aggregate view (`all`), the report page SHALL partition data by `accountBook.currency` and render a separate report section for each currency. Each section SHALL include the currency label and a complete set of summary cards, category breakdown, and monthly trend chart limited to transactions from books whose currency matches that section.

The system SHALL NOT sum amounts across different currencies.

Currency sections SHALL be displayed in descending order of the number of transactions within the section for the selected time range.

#### Scenario: Multiple currencies in aggregate view

- **WHEN** the user is in the aggregate view and the data contains books with currency `TWD` and `JPY`
- **THEN** the report page SHALL display one section for TWD transactions and one section for JPY transactions, each with its own summary, category breakdown, and trend chart; the system SHALL NOT sum TWD and JPY amounts

#### Scenario: Single currency in aggregate view

- **WHEN** the user is in the aggregate view and all books share a single currency
- **THEN** the report page SHALL display a single currency section without currency selection controls

<!-- @trace
source: add-report-page
updated: 2026-05-05
code:
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/tsconfig.spec.json
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/package.json
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/report/reportTypes.ts
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/src/pages/styles.css
tests:
  - apps/web/specs/reportAggregate.spec.ts
  - apps/web/specs/timeRangeSelector.spec.tsx
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
-->

---
### Requirement: Report outputs reflect the active tag filter

When the report page has an active tag filter selection, the report's derived outputs SHALL be recalculated from the tag-filtered transaction dataset for the current page scope.

#### Scenario: Summary values reflect the active tag filter

- **WHEN** one or more report tags are selected
- **THEN** the income, expense, and net summary values SHALL be calculated from only the transactions that remain in scope after tag filtering

#### Scenario: Category breakdown reflects the active tag filter

- **WHEN** one or more report tags are selected
- **THEN** the category breakdown chart and ranking list SHALL use only the transactions that remain in scope after tag filtering

#### Scenario: Monthly trend reflects the active tag filter

- **WHEN** one or more report tags are selected
- **THEN** the monthly trend chart SHALL use only the transactions that remain in scope after tag filtering

<!-- @trace
source: add-report-tag-filter
updated: 2026-06-12
code:
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/components/ui/TagInput.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/test-setup.ts
  - apps/web/src/components/report/TagFilterSelector.tsx
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/hooks/useAccountBookTagSuggestions.ts
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/hooks/transactionQueryUtils.ts
tests:
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/reportTagFilterSelector.spec.tsx
  - apps/web/specs/useAccountBookTagSuggestions.spec.ts
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/transactionFormTags.spec.tsx
  - apps/web/specs/category.spec.ts
  - apps/web/specs/reportSection.spec.tsx
-->