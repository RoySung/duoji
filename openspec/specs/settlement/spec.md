# settlement Specification

## Purpose

TBD - created by archiving change 'split-settlement-feature'. Update Purpose after archive.

## Requirements

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


<!-- @trace
source: split-settlement-feature
updated: 2026-04-11
code:
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - CLAUDE.md
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/jest.config.ts
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/repositories/settlementRepo/index.ts
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/components/transaction/TransactionList.tsx
  - .github/skills/spectra-propose/SKILL.md
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - apps/web/src/pages/index.tsx
  - GEMINI.md
  - apps/web/package.json
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/next.config.js
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - .spectra.yaml
  - AGENTS.md
  - apps/web/src/stores/transaction/transactionStore.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/pages/_app.tsx
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/.babelrc
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - .github/skills/spectra-ingest/SKILL.md
  - apps/web/src/components/layout/navbar.tsx
  - .github/prompts/spectra-propose.prompt.md
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/entities/settlement.ts
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/utils/transactionUtils.ts
  - .github/prompts/spectra-ask.prompt.md
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/stores/transaction/index.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - .github/skills/spectra-ask/SKILL.md
  - .github/prompts/spectra-apply.prompt.md
  - .github/prompts/spectra-debug.prompt.md
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
tests:
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlement.spec.ts
-->

---
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


<!-- @trace
source: amount-rounding-formatting
updated: 2026-07-27
code:
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web/src/utils/settlementMarkdown.ts
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/components/calendar/MonthGrid.tsx
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/hooks/useFormatAmount.ts
  - apps/web/src/components/calendar/TransactionCalendar.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/utils/amountUtils.ts
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/i18n/messages/zh-TW.json
tests:
  - apps/web/src/utils/amountUtils.test.ts
  - apps/web/src/hooks/useFormatAmount.test.ts
  - apps/web/specs/reportAggregate.spec.ts
  - apps/web/src/utils/settlementMarkdown.test.ts
-->

---
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


<!-- @trace
source: split-settlement-feature
updated: 2026-04-11
code:
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - CLAUDE.md
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/jest.config.ts
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/repositories/settlementRepo/index.ts
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/components/transaction/TransactionList.tsx
  - .github/skills/spectra-propose/SKILL.md
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - apps/web/src/pages/index.tsx
  - GEMINI.md
  - apps/web/package.json
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/next.config.js
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - .spectra.yaml
  - AGENTS.md
  - apps/web/src/stores/transaction/transactionStore.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/pages/_app.tsx
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/.babelrc
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - .github/skills/spectra-ingest/SKILL.md
  - apps/web/src/components/layout/navbar.tsx
  - .github/prompts/spectra-propose.prompt.md
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/entities/settlement.ts
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/utils/transactionUtils.ts
  - .github/prompts/spectra-ask.prompt.md
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/stores/transaction/index.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - .github/skills/spectra-ask/SKILL.md
  - .github/prompts/spectra-apply.prompt.md
  - .github/prompts/spectra-debug.prompt.md
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
tests:
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlement.spec.ts
-->

---
### Requirement: Users can mark individual transfers as completed

For each `SettlementTransfer` within a settlement record, the user SHALL be able to mark it as completed by providing an `actualAmount` and an optional `note`. The transfer's `status` SHALL change to `'completed'` and `completedAt` SHALL be set to the current timestamp.

The `actualAmount` MAY differ from `suggestedAmount` to accommodate rounding differences.

#### Scenario: Marking a transfer complete

- **WHEN** the user confirms a transfer with an actual amount
- **THEN** the transfer `status` SHALL become `'completed'`, `actualAmount` SHALL be saved, and `completedAt` SHALL be set

#### Scenario: Actual amount differs from suggested

- **WHEN** the user enters an actual amount different from the suggested amount
- **THEN** the system SHALL accept the actual amount without validation error


