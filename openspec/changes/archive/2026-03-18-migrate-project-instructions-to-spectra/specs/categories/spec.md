## ADDED Requirements

### Requirement: Default categories exist for income and expense flows

The system SHALL provide default category sets for both income and expense transactions so users can record common transaction types without manual setup.

#### Scenario: Start recording a new transaction

- **WHEN** a user opens a new income or expense transaction form
- **THEN** the system SHALL provide category choices appropriate to the selected transaction type

### Requirement: Transactions use typed categories

The system SHALL assign each transaction to a category whose type matches the transaction type.

#### Scenario: Choose a category for an expense

- **WHEN** a user selects a category while creating or editing an expense transaction
- **THEN** the system SHALL restrict the available category choices to expense categories

### Requirement: Custom categories support visual metadata

The system SHALL support user-defined categories with icon and color metadata so custom categories remain distinguishable in transaction flows.

#### Scenario: Create a custom category

- **WHEN** a user creates a custom category with a name, icon, and color
- **THEN** the system SHALL make that category available in future transaction flows with the configured visual metadata