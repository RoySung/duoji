## MODIFIED Requirements

### Requirement: Income transactions record a single recipient

The system SHALL record exactly one recipient for each income transaction. The income transaction form SHALL prefill that recipient with the current user and SHALL allow the user to choose a different active (non-deleted) participant from the active account book before saving. When editing an existing income transaction, if the recorded recipient is a deleted virtual user, the system SHALL display that recipient with strikethrough style and SHALL allow removal but SHALL NOT allow re-selection.

#### Scenario: Create an income transaction with the default recipient

- **WHEN** a user opens a new income transaction form and saves a valid income transaction without changing the recipient
- **THEN** the system SHALL persist the current user as the income recipient

#### Scenario: Create an income transaction with a different recipient

- **WHEN** a user selects a different active account book participant (non-deleted) as the income recipient and saves a valid income transaction
- **THEN** the system SHALL persist that selected participant as the income recipient

#### Scenario: Edit the recipient of an income transaction

- **WHEN** a user changes the recipient on an existing income transaction and saves the form
- **THEN** the system SHALL persist the updated income recipient

#### Scenario: Recipient selector in new income transaction excludes deleted persons

- **WHEN** a user opens the recipient selector within a new income transaction form
- **THEN** the system SHALL only show active (non-deleted) people in the selector

#### Scenario: Edit income transaction with deleted recipient

- **WHEN** a user opens an existing income transaction whose recorded recipient is a deleted virtual user
- **THEN** the system SHALL display the deleted recipient with strikethrough style in the selector
- **AND** the system SHALL allow the user to remove (deselect) the deleted recipient
- **AND** the system SHALL NOT allow the user to re-add a deleted virtual user as the recipient
