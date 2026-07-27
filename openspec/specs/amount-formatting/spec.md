# amount-formatting Specification

## Purpose

TBD - created by archiving change 'amount-rounding-formatting'. Update Purpose after archive.

## Requirements

### Requirement: Unified amount formatting with optional rounding
The system SHALL provide a unified amount formatting function `formatAmount` and React hook `useFormatAmount` to format numeric transaction amounts into localized display strings.

#### Scenario: Format amount with ceil rounding
- **WHEN** `roundMode` option is set to `'ceil'` and `formatAmount(150.2)` is invoked
- **THEN** the output SHALL be rounded up to the nearest integer as `"151"`

##### Example: Rounding mode cases
| Input Amount | roundMode | Expected Output | Notes |
| ------------ | --------- | --------------- | ----- |
| 150.2 | "ceil" | "151" | Ceil round up |
| 150.8 | "round" | "151" | Standard round |
| 150.8 | "none" | "150.8" | Preserve decimal |

#### Scenario: Format amount with currency symbol
- **WHEN** `showCurrency` is `true` and `currencySymbol` is `"NT$"`
- **THEN** the output SHALL prefix the formatted string with `"NT$ "`

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