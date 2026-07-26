## ADDED Requirements

### Requirement: Synchronize fields on account book switch in transaction form
When the user switches the account book in the transaction modal during creation, the system SHALL update all account book-dependent fields to their defaults for the newly selected account book.
Account book-dependent fields:
- categoryId (SHALL reset to the default category of the newly selected account book, or empty if none)
- paidByDetail and splitDetail for expenses (SHALL reset to the default payer and split detail for the newly selected account book based on its members)
- receivedByUserId/paidByDetail/splitDetail for incomes (SHALL reset to the default recipient for the newly selected account book based on its members)

Unrelated fields:
- amount, date, and description SHALL remain unchanged.

#### Scenario: Switching account book for expense resets dependent fields
- **WHEN** the user switches the account book in the expense modal from Book A to Book B
- **THEN** categoryId SHALL be updated to the default category of Book B
- **AND** paidByDetail SHALL be updated to the default payer (the first active member of Book B)
- **AND** splitDetail SHALL be updated to all active members of Book B (except the shared wallet)
- **AND** amount, date, and description SHALL preserve their original inputs

#### Scenario: Switching account book for income resets recipient and category
- **WHEN** the user switches the account book in the income modal from Book A to Book B
- **THEN** categoryId SHALL be updated to the default category of Book B
- **AND** receivedByUserId, paidByDetail, and splitDetail SHALL be updated to the default recipient of Book B (the first active member of Book B)
- **AND** amount, date, and description SHALL preserve their original inputs

### Requirement: Allow subcategory creation under newly selected account book
When the user switches the account book in the transaction modal and then creates a subcategory, the newly created subcategory SHALL be associated with the selected account book.

#### Scenario: Creating a subcategory under selected account book
- **WHEN** the user switches the account book in the modal and adds a subcategory
- **THEN** the system SHALL create the subcategory in the selected account book
- **AND** the category selector SHALL display the new subcategory
