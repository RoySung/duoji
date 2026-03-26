## ADDED Requirements

### Requirement: Category Settings page uses draft mode for all mutations

The system SHALL stage all category mutations (add, edit, delete, reorder) in page-local draft state and SHALL NOT write to the database until the user explicitly saves.

#### Scenario: Draft mode activates on first mutation

- **WHEN** a user performs any mutation (add, edit, delete, or reorder) on the Category Settings page
- **THEN** the system SHALL display a sticky Save/Discard action bar at the bottom of the page indicating unsaved changes

#### Scenario: Save commits all staged changes

- **WHEN** a user taps the Save button on the Save/Discard bar
- **THEN** the system SHALL write all staged mutations to the database in topological order (deletes → add roots → add sub-categories → updates) and clear the draft state

#### Scenario: Discard reverts to last saved state

- **WHEN** a user taps the Discard button on the Save/Discard bar
- **THEN** the system SHALL revert all staged mutations back to the last saved state from the database and hide the Save/Discard bar

#### Scenario: No unsaved changes on page load

- **WHEN** a user navigates to the Category Settings page
- **THEN** the system SHALL NOT display the Save/Discard bar and the draft state SHALL match the persisted state

## MODIFIED Requirements

### Requirement: Users can view categories organized by root groups for a specific account book

The system SHALL display a Category Settings page scoped to a specific account book, listing all root categories as expandable accordion groups, each showing its sub-category count, sorted by their `sortOrder` value ascending.

#### Scenario: Open category settings for an account book

- **WHEN** a user navigates to the category settings page for an account book
- **THEN** the system SHALL display the account book name, a subtitle, and a list of root categories as collapsible groups sorted by `sortOrder` ascending

#### Scenario: Expand a root category group

- **WHEN** a user taps the expand control on a root category group
- **THEN** the system SHALL reveal the sub-categories belonging to that root category, sorted by `sortOrder` ascending, and an "ADD SUB-CATEGORY" action

#### Scenario: Collapse a root category group

- **WHEN** a user taps the expand control on an already-expanded root category group
- **THEN** the system SHALL collapse the sub-category list
