## MODIFIED Requirements

### Requirement: Users can record income and expense transactions

The system SHALL allow users to create transactions with a type, amount, date, category, note, and payment method within the active account book. Transaction split fields (`paidByDetail`, `splitDetail`) SHALL reference `Person` records (by `personId` and `personType`) from the active account book's people list rather than embedding full `User` objects. The `receivedByPersonId` field SHALL replace `receivedByUserId` and SHALL accept any `Person` id from the account book's people list.

#### Scenario: Create an expense transaction

- **WHEN** a user submits a valid expense transaction form in the active account book
- **THEN** the system SHALL store the transaction and include it in the active account book transaction list

#### Scenario: Create an income transaction

- **WHEN** a user submits a valid income transaction form in the active account book
- **THEN** the system SHALL store the transaction and include it in the active account book transaction list

## ADDED Requirements

### Requirement: Transaction form allows selecting people from the account book

The system SHALL populate the payer and split-participant pickers in the transaction form with the active account book's people list, including both registered users and virtual users.

#### Scenario: Select a registered user as payer

- **WHEN** a user opens the payer picker in the transaction form
- **THEN** the system SHALL display all registered members of the active account book as selectable options

#### Scenario: Select a virtual user as payer

- **WHEN** a user opens the payer picker in the transaction form
- **THEN** the system SHALL display all virtual users of the active account book as selectable options alongside registered users

#### Scenario: Select participants for expense split

- **WHEN** a user configures split participants in the transaction form
- **THEN** the system SHALL display all people (registered and virtual) from the active account book as selectable participants

### Requirement: Data migration converts embedded user objects to person references

The system SHALL migrate existing transaction records on first run after upgrade, converting `paidByDetail[].user` and `splitDetail[].user` embedded `User` objects to `{ personId, personType: 'user', amount }` references. The `receivedByUserId` field SHALL be migrated to `receivedByPersonId`.

#### Scenario: Migrate existing transactions on startup

- **WHEN** the application starts and detects unmigrated transaction records
- **THEN** the system SHALL convert all `paidByDetail` and `splitDetail` entries from embedded user format to person-reference format without data loss
