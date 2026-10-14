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

The report page SHALL display a hierarchical category breakdown for each scope, with separate views for expense and income categories accessible via a tab control.

The breakdown SHALL include:

- A donut chart visualizing each root category's proportion of the total.
- A full-height rectangular color block on the left edge of every ranking row that maps the category to its donut slice without requiring hover, including categories with an image. Its outer left corners SHALL follow the row's rounded outline while its inner right edge remains straight.
- A donut center label identifying the current category context, using the localized all-categories label at the root level and the selected root category name in a focused view.
- A ranking list showing each root category's display name, total amount, transaction count, and percentage of the total, sorted by amount descending.
- A hierarchy indicator above the category content that remains visible at every level, displaying a static localized all-categories label at the root level and a breadcrumb/back control naming the selected root in a focused view.
- A root-level ranking whose primary row actions and matching donut slices navigate into eligible root categories.
- A focused root view with a breadcrumb/back control and synchronized donut and ranking list showing each subcategory's display name, total amount, transaction count, and percentage of the selected root total, sorted by amount descending.
- A localized direct-assignment item in the focused view when the selected root contains transactions assigned directly to itself.
- A user-selectable subcategory-comparison mode containing a horizontal bar chart and synchronized ranking list that flatten every root's subcategories and direct-assignment item into one globally amount-sorted comparison.

A root category's amount, count, percentage, and transaction detail SHALL include transactions assigned directly to the root and transactions assigned to its descendant categories. A subcategory row's amount, count, and transaction detail SHALL include only transactions assigned to that subcategory. Root-level percentages SHALL use the complete active-type amount as denominator. Focused-view percentages SHALL use the selected root amount as denominator. Navigating between hierarchy levels SHALL NOT change report totals, category exclusion state, or transaction data.

The subcategory-comparison mode SHALL label every entry with its full root/subcategory path, SHALL calculate each percentage against the complete amount for the active transaction type, and SHALL assign stable colors by root identity. Activating a comparison bar SHALL open the transactions represented by that entry. Stored subcategories SHALL retain independent include/exclude and transaction-detail actions in the synchronized list, while direct-assignment entries SHALL remain detail-only. Changing expense/income tabs SHALL return the category breakdown to the root overview.

When the scope is a single account book, root and subcategory entries SHALL be grouped by category identity and display each category's `name` and `imageUrl`.

When the scope is the aggregate view (`all`), root categories SHALL be grouped by root category name so that identically named roots across different account books merge into a single entry. Subcategories SHALL be grouped by subcategory name within the merged root, so identically named subcategories beneath different root names remain separate. A merged entry's image MUST be taken from the first occurrence encountered during aggregation.

Transactions whose `categoryId` cannot be resolved to a known category SHALL be grouped under a single non-expandable `Uncategorized` root entry for their transaction type. A known category whose root cannot be resolved because of a missing or cyclic parent reference SHALL remain visible as a non-expandable top-level entry using the known category's identity.

#### Scenario: Expense tab shows root expense categories initially

- **WHEN** the user activates the `Expense` tab and the scoped expense transactions belong to subcategories under one or more root categories
- **THEN** the donut and ranking list SHALL initially show only the corresponding root expense categories with their descendant amounts and counts rolled up

#### Scenario: Income tab shows root income categories initially

- **WHEN** the user activates the `Income` tab and the scoped income transactions belong to subcategories under one or more root categories
- **THEN** the donut and ranking list SHALL initially show only the corresponding root income categories with their descendant amounts and counts rolled up

#### Scenario: User drills into a root from the list

- **WHEN** the user activates the primary row action for a root category with child or direct-assignment data
- **THEN** the system SHALL replace both the donut and ranking list with that root's focused composition
- **AND** the system SHALL expose a breadcrumb/back control naming the selected root

#### Scenario: User drills into a root from the chart

- **WHEN** the user activates a donut slice for a root category with child or direct-assignment data
- **THEN** the system SHALL show the same focused composition produced by the matching root row action

#### Scenario: User identifies donut categories without hover

- **WHEN** the category breakdown is displayed at any supported width
- **THEN** every ranking row SHALL show a full-height rectangular color block matching its donut slice color along the row's left edge
- **AND** the block SHALL follow the row's rounded outer-left corners while keeping its inner right edge straight
- **AND** the marker SHALL remain visible when the category also has an image
- **AND** an excluded row and its marker SHALL share the existing muted excluded treatment

#### Scenario: Current hierarchy indicator remains visible

- **WHEN** the user views the category breakdown at the root level
- **THEN** a non-interactive localized all-categories label SHALL be visible above the category content
- **AND** when the user drills into `Food`, the indicator SHALL become a breadcrumb/back control displaying `All categories / Food`
- **AND** returning from `Food` SHALL restore the non-interactive all-categories label

#### Scenario: Donut label stays fixed to the current category context

- **WHEN** the user views all categories or drills into a root category
- **THEN** the donut center label SHALL identify the current category context as the localized all-categories label or the selected root category name
- **AND** excluding a child category or changing active amounts SHALL NOT replace that label with a generic total or a different category name

