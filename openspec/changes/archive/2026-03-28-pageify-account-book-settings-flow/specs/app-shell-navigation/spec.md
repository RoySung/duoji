## MODIFIED Requirements

### Requirement: The shell supports page title and back navigation patterns

The shared app shell SHALL support page title presentation and contextual back navigation where a page is not a top-level destination. Nested account book settings routes SHALL present titles and back targets that reflect whether the user is on the account book list, a new account book page, an existing account book settings page, or that account book's category settings page.

#### Scenario: Open a nested page

- **WHEN** a user navigates to a non-top-level page inside the application shell
- **THEN** the system SHALL present the page title and a contextual back-navigation control

#### Scenario: Open the new account book page

- **WHEN** a user navigates from the account book settings list to the new account book page
- **THEN** the system SHALL present a page title for creating an account book and a back-navigation control that returns to the account book settings list

#### Scenario: Open an existing account book settings page

- **WHEN** a user navigates from the account book settings list to a specific account book's settings page
- **THEN** the system SHALL present that page within the shared shell with a title, account-book-scoped actions, and a back-navigation control that returns to the account book settings list

#### Scenario: Open category settings from account book settings

- **WHEN** a user navigates from an account book's settings page to that account book's category settings page
- **THEN** the system SHALL present a contextual back-navigation control that returns to the originating account book settings page
