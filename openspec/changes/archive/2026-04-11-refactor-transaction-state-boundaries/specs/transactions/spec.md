## MODIFIED Requirements

### Requirement: Transactions are presented in an account-book-scoped list

The system SHALL present transactions for the current account book on the home page in a browsable flat list. Each visible transaction row SHALL surface key summary details, including date, category, description, expense payer information for expense transactions, income recipient information for income transactions, tags when present, payment method when present, an equal-split indicator when applicable, and signed amount, and SHALL provide direct access to edit that transaction. The transaction list query state for that view SHALL be owned by the active account-book page rather than an app-level shared transaction store.

#### Scenario: View the current account book transaction list

- **WHEN** a user opens the home page with a current account book selected
- **THEN** the system SHALL load and show only transactions that belong to that account book in one flat list ordered by the transaction list's current sort, using page-owned query state for that account-book view

#### Scenario: View transaction summary details

- **WHEN** a transaction row is rendered in the home-page list
- **THEN** the system SHALL display enough summary information to distinguish the transaction, including its date, category, description or note, expense payer information for expense transactions, income recipient information for income transactions, tags when present, payment method when present, an equal-split indicator when the split detail is even, and signed amount

#### Scenario: Edit a transaction from the visible list

- **WHEN** a user chooses the edit action for a visible transaction row
- **THEN** the system SHALL open the transaction editing flow for the current account-book page, prefilled with that transaction's current values, without requiring an app-shell-wide transaction store

## ADDED Requirements

### Requirement: Transaction editing session is scoped to the active account-book page

The system SHALL keep transaction creation and editing session state scoped to the account-book page that owns the visible transaction list, unless a separate cross-page requirement is introduced.

#### Scenario: Open a new transaction flow from an account-book page

- **WHEN** a user starts creating a transaction while viewing an account-book page
- **THEN** the system SHALL open a transaction session owned by that page and associate the draft with that active account book

#### Scenario: Switch away from the active account-book page

- **WHEN** a user leaves the account-book page that owns an in-progress transaction session
- **THEN** the system SHALL allow that page-owned session to be disposed without preserving an app-level transaction editing state