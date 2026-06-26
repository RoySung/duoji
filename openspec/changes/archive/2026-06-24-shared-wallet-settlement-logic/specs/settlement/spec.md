## ADDED Requirements

### Requirement: Exclude Shared Wallet from peer-to-peer transfers
The system SHALL NOT include the Shared Wallet in the minimum transfers calculation for peer-to-peer settlements. The Shared Wallet SHALL NOT appear as a creditor or debtor in the standard transfer list.

#### Scenario: Shared Wallet pays for an expense split by all members
- **WHEN** the Shared Wallet pays for an expense and it is split among all real members
- **THEN** no transfers involving the Shared Wallet SHALL be generated in the peer-to-peer transfer list

#### Scenario: Shared Wallet pays for an expense split by a subset of members
- **WHEN** the Shared Wallet pays for an expense and it is split by fewer members than the total real members
- **THEN** the system SHALL calculate the split amounts as "borrowings" from the Shared Wallet for those specific members
- **THEN** the system SHALL generate special transfers to the Shared Wallet that are displayed separately from peer-to-peer transfers

##### Example: Shared Wallet borrowing
| Input | Expected Output | Notes |
|-------|-----------------|-------|
| Shared Wallet pays $100, split by A and B (Total members: A, B, C) | A owes Shared Wallet $50, B owes Shared Wallet $50 | Subset split creates borrowings |
| Shared Wallet pays $90, split by A, B, C (Total members: A, B, C) | No borrowings generated | All members split it |

### Requirement: Display Shared Wallet summary in Settlement view
The settlement UI SHALL display a distinct Shared Wallet section separate from the peer-to-peer transfer list.

#### Scenario: Viewing Shared Wallet summary
- **WHEN** a user views the settlement preview or a settlement record
- **THEN** the UI SHALL display the total amount paid by the Shared Wallet
- **THEN** the UI SHALL display the average expense per real member
- **THEN** the UI SHALL list any members who owe additional funds to the Shared Wallet due to subset splits

##### Example: Shared Wallet UI data
- **GIVEN** Shared Wallet paid $90 (split by A, B, C) and $100 (split by A, B)
- **WHEN** viewing the settlement summary
- **THEN** Total Expense is $190
- **THEN** Average per person is $63.33 ($190 / 3)
- **THEN** Additional personal borrowings list shows A owes $50, B owes $50
