## ADDED Requirements

### Requirement: The header displays the current account book and allows switching

On account book pages, the application header SHALL display the name of the currently active account book and provide a dropdown menu to switch between all available account books.

#### Scenario: View header on an account book page

- **WHEN** a user navigates to an account book page (`/account-books/[id]` or any sub-route)
- **THEN** the system SHALL display the header with the current account book name as the dropdown trigger label

#### Scenario: Open the account book dropdown

- **WHEN** a user clicks the account book menu trigger in the header
- **THEN** the system SHALL display a dropdown list of all available account books with the current account book visually highlighted

#### Scenario: Switch account book via dropdown

- **WHEN** a user selects a different account book from the dropdown
- **THEN** the system SHALL navigate to that account book's page and update the header label accordingly

#### Scenario: Create a new account book via dropdown

- **WHEN** a user clicks "New account book" at the bottom of the dropdown
- **THEN** the system SHALL navigate to the new account book creation page

### Requirement: The header shows the app title on non-account-book pages

On pages outside the account book area, the application header SHALL display the app title only, without the account book dropdown.

#### Scenario: View header on a non-account-book page

- **WHEN** a user navigates to a page that is not an account book route (e.g., settings, home)
- **THEN** the system SHALL display the header with the app title and no account book dropdown
