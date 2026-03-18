## ADDED Requirements

### Requirement: The application provides a shared app shell

The web application SHALL provide a shared app shell that wraps primary pages in a consistent layout.

#### Scenario: Open a primary application page

- **WHEN** a user navigates to a primary page within the web application
- **THEN** the system SHALL render that page within the shared application shell

### Requirement: The application provides primary navigation for Phase 1

The web application SHALL provide primary navigation for the account book area, transaction entry flow, and statistics area.

#### Scenario: Use primary navigation

- **WHEN** a user interacts with the main navigation controls
- **THEN** the system SHALL allow movement between the primary Phase 1 areas of the application

### Requirement: The shell supports page title and back navigation patterns

The shared app shell SHALL support page title presentation and contextual back navigation where a page is not a top-level destination.

#### Scenario: Open a nested page

- **WHEN** a user navigates to a non-top-level page inside the application shell
- **THEN** the system SHALL present the page title and a contextual back-navigation control

### Requirement: The shell is usable on mobile-first and desktop layouts

The shared app shell SHALL remain usable on mobile-first layouts and on wider desktop viewports.

#### Scenario: Resize the viewport

- **WHEN** the application is viewed on a phone-sized viewport or a desktop-sized viewport
- **THEN** the system SHALL preserve primary navigation access and readable page structure