## ADDED Requirements

### Requirement: Editing a transaction with a deleted category requires re-selection

When a user opens an existing transaction for editing and the transaction's category no longer exists, the system SHALL preserve the uncategorized state and prevent saving until the user selects a valid replacement category.

#### Scenario: Open edit modal for transaction with deleted category

- **WHEN** a user opens the edit modal for a transaction whose `categoryId` does not exist in the current category store
- **THEN** the system SHALL display the category selector with no category selected
- **AND** the system SHALL disable the save button until the user explicitly selects a category

#### Scenario: User selects a replacement category

- **WHEN** the user selects a valid category in the edit modal where no category was previously resolved
- **THEN** the system SHALL enable the save button
- **AND** the system SHALL save the transaction with the newly selected category when the user confirms
