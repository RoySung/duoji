## ADDED Requirements

### Requirement: A reactive category store loads categories for the active account book

The system SHALL provide a Zustand-based category store that loads categories scoped to the current account book and exposes them to the React component tree via a context provider.

#### Scenario: Initialize category store with an account book

- **WHEN** the category store is initialized with a valid `accountBookId`
- **THEN** the store SHALL fetch all categories for that account book from the local repository and make them available as reactive state

#### Scenario: Separate expense and income categories

- **WHEN** a component accesses the category store
- **THEN** the store SHALL expose filtered lists for `expense` and `income` category types derived from the loaded categories

#### Scenario: Components replace mock imports with store data

- **WHEN** a transaction form component renders category options
- **THEN** the component SHALL source its category list from the category store instead of importing static mock arrays
