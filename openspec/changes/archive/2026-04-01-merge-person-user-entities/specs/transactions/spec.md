## MODIFIED Requirements

### Requirement: Users can record income and expense transactions

The system SHALL allow users to create transactions with a type, amount, date, category, note, and payment method within the active account book. Each participant reference in `paidByDetail` and `splitDetail` SHALL use `personType: 'registered'` for registered users and `personType: 'virtual'` for virtual users.

#### Scenario: Create an expense transaction

- **WHEN** a user submits a valid expense transaction form in the active account book
- **THEN** the system SHALL store the transaction and include it in the active account book transaction list

#### Scenario: Create an income transaction

- **WHEN** a user submits a valid income transaction form in the active account book
- **THEN** the system SHALL store the transaction and include it in the active account book transaction list

#### Scenario: Participant type stored as `registered`

- **WHEN** a registered user is referenced in a transaction's `paidByDetail` or `splitDetail`
- **THEN** the system SHALL store `personType: 'registered'` (not `'user'`) for that participant entry
