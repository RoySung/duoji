## ADDED Requirements

### Requirement: Users can edit the name and icon of an existing category

The system SHALL allow users to edit the name and icon of any category (root group or sub-category) from the Category Settings page.

#### Scenario: Edit a root category group name and icon

- **WHEN** a user taps the edit action on a root category group
- **THEN** the system SHALL open the category modal pre-filled with the current name and icon, allowing the user to modify them

#### Scenario: Edit a sub-category name and icon

- **WHEN** a user taps the edit action on a sub-category
- **THEN** the system SHALL open the category modal pre-filled with the current name and icon, allowing the user to modify them

#### Scenario: Category type cannot be changed during edit

- **WHEN** a user opens the edit modal for any category
- **THEN** the system SHALL NOT display a type selector, and the category type SHALL remain unchanged after saving

---

### Requirement: Users can delete a category from the Category Settings page

The system SHALL allow users to delete any category (root group or sub-category) from the Category Settings page.

#### Scenario: Delete a sub-category

- **WHEN** a user taps the delete action on a sub-category and confirms
- **THEN** the system SHALL stage the deletion in draft state; upon Save, the sub-category SHALL be permanently removed from the account book

#### Scenario: Delete a root category group with sub-categories

- **WHEN** a user taps the delete action on a root category group that has one or more sub-categories
- **THEN** the system SHALL display a confirmation modal stating the number of sub-categories that will also be deleted

#### Scenario: User confirms deletion of root group with sub-categories

- **WHEN** a user confirms deletion of a root category group
- **THEN** the system SHALL stage the root group and all its sub-categories for deletion in draft state; upon Save, all of them SHALL be permanently removed

#### Scenario: User cancels deletion of root group

- **WHEN** a user cancels the deletion confirmation modal
- **THEN** the system SHALL NOT modify the draft state and the category SHALL remain visible

---

### Requirement: Users can reorder categories via drag-and-drop

The system SHALL allow users to reorder root category groups (within a type tab) and sub-categories (within their parent group) via drag-and-drop.

#### Scenario: Drag to reorder root category groups

- **WHEN** a user drags a root category group to a new position within the same type tab (expense or income)
- **THEN** the system SHALL update the display order in draft state immediately; the new order SHALL be persisted upon Save

#### Scenario: Drag to reorder sub-categories

- **WHEN** a user drags a sub-category to a new position within its parent root group
- **THEN** the system SHALL update the display order in draft state immediately; the new order SHALL be persisted upon Save

#### Scenario: Drag handle is always visible

- **WHEN** a category item is displayed on the Category Settings page
- **THEN** the system SHALL display a drag handle icon on the left side of each item to indicate draggability
