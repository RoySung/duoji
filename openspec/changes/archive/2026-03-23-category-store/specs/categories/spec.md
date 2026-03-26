## ADDED Requirements

### Requirement: Categories are scoped to an account book

The system SHALL associate each category with exactly one account book via an `accountBookId` field so that categories can be managed independently per book.

#### Scenario: Load categories for the active account book

- **WHEN** the active account book changes or the category store is initialized
- **THEN** the system SHALL load only the categories belonging to that account book

#### Scenario: Seed default categories for a new account book

- **WHEN** an account book has no categories stored
- **THEN** the system SHALL seed a default set of expense and income categories scoped to that account book's ID

#### Scenario: Automatically seed default categories on account book creation

- **WHEN** a new account book is created
- **THEN** the system SHALL immediately seed the default category set (as defined in `mocks/category`) scoped to the newly created account book's ID, so the book is usable for transaction recording without any additional setup

## MODIFIED Requirements

### Requirement: Default categories exist for income and expense flows

The system SHALL provide default category sets for both income and expense transactions scoped to the active account book, so users can record common transaction types without manual setup.

#### Scenario: Start recording a new transaction

- **WHEN** a user opens a new income or expense transaction form
- **THEN** the system SHALL provide category choices sourced from the category store, filtered to the active account book and appropriate to the selected transaction type
