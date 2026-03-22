## ADDED Requirements

### Requirement: Income transactions record a single recipient

The system SHALL record exactly one recipient for each income transaction. The income transaction form SHALL prefill that recipient with the current user and SHALL allow the user to choose a different participant from the active account book before saving.

#### Scenario: Create an income transaction with the default recipient

- **WHEN** a user opens a new income transaction form and saves a valid income transaction without changing the recipient
- **THEN** the system SHALL persist the current user as the income recipient

#### Scenario: Create an income transaction with a different recipient

- **WHEN** a user selects a different active-account-book participant as the income recipient and saves a valid income transaction
- **THEN** the system SHALL persist that selected participant as the income recipient

#### Scenario: Edit the recipient of an income transaction

- **WHEN** a user changes the recipient on an existing income transaction and saves the form
- **THEN** the system SHALL persist the updated income recipient

## MODIFIED Requirements

### Requirement: Transactions are presented in an account-book-scoped list

The system SHALL present transactions for the current account book on the home page in a browsable flat list. Each visible transaction row SHALL surface key summary details, including date, category, description, expense payer information for expense transactions, income recipient information for income transactions, tags when present, payment method when present, an equal-split indicator when applicable, and signed amount, and SHALL provide direct access to edit that transaction.

#### Scenario: View the current account book transaction list

- **WHEN** a user opens the home page with a current account book selected
- **THEN** the system SHALL show only transactions that belong to that account book in one flat list ordered by the transaction list's current sort

#### Scenario: View transaction summary details

- **WHEN** a transaction row is rendered in the home-page list
- **THEN** the system SHALL display enough summary information to distinguish the transaction, including its date, category, description or note, expense payer information for expense transactions, income recipient information for income transactions, tags when present, payment method when present, an equal-split indicator when the split detail is even, and signed amount

#### Scenario: Edit a transaction from the visible list

- **WHEN** a user chooses the edit action for a visible transaction row
- **THEN** the system SHALL open the transaction editing flow prefilled with that transaction's current values
