## ADDED Requirements

### Requirement: Transactions with a deleted category display as uncategorized

When a transaction's `categoryId` no longer exists in the category store (because the category was deleted), the system SHALL display the transaction as "未分類" rather than hiding the transaction or silently using another category.

#### Scenario: Display transaction with deleted category

- **WHEN** the transaction list renders a transaction whose `categoryId` does not match any category in the category store
- **THEN** the system SHALL display "未分類" as the category label for that transaction

#### Scenario: Display transaction with empty categoryId

- **WHEN** the transaction list renders a transaction whose `categoryId` is an empty string
- **THEN** the system SHALL display "未分類" as the category label for that transaction
