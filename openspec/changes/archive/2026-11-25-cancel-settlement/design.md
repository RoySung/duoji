## Context

Transactions reference their settlement through the indexed settlementRecordId field. The detail page currently supports marking transfers as complete.

## Goals / Non-Goals

- In scope are cancellation, restoring expenses, and updating settlement views.
- Out of scope are reversing payments and restoring canceled records.

## Decisions

### Atomic cancellation

Store a deletion timestamp on the record and reset the association on linked transactions in one Dexie write transaction. Retain the record and its transfer snapshots in storage. Keep transfer completion serialized with cancellation so either operation observes the committed state of the other.

### Detail page confirmation

Use a confirmation dialog that states how many expenses will be reopened. Present the cancellation action for records with no completed transfer. Return to the unsettled tab after success. Align the cancellation button to the left of the detail page. Use the system’s solid danger treatment with white text for the trigger and confirmation.

### Concurrent creation and open views

Create the record and link its expenses in one Dexie write transaction so cancellation can only observe the committed record and associations. Observe settlement records and unsettled expenses in mounted views so changes from another tab update history, badges, and previews.

## Implementation Contract

The repository validates the account book, active record, and transfer status at write time. Active queries filter out canceled records, including records accessed by ID. Cancellation preserves transaction contents and deletion status. Expense edits preserve the settlement association read inside their write transaction so a stale edit cannot reattach a reopened expense. A rejected or failed write leaves stored records and relationships intact. Legacy records with no deletion timestamp remain active.

## Risks / Trade-offs

Display numbers follow chronological order among active records. Canceling an older record shifts the displayed numbers of newer records.
