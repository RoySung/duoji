## ADDED Requirements

### Requirement: Transaction forms support tag suggestions without removing manual tag entry

The transaction form SHALL allow users to add tags either by typing manually or by selecting from the available suggestions for the form's selected account book. This behavior SHALL apply to both expense and income transaction forms in create and edit flows.

#### Scenario: Create a transaction with a suggested tag

- **WHEN** a user selects one or more available tag suggestions in a new transaction form and saves a valid transaction
- **THEN** the system SHALL persist the selected tags together with any manually entered tags on the saved transaction

#### Scenario: Edit a transaction with suggested and manual tags

- **WHEN** a user opens an existing transaction form, keeps some existing tags, adds another tag from the available suggestions, and saves the form
- **THEN** the system SHALL persist the updated combined tag list on that transaction

#### Scenario: Manual tag entry remains available without suggestions

- **WHEN** no tag suggestions are available for the selected account book
- **THEN** the transaction form SHALL still allow the user to enter and save tags manually
