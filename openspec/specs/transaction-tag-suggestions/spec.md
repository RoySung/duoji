# transaction-tag-suggestions Specification

## Purpose

TBD - created by archiving change 'add-transaction-tag-suggestions'. Update Purpose after archive.

## Requirements

### Requirement: Tag suggestions are scoped to the transaction form's selected account book

The system SHALL derive transaction-form tag suggestions from tags cached in LocalStorage for the account book currently selected in the form.

#### Scenario: Suggestions are scoped to the selected account book

- **WHEN** a user opens a transaction form for account book A and account book A has tags cached in LocalStorage while account book B has different cached tags
- **THEN** the system SHALL show only suggestions derived from account book A's LocalStorage cache

#### Scenario: Changing the account book changes the suggestion source

- **WHEN** the user changes the account book selection inside the transaction form
- **THEN** the system SHALL update the available suggestions to use the newly selected account book's LocalStorage cache as the only source


<!-- @trace
source: cache-tag-suggestions-in-localstorage
updated: 2026-06-13
code:
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/test-setup.ts
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/hooks/transactionQueryUtils.ts
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/components/report/TagFilterSelector.tsx
  - apps/web/src/components/ui/TagInput.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/hooks/useAccountBookTagSuggestions.ts
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
tests:
  - apps/web/specs/useAccountBookTagSuggestions.spec.ts
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/transactionFormTags.spec.tsx
  - apps/web/specs/reportTagFilterSelector.spec.tsx
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/category.spec.ts
-->

---
### Requirement: Tag suggestions are normalized for display

The system SHALL exclude empty tag values, trim surrounding whitespace, collapse case-insensitive duplicate values into a single suggestion, sort visible suggestions in ascending order, and hide suggestions that are already selected in the current transaction draft.

#### Scenario: Empty and already-selected values are excluded

- **WHEN** the stored transactions for the selected account book contain empty tag values, whitespace-padded values, and values that are already present in the current draft
- **THEN** the visible suggestion list SHALL exclude the empty values and SHALL NOT repeat any tag already selected in the draft

#### Scenario: Case-insensitive duplicates appear once

- **WHEN** the stored transactions for the selected account book contain multiple tag values that differ only by case
- **THEN** the suggestion list SHALL present only one selectable suggestion for that tag value


<!-- @trace
source: add-transaction-tag-suggestions
updated: 2026-06-13
code:
  - apps/web/src/hooks/transactionQueryUtils.ts
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/ui/TagInput.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/hooks/useAccountBookTagSuggestions.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/test-setup.ts
  - apps/web/src/components/report/TagFilterSelector.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
tests:
  - apps/web/specs/category.spec.ts
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/reportTagFilterSelector.spec.tsx
  - apps/web/specs/transactionFormTags.spec.tsx
  - apps/web/specs/useAccountBookTagSuggestions.spec.ts
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/reportSection.spec.tsx
-->

---
### Requirement: Tag suggestions stay coherent with transaction mutations

The system SHALL update the LocalStorage tag suggestions cache for an account book after a transaction is successfully created or updated in that account book.

#### Scenario: A new tag is cached after transaction creation or update

- **WHEN** a user saves (creates or updates) a transaction in account book A with one or more tags
- **THEN** the system SHALL append those tags to the LocalStorage cache for account book A, making them immediately available in the suggestion list for future transaction forms of account book A


<!-- @trace
source: cache-tag-suggestions-in-localstorage
updated: 2026-06-13
code:
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/test-setup.ts
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/hooks/transactionQueryUtils.ts
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/components/report/TagFilterSelector.tsx
  - apps/web/src/components/ui/TagInput.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/hooks/useAccountBookTagSuggestions.ts
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
tests:
  - apps/web/specs/useAccountBookTagSuggestions.spec.ts
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/transactionFormTags.spec.tsx
  - apps/web/specs/reportTagFilterSelector.spec.tsx
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/category.spec.ts
-->

---
