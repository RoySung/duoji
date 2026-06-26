## 1. Data Layer — VirtualUser Entity

- [x] 1.1 Add an `isSharedWallet` boolean field (`z.boolean().optional().default(false)`) to the `VirtualUserSchema` (apps/web/src/entities/user.ts) to meet the "A virtual user can be marked as a shared wallet" requirement. Existing virtual member data is not affected (backward compatible). Validation: Run `npx tsc --noEmit` to ensure type compilation passes; add a VirtualUser schema test in apps/web/specs/ to verify that `isSharedWallet` defaults to `false` and can be set to `true`.

## 2. UI — Create Shared Wallet Button

- [x] 2.1 In the virtual members section (apps/web/src/components/accountBookSettings/UserSection.tsx), add a "Create shared wallet" button to replace the original virtual member toggle. This button is only displayed when there is no active (undeleted) shared wallet in the account book. Clicking it automatically creates a virtual member with `isSharedWallet: true` (the default name uses the locale default, e.g., "Shared Wallet"). Deleting the shared wallet is the same as for a regular member. Validation: Confirm the "Create shared wallet" button appears on the screen; after clicking, the shared wallet is successfully created and the button disappears; after deletion, the button reappears.

- [x] 2.2 Add i18n translation keys (apps/web/src/i18n/messages/zh-TW.json and en-US.json), including texts like "Create shared wallet". Validation: Confirm the corresponding keys exist and the content is correct in zh-TW.json and en-US.json.

## 3. UI — People List Shared Wallet Visual Indicator

- [x] 3.1 In the people list (apps/web/src/components/accountBookSettings/UserSection.tsx), display a wallet icon or badge for virtual members with `isSharedWallet: true` to meet the "Shared wallet member is visually distinguished in the people list" requirement. Regular virtual members do not show this indicator. Validation: Manually verify that there is an icon next to the shared wallet member in the people list; there is no icon next to regular members.

## 4. Report — Exclude Shared Wallet from Member Filter

- [x] 4.1 In the report's member filter (apps/web/src/components/report/MemberFilterSelector.tsx), exclude members with `isSharedWallet: true` to meet the "Report member filter excludes shared wallet from selectable members" requirement. Validation: The member filter options list on the report page does not include shared wallet members. Add test cases in apps/web/specs/reportMemberFilter.spec.tsx to verify shared wallet members do not appear in the options.

- [x] 4.2 Adjust the `availableMembers` calculation logic on the report page (apps/web/src/pages/account-books/[id]/report.tsx around L70-L96) to extract shared wallet information from `allUsers` and filter out shared wallet members when constructing `availableMembers`. Validation: On the report page, even if transactions include a shared wallet member, that member does not appear in the member filter.

## 5. Report — Distribute Shared Wallet Amounts During Member Filtering

- [x] 5.1 Modify the `memberFilteredTransactions` calculation logic on the report page (apps/web/src/pages/account-books/[id]/report.tsx) to resolve issues with multiple historical shared wallets and deleted members. The denominator `realMemberCount` takes the total number of all non-shared wallet members (including soft-deleted ones, to maintain correct historical transaction distribution ratios), and uses the `sharedWalletIds` Set to track all historical shared wallets. When `selectedMemberId` is not null, for each transaction, add the `splitDetail` amount of the shared wallet divided by `realMemberCount` to the individual's share; for income transactions: if `receivedByUserId` is in `sharedWalletIds`, divide it equally by `realMemberCount`. Validation: Add test cases in apps/web/specs/reportMemberFilter.spec.tsx covering scenarios with multiple historical shared wallets, soft-deleted real members, expenses including shared wallets, and incomes received by shared wallets.

- [x] 5.2 Ensure that the transaction amounts displayed in the category details modal are the adjusted amounts for the member (including the shared wallet distribution) rather than the original transaction amount, to meet the "Category details drawer shows adjusted transaction amount" scenario. Validation: Open the report category details modal and verify that the listed transaction amounts are the individual's share for the filtered member (including the shared wallet distribution).
