## ADDED Requirements

### Requirement: Virtual users support soft deletion

The system SHALL support soft deletion of virtual users by setting a `deletedAt` timestamp on the `VirtualUser` record instead of removing it. A virtual user with a `deletedAt` value SHALL be considered deleted. A virtual user without a `deletedAt` value SHALL be considered active.

#### Scenario: Soft-delete a virtual user

- **WHEN** a user triggers the delete action for a virtual user in the account book settings
- **THEN** the system SHALL set `deletedAt` to the current Unix timestamp (ms) on that virtual user record
- **AND** the system SHALL NOT remove the virtual user record from storage

#### Scenario: Active people list excludes deleted virtual users

- **WHEN** the people store resolves the active member list for an account book
- **THEN** the system SHALL exclude all virtual users whose `deletedAt` is set from the active people list

#### Scenario: All people list includes deleted virtual users

- **WHEN** the people store resolves the full member list for an account book
- **THEN** the system SHALL include all virtual users regardless of `deletedAt` status

### Requirement: New transaction person selectors exclude deleted members

The system SHALL exclude deleted virtual users from all person selectors when creating a new transaction.

#### Scenario: Paid-by selector in new expense transaction

- **WHEN** a user opens the paid-by selector within a new expense transaction form
- **THEN** the system SHALL only show active (non-deleted) people

#### Scenario: Split selector in new expense transaction

- **WHEN** a user opens the split detail selector within a new expense transaction form
- **THEN** the system SHALL only show active (non-deleted) people

#### Scenario: Recipient selector in new income transaction

- **WHEN** a user opens the recipient selector within a new income transaction form
- **THEN** the system SHALL only show active (non-deleted) people

### Requirement: Edit transaction person selectors allow removal of deleted members only

The system SHALL include deleted virtual users in person selectors when editing an existing transaction, but SHALL restrict interaction to removal only.

#### Scenario: Deleted person already on a transaction remains selectable for removal

- **WHEN** a user opens the edit form for a transaction that references a deleted virtual user
- **THEN** the system SHALL display the deleted virtual user in the selector with a strikethrough style and a disabled state
- **AND** the system SHALL allow the user to deselect (remove) that deleted virtual user
- **AND** the system SHALL NOT allow the user to select (re-add) that deleted virtual user if not already present

#### Scenario: Deleted person not on a transaction is not selectable in edit form

- **WHEN** a user opens the edit form for a transaction that does NOT reference a deleted virtual user
- **THEN** the system SHALL NOT allow the user to select that deleted virtual user

### Requirement: Transaction views display deleted persons with strikethrough style

The system SHALL render any deleted virtual user referenced in a historical transaction with a strikethrough text style to indicate their deleted status.

#### Scenario: View a transaction referencing a deleted person

- **WHEN** a transaction in the home-page transaction list references a virtual user whose `deletedAt` is set
- **THEN** the system SHALL render that person's name with line-through styling
