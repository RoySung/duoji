## MODIFIED Requirements

### Requirement: Transaction queries remain scoped to the target account book

The system SHALL allow the application to query locally stored transactions for one account book without returning transactions from other account books. The system SHALL also allow the application to retrieve distinct tag values from transactions belonging to a specific account book.

#### Scenario: Read transactions for one account book

- **WHEN** the application requests transactions for a specific account book
- **THEN** the system SHALL return only transaction records whose accountBookId matches that account book

#### Scenario: Read a transaction by identifier

- **WHEN** the application requests one transaction by its identifier
- **THEN** the system SHALL return that transaction when it exists or null when it does not exist

#### Scenario: Retrieve distinct tags for one account book

- **WHEN** the application requests tags for a specific account book
- **THEN** the system SHALL return a deduplicated array of non-empty, trimmed tag strings collected from all non-deleted transactions in that account book

##### Example: tags from multiple transactions

- **GIVEN** account book "AB-1" contains three transactions:
  - Transaction A with tags ["Food", "Lunch"]
  - Transaction B with tags ["Food", "Transport"]
  - Transaction C with tags [""] (empty string tag)
- **WHEN** the application requests tags for account book "AB-1"
- **THEN** the system SHALL return ["Food", "Lunch", "Transport"] (deduplicated, empty strings excluded)

#### Scenario: Retrieve tags for an account book with no transactions

- **WHEN** the application requests tags for an account book that has no transactions
- **THEN** the system SHALL return an empty array

#### Scenario: Retrieve tags across all account books

- **WHEN** the application requests tags with accountBookId "all"
- **THEN** the system SHALL return deduplicated tags collected from all non-deleted transactions across every account book
