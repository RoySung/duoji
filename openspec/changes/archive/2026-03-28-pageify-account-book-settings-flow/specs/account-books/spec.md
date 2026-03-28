## MODIFIED Requirements

### Requirement: Users can manage personal account books

The system SHALL allow users to create, rename, edit, and delete private account books for personal expense tracking during Phase 1. The management interface SHALL split account book overview from account-book-specific editing, using a list page for navigation and dedicated settings pages for creating a new account book or editing an existing one.

#### Scenario: Open the account book management interface

- **WHEN** a user opens the account book settings page
- **THEN** the system SHALL display the available personal account books and controls to create a new account book or open an existing account book's settings page

#### Scenario: Open the new account book page

- **WHEN** a user starts the create flow from the account book settings page
- **THEN** the system SHALL navigate to a dedicated new account book settings page with an empty account book form

#### Scenario: Create a personal account book

- **WHEN** a user submits valid details on the new account book settings page
- **THEN** the system SHALL create the account book and make it available for selection

#### Scenario: Open an existing account book settings page

- **WHEN** a user opens the settings page for an existing account book
- **THEN** the system SHALL display that account book's current name, currency, and description in an editable form

#### Scenario: Rename a personal account book

- **WHEN** a user submits a valid new name on an existing account book's settings page
- **THEN** the system SHALL persist the renamed account book in the available account book list

#### Scenario: Update account book details

- **WHEN** a user submits valid changes to an existing personal account book's currency or description on its settings page
- **THEN** the system SHALL persist the updated currency and description

#### Scenario: Delete a personal account book

- **WHEN** a user confirms deletion from an existing account book's settings page
- **THEN** the system SHALL remove that account book from the available account book list