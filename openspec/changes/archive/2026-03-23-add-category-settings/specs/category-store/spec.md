## ADDED Requirements

### Requirement: The category store exposes CRUD mutations for managing categories

The system SHALL provide `addCategory`, `updateCategory`, and `deleteCategory` actions in the category store so that UI components can create, modify, and remove categories without directly calling the repository layer.

#### Scenario: Add a new category

- **WHEN** a component calls `addCategory` with a valid category payload
- **THEN** the store SHALL persist the new category via the repository and update the in-memory category state to include the new entry

#### Scenario: Update an existing category

- **WHEN** a component calls `updateCategory` with a valid id and partial updates
- **THEN** the store SHALL persist the changes via the repository and reflect the updated category in the in-memory state

#### Scenario: Delete a category

- **WHEN** a component calls `deleteCategory` with a valid category id
- **THEN** the store SHALL delete the category and all its descendants via the repository and remove them from the in-memory state
