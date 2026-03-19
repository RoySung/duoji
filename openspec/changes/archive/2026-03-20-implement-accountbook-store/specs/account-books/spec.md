## MODIFIED Requirements

### Requirement: The application maintains an active account book

The system SHALL maintain one active account book context for transaction creation, transaction listing, and account-book-scoped summaries. After local persistence initializes and personal account books become available, the system SHALL establish an active account book before the user performs account-book-scoped actions.

#### Scenario: Bootstrap the active account book on startup

- **WHEN** the application finishes loading persisted account books and at least one account book exists with no current active selection
- **THEN** the system SHALL select a deterministic active account book for subsequent account-book-scoped views

#### Scenario: Switch the active account book

- **WHEN** a user selects a different account book from the account book picker
- **THEN** the system SHALL use the selected account book as the active context for subsequent account-book-scoped views

#### Scenario: Create the first active account book

- **WHEN** a user creates an account book while no active account book is currently selected
- **THEN** the system SHALL use the newly created account book as the active context

#### Scenario: Delete the active account book when another account book remains

- **WHEN** a user deletes the currently active account book and at least one other account book remains
- **THEN** the system SHALL switch the active context to one of the remaining account books

#### Scenario: Delete the last active account book

- **WHEN** a user deletes the currently active account book and no other account books remain
- **THEN** the system SHALL clear the active account book context until another account book becomes available