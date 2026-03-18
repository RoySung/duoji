## ADDED Requirements

### Requirement: Users can record income and expense transactions

The system SHALL allow users to create transactions with a type, amount, date, category, note, and payment method within the active account book.

#### Scenario: Create an expense transaction

- **WHEN** a user submits a valid expense transaction form in the active account book
- **THEN** the system SHALL store the transaction and include it in the active account book transaction list

#### Scenario: Create an income transaction

- **WHEN** a user submits a valid income transaction form in the active account book
- **THEN** the system SHALL store the transaction and include it in the active account book transaction list

### Requirement: Users can edit and delete transactions

The system SHALL allow users to modify and remove previously created transactions.

#### Scenario: Edit a transaction

- **WHEN** a user saves changes to an existing transaction
- **THEN** the system SHALL persist the updated transaction details

#### Scenario: Delete a transaction

- **WHEN** a user confirms deletion of an existing transaction
- **THEN** the system SHALL remove the transaction from the active account book transaction list

### Requirement: Transactions are presented in an account-book-scoped list

The system SHALL present transactions for the active account book in a browsable list grouped by date and accompanied by relevant totals for the visible range.

#### Scenario: View the transaction list

- **WHEN** a user opens the transaction history for the active account book
- **THEN** the system SHALL show only transactions that belong to the active account book and organize them by date