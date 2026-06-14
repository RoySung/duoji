## ADDED Requirements

### Requirement: Member filter is available on the report page

The report page SHALL display a member filter control in the header toolbar for both single-book and all-books views.

#### Scenario: Member filter visible in single-book view
- **WHEN** the user navigates to the report page for a specific account book
- **THEN** a member filter control SHALL be visible alongside the tag filter and date range selector

#### Scenario: Member filter visible in all-books view
- **WHEN** the user navigates to the all-books report page
- **THEN** a member filter control SHALL be visible alongside the book filter, tag filter, and date range selector

---

### Requirement: Member filter options are derived from the current report dataset

The system SHALL derive member filter options from users/members who have transaction records within the selected date range and, in all-books view, the selected book filter.

#### Scenario: Date range changes update available members
- **WHEN** the user changes the report date range and the resulting transaction set contains a different set of participants
- **THEN** the available member filter options SHALL update to match the participants in the newly selected date range

#### Scenario: Member options are mapped to user store profiles
- **WHEN** a member has transactions in the current scope
- **THEN** the filter options SHALL display their name and avatar from the user store (registered or virtual, active or deleted)

#### Scenario: Selected member is cleared when they leave scope
- **WHEN** a previously selected member no longer has any transactions in the current report dataset after a time-range or book-filter change
- **THEN** the system SHALL remove that member from the active member filter selection

---

### Requirement: Filtering by member calculates and displays the member's own share

When a specific member filter is active, all summary statistics, category breakdown totals, and monthly trends on the report page SHALL be calculated using only that member's share of the transaction amounts.

For an expense transaction, the member's share SHALL be the amount allocated to them in the transaction's `splitDetail`. If the member is not in `splitDetail`, their share SHALL be $0.

For an income transaction, the member's share SHALL be the transaction's full amount if they are the `receivedByUserId`. If not, their share SHALL be $0.

#### Scenario: Expense transaction amount is adjusted to member split share
- **WHEN** a member filter is active and the report aggregates an expense transaction where the selected member is in `splitDetail` with a split amount
- **THEN** the report SHALL use that split amount for the member's expense total, category breakdown, and monthly trend

#### Scenario: Expense transaction with $0 member split share is excluded
- **WHEN** a member filter is active and the report aggregates an expense transaction where the selected member is not in `splitDetail`
- **THEN** the transaction SHALL be excluded from the member's report calculations (net $0 expense contribution)

#### Scenario: Income transaction recipient matches selected member
- **WHEN** a member filter is active and the report aggregates an income transaction where the selected member is the `receivedByUserId`
- **THEN** the report SHALL include the full transaction amount in the member's income total, category breakdown, and monthly trend

#### Scenario: Income transaction recipient does not match selected member
- **WHEN** a member filter is active and the report aggregates an income transaction where the selected member is not the `receivedByUserId`
- **THEN** the transaction SHALL be excluded from the member's report calculations (net $0 income contribution)

#### Scenario: Category details drawer shows adjusted transaction amount
- **WHEN** a member filter is active and the user opens the category transactions detail modal
- **THEN** the transaction amount displayed for each transaction in the list SHALL show the selected member's individual share of the transaction rather than the full transaction amount

##### Example: Expense split and income recipient calculations
- **GIVEN** the following transactions in the current scope:
  | ID | Type | Amount | Split Detail | Received By |
  |---|---|---|---|---|
  | tx1 | expense | 1000 | UserA: 400, UserB: 600 | null |
  | tx2 | expense | 500 | UserB: 500 | null |
  | tx3 | income | 1200 | null | UserA |
  | tx4 | income | 800 | null | UserB |
- **WHEN** filtering by UserA
- **THEN** the report SHALL calculate:
  - Total Expense: 400 (from tx1; tx2 is ignored)
  - Total Income: 1200 (from tx3; tx4 is ignored)
  - Net: 800 (1200 - 400)
