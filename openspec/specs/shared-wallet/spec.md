# shared-wallet Specification

## Purpose

TBD - created by archiving change 'add-shared-wallet'. Update Purpose after archive.

## Requirements

### Requirement: A virtual user can be marked as a shared wallet

The system SHALL allow marking a virtual user as a shared wallet via an `isSharedWallet` boolean field on the `VirtualUser` entity. A shared wallet represents a communal fund account whose expenses and income are logically distributed among all real members of the account book.

The `isSharedWallet` field SHALL default to `false` and SHALL be optional to ensure backward compatibility with existing virtual user records.

#### Scenario: Create a virtual user marked as shared wallet

- **WHEN** a user creates a new virtual user in the account book settings and enables the "shared wallet" toggle
- **THEN** the system SHALL persist the virtual user with `isSharedWallet: true`

#### Scenario: Create a regular virtual user

- **WHEN** a user creates a new virtual user without enabling the "shared wallet" toggle
- **THEN** the system SHALL persist the virtual user with `isSharedWallet: false`

#### Scenario: Edit a virtual user to toggle shared wallet status

- **WHEN** a user edits an existing virtual user and changes the "shared wallet" toggle
- **THEN** the system SHALL persist the updated `isSharedWallet` value

<!-- @trace
source: add-shared-wallet
updated: 2026-06-18
code:
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/entities/user.ts
  - apps/web/src/i18n/messages/zh-TW.json
tests:
  - apps/web/specs/reportMemberFilter.spec.tsx
  - apps/web/specs/userEntity.spec.ts
-->

---
### Requirement: Each account book has at most one shared wallet

The system SHALL enforce that at most one virtual user per account book can be marked as a shared wallet. When a shared wallet already exists in an account book, the shared wallet toggle for other virtual users SHALL be disabled with a descriptive tooltip or message.

#### Scenario: Attempt to create a second shared wallet

- **WHEN** an account book already has a virtual user with `isSharedWallet: true` and the user tries to create or edit another virtual user to set `isSharedWallet: true`
- **THEN** the system SHALL prevent the action by disabling the shared wallet toggle and displaying a message indicating that a shared wallet already exists

#### Scenario: Existing shared wallet is deleted

- **WHEN** the virtual user marked as shared wallet is deleted (soft-delete)
- **THEN** the system SHALL allow another virtual user to be marked as shared wallet


<!-- @trace
source: add-shared-wallet
updated: 2026-06-18
code:
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/entities/user.ts
  - apps/web/src/i18n/messages/zh-TW.json
tests:
  - apps/web/specs/reportMemberFilter.spec.tsx
  - apps/web/specs/userEntity.spec.ts
-->

---
### Requirement: Shared wallet member is visually distinguished in the people list

The system SHALL display a distinct visual indicator (icon or badge) next to a shared wallet virtual user in the account book's people list, so users can immediately identify which member represents the shared wallet.

#### Scenario: Shared wallet member displays visual indicator

- **WHEN** the people list renders a virtual user with `isSharedWallet: true`
- **THEN** the system SHALL display a wallet icon or badge next to the member's name

#### Scenario: Regular virtual user has no wallet indicator

- **WHEN** the people list renders a virtual user with `isSharedWallet: false`
- **THEN** the system SHALL NOT display the wallet indicator


<!-- @trace
source: add-shared-wallet
updated: 2026-06-18
code:
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/entities/user.ts
  - apps/web/src/i18n/messages/zh-TW.json
tests:
  - apps/web/specs/reportMemberFilter.spec.tsx
  - apps/web/specs/userEntity.spec.ts
-->

---
### Requirement: Report member filter excludes shared wallet from selectable members

The member filter selector on the report page SHALL NOT include the shared wallet virtual user as a selectable filter option. The shared wallet's amounts are distributed to real members and selecting the shared wallet itself would produce misleading results.

#### Scenario: Shared wallet excluded from member filter options

- **WHEN** the report page derives available member filter options from transactions that include a shared wallet member in `splitDetail` or as `receivedByUserId`
- **THEN** the shared wallet member SHALL NOT appear in the member filter selector's option list


<!-- @trace
source: add-shared-wallet
updated: 2026-06-18
code:
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/entities/user.ts
  - apps/web/src/i18n/messages/zh-TW.json
tests:
  - apps/web/specs/reportMemberFilter.spec.tsx
  - apps/web/specs/userEntity.spec.ts
-->

---
### Requirement: Shared wallet can be selected as transaction payer
The system SHALL allow users to select the shared wallet as the payer when creating or editing a transaction. This indicates that the expense is paid from the public communal fund.

#### Scenario: Shared wallet is available in payer options
- **WHEN** the user opens the transaction form
- **THEN** the payer dropdown SHALL include the shared wallet virtual user


<!-- @trace
source: redesign-shared-wallet
updated: 2026-06-24
code:
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/src/entities/user.ts
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web/src/hooks/useSettlement.ts
  - diff.patch
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/stores/user/userStore.ts
tests:
  - apps/web/specs/reportMemberFilter.spec.tsx
  - apps/web/specs/userEntity.spec.ts
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/reportTagFilterSelector.spec.tsx
  - apps/web/src/utils/settlementUtils.spec.ts
-->

---
### Requirement: Shared wallet is excluded from transaction split targets
The system SHALL NOT include the shared wallet as an option in the split targets list. The shared wallet represents a fund, not a consuming member.

#### Scenario: Shared wallet is hidden from split targets
- **WHEN** the user opens the transaction form and views the split targets list
- **THEN** the shared wallet virtual user SHALL NOT be visible or selectable


<!-- @trace
source: redesign-shared-wallet
updated: 2026-06-24
code:
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/src/entities/user.ts
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web/src/hooks/useSettlement.ts
  - diff.patch
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/stores/user/userStore.ts
tests:
  - apps/web/specs/reportMemberFilter.spec.tsx
  - apps/web/specs/userEntity.spec.ts
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/reportTagFilterSelector.spec.tsx
  - apps/web/src/utils/settlementUtils.spec.ts
-->

---
### Requirement: Selecting shared wallet as payer auto-selects all active members as split targets
When a user selects the shared wallet as the payer, the system SHALL automatically update the split targets to select all active real members in the current account book. The user SHALL be able to manually uncheck members after this auto-selection occurs.

#### Scenario: Auto-select active members on payer change
- **WHEN** the user changes the payer to the shared wallet
- **THEN** the system SHALL overwrite the current split targets and check all active real members

#### Scenario: Manual uncheck after auto-select
- **WHEN** the system has auto-selected all active members due to shared wallet payer selection
- **THEN** the user SHALL be able to manually uncheck specific members without the system reverting them

<!-- @trace
source: redesign-shared-wallet
updated: 2026-06-24
code:
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/src/entities/user.ts
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web/src/hooks/useSettlement.ts
  - diff.patch
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/stores/user/userStore.ts
tests:
  - apps/web/specs/reportMemberFilter.spec.tsx
  - apps/web/specs/userEntity.spec.ts
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/reportTagFilterSelector.spec.tsx
  - apps/web/src/utils/settlementUtils.spec.ts
-->