## ADDED Requirements

### Requirement: Users can view categories organized by root groups for a specific account book

The system SHALL display a Category Settings page scoped to a specific account book, listing all root categories as expandable accordion groups, each showing its sub-category count.

#### Scenario: Open category settings for an account book

- **WHEN** a user navigates to the category settings page for an account book
- **THEN** the system SHALL display the account book name, a subtitle, and a list of root categories as collapsible groups sorted by creation order

#### Scenario: Expand a root category group

- **WHEN** a user taps the expand control on a root category group
- **THEN** the system SHALL reveal the sub-categories belonging to that root category and an "ADD SUB-CATEGORY" action

#### Scenario: Collapse a root category group

- **WHEN** a user taps the expand control on an already-expanded root category group
- **THEN** the system SHALL collapse the sub-category list

### Requirement: Users can add a new root category group to an account book

The system SHALL provide an "ADD NEW GROUP" action on the category settings page that allows users to create a new root category for the selected account book.

#### Scenario: Add a new root category group

- **WHEN** a user submits a valid name via the add category modal with no parent selected
- **THEN** the system SHALL create a new root category scoped to the account book and display it at the bottom of the group list

#### Scenario: Attempt to add a root category without a name

- **WHEN** a user submits the add category modal with an empty name
- **THEN** the system SHALL prevent submission and display a validation error

### Requirement: Users can add a sub-category to an existing root group

The system SHALL provide an "ADD SUB-CATEGORY" action within each expanded root category group that allows users to create a new sub-category under that group.

#### Scenario: Add a sub-category under a root group

- **WHEN** a user submits a valid name via the add category modal with a parent root category pre-selected
- **THEN** the system SHALL create a new sub-category with parentId set to the root category and display it within the expanded group

#### Scenario: Sub-category inherits transaction type from parent

- **WHEN** a user adds a sub-category under a root category of type "expense"
- **THEN** the new sub-category SHALL have type "expense" automatically, without requiring the user to select it

### Requirement: Users can navigate to category settings from an account book card

The system SHALL provide a navigation entry point on each account book card in the Account Books Settings page that leads to the category settings page for that account book.

#### Scenario: Navigate to category settings from account book card

- **WHEN** a user presses the "Category Settings" button on an account book card
- **THEN** the system SHALL navigate to the category settings page for that account book
