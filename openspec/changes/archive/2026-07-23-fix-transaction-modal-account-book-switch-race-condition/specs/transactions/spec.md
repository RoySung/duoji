## ADDED Requirements

### Requirement: Prevent race condition on account book switch in transaction form
When the user switches the account book in the transaction modal, the system SHALL immediately set the loading state to true for categories and users of the newly selected account book, preventing the form from rendering or resetting fields with stale data from the previously selected account book.
Once categories and users for the new account book are fully loaded:
- categoryId SHALL be updated to the default category of the newly selected account book
- paidByDetail SHALL be updated to the default payer (the first active member of the newly selected account book)
- splitDetail SHALL be updated to all active members of the newly selected account book (except the shared wallet)

#### Scenario: Switching account book correctly loads new book defaults
- **WHEN** the user switches the account book in the expense modal from Book A to Book B
- **THEN** the system SHALL immediately set loading to true
- **AND** once loading finishes, the categoryId, paidByDetail, and splitDetail SHALL be updated to Book B defaults (first member for payer, all members for split)
