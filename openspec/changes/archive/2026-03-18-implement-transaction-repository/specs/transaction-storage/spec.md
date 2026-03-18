## ADDED Requirements

### Requirement: Transaction records persist through a dedicated repository

The system SHALL persist transaction records in IndexedDB through a dedicated transaction repository that validates each record before writing it to local storage.

#### Scenario: Create a valid transaction record

- **WHEN** the application saves a valid transaction for an account book through the repository
- **THEN** the system SHALL persist the transaction and return it from later repository reads

#### Scenario: Update an existing transaction record

- **WHEN** the application saves changes to an existing transaction through the repository
- **THEN** the system SHALL persist the updated record and later reads SHALL return the updated values

#### Scenario: Delete an existing transaction record

- **WHEN** the application deletes an existing transaction through the repository
- **THEN** the system SHALL remove it from local storage and later reads SHALL report that it is missing

#### Scenario: Reject an invalid transaction record

- **WHEN** the application attempts to save a transaction that fails repository validation
- **THEN** the system SHALL reject the write and SHALL NOT persist the invalid transaction record

### Requirement: Transaction queries remain scoped to the target account book

The system SHALL allow the application to query locally stored transactions for one account book without returning transactions from other account books.

#### Scenario: Read transactions for one account book

- **WHEN** the application requests transactions for a specific account book
- **THEN** the system SHALL return only transaction records whose accountBookId matches that account book

#### Scenario: Read a transaction by identifier

- **WHEN** the application requests one transaction by its identifier
- **THEN** the system SHALL return that transaction when it exists or null when it does not exist

### Requirement: Local transaction data can be cleared for development workflows

The system SHALL support clearing all locally stored transactions so automated tests and local development can start from a clean state.

#### Scenario: Clear all local transactions

- **WHEN** automated tests or local development call the repository clear operation
- **THEN** the system SHALL remove all stored transaction records from the local transaction store