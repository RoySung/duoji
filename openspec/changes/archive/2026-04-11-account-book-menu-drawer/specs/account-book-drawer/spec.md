## ADDED Requirements

### Requirement: The account book menu opens as a drawer

The system SHALL provide a drawer panel that opens from the right side of the screen when the user activates the account book menu button in the header.

#### Scenario: Open the account book drawer

- **WHEN** a user taps the account book menu button in the header
- **THEN** the system SHALL open a drawer panel from the right side of the screen

#### Scenario: Close the account book drawer

- **WHEN** a user taps the backdrop or a close control while the drawer is open
- **THEN** the system SHALL close the drawer panel

---

### Requirement: The drawer lists all account books for switching

The drawer SHALL display all account books and allow the user to switch to any of them. The currently active account book SHALL be visually highlighted.

#### Scenario: View account books in drawer

- **WHEN** the drawer is open
- **THEN** the system SHALL list all account books with the active one visually distinguished

#### Scenario: Switch account book from drawer

- **WHEN** a user selects a different account book in the drawer
- **THEN** the system SHALL navigate to that account book's page and close the drawer

---

### Requirement: The drawer provides inline account book management actions

The drawer SHALL allow users to create a new account book, rename an existing account book, and delete an existing account book without leaving the current page.

#### Scenario: Create a new account book from the drawer

- **WHEN** a user activates the "New account book" action in the drawer
- **THEN** the system SHALL present a way to enter a name and create a new account book

#### Scenario: Rename an account book from the drawer

- **WHEN** a user activates the rename action on an account book row in the drawer
- **THEN** the system SHALL allow the user to edit the name of that account book

#### Scenario: Delete an account book from the drawer

- **WHEN** a user activates the delete action on an account book row in the drawer
- **THEN** the system SHALL prompt for confirmation before deleting the account book
