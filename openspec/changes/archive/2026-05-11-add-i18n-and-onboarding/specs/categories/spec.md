## MODIFIED Requirements

### Requirement: Categories are scoped to an account book

The system SHALL associate each category with exactly one account book via an `accountBookId` field so that categories can be managed independently per book. When seeding default categories on account book creation, the system SHALL use the active locale (`Settings.language`) to choose the language of seeded category names and descriptions.

#### Scenario: Load categories for the active account book

- **WHEN** the active account book changes or the category store is initialized
- **THEN** the system SHALL load only the categories belonging to that account book

#### Scenario: Seed default categories for a new account book

- **WHEN** an account book has no categories stored
- **THEN** the system SHALL seed a default set of expense and income categories scoped to that account book's ID, with names and descriptions taken from the i18n message catalog of the active locale

#### Scenario: Automatically seed default categories on account book creation

- **WHEN** a new account book is created
- **THEN** the system SHALL immediately seed the default category set scoped to the newly created account book's ID, using the active locale at creation time to translate category names and descriptions, so the book is usable for transaction recording without any additional setup

#### Scenario: Existing categories are not retranslated when the locale changes

- **WHEN** the user changes the active locale after an account book's default categories have been seeded
- **THEN** the system SHALL NOT rename, retranslate, or otherwise mutate the existing category records
