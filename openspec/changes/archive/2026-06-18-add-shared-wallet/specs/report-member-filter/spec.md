## MODIFIED Requirements

### Requirement: Filtering by member calculates and displays the member's own share

When a specific member filter is active, all summary statistics, category breakdown totals, and monthly trends on the report page SHALL be calculated using only that member's share of the transaction amounts.

For an expense transaction, the member's share SHALL be the amount allocated to them in the transaction's `splitDetail`. If the member is not in `splitDetail`, their share SHALL be $0 — UNLESS the transaction's `splitDetail` includes a shared wallet member, in which case the member's share from the shared wallet portion SHALL be added (see the `shared-wallet` spec for distribution rules). If both the member's direct split and shared wallet distribution result in $0, the transaction SHALL be excluded.

For an income transaction, the member's share SHALL be the transaction's full amount if they are the `receivedByUserId`. If the `receivedByUserId` is a shared wallet member, the member's share SHALL be the transaction amount divided by the number of real members in the account book. If neither condition applies, their share SHALL be $0.

#### Scenario: Expense transaction amount is adjusted to member split share

- **WHEN** a member filter is active and the report aggregates an expense transaction where the selected member is in `splitDetail` with a split amount
- **THEN** the report SHALL use that split amount plus any shared wallet distribution for the member's expense total, category breakdown, and monthly trend

#### Scenario: Expense transaction with $0 member split share is excluded

- **WHEN** a member filter is active and the report aggregates an expense transaction where the selected member is not in `splitDetail` and no shared wallet member is in `splitDetail`
- **THEN** the transaction SHALL be excluded from the member's report calculations (net $0 expense contribution)

#### Scenario: Income transaction recipient matches selected member

- **WHEN** a member filter is active and the report aggregates an income transaction where the selected member is the `receivedByUserId`
- **THEN** the report SHALL include the full transaction amount in the member's income total, category breakdown, and monthly trend

#### Scenario: Income transaction recipient does not match selected member

- **WHEN** a member filter is active and the report aggregates an income transaction where the selected member is not the `receivedByUserId` and the `receivedByUserId` is not a shared wallet member
- **THEN** the transaction SHALL be excluded from the member's report calculations (net $0 income contribution)

#### Scenario: Category details drawer shows adjusted transaction amount

- **WHEN** a member filter is active and the user opens the category transactions detail modal
- **THEN** the transaction amount displayed for each transaction in the list SHALL show the selected member's individual share of the transaction (including shared wallet distribution) rather than the full transaction amount

##### Example: Expense split and income recipient calculations with shared wallet

- **GIVEN** the following transactions in the current scope and account book members UserA, UserB, SharedWallet (isSharedWallet: true):
  | ID | Type | Amount | Split Detail | Received By |
  |---|---|---|---|---|
  | tx1 | expense | 1500 | UserA: 500, UserB: 500, SharedWallet: 500 | null |
  | tx2 | expense | 500 | UserB: 500 | null |
  | tx3 | income | 1200 | null | UserA |
  | tx4 | income | 800 | null | SharedWallet |
- **WHEN** filtering by UserA
- **THEN** the report SHALL calculate:
  - Total Expense: 750 (tx1: 500 direct + 250 shared wallet share; tx2: ignored — UserA not in split and no shared wallet)
  - Total Income: 1600 (tx3: 1200 direct; tx4: 800/2 = 400 shared wallet share)
  - Net: 850 (1600 - 750)
