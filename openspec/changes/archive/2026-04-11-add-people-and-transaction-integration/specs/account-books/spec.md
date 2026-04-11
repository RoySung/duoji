## ADDED Requirements

### Requirement: Account book settings include a People management section

The system SHALL display a People section in the account book settings page that lists all current members (registered users and virtual users) and provides controls to add or remove virtual users.

#### Scenario: View people in account book settings

- **WHEN** a user opens an existing account book's settings page
- **THEN** the system SHALL display the list of registered members and virtual users associated with that account book

#### Scenario: Add a virtual user from settings

- **WHEN** a user submits a name in the Add Virtual User form within account book settings
- **THEN** the system SHALL create the virtual user and include them in the displayed people list

#### Scenario: Remove a virtual user from settings

- **WHEN** a user confirms removal of a virtual user in account book settings
- **THEN** the system SHALL remove that virtual user from the people list

## MODIFIED Requirements

### Requirement: Users can manage personal account books

The system SHALL allow users to create, rename, edit, and delete private account books for personal expense tracking during Phase 1. The management interface SHALL split account book overview from account-book-specific editing, using a list page for navigation and dedicated settings pages for creating a new account book or editing an existing one. The `AccountBook` entity SHALL include a `virtualUsers` field storing embedded `VirtualUser` records scoped to that account book.

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
- **THEN** the system SHALL display that account book's current name, currency, description, and people list in an editable form

#### Scenario: Rename a personal account book

- **WHEN** a user submits a valid new name on an existing account book's settings page
- **THEN** the system SHALL persist the renamed account book in the available account book list

#### Scenario: Update account book details

- **WHEN** a user submits valid changes to an existing personal account book's currency or description on its settings page
- **THEN** the system SHALL persist the updated currency and description

#### Scenario: Delete a personal account book

- **WHEN** a user confirms deletion from an existing account book's settings page
- **THEN** the system SHALL remove that account book from the available account book list
