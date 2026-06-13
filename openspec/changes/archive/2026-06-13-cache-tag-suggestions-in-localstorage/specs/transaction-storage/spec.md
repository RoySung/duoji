## MODIFIED Requirements

### Requirement: Transaction queries remain scoped to the target account book

The system SHALL allow the application to query locally stored transactions for one account book without returning transactions from other account books.

#### Scenario: Read transactions for one account book

- **WHEN** the application requests transactions for a specific account book
- **THEN** the system SHALL return only transaction records whose accountBookId matches that account book

#### Scenario: Read a transaction by identifier

- **WHEN** the application requests one transaction by its identifier
- **THEN** the system SHALL return that transaction when it exists or null when it does not exist
