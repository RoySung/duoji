## ADDED Requirements

### Requirement: Users can add sub-categories directly within the transaction form

The system SHALL allow users to create a new sub-category under a root category group from within the transaction form. The created sub-category SHALL immediately be saved to the category store and selected in the form.

#### Scenario: User adds a sub-category from the transaction form

- **WHEN** a user opens the transaction form and clicks the "+ Add Sub-Category" button under a root category group
- **AND** submits a valid name and icon for the sub-category
- **THEN** the system SHALL create the sub-category with the selected root group's ID as `parentId` and the matching transaction type, persist it to the database, and automatically select the new sub-category in the transaction form
