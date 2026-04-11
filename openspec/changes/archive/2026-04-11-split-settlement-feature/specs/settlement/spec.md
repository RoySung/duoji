## ADDED Requirements

### Requirement: System calculates per-member balances from unsettled expense transactions

For a given account book, the system SHALL compute a net balance for each member by summing amounts from `paidByDetail` (positive, member paid on behalf of others) and `splitDetail` (negative, member owes a share) across all expense transactions not referenced by any non-deleted settlement record.

A member's net balance SHALL equal `paidAmount − splitAmount`. A positive net balance means the member is owed money; a negative net balance means the member owes money.

Income transactions SHALL NOT be included in settlement balance calculations.

#### Scenario: Member who paid more than their share has positive balance

- **WHEN** a member appears in `paidByDetail` for $3,000 and in `splitDetail` for $1,000 across unsettled transactions
- **THEN** their net balance SHALL be +$2,000

#### Scenario: Member who owes more than they paid has negative balance

- **WHEN** a member appears in `splitDetail` for $1,500 and in `paidByDetail` for $500
- **THEN** their net balance SHALL be -$1,000

#### Scenario: Income transactions are excluded

- **WHEN** the account book contains income transactions with `paidByDetail` entries
- **THEN** those transactions SHALL NOT affect any member's settlement balance

### Requirement: System generates minimum-transfer suggestions

The system SHALL compute a list of transfer suggestions that settles all non-zero member balances using the fewest possible transfers.

The algorithm SHALL use a greedy approach: repeatedly match the member with the highest positive balance (creditor) against the member with the most negative balance (debtor), transferring `min(creditor balance, |debtor balance|)` until all balances reach zero (within a $0.01 threshold).

All suggested amounts SHALL be rounded to 2 decimal places.

#### Scenario: Three members, two transfers needed

- **WHEN** member A has +$2,000, member B has -$1,200, member C has -$800
- **THEN** the system SHALL suggest exactly 2 transfers: B→A $1,200 and C→A $800

#### Scenario: All balances are zero

- **WHEN** all members have a net balance of $0
- **THEN** the system SHALL return an empty transfer suggestion list

### Requirement: Users can create a settlement record

The system SHALL allow users to create a `SettlementRecord` for an account book. Upon creation, the record SHALL:
- Capture the IDs of all currently unsettled expense transactions as `transactionIds`
- Store a per-member summary (`memberStatuses`) with each member's `splitAmount`, `paidAmount`, and `netAmount` computed from those transactions
- Store the minimum-transfer suggestions as `transfers` with `status: 'pending'`
- Assign a `sequenceNumber` equal to the count of existing non-deleted settlement records for the account book plus one

#### Scenario: Creating the first settlement record

- **WHEN** the account book has no prior settlement records and 15 unsettled transactions
- **THEN** the new record SHALL have `sequenceNumber: 1` and `transactionIds` containing all 15 transaction IDs

#### Scenario: Creating a subsequent settlement record

- **WHEN** one settlement record already exists and there are 8 new unsettled transactions
- **THEN** the new record SHALL have `sequenceNumber: 2` and `transactionIds` containing only the 8 new transaction IDs

#### Scenario: No unsettled transactions exist

- **WHEN** all transactions are already covered by existing settlement records
- **THEN** the system SHALL NOT allow creating a new settlement record (the "確認結帳金額" button SHALL be disabled or absent)

### Requirement: Users can mark individual transfers as completed

For each `SettlementTransfer` within a settlement record, the user SHALL be able to mark it as completed by providing an `actualAmount` and an optional `note`. The transfer's `status` SHALL change to `'completed'` and `completedAt` SHALL be set to the current timestamp.

The `actualAmount` MAY differ from `suggestedAmount` to accommodate rounding differences.

#### Scenario: Marking a transfer complete

- **WHEN** the user confirms a transfer with an actual amount
- **THEN** the transfer `status` SHALL become `'completed'`, `actualAmount` SHALL be saved, and `completedAt` SHALL be set

#### Scenario: Actual amount differs from suggested

- **WHEN** the user enters an actual amount different from the suggested amount
- **THEN** the system SHALL accept the actual amount without validation error

### Requirement: Users can view settlement record history

The system SHALL display all non-deleted settlement records for the current account book, ordered by `createdAt` descending, with the label "第N次結帳 | 日期".

Each record in the list SHALL show the record label and a navigation affordance to the detail page.

#### Scenario: Multiple settlement records listed

- **WHEN** two settlement records exist with sequenceNumbers 1 and 2
- **THEN** the record with sequenceNumber 2 SHALL appear first in the list

### Requirement: Users can view settlement record detail

The settlement record detail page SHALL display:
- Each member's `splitAmount`, `paidAmount`, and `netAmount` (labeled as 分攤金額, 代支費用, and 實收金額/應付金額)
- Each member's settlement status badge (已結帳 / 未結帳)
- Each transfer with its status and a control to mark it complete if pending
- A collapsible section listing the covered transactions (title, date, amount)

#### Scenario: Viewing a record with one completed transfer

- **WHEN** a settlement record has two transfers and one is completed
- **THEN** the completed transfer SHALL display "已完成 ✓" and the pending transfer SHALL display a "標記完成" affordance

#### Scenario: Expanding covered transactions

- **WHEN** the user expands the "涵蓋交易" section
- **THEN** the system SHALL display the title, date, and amount of each transaction whose ID is in `transactionIds`

### Requirement: Users can soft-delete a settlement record

The system SHALL allow users to delete a settlement record. Deletion SHALL set `deletedAt` to the current timestamp (soft delete). Deleted records SHALL NOT appear in the settlement record list. Transactions previously covered by a deleted record SHALL become unsettled again.

#### Scenario: Deleting a settlement record re-exposes transactions

- **WHEN** a settlement record is soft-deleted
- **THEN** its `transactionIds` SHALL no longer be in the settled set, and those transactions SHALL appear in the unsettled transaction list
