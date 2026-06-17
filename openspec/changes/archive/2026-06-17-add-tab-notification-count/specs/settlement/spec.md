## MODIFIED Requirements

### Requirement: Users can view settlement record history

The system SHALL display all non-deleted settlement records for the current account book, ordered by `createdAt` descending, with the label "第N次結帳 | 日期".

Each record in the list SHALL show the record label, a navigation affordance to the detail page, and a distinct visual status badge indicating whether all transfers associated with the settlement have been completed.
- If all transfers are completed, a badge showing "Settled" (or "已結算") with a success style SHALL be displayed.
- If one or more transfers are still pending, a badge showing "Pending" (or "待處理") with a warning/accent style SHALL be displayed.

The tab for viewing history/settled records SHALL be labeled "已結算" (or "Settled").
When there exists at least one non-deleted settlement record that has one or more pending transfers, a distinct visual indicator/notification badge displaying the count of such records SHALL be displayed on the top-right corner of the "已結算" (Settled) tab label text.

#### Scenario: Multiple settlement records listed

- **WHEN** two settlement records exist with sequenceNumbers 1 and 2
- **THEN** the record with sequenceNumber 2 SHALL appear first in the list

#### Scenario: Settlement record in history list shows completion status badge

- **WHEN** a settlement record has all its transfers completed
- **THEN** the record in the list SHALL display a "Settled" status badge
- **WHEN** a settlement record has one or more pending transfers
- **THEN** the record in the list SHALL display a "Pending" status badge

#### Scenario: Settled tab shows notification dot when there is a pending record

- **WHEN** a settlement record has one or more pending transfers
- **THEN** the "已結算" (Settled) tab label SHALL display a visual notification badge displaying the count of pending settlement records at the top-right corner of the text
- **WHEN** all settlement records have all their transfers completed
- **THEN** the "已結算" (Settled) tab label SHALL NOT display a visual notification badge
