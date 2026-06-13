## MODIFIED Requirements

### Requirement: Transactions are presented in an account-book-scoped list

The system SHALL present transactions for the current account book on the home page in a browsable flat list. Each visible transaction row SHALL surface key summary details, including date, category, description, expense payer information for expense transactions, income recipient information for income transactions, tags when present, payment method when present, an equal-split indicator when applicable, and the transaction amount, and SHALL provide direct access to edit that transaction. Income amounts SHALL be prefixed with a `+` sign; expense amounts SHALL be displayed without a sign prefix, with expense versus income distinction conveyed through color (danger for expense, success for income). The transaction list query state for that view SHALL be owned by the active account-book page rather than an app-level shared transaction store.

#### Scenario: View the current account book transaction list

- **WHEN** a user opens the home page with a current account book selected
- **THEN** the system SHALL load and show only transactions that belong to that account book in one flat list ordered by the transaction list's current sort, using page-owned query state for that account-book view

#### Scenario: View transaction summary details

- **WHEN** a transaction row is rendered in the home-page list
- **THEN** the system SHALL display enough summary information to distinguish the transaction, including its date, category, description or note, expense payer information for expense transactions, income recipient information for income transactions, tags when present, payment method when present, an equal-split indicator when the split detail is even, and the transaction amount with a `+` prefix for income and no sign prefix for expense
- **AND** the expense payer or income recipient information SHALL be displayed with a LuDollarSign prefix icon and their user avatar(s)

#### Scenario: Edit a transaction from the visible list

- **WHEN** a user chooses the edit action for a visible transaction row
- **THEN** the system SHALL open the transaction editing flow for the current account-book page, prefilled with that transaction's current values, without requiring an app-shell-wide transaction store

#### Scenario: Transaction query cache stays coherent after mutation

- **WHEN** a transaction is created, updated, or deleted from the account-book page
- **THEN** the visible transaction list query state SHALL update the affected cached list results and related calendar-summary query results without waiting for the cache TTL to expire
