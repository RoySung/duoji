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

All suggested amounts SHALL be rounded to 2 decimal places.

#### Scenario: Three members, two transfers needed

- **WHEN** member A has +$2,000, member B has -$1,200, member C has -$800
- **THEN** the system SHALL suggest exactly 2 transfers: B→A $1,200 and C→A $800

#### Scenario: All balances are zero

- **WHEN** all members have a net balance of $0
- **THEN** the system SHALL return an empty transfer suggestion list


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

The system SHALL allow users to delete a settlement record. Deletion SHALL set `deletedAt` to the current timestamp (soft delete). Deleted records SHALL NOT appear in the settlement record list. Transactions previously covered by a deleted record SHALL become unsettled again.

#### Scenario: Deleting a settlement record re-exposes transactions

- **WHEN** a settlement record is soft-deleted
- **THEN** its `transactionIds` SHALL no longer be in the settled set, and those transactions SHALL appear in the unsettled transaction list

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