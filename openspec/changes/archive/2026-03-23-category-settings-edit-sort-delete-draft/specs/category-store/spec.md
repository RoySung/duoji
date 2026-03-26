## ADDED Requirements

### Requirement: Category store assigns sortOrder when seeding and adding categories

The system SHALL assign sequential `sortOrder` values when seeding default categories and SHALL append new categories after existing ones by assigning a `sortOrder` value higher than the current maximum.

#### Scenario: Seed default categories with sortOrder

- **WHEN** the category store seeds default categories for a new account book
- **THEN** each seeded category SHALL receive a `sortOrder` value equal to its index in the seed template array

#### Scenario: Add a new category appends to end

- **WHEN** a new category is added via `addCategory` without an explicit `sortOrder`
- **THEN** the store SHALL assign a `sortOrder` value greater than all existing categories in the same account book and parent scope

### Requirement: Category store returns categories sorted by sortOrder

The system SHALL return categories from `findByAccountBookId` sorted by `sortOrder` ascending, with categories lacking a `sortOrder` value placed at the end.

#### Scenario: Load categories in display order

- **WHEN** the category store initializes for an account book
- **THEN** the categories in store state SHALL be ordered by `sortOrder` ascending, enabling components to render them in the correct display order without client-side sorting
