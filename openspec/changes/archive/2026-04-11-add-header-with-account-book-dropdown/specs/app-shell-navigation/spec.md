## MODIFIED Requirements

### Requirement: The application provides a shared app shell

The web application SHALL provide a shared app shell that wraps primary pages in a consistent layout. The shell SHALL include a top header bar (containing the app title and contextual controls) and a bottom navigation bar.

#### Scenario: Open a primary application page

- **WHEN** a user navigates to a primary page within the web application
- **THEN** the system SHALL render that page within the shared application shell, with a top header bar visible at the top and the bottom navigation bar visible at the bottom
