## MODIFIED Requirements

### Requirement: System generates minimum-transfer suggestions

The system SHALL compute a list of transfer suggestions that settles all non-zero member balances using the fewest possible transfers.

The algorithm SHALL use a greedy approach: repeatedly match the member with the highest positive balance (creditor) against the member with the most negative balance (debtor), transferring `min(creditor balance, |debtor balance|)` until all balances reach zero (within a $0.01 threshold).

All suggested amounts SHALL be rounded to 2 decimal places in calculation storage. The settlement view SHALL provide a toggle for auto-rounding transfer suggested amounts to integers (using `Math.ceil`) for transfer convenience and Markdown summary export.

#### Scenario: Three members, two transfers needed
- **WHEN** member A has +$2,000, member B has -$1,200, member C has -$800
- **THEN** the system SHALL suggest exactly 2 transfers: B→A $1,200 and C→A $800

#### Scenario: All balances are zero
- **WHEN** all members have a net balance of $0
- **THEN** the system SHALL return an empty transfer suggestion list

#### Scenario: Settlement auto-rounding toggle
- **WHEN** the auto-rounding toggle is enabled on the settlement page for transfer $150.20
- **THEN** the settlement list and exported Markdown text SHALL format the transfer suggestion as $151 while preserving $150.20 in stored record data
