## MODIFIED Requirements

### Requirement: Users can view settlement record history

The system SHALL display all non-deleted settlement records for the current account book, ordered by `createdAt` descending, with the label "第N次結帳 | 日期".

Each record in the list SHALL show the record label, a navigation affordance to the detail page, and a distinct visual status badge indicating whether all transfers associated with the settlement have been completed.
- If all transfers are completed, a badge showing "Settled" (or "已結算") with a success style SHALL be displayed.
- If one or more transfers are still pending, a badge showing "Pending" (or "待處理") with a warning/accent style SHALL be displayed.

#### Scenario: Multiple settlement records listed

- **WHEN** two settlement records exist with sequenceNumbers 1 and 2
- **THEN** the record with sequenceNumber 2 SHALL appear first in the list

#### Scenario: Settlement record in history list shows completion status badge

- **WHEN** a settlement record has all its transfers completed
- **THEN** the record in the list SHALL display a "Settled" status badge
- **WHEN** a settlement record has one or more pending transfers
- **THEN** the record in the list SHALL display a "Pending" status badge


### Requirement: Users can view settlement record detail

The settlement record detail page SHALL display:
- The overall settlement completion status badge (Settled/Pending) next to the settlement title
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

#### Scenario: Settlement record detail displays overall status badge

- **WHEN** the user views the settlement record detail page
- **THEN** the overall settlement completion status badge (Settled/Pending) SHALL be displayed next to or near the settlement record title
