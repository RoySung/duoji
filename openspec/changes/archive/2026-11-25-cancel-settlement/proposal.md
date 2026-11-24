## Why

Users need to reopen mistakenly created settlements so the original expenses can be included in a corrected settlement.

## What Changes

- Add a confirmed cancellation action on the settlement detail page for records with zero completed transfers.
- Restore linked expenses to the unsettled list and remove the canceled record from active settlement views in one database transaction.
- Return the user to the account book's unsettled view with refreshed totals and transfer suggestions. Refresh already-open settlement views after database changes.

## Capabilities

### New Capabilities

### Modified Capabilities

- `settlement`: Cancel a settlement, release linked expenses, and keep active views consistent.

## Impact

- Settlement detail and list pages, the settlement hook and repository, and English and Traditional Chinese messages.
- IndexedDB settlement and transaction records.
