## ADDED Requirements

### Requirement: User can export visible transactions as CSV

The system SHALL provide a CSV export action on the Report page that downloads all currently visible transactions as a CSV file. The export SHALL reflect the active date range and account book filters. Soft-deleted transactions (where `deletedAt` is not null) SHALL be excluded from the export.

#### Scenario: Export button is present on the report page

- **WHEN** the user navigates to the Report page for a single account book
- **THEN** an "Export CSV" button SHALL be visible in the page header area

#### Scenario: Export downloads a CSV file

- **WHEN** the user clicks the "Export CSV" button
- **THEN** the browser SHALL download a file named `transactions-YYYY-MM-DD.csv` where the date is today's date

#### Scenario: CSV contains correct columns

- **WHEN** the CSV file is opened
- **THEN** the first row SHALL be a header row with columns: `Date,Type,Category,Amount,Payment Method,Description`

#### Scenario: CSV rows reflect current filter state

- **WHEN** the user has selected a specific date range and clicks "Export CSV"
- **THEN** the exported rows SHALL contain only transactions within that date range

#### Scenario: Category name is resolved in CSV

- **WHEN** a transaction has a valid category ID
- **THEN** the Category column SHALL contain the category's display name, not the category ID

#### Scenario: Category fallback for unknown category

- **WHEN** a transaction's category ID does not match any known category
- **THEN** the Category column SHALL contain the raw category ID


<!-- @trace
source: export-transactions-csv
updated: 2026-05-05
code:
  - apps/web/src/utils/csvExport.ts
  - apps/web/src/hooks/useExportTransactionsCsv.ts
  - apps/web/public/_redirects
  - apps/web/src/pages/account-books/[id]/report.tsx
tests:
  - apps/web/src/utils/csvExport.test.ts
-->

### Requirement: CSV fields are safely encoded

The system SHALL ensure CSV field values containing commas, double-quotes, or newlines are properly escaped so that the file parses correctly in standard CSV readers.

#### Scenario: Field containing a comma is quoted

- **WHEN** a transaction's description contains a comma
- **THEN** that field SHALL be wrapped in double-quotes in the CSV output

#### Scenario: Field containing a double-quote is escaped

- **WHEN** a transaction's description contains a double-quote character
- **THEN** the double-quote SHALL be escaped as `""` within a quoted field

## Requirements


<!-- @trace
source: export-transactions-csv
updated: 2026-05-05
code:
  - apps/web/src/utils/csvExport.ts
  - apps/web/src/hooks/useExportTransactionsCsv.ts
  - apps/web/public/_redirects
  - apps/web/src/pages/account-books/[id]/report.tsx
tests:
  - apps/web/src/utils/csvExport.test.ts
-->

### Requirement: User can export visible transactions as CSV

The system SHALL provide a CSV export action on the Report page that downloads all currently visible transactions as a CSV file. The export SHALL reflect the active date range and account book filters. Soft-deleted transactions (where `deletedAt` is not null) SHALL be excluded from the export.

#### Scenario: Export button is present on the report page

- **WHEN** the user navigates to the Report page for a single account book
- **THEN** an "Export CSV" button SHALL be visible in the page header area

#### Scenario: Export downloads a CSV file

- **WHEN** the user clicks the "Export CSV" button
- **THEN** the browser SHALL download a file named `transactions-YYYY-MM-DD.csv` where the date is today's date

#### Scenario: CSV contains correct columns

- **WHEN** the CSV file is opened
- **THEN** the first row SHALL be a header row with columns: `Date,Type,Category,Amount,Payment Method,Description`

#### Scenario: CSV rows reflect current filter state

- **WHEN** the user has selected a specific date range and clicks "Export CSV"
- **THEN** the exported rows SHALL contain only transactions within that date range

#### Scenario: Category name is resolved in CSV

- **WHEN** a transaction has a valid category ID
- **THEN** the Category column SHALL contain the category's display name, not the category ID

#### Scenario: Category fallback for unknown category

- **WHEN** a transaction's category ID does not match any known category
- **THEN** the Category column SHALL contain the raw category ID

---
### Requirement: CSV fields are safely encoded

The system SHALL ensure CSV field values containing commas, double-quotes, or newlines are properly escaped so that the file parses correctly in standard CSV readers.

#### Scenario: Field containing a comma is quoted

- **WHEN** a transaction's description contains a comma
- **THEN** that field SHALL be wrapped in double-quotes in the CSV output

#### Scenario: Field containing a double-quote is escaped

- **WHEN** a transaction's description contains a double-quote character
- **THEN** the double-quote SHALL be escaped as `""` within a quoted field