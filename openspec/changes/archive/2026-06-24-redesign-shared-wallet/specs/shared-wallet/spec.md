## ADDED Requirements

### Requirement: Shared wallet can be selected as transaction payer
The system SHALL allow users to select the shared wallet as the payer when creating or editing a transaction. This indicates that the expense is paid from the public communal fund.

#### Scenario: Shared wallet is available in payer options
- **WHEN** the user opens the transaction form
- **THEN** the payer dropdown SHALL include the shared wallet virtual user

### Requirement: Shared wallet is excluded from transaction split targets
The system SHALL NOT include the shared wallet as an option in the split targets list. The shared wallet represents a fund, not a consuming member.

#### Scenario: Shared wallet is hidden from split targets
- **WHEN** the user opens the transaction form and views the split targets list
- **THEN** the shared wallet virtual user SHALL NOT be visible or selectable

### Requirement: Selecting shared wallet as payer auto-selects all active members as split targets
When a user selects the shared wallet as the payer, the system SHALL automatically update the split targets to select all active real members in the current account book. The user SHALL be able to manually uncheck members after this auto-selection occurs.

#### Scenario: Auto-select active members on payer change
- **WHEN** the user changes the payer to the shared wallet
- **THEN** the system SHALL overwrite the current split targets and check all active real members

#### Scenario: Manual uncheck after auto-select
- **WHEN** the system has auto-selected all active members due to shared wallet payer selection
- **THEN** the user SHALL be able to manually uncheck specific members without the system reverting them

## REMOVED Requirements

### Requirement: Report member filter distributes shared wallet amounts to the selected member
**Reason**: Since the shared wallet is no longer allowed in split targets, transactions will accurately reflect member consumption in their direct split details. Special calculation logic for the shared wallet is no longer needed.
**Migration**: Remove the logic that distributes shared wallet split amounts to selected members in the report calculation.

#### Scenario: Shared wallet amounts are not specially distributed
- **WHEN** the report calculates member balances
- **THEN** it SHALL rely on direct split details and SHALL NOT apply special shared wallet distribution rules
