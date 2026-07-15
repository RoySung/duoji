## MODIFIED Requirements

### Requirement: Default categories exist for income and expense flows

The system SHALL provide default category sets for both income and expense transactions scoped to the active account book, so users can record common transaction types without manual setup. When initiating a new transaction form without an existing selected category, the system SHALL default to selecting the first sub-category under the first root category of the matching transaction type.

#### Scenario: Start recording a new transaction

- **WHEN** a user opens a new income or expense transaction form
- **THEN** the system SHALL provide category choices sourced from the category store, filtered to the active account book and appropriate to the selected transaction type, and SHALL default the selection to the first sub-category under the first root category of that type even if custom categories are present in the account book