<!-- @trace
source: split-settlement-feature
updated: 2026-04-11
code:
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - CLAUDE.md
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/jest.config.ts
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/repositories/settlementRepo/index.ts
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/components/transaction/TransactionList.tsx
  - .github/skills/spectra-propose/SKILL.md
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - apps/web/src/pages/index.tsx
  - GEMINI.md
  - apps/web/package.json
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/next.config.js
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - .spectra.yaml
  - AGENTS.md
  - apps/web/src/stores/transaction/transactionStore.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/pages/_app.tsx
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/.babelrc
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - .github/skills/spectra-ingest/SKILL.md
  - apps/web/src/components/layout/navbar.tsx
  - .github/prompts/spectra-propose.prompt.md
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/entities/settlement.ts
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/utils/transactionUtils.ts
  - .github/prompts/spectra-ask.prompt.md
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/stores/transaction/index.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - .github/skills/spectra-ask/SKILL.md
  - .github/prompts/spectra-apply.prompt.md
  - .github/prompts/spectra-debug.prompt.md
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
tests:
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlement.spec.ts
-->

---
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


<!-- @trace
source: add-tab-notification-count
updated: 2026-06-17
code:
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/components/settlement/SettlementRecordList.tsx
-->

---
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


<!-- @trace
source: distinguish-transfer-completion
updated: 2026-06-17
code:
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
-->

---
### Requirement: Users can soft-delete a settlement record

The system SHALL allow users to cancel an active settlement from its detail page after confirmation, provided no transfer has been marked complete. The system SHALL atomically set the record's deletion timestamp and restore the transactions linked to it in the same account book to unsettled status. Canceled records SHALL be excluded from active settlement views and pending-transfer counts.

#### Scenario: Confirming cancellation for an eligible record

- **WHEN** a user confirms cancellation of a settlement with no completed transfers
- **THEN** the user SHALL return to the account book's unsettled view, where the released expenses SHALL be available for a new settlement and included in the recalculated balances and suggestions.

#### Scenario: Viewing settlements in another tab

- **WHEN** a user cancels a settlement while another tab displays the same account book’s settlements
- **THEN** the other tab SHALL remove the record and its pending count and include the reopened expenses in its unsettled view without a reload.

#### Scenario: Attempting to cancel a record with a completed transfer

- **WHEN** a settlement contains any completed transfer, including a shared-wallet transfer
- **THEN** the system SHALL disallow cancellation and preserve the settlement and its linked transactions.

#### Scenario: Dismissing the confirmation

- **WHEN** the user dismisses the cancellation confirmation
- **THEN** the settlement and its linked transactions SHALL retain their current state.

#### Scenario: Cancellation write fails

- **WHEN** the cancellation cannot be committed
- **THEN** the system SHALL preserve the previous settlement and transaction states and show an error.

#### Scenario: Saving an edit opened before cancellation

- **WHEN** a user saves an expense edit that was opened before its settlement was canceled and the expense is still unsettled
- **THEN** the edit SHALL be saved and the expense SHALL remain unsettled.


<!-- @trace
source: cancel-settlement
updated: 2026-11-25
code:
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/entities/settlement.ts
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/package.json
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
tests:
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
-->

---
### Requirement: Exclude Shared Wallet from peer-to-peer transfers
The system SHALL NOT include the Shared Wallet in the minimum transfers calculation for peer-to-peer settlements. The Shared Wallet SHALL NOT appear as a creditor or debtor in the standard transfer list.

#### Scenario: Shared Wallet pays for an expense split by all members
- **WHEN** the Shared Wallet pays for an expense and it is split among all real members
- **THEN** no transfers involving the Shared Wallet SHALL be generated in the peer-to-peer transfer list

#### Scenario: Shared Wallet pays for an expense split by a subset of members
- **WHEN** the Shared Wallet pays for an expense and it is split by fewer members than the total real members
- **THEN** the system SHALL calculate the split amounts as "borrowings" from the Shared Wallet for those specific members
- **THEN** the system SHALL generate special transfers to the Shared Wallet that are displayed separately from peer-to-peer transfers

##### Example: Shared Wallet borrowing
| Input | Expected Output | Notes |
|-------|-----------------|-------|
| Shared Wallet pays $100, split by A and B (Total members: A, B, C) | A owes Shared Wallet $50, B owes Shared Wallet $50 | Subset split creates borrowings |
| Shared Wallet pays $90, split by A, B, C (Total members: A, B, C) | No borrowings generated | All members split it |


<!-- @trace
source: shared-wallet-settlement-logic
updated: 2026-06-24
code:
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/entities/user.ts
  - diff.patch
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/utils/transactionUtils.ts
tests:
  - apps/web/src/utils/settlementUtils.spec.ts
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/reportMemberFilter.spec.tsx
  - apps/web/specs/reportTagFilterSelector.spec.tsx
  - apps/web/specs/userEntity.spec.ts
