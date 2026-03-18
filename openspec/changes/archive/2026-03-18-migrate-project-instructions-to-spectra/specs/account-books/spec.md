## ADDED Requirements

### Requirement: Users can manage personal account books

The system SHALL allow users to create, rename, and delete private account books for personal expense tracking during Phase 1.

#### Scenario: Create a personal account book

- **WHEN** a user submits valid details for a new personal account book
- **THEN** the system SHALL create the account book and make it available for selection

#### Scenario: Delete a personal account book

- **WHEN** a user confirms deletion of an existing personal account book
- **THEN** the system SHALL remove that account book from the available account book list

### Requirement: The application maintains an active account book

The system SHALL maintain one active account book context for transaction creation, transaction listing, and account-book-scoped summaries.

#### Scenario: Switch the active account book

- **WHEN** a user selects a different account book from the account book picker
- **THEN** the system SHALL use the selected account book as the active context for subsequent account-book-scoped views

### Requirement: The account book list indicates the current selection

The system SHALL present the available personal account books and clearly indicate which account book is currently active.

#### Scenario: View the account book list

- **WHEN** a user opens the account book management or selection interface
- **THEN** the system SHALL display the active account book distinctly from inactive account books