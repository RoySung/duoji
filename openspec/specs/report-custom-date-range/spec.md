# report-custom-date-range Specification

## Purpose

TBD - created by archiving change 'add-custom-date-range'. Update Purpose after archive.

## Requirements

### Requirement: User can select a custom date range on the report page

The report time range selector SHALL include a "Custom" option that allows users to specify an arbitrary start date and end date for the report.

#### Scenario: Custom option is available

- **WHEN** the user views the report page
- **THEN** the time range selector SHALL display a "Custom" tab alongside the existing preset tabs

#### Scenario: Date inputs appear after selecting Custom

- **WHEN** the user selects the "Custom" tab
- **THEN** the system SHALL display a start date input and an end date input

#### Scenario: Report updates when both dates are provided

- **WHEN** the user has selected "Custom" and provides both a valid start date and a valid end date
- **THEN** the system SHALL fetch and display transactions within that date range

#### Scenario: Report does not fetch while custom range is incomplete

- **WHEN** the user has selected "Custom" but has not yet provided both a start date and an end date
- **THEN** the system SHALL NOT issue a data fetch and SHALL display a prompt asking the user to select a date range

#### Scenario: End date must not be before start date

- **WHEN** the user selects an end date that is earlier than the start date
- **THEN** the system SHALL indicate the date range is invalid and SHALL NOT fetch transactions

<!-- @trace
source: add-custom-date-range
updated: 2026-05-05
code:
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/tsconfig.spec.json
  - apps/web/package.json
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/src/pages/styles.css
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/report/reportTypes.ts
tests:
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/reportAggregate.spec.ts
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/timeRangeSelector.spec.tsx
-->