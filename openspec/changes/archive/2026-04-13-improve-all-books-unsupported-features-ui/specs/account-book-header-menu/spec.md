## ADDED Requirements

### Requirement: The "All Account Books" card communicates feature limitations

When the account book menu drawer is open, the "All Account Books" card SHALL display a note clarifying that Settlement and Add Transaction are not available in the aggregate view. This note SHALL be rendered as supplementary descriptive text beneath the existing "View transactions across every account book" description.

#### Scenario: Open the account book menu drawer in the all-books view

- **WHEN** a user opens the account book menu drawer while viewing the "All Account Books" aggregate view
- **THEN** the system SHALL display the "All Account Books" card with a note stating that Settlement and Add Transaction are not supported in this view

#### Scenario: Open the account book menu drawer while viewing a specific account book

- **WHEN** a user opens the account book menu drawer while viewing a specific account book
- **THEN** the system SHALL still display the "All Account Books" card with the same feature limitation note, so the user understands the trade-off before switching