##### Example: Root and focused labels

- **GIVEN** root categories `Food` and `Transport`, with `Food` containing child `Dining`
- **WHEN** the report is at the root level and then focused on `Food`
- **THEN** the donut center labels SHALL be `All categories` and `Food`, respectively
- **AND** excluding `Dining` SHALL leave the focused center label as `Food`

#### Scenario: User returns to all categories

- **WHEN** the user activates the focused view's breadcrumb/back control
- **THEN** the donut and ranking list SHALL return to root categories

#### Scenario: Tab change resets hierarchy navigation

- **WHEN** the user changes between the expense and income tabs while viewing a focused root
- **THEN** the newly active tab SHALL open at its root-category level

#### Scenario: User compares subcategories across roots

- **WHEN** the user switches from the root overview to subcategory comparison
- **THEN** the system SHALL show a horizontal bar and synchronized ranking entry for every scoped child category and non-zero direct-assignment item across all roots
- **AND** the entries SHALL be sorted globally by amount descending
- **AND** each entry SHALL display its full root/subcategory path

##### Example: Cross-root comparison ordering and percentages

- **GIVEN** total scoped expense is `1000`, `Food > Dining` is `300`, `Transport > Taxi` is `200`, and direct assignments to `Food` are `100`
- **WHEN** the user opens subcategory comparison
- **THEN** the entries SHALL appear in the order `Food / Dining`, `Transport / Taxi`, `Food / Directly in Food`
- **AND** their percentages SHALL be `30%`, `20%`, and `10%`, respectively

#### Scenario: Comparison actions preserve represented transactions

- **WHEN** the user activates a child bar or its explicit transaction-detail action
- **THEN** the detail SHALL contain only transactions assigned to that child
- **AND** when the user activates a direct-assignment bar, the detail SHALL contain only transactions assigned directly to that root
- **AND** excluding a stored child from the synchronized list SHALL NOT exclude its siblings

#### Scenario: Tab change leaves comparison mode

- **WHEN** the user changes between expense and income while subcategory comparison is active
- **THEN** the newly active tab SHALL return to the root overview

#### Scenario: Hierarchical totals and ordering are calculated from scoped transactions

- **WHEN** a report contains expense transactions of `120` assigned directly to `Food`, `300` assigned to `Food > Dining`, `80` assigned to `Food > Groceries`, and `200` assigned to `Transport > Transit`
- **THEN** the root ranking SHALL show `Food` first with amount `500` and `Transport` second with amount `200`
- **AND** drilling into `Food` SHALL show `Dining` before `Groceries` plus a localized direct-assignment item for `120`
- **AND** focused percentages SHALL be `60%` for `Dining`, `16%` for `Groceries`, and `24%` for the direct-assignment item

#### Scenario: Root and subcategory details use their represented transactions

- **WHEN** the user opens transaction details from a root row
- **THEN** the detail SHALL contain the scoped transactions assigned directly to that root and to its descendant categories
- **AND** when the user opens transaction details from a subcategory row, the detail SHALL contain only scoped transactions assigned to that subcategory

#### Scenario: Direct root assignments reconcile the focused view

- **WHEN** a selected root contains transactions assigned directly to itself and transactions assigned to child categories
- **THEN** the focused donut and list SHALL include a localized direct-assignment item containing only the direct transactions
- **AND** the focused item amounts SHALL sum to the selected root amount
- **AND** the direct-assignment item SHALL open its represented transaction detail without exposing a category exclusion action

#### Scenario: Aggregate view merges hierarchy by parent-scoped names

- **WHEN** two account books in the same currency section each contain a root named `Food` with a subcategory named `Dining`, and another root named `Travel` also has a subcategory named `Dining`
- **THEN** the breakdown SHALL present one merged `Food` root with one merged `Dining` child for the two books
- **AND** the `Dining` child beneath `Travel` SHALL remain a separate entry

#### Scenario: Excluding hierarchy levels updates active report data

- **WHEN** the user excludes a subcategory row
- **THEN** only that subcategory's transactions SHALL be removed from the donut, summary values, and monthly trend while its active siblings remain included
- **AND** when the user excludes a root row, transactions assigned directly to that root and to all of its descendants SHALL be removed from those report outputs

#### Scenario: Unknown and malformed categories remain visible

- **WHEN** scoped transactions contain unknown category IDs or a known category whose parent chain cannot resolve to a valid root
- **THEN** unknown IDs SHALL aggregate into one non-expandable `Uncategorized` root for the transaction type
- **AND** each known category with a broken parent chain SHALL render as a non-expandable top-level entry instead of being omitted


<!-- @trace
source: group-report-categories-by-parent
updated: 2026-10-09
code:
  - apps/web/src/components/report/reportTypes.ts
  - work/visualizations/category-drilldown-sketch.html
  - apps/web/src/i18n/messages/en-US.json
  - work/visualizations/category-drilldown-sketch-preview.html
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/src/components/report/ReportSection.tsx
tests:
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/reportAggregate.spec.ts
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
