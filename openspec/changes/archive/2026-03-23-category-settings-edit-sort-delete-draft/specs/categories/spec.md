## ADDED Requirements

### Requirement: Categories carry a sortOrder field for display ordering

The system SHALL store a `sortOrder` field on each `Category` entity to determine display order within its parent context (root groups within a type tab, sub-categories within a root group).

#### Scenario: Category sort order is persisted

- **WHEN** a user saves a reordered list of categories
- **THEN** the system SHALL persist the new `sortOrder` values for each affected category in the local database

#### Scenario: Categories without sortOrder sort to end

- **WHEN** the system loads categories that do not have a `sortOrder` value assigned
- **THEN** those categories SHALL be displayed after all categories that have an explicit `sortOrder` value
