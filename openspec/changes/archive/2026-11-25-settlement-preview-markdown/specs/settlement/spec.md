## ADDED Requirements

### Requirement: User can review a settlement before creating the record

The settlement confirmation dialog SHALL show per-member balances, suggested transfers, and the Shared Wallet summary when applicable. The current rounding setting SHALL control displayed balances and suggested transfers. Users SHALL be able to review individual expenses in the existing unsettled list and the Markdown draft.

#### Scenario: The draft contains only expenses included in the settlement

- **WHEN** a user opens the Markdown draft for the current account book
- **THEN** the draft SHALL show a count and details for eligible unsettled expenses only
- **AND** each entry SHALL show its date, description, category, amount, payers, and splits

##### Example: Expenses from two account books

- **GIVEN** the active account book contains an unsettled dinner expense, a settled taxi expense, a deleted snack expense, and income
- **WHEN** the user opens the Markdown draft while another account book has an unsettled hotel expense
- **THEN** the draft SHALL report one expense and list only dinner

### Requirement: User can preview and copy a Markdown settlement draft before creating the record

The confirmation dialog SHALL open a Markdown preview using the same copy interaction as settlement detail. The text SHALL label the settlement as a draft with an export timestamp and include the included expense count and details, plus the same member balances, suggested transfers, applicable Shared Wallet summary, and rounding setting as the confirmation dialog when opened. Closing the preview SHALL return to the settlement review. Opening, closing, and copying the draft SHALL leave settlement records and expense links unchanged.

#### Scenario: Draft uses the displayed rounding setting

- **WHEN** a user changes the rounding setting and opens the Markdown preview
- **THEN** the preview and copied text SHALL format the balances and suggested transfers using the current setting
- **AND** the system SHALL leave the expenses unsettled

##### Example: Fractional suggested transfer

- **GIVEN** the current overview has a suggested transfer of 150.20 in a currency displayed to two decimal places
- **WHEN** the user turns on rounding and opens the draft
- **THEN** the overview and draft SHALL display 151 for that suggestion
- **WHEN** the user returns to the review, turns off rounding, and opens another draft
- **THEN** the overview and the new draft SHALL display 150.20 for that suggestion

#### Scenario: Custom currency labels retain their literal text

- **WHEN** a user previews or copies a draft from an account book whose custom currency label contains Markdown delimiters
- **THEN** the draft Markdown SHALL escape those delimiters in every amount so the currency label renders literally and the member balance table retains its columns

##### Example: A pipe in the currency label

- **GIVEN** the account book uses the custom currency label `A|B`
- **WHEN** the user opens the Markdown draft
- **THEN** the draft source SHALL use `A\|B` in each amount, and the member balance table SHALL retain its four columns

#### Scenario: The clipboard rejects the copy

- **WHEN** the browser rejects copying the Markdown
- **THEN** the system SHALL display the localized copy failure and keep the draft available for manual selection

##### Example: Clipboard permission is denied

- **GIVEN** the draft shows a dinner expense
- **WHEN** the clipboard denies write permission
- **THEN** the copy failure appears and the dinner remains visible and selectable

### Requirement: Settlement creation requires confirmation of current review data

The system SHALL create a settlement record only after explicit confirmation of the current overview. If included expenses, their review values, or the derived settlement amounts change between the reviewed overview and creation, the system SHALL refresh the overview, notify the user, and require explicit confirmation of the updated data. The stale attempt SHALL NOT create a settlement record or relink any expense. If the refreshed overview has no eligible expenses, the system SHALL make confirmation and opening a Markdown draft unavailable.

#### Scenario: An in-place edit changes a reviewed expense

- **WHEN** an expense's split changes after the user sees the overview but before creation, while its ID and the count of included expenses stay the same
- **THEN** the system SHALL show the revised expense and calculations, notify the user, and wait for another confirmation
- **AND** the stale attempt SHALL leave all settlement records and expense links unchanged

##### Example: Dinner split is corrected

- **GIVEN** the overview includes a dinner of 120 paid by A and initially split as 60 each by A and B
- **WHEN** B's share is corrected to 40 and A's share to 80 before the user confirms the original overview
- **THEN** the revised overview SHALL show that B owes A 40 and no settlement record SHALL exist for the stale attempt

#### Scenario: Membership changes a reviewed Shared Wallet calculation

- **GIVEN** the Shared Wallet pays 120 for an expense split evenly between the account book's two members
- **WHEN** another view adds a third member before the settlement is written
- **THEN** the stale attempt SHALL leave the expense unsettled and create no record
- **AND** the refreshed review SHALL show 60 owed to the Shared Wallet from each original member and require another confirmation

#### Scenario: The reviewed expenses are still current at confirmation

- **WHEN** the user confirms an overview whose reviewed data still matches the current settlement inputs
- **THEN** the system SHALL create the record for exactly the reviewed expenses with the underlying unrounded balances and suggested transfers

##### Example: Rounding applies to display

- **GIVEN** the reviewed expenses imply a transfer of 150.20 and rounding displays 151
- **WHEN** the user confirms without any expense changes
- **THEN** the new record SHALL link exactly those expenses and store the transfer suggestion as 150.20

#### Scenario: No reviewed expenses remain eligible

- **WHEN** all reviewed expenses become ineligible before creation and there are no other unsettled expenses in the account book
- **THEN** the overview SHALL indicate that no expenses remain eligible and make confirmation and opening a Markdown draft unavailable

##### Example: The only expense is settled elsewhere

- **GIVEN** the overview contains one taxi expense
- **WHEN** another view settles the taxi expense before the user confirms
- **THEN** the overview SHALL show a count of 0 and SHALL disable confirmation and opening a Markdown draft
