## MODIFIED Requirements

### Requirement: Tag suggestions are scoped to the transaction form's selected account book

The system SHALL derive transaction-form tag suggestions from tags cached in LocalStorage for the account book currently selected in the form.

#### Scenario: Suggestions are scoped to the selected account book

- **WHEN** a user opens a transaction form for account book A and account book A has tags cached in LocalStorage while account book B has different cached tags
- **THEN** the system SHALL show only suggestions derived from account book A's LocalStorage cache

#### Scenario: Changing the account book changes the suggestion source

- **WHEN** the user changes the account book selection inside the transaction form
- **THEN** the system SHALL update the available suggestions to use the newly selected account book's LocalStorage cache as the only source

### Requirement: Tag suggestions stay coherent with transaction mutations

The system SHALL update the LocalStorage tag suggestions cache for an account book after a transaction is successfully created or updated in that account book.

#### Scenario: A new tag is cached after transaction creation or update

- **WHEN** a user saves (creates or updates) a transaction in account book A with one or more tags
- **THEN** the system SHALL append those tags to the LocalStorage cache for account book A, making them immediately available in the suggestion list for future transaction forms of account book A
