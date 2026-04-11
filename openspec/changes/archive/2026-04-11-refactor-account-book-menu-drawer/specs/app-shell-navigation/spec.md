## ADDED Requirements

### Requirement: The account book menu drawer displays account books as navigable cards

The account book menu drawer in the app header SHALL present each account book as a card showing its name, currency, and description (when present). The active account book SHALL be visually distinguished from inactive ones.

#### Scenario: Open the account book menu drawer

- **WHEN** a user opens the account book menu drawer on an account book page
- **THEN** the system SHALL display each account book as a card with its name, currency, and description

#### Scenario: Active account book card

- **WHEN** the account book menu drawer is open
- **THEN** the system SHALL visually highlight the currently active account book card and SHALL NOT show a "Switch" button for it

#### Scenario: Inactive account book card

- **WHEN** the account book menu drawer is open and there are multiple account books
- **THEN** each non-active account book card SHALL display a "Switch" button and a "View settings" button

### Requirement: The account book menu drawer delegates CRUD to settings pages

The account book menu drawer SHALL NOT provide inline rename, delete, or create forms. All account book management SHALL be delegated to the settings pages via navigation.

#### Scenario: Switch to a different account book

- **WHEN** a user presses "Switch" on a non-active account book card in the drawer
- **THEN** the system SHALL navigate to that account book's page and close the drawer

#### Scenario: Navigate to account book settings from the drawer

- **WHEN** a user presses "View settings" on any account book card in the drawer
- **THEN** the system SHALL navigate to `/settings/account-books/[id]` for that account book and close the drawer

#### Scenario: Navigate to create a new account book from the drawer

- **WHEN** a user presses "New account book" in the drawer footer
- **THEN** the system SHALL navigate to `/settings/account-books/new` and close the drawer
