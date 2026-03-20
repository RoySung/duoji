## MODIFIED Requirements

### Requirement: Users can manage personal account books

The system SHALL allow users to create, rename, edit, and delete private account books for personal expense tracking during Phase 1. The management interface SHALL allow users to update the account book name, currency, and description.

#### Scenario: Open the account book management interface

- **WHEN** a user opens the account book settings page
- **THEN** the system SHALL display the available personal account books and controls to create, edit, and delete an account book

#### Scenario: Create a personal account book

- **WHEN** a user submits valid details for a new personal account book
- **THEN** the system SHALL create the account book and make it available for selection

#### Scenario: Rename a personal account book

- **WHEN** a user submits a valid new name for an existing personal account book
- **THEN** the system SHALL persist the renamed account book in the available account book list

#### Scenario: Update account book details

- **WHEN** a user submits valid changes to an existing personal account book's currency or description
- **THEN** the system SHALL persist the updated currency and description

#### Scenario: Delete a personal account book

- **WHEN** a user confirms deletion of an existing personal account book
- **THEN** the system SHALL remove that account book from the available account book list

### Requirement: The application maintains an active account book

The system SHALL maintain one current account book context for transaction creation, transaction listing, and account-book-scoped summaries. After local persistence initializes and personal account books become available, the system SHALL establish a current account book before the user performs account-book-scoped actions.

#### Scenario: Bootstrap the current account book on startup

- **WHEN** the application finishes loading persisted account books and at least one account book exists with no current selection
- **THEN** the system SHALL select the first available account book as the current context for subsequent account-book-scoped views

#### Scenario: Change the current account book from the home page

- **WHEN** a user selects a different account book from the home page selector
- **THEN** the system SHALL use the selected account book as the current context for subsequent account-book-scoped views

#### Scenario: Create the first current account book

- **WHEN** a user creates an account book while no current account book is selected
- **THEN** the system SHALL use the newly created account book as the current context

#### Scenario: Delete the current account book when another account book remains

- **WHEN** a user deletes the currently selected account book and at least one other account book remains
- **THEN** the system SHALL switch the current context to one of the remaining account books

#### Scenario: Delete the last current account book

- **WHEN** a user deletes the currently selected account book and no other account books remain
- **THEN** the system SHALL clear the current account book context until another account book becomes available

### Requirement: The account book list indicates the current selection

The system SHALL present an account-book selection interface and clearly indicate which account book is currently selected.

#### Scenario: View the account book selector

- **WHEN** a user opens the home page selector or another account-book selection interface
- **THEN** the system SHALL display the current account book distinctly from the other available account books