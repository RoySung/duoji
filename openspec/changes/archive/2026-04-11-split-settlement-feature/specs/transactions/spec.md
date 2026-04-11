## ADDED Requirements

### Requirement: Settled transactions display a settled badge

A transaction that has been included in any non-deleted `SettlementRecord.transactionIds` SHALL display a "已結算" badge in the transaction list view.

The badge SHALL be visible without expanding or opening the transaction.

#### Scenario: Transaction included in a settlement record

- **WHEN** a transaction's ID appears in a non-deleted settlement record's `transactionIds`
- **THEN** the transaction list item SHALL display a "已結算" badge

#### Scenario: Transaction not yet settled

- **WHEN** a transaction's ID does not appear in any non-deleted settlement record's `transactionIds`
- **THEN** the transaction list item SHALL NOT display a settled badge

#### Scenario: Settlement record is soft-deleted

- **WHEN** the settlement record referencing a transaction is soft-deleted
- **THEN** the "已結算" badge SHALL be removed from that transaction
