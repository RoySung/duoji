## ADDED Requirements

### Requirement: Account books support a people list with registered and virtual users

The system SHALL represent participants in an account book as a `Person` discriminated union: either a registered `User` (type: `'user'`) or a `VirtualUser` (type: `'virtual'`). A `VirtualUser` SHALL have an `id`, `name`, `accountBookId`, `createdAt`, and `updatedAt`. The combined people list for an account book SHALL be accessible through a `peopleStore` that merges registered `userIds` with `virtualUsers`.

#### Scenario: Retrieve people list for an account book

- **WHEN** the active account book changes
- **THEN** the system SHALL load and expose the merged list of registered users and virtual users for that account book

### Requirement: Users can create a virtual user in an account book

The system SHALL allow users to add a named virtual participant to an account book's people list without requiring that person to have a registered account.

#### Scenario: Create a virtual user

- **WHEN** a user submits a valid name for a new virtual user in the account book settings
- **THEN** the system SHALL create a `VirtualUser` record scoped to that account book and include it in the people list

### Requirement: Users can rename a virtual user

The system SHALL allow users to update the name of an existing virtual user.

#### Scenario: Rename a virtual user

- **WHEN** a user submits a new name for an existing virtual user
- **THEN** the system SHALL persist the updated name and reflect it in the people list

### Requirement: Users can remove a virtual user from an account book

The system SHALL allow users to remove a virtual user from an account book's people list.

#### Scenario: Remove a virtual user

- **WHEN** a user confirms removal of a virtual user from the account book settings
- **THEN** the system SHALL delete the virtual user from the account book's `virtualUsers` list