-->

---
### Requirement: Display Shared Wallet summary in Settlement view
The settlement UI SHALL display a distinct Shared Wallet section separate from the peer-to-peer transfer list.

#### Scenario: Viewing Shared Wallet summary
- **WHEN** a user views the settlement preview or a settlement record
- **THEN** the UI SHALL display the total amount paid by the Shared Wallet
- **THEN** the UI SHALL display the average expense per real member, calculated ONLY from transactions that are split by ALL real members
- **THEN** the UI SHALL list any members who owe additional funds to the Shared Wallet due to subset splits

##### Example: Shared Wallet UI data
- **GIVEN** Shared Wallet paid $90 (split by A, B, C) and $100 (split by A, B)
- **WHEN** viewing the settlement summary
- **THEN** Total Expense is $190
- **THEN** Average per person is $30 ($90 / 3), since the $100 transaction was not split by all members
- **THEN** Additional personal borrowings list shows A owes $50, B owes $50

<!-- @trace
source: shared-wallet-settlement-logic
updated: 2026-06-24
code:
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/entities/user.ts
  - diff.patch
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/utils/transactionUtils.ts
tests:
  - apps/web/src/utils/settlementUtils.spec.ts
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/reportMemberFilter.spec.tsx
  - apps/web/specs/reportTagFilterSelector.spec.tsx
  - apps/web/specs/userEntity.spec.ts
-->

---
### Requirement: User can review a settlement before creating the record

The settlement confirmation dialog SHALL show per-member balances, suggested transfers, and the Shared Wallet summary when applicable. The current rounding setting SHALL control displayed balances and suggested transfers. Users SHALL be able to review individual expenses in the existing unsettled list and the Markdown draft.

#### Scenario: The draft contains only expenses included in the settlement

- **WHEN** a user opens the Markdown draft for the current account book
- **THEN** the draft SHALL show a count and details for eligible unsettled expenses only
- **AND** each entry SHALL show its date, description, category, amount, payers, and splits

##### Example: Expenses from two account books

- **GIVEN** the active account book contains an unsettled dinner expense, a settled taxi expense, a deleted snack expense, and income
- **WHEN** the user opens the Markdown draft while another account book has an unsettled hotel expense
- **THEN** the draft SHALL report one expense and list only dinner


<!-- @trace
source: settlement-preview-markdown
updated: 2026-11-25
code:
  - apps/web/src/components/settlement/SettlementMarkdownModal.tsx
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/utils/settlementMarkdown.ts
  - apps/web/src/components/settlement/settlementModalStyles.ts
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/i18n/messages/en-US.json
  - .github/workflows/ci.yml
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/repositories/userRepo/index.ts
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/entities/settlement.ts
tests:
  - apps/web/specs/settlementModals.spec.tsx
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/src/utils/settlementMarkdown.test.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/settlement.spec.ts
-->

---
### Requirement: User can preview and copy a Markdown settlement draft before creating the record

The confirmation dialog SHALL open a Markdown preview using the same copy interaction as settlement detail. The text SHALL label the settlement as a draft with an export timestamp and include the included expense count and details, plus the same member balances, suggested transfers, applicable Shared Wallet summary, and rounding setting as the confirmation dialog when opened. Closing the preview SHALL return to the settlement review. Opening, closing, and copying the draft SHALL leave settlement records and expense links unchanged.

#### Scenario: Draft uses the displayed rounding setting

- **WHEN** a user changes the rounding setting and opens the Markdown preview
- **THEN** the preview and copied text SHALL format the balances and suggested transfers using the current setting
- **AND** the system SHALL leave the expenses unsettled

##### Example: Fractional suggested transfer

- **GIVEN** the current overview has a suggested transfer of 150.20 in a currency displayed to two decimal places
- **WHEN** the user turns on rounding and opens the draft
- **THEN** the overview and draft SHALL display 151 for that suggestion
- **WHEN** the user returns to the review, turns off rounding, and opens another draft
- **THEN** the overview and the new draft SHALL display 150.20 for that suggestion

#### Scenario: Custom currency labels retain their literal text

- **WHEN** a user previews or copies a draft from an account book whose custom currency label contains Markdown delimiters
- **THEN** the draft Markdown SHALL escape those delimiters in every amount so the currency label renders literally and the member balance table retains its columns

##### Example: A pipe in the currency label

