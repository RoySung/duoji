## MODIFIED Requirements

### Requirement: Users can soft-delete a settlement record

The system SHALL allow users to cancel an active settlement from its detail page after confirmation, provided no transfer has been marked complete. The system SHALL atomically set the record's deletion timestamp and restore the transactions linked to it in the same account book to unsettled status. Canceled records SHALL be excluded from active settlement views and pending-transfer counts.

#### Scenario: Confirming cancellation for an eligible record

- **WHEN** a user confirms cancellation of a settlement with no completed transfers
- **THEN** the user SHALL return to the account book's unsettled view, where the released expenses SHALL be available for a new settlement and included in the recalculated balances and suggestions.

#### Scenario: Viewing settlements in another tab

- **WHEN** a user cancels a settlement while another tab displays the same account book’s settlements
- **THEN** the other tab SHALL remove the record and its pending count and include the reopened expenses in its unsettled view without a reload.

#### Scenario: Attempting to cancel a record with a completed transfer

- **WHEN** a settlement contains any completed transfer, including a shared-wallet transfer
- **THEN** the system SHALL disallow cancellation and preserve the settlement and its linked transactions.

#### Scenario: Dismissing the confirmation

- **WHEN** the user dismisses the cancellation confirmation
- **THEN** the settlement and its linked transactions SHALL retain their current state.

#### Scenario: Cancellation write fails

- **WHEN** the cancellation cannot be committed
- **THEN** the system SHALL preserve the previous settlement and transaction states and show an error.

#### Scenario: Saving an edit opened before cancellation

- **WHEN** a user saves an expense edit that was opened before its settlement was canceled and the expense is still unsettled
- **THEN** the edit SHALL be saved and the expense SHALL remain unsettled.
