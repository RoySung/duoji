## MODIFIED Requirements

### Requirement: Users can record income and expense transactions

The system SHALL allow users to create transactions with a type, amount, date, category, note, and payment method within the active account book. Each participant reference in `paidByDetail` and `splitDetail` SHALL use `userType: 'registered'` for registered users and `userType: 'virtual'` for virtual users. Each transaction SHALL carry a `settlementRecordId` field that is `null` when the transaction has not been included in any settlement record, and SHALL be set to the owning `SettlementRecord.id` when included.

#### Scenario: Create an expense transaction

- **WHEN** a user submits a valid expense transaction form in the active account book
- **THEN** the system SHALL store the transaction with `settlementRecordId: null` and include it in the active account book transaction list

#### Scenario: Create an income transaction

- **WHEN** a user submits a valid income transaction form in the active account book
- **THEN** the system SHALL store the transaction with `settlementRecordId: null` and include it in the active account book transaction list

#### Scenario: Participant type stored as `registered`

- **WHEN** a registered user is referenced in a transaction's `paidByDetail` or `splitDetail`
- **THEN** the system SHALL store `userType: 'registered'` (not `'user'`) for that participant entry

## ADDED Requirements

### Requirement: Unsettled expense transactions are queryable by index

The system SHALL support efficient lookup of expense transactions that have not been assigned to a settlement record, without loading settlement records.

#### Scenario: Query unsettled transactions

- **WHEN** the settlement store initializes for an account book
- **THEN** the system SHALL retrieve unsettled expense transactions by querying transactions where `settlementRecordId` is null, without reading any settlement record's payload

#### Scenario: Transaction marked as settled

- **WHEN** a settlement record is successfully created
- **THEN** the system SHALL update each included expense transaction's `settlementRecordId` to the new settlement record's ID

### Requirement: Settlement record transactions are queryable by reverse lookup

The system SHALL allow retrieving all transactions belonging to a specific settlement record by querying `settlementRecordId` on the transactions table.

#### Scenario: Load transactions for a settlement record

- **WHEN** the application needs to display which transactions were included in a settlement record
- **THEN** the system SHALL retrieve those transactions by querying `transactions.where('settlementRecordId').equals(recordId)` rather than reading a stored `transactionIds` array from the settlement record