- **GIVEN** the account book uses the custom currency label `A|B`
- **WHEN** the user opens the Markdown draft
- **THEN** the draft source SHALL use `A\|B` in each amount, and the member balance table SHALL retain its four columns

#### Scenario: The clipboard rejects the copy

- **WHEN** the browser rejects copying the Markdown
- **THEN** the system SHALL display the localized copy failure and keep the draft available for manual selection

##### Example: Clipboard permission is denied

- **GIVEN** the draft shows a dinner expense
- **WHEN** the clipboard denies write permission
- **THEN** the copy failure appears and the dinner remains visible and selectable


<!-- @trace
source: settlement-preview-markdown
updated: 2026-11-25
code:
  - apps/web/src/components/settlement/SettlementMarkdownModal.tsx
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/utils/settlementMarkdown.ts
  - apps/web/src/components/settlement/settlementModalStyles.ts
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/i18n/messages/en-US.json
  - .github/workflows/ci.yml
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/repositories/userRepo/index.ts
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/entities/settlement.ts
tests:
  - apps/web/specs/settlementModals.spec.tsx
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/src/utils/settlementMarkdown.test.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/settlement.spec.ts
-->

---
### Requirement: Settlement creation requires confirmation of current review data

The system SHALL create a settlement record only after explicit confirmation of the current overview. If included expenses, their review values, or the derived settlement amounts change between the reviewed overview and creation, the system SHALL refresh the overview, notify the user, and require explicit confirmation of the updated data. The stale attempt SHALL NOT create a settlement record or relink any expense. If the refreshed overview has no eligible expenses, the system SHALL make confirmation and opening a Markdown draft unavailable.

#### Scenario: An in-place edit changes a reviewed expense

- **WHEN** an expense's split changes after the user sees the overview but before creation, while its ID and the count of included expenses stay the same
- **THEN** the system SHALL show the revised expense and calculations, notify the user, and wait for another confirmation
- **AND** the stale attempt SHALL leave all settlement records and expense links unchanged

##### Example: Dinner split is corrected

- **GIVEN** the overview includes a dinner of 120 paid by A and initially split as 60 each by A and B
- **WHEN** B's share is corrected to 40 and A's share to 80 before the user confirms the original overview
- **THEN** the revised overview SHALL show that B owes A 40 and no settlement record SHALL exist for the stale attempt

#### Scenario: Membership changes a reviewed Shared Wallet calculation

- **GIVEN** the Shared Wallet pays 120 for an expense split evenly between the account book's two members
- **WHEN** another view adds a third member before the settlement is written
- **THEN** the stale attempt SHALL leave the expense unsettled and create no record
- **AND** the refreshed review SHALL show 60 owed to the Shared Wallet from each original member and require another confirmation

#### Scenario: The reviewed expenses are still current at confirmation

- **WHEN** the user confirms an overview whose reviewed data still matches the current settlement inputs
- **THEN** the system SHALL create the record for exactly the reviewed expenses with the underlying unrounded balances and suggested transfers

##### Example: Rounding applies to display

- **GIVEN** the reviewed expenses imply a transfer of 150.20 and rounding displays 151
- **WHEN** the user confirms without any expense changes
- **THEN** the new record SHALL link exactly those expenses and store the transfer suggestion as 150.20

#### Scenario: No reviewed expenses remain eligible

- **WHEN** all reviewed expenses become ineligible before creation and there are no other unsettled expenses in the account book
- **THEN** the overview SHALL indicate that no expenses remain eligible and make confirmation and opening a Markdown draft unavailable

##### Example: The only expense is settled elsewhere

- **GIVEN** the overview contains one taxi expense
- **WHEN** another view settles the taxi expense before the user confirms
- **THEN** the overview SHALL show a count of 0 and SHALL disable confirmation and opening a Markdown draft

<!-- @trace
source: settlement-preview-markdown
updated: 2026-11-25
code:
  - apps/web/src/components/settlement/SettlementMarkdownModal.tsx
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/utils/settlementMarkdown.ts
  - apps/web/src/components/settlement/settlementModalStyles.ts
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/i18n/messages/en-US.json
  - .github/workflows/ci.yml
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/repositories/userRepo/index.ts
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/entities/settlement.ts
tests:
  - apps/web/specs/settlementModals.spec.tsx
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/src/utils/settlementMarkdown.test.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/settlement.spec.ts
-->