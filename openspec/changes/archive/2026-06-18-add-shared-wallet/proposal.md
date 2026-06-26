## Why

When splitting bills, there are situations that involve a "shared wallet": some transactions are paid from a common fund account, and the payer and/or the splitee is the shared wallet. Currently, the Member Filter in Reports only fetches the individual's split amount from `splitDetail`. If a transaction's splitees include a "shared wallet", the shared wallet's portion of this expense will not be included for the individual during filtering, leading to an incomplete calculation of the individual's total income and expenses.

## What Changes

- Add a new `isSharedWallet` boolean field to the VirtualUser entity to mark a virtual member as a shared wallet.
- Add a standalone "Create Shared Wallet" button in the virtual members section. A maximum of one active shared wallet is allowed per account book. When deleting the shared wallet, it behaves like a regular member, with no downgrade mechanism.
- Adjust the member filtering logic in the report: when filtering by a specific member, automatically distribute all expenses/income related to shared wallets (including historically soft-deleted ones) proportionally (divided equally among the total historical number of real members in the account book) into the individual's report data.
- Hide all shared wallet members in the member filter (since their amounts are already distributed to the real members).
- Display a special visual indicator for the shared wallet member in the people list.

## Non-Goals

- No modifications are needed for the transaction form (TransactionModal); the shared wallet can function normally as a payer and splitee.
- No modifications are needed for the Settlement calculation logic; the shared wallet participates in the settlement as an independent member.
- No modifications are needed for the display in the TransactionList.
- No Dexie schema migration is needed; `isSharedWallet` uses `optional().default(false)` to ensure backward compatibility.
- Custom distribution ratios are not supported; it is fixed to an equal split among all real members in the account book.
- Supporting multiple active shared wallets in one account book at the same time is not supported (but the report calculation supports historically deleted shared wallets).

## Capabilities

### New Capabilities

- `shared-wallet`: Shared wallet marking and report distribution features. Covers the `isSharedWallet` field for VirtualUser, the dedicated button to create a shared wallet, the historical distribution logic of shared wallet amounts when filtering report members, hiding the shared wallet in the member filter, and the visual indicator in the people list.

### Modified Capabilities

- `report-member-filter`: The amount calculation logic for member filtering needs to be extended. When filtering by a specific member, in addition to calculating the individual's direct split share in `splitDetail`, the share distributed to that member from the shared wallet must also be added. The same applies to income transactions: if `receivedByUserId` is the shared wallet, it needs to be distributed proportionally to individuals.

## Impact

- Affected specs: `shared-wallet` (new), `report-member-filter` (modified)
- Affected code:
  - Modified: apps/web/src/entities/user.ts, apps/web/src/pages/account-books/[id]/report.tsx, apps/web/src/components/report/MemberFilterSelector.tsx, apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx, apps/web/src/components/accountBookSettings/UserSection.tsx
  - New: (none)
  - Removed: (none)
