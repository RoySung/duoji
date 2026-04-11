## MODIFIED Requirements

### Requirement: Core domain records persist locally in IndexedDB

The web application SHALL persist account books, transactions, categories, settlements, and user-related local records in IndexedDB. The transactions table SHALL index the `settlementRecordId` field to support efficient unsettled-transaction queries.

#### Scenario: Save a new domain record

- **WHEN** the application creates or updates an account book, transaction, category, settlement record, or other local user record
- **THEN** the system SHALL persist the change in IndexedDB

#### Scenario: Index supports unsettled transaction lookup

- **WHEN** the Dexie schema is initialized
- **THEN** the transactions table SHALL have an index on `settlementRecordId` so that queries filtering by that field do not require a full table scan
