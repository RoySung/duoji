## ADDED Requirements

### Requirement: Transactions can be queried by date range

The system SHALL allow the application to query transactions within a date range, optionally scoped to an account book. The repository SHALL return the complete Transaction records (not aggregated summaries) for the requested range.

#### Scenario: Query transactions for a date range within one account book

- **WHEN** the application requests transactions for account book "AB-1" from "2026-04-01" to "2026-04-30"
- **THEN** the system SHALL return all Transaction records whose accountBookId is "AB-1" and whose date falls within that range (inclusive)

#### Scenario: Query a date range with no matching transactions

- **WHEN** the application requests transactions for a date range that contains no records
- **THEN** the system SHALL return an empty array

#### Scenario: Query does not return transactions outside the date range

- **WHEN** the application requests transactions from "2026-04-01" to "2026-04-30"
- **THEN** the system SHALL NOT include transactions with dates before "2026-04-01" or after "2026-04-30"
