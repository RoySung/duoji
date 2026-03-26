## ADDED Requirements

### Requirement: Users can manage categories within an account book

The system SHALL allow users to view all categories for a specific account book organized into root groups and sub-categories, and add new root groups and sub-categories.

#### Scenario: User views categories for an account book

- **WHEN** a user opens the category settings page for an account book
- **THEN** the system SHALL display all categories scoped to that account book, organized as root groups with their sub-categories

#### Scenario: User adds a new root category group

- **WHEN** a user submits a valid name for a new group on the category settings page
- **THEN** the system SHALL persist a new root category with `parentId: null` for the active account book and reflect it in the category list

#### Scenario: User adds a sub-category to a root group

- **WHEN** a user submits a valid name for a new sub-category under an existing root group
- **THEN** the system SHALL persist a new category with the root group's `id` as `parentId` and the same `type` as the parent
