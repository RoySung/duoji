## MODIFIED Requirements

### Requirement: Users can navigate to category settings from an account book card

The system SHALL use the account book card in the Account Books Settings page as the entry point to that account book's dedicated settings page, and the card SHALL NOT expose a direct Category Settings action.

#### Scenario: Open account book settings from account book card

- **WHEN** a user presses the primary manage action on an account book card
- **THEN** the system SHALL navigate to that account book's dedicated settings page

#### Scenario: Category settings is not shown on account book card

- **WHEN** a user views the available actions on an account book card
- **THEN** the system SHALL NOT display a direct Category Settings action on that card

## ADDED Requirements

### Requirement: Users can navigate to category settings from an account book settings page

The system SHALL provide a Category Settings action inside each account book's dedicated settings page, and that action SHALL lead to the category settings page for the same account book.

#### Scenario: Navigate to category settings from an account book settings page

- **WHEN** a user presses the "Category Settings" action on an existing account book's settings page
- **THEN** the system SHALL navigate to the category settings page for that same account book

#### Scenario: Return from category settings to account book settings

- **WHEN** a user uses back navigation from the category settings page for an account book
- **THEN** the system SHALL return to that account book's settings page
