## MODIFIED Requirements

### Requirement: The application provides a shared app shell

The web application SHALL provide a shared app shell that wraps primary pages in a consistent mobile-first layout. The shell SHALL include a top header containing the app identity and contextual controls, a centered content frame no wider than 768px, and a floating bottom navigation bar. The shell SHALL account for top and bottom device safe-area insets and SHALL reserve enough scroll space to keep page content unobstructed.

#### Scenario: Open a primary application page

- **WHEN** a user navigates to a primary page within the web application
- **THEN** the system SHALL render that page within the shared application shell, with a top header bar visible at the top and the bottom navigation bar visible at the bottom
- **THEN** the page content SHALL use the centered content frame and shared page gutters

#### Scenario: View the shell on a mobile safe-area device

- **WHEN** a primary page is displayed on a device that reports top or bottom safe-area insets
- **THEN** the header and bottom navigation SHALL include the corresponding inset spacing
- **THEN** no label, icon, or interactive target SHALL be clipped by the device edge

#### Scenario: Reach content behind the floating navigation

- **WHEN** a user scrolls a primary page to its end
- **THEN** the final interactive element SHALL be fully visible and activatable above the floating bottom navigation

#### Scenario: Use the shell on a wide viewport

- **WHEN** the viewport is wider than 768px
- **THEN** the page content SHALL remain centered at a maximum width of 768px
- **THEN** the header and bottom navigation SHALL retain the same destination order and interaction model used on mobile

#### Scenario: Identify the active destination

- **WHEN** the user opens the home, settlement, report, or settings destination
- **THEN** the corresponding bottom-navigation item SHALL expose a visible selected state
- **THEN** the central create-transaction action SHALL retain its existing enabled or disabled rule for the active account-book context
