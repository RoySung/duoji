## MODIFIED Requirements

### Requirement: The shell supports page title and back navigation patterns

The shared app shell SHALL support page title presentation and contextual back navigation where a page is not a top-level destination, including nested settings pages.

#### Scenario: Open a nested page

- **WHEN** a user navigates to a non-top-level page inside the application shell
- **THEN** the system SHALL present the page title and a contextual back-navigation control

#### Scenario: Open the account book settings page from settings

- **WHEN** a user navigates from the settings landing page to the nested account book settings page inside the application shell
- **THEN** the system SHALL present the account book settings page title and a contextual back-navigation control that returns to settings