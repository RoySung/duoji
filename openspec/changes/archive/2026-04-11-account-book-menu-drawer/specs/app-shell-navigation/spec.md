## MODIFIED Requirements

### Requirement: The application provides primary navigation for Phase 1

The web application SHALL provide primary navigation for the account book area, transaction entry flow, and statistics area. On account book routes, the header SHALL display an account book menu button that opens a drawer for switching and managing account books.

#### Scenario: Use primary navigation

- **WHEN** a user interacts with the main navigation controls
- **THEN** the system SHALL allow movement between the primary Phase 1 areas of the application

#### Scenario: Open account book menu on an account book route

- **WHEN** a user is on an account book route and activates the account book menu button in the header
- **THEN** the system SHALL open a drawer panel rather than a dropdown
