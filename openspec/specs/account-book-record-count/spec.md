# account-book-record-count Specification

## Purpose

This capability makes the account-book hero's transaction count unambiguous by naming the exact selected day, displayed week, or displayed month represented by the count.

## Requirements

### Requirement: Account-book hero reports the selected date count
The account-book hero SHALL display the number of transactions dated on the selected calendar date when a date is selected. This requirement SHALL apply in both week and month calendar views.

#### Scenario: Selected date overrides the displayed week
- **GIVEN** the calendar is in week view, a date in its displayed week is selected, and that date has 2 transactions
- **WHEN** the displayed week contains additional transactions on other dates
- **THEN** the hero SHALL display `2026/09/12 共 2 筆` in the Traditional Chinese locale when the selected date is September 12, 2026

#### Scenario: Selected date overrides the displayed month
- **GIVEN** the calendar is in month view, a date is selected, and that date has 0 transactions
- **WHEN** the displayed month contains transactions on other dates
- **THEN** the hero SHALL display the selected date in zero-padded `YYYY/MM/DD` form followed by the localized count of 0


<!-- @trace
source: account-book-record-count
updated: 2026-09-20
code:
  - apps/web/src/i18n/messages/zh-TW.json
  - .agents/skills/spectra-review/SKILL.md
  - .github/prompts/spectra-ask.prompt.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-analyze/SKILL.md
  - .github/skills/spectra-audit/SKILL.md
  - .github/skills/spectra-commit/SKILL.md
  - .github/skills/spectra-debug/SKILL.md
  - .github/skills/spectra-propose/SKILL.md
  - .github/prompts/spectra-apply.prompt.md
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/web/src/i18n/messages/en-US.json
  - .github/skills/spectra-archive/SKILL.md
  - .github/skills/spectra-discuss/SKILL.md
  - .github/skills/spectra-review/SKILL.md
  - GEMINI.md
  - .agents/skills/spectra-debug/SKILL.md
  - apps/web/src/components/calendar/TransactionCalendar.tsx
  - .github/prompts/spectra-discuss.prompt.md
  - .agents/skills/spectra-commit/SKILL.md
  - apps/web-e2e/src/helpers/onboarding.ts
  - .github/prompts/spectra-propose.prompt.md
  - .agents/skills/spectra-verify/SKILL.md
  - .github/skills/spectra-ingest/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .github/prompts/spectra-archive.prompt.md
  - CLAUDE.md
  - .github/prompts/spectra-audit.prompt.md
  - AGENTS.md
  - .agents/skills/spectra-apply/SKILL.md
  - .github/prompts/spectra-commit.prompt.md
  - .github/prompts/spectra-drift.prompt.md
  - .agents/skills/spectra-audit/SKILL.md
  - .github/skills/spectra-apply/SKILL.md
  - .github/skills/spectra-ask/SKILL.md
  - .github/skills/spectra-drift/SKILL.md
  - apps/web/src/pages/account-books/[id]/index.tsx
  - .agents/skills/spectra-drift/SKILL.md
  - .github/prompts/spectra-ingest.prompt.md
  - .github/skills/spectra-verify/SKILL.md
  - .github/skills/spectra-analyze/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .github/prompts/spectra-debug.prompt.md
tests:
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web-e2e/src/transactions.spec.ts
-->

---
### Requirement: Account-book hero reports the displayed week count without a selection
The account-book hero SHALL display the number of transactions whose dates fall within the calendar's displayed week when no date is selected and the calendar is in week view. Transactions outside that displayed week SHALL NOT contribute to the count.

#### Scenario: Unselected week has transactions
- **GIVEN** no calendar date is selected and the displayed week contains 3 transactions across its seven dates
- **WHEN** the calendar is in week view
- **THEN** the hero SHALL display `2026/09/07–2026/09/13 共 3 筆` in the Traditional Chinese locale when those are the displayed week boundaries

#### Scenario: Week navigation changes the unselected count
- **GIVEN** no calendar date is selected, the displayed week has 1 transaction, and the next displayed week has 4 transactions
- **WHEN** the user navigates to the next week while remaining in week view
- **THEN** the hero SHALL update both zero-padded `YYYY/MM/DD` boundaries and the localized count of 4, joining the boundaries with an en dash (`–`)


<!-- @trace
source: account-book-record-count
updated: 2026-09-20
code:
  - apps/web/src/i18n/messages/zh-TW.json
  - .agents/skills/spectra-review/SKILL.md
  - .github/prompts/spectra-ask.prompt.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-analyze/SKILL.md
  - .github/skills/spectra-audit/SKILL.md
  - .github/skills/spectra-commit/SKILL.md
  - .github/skills/spectra-debug/SKILL.md
  - .github/skills/spectra-propose/SKILL.md
  - .github/prompts/spectra-apply.prompt.md
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/web/src/i18n/messages/en-US.json
  - .github/skills/spectra-archive/SKILL.md
  - .github/skills/spectra-discuss/SKILL.md
  - .github/skills/spectra-review/SKILL.md
  - GEMINI.md
  - .agents/skills/spectra-debug/SKILL.md
  - apps/web/src/components/calendar/TransactionCalendar.tsx
  - .github/prompts/spectra-discuss.prompt.md
  - .agents/skills/spectra-commit/SKILL.md
  - apps/web-e2e/src/helpers/onboarding.ts
  - .github/prompts/spectra-propose.prompt.md
  - .agents/skills/spectra-verify/SKILL.md
  - .github/skills/spectra-ingest/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .github/prompts/spectra-archive.prompt.md
  - CLAUDE.md
  - .github/prompts/spectra-audit.prompt.md
  - AGENTS.md
  - .agents/skills/spectra-apply/SKILL.md
  - .github/prompts/spectra-commit.prompt.md
  - .github/prompts/spectra-drift.prompt.md
  - .agents/skills/spectra-audit/SKILL.md
  - .github/skills/spectra-apply/SKILL.md
  - .github/skills/spectra-ask/SKILL.md
  - .github/skills/spectra-drift/SKILL.md
  - apps/web/src/pages/account-books/[id]/index.tsx
  - .agents/skills/spectra-drift/SKILL.md
  - .github/prompts/spectra-ingest.prompt.md
  - .github/skills/spectra-verify/SKILL.md
  - .github/skills/spectra-analyze/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .github/prompts/spectra-debug.prompt.md
tests:
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web-e2e/src/transactions.spec.ts
-->

---
### Requirement: Account-book hero reports the displayed month count without a selection
The account-book hero SHALL display the number of transactions whose dates fall within the calendar's displayed month when no date is selected and the calendar is in month view. Transactions from adjacent months represented by leading or trailing calendar cells SHALL NOT contribute to the count.

#### Scenario: Unselected month has transactions
- **GIVEN** no calendar date is selected and the displayed calendar month contains 5 transactions
- **WHEN** the calendar is in month view
- **THEN** the hero SHALL display `2026/09 共 5 筆` in the Traditional Chinese locale when September 2026 is displayed

#### Scenario: Adjacent-month transactions are excluded
- **GIVEN** no calendar date is selected, the displayed month contains 2 transactions, and an adjacent-month grid cell has 1 transaction
- **WHEN** the calendar is in month view
- **THEN** the hero SHALL display the displayed month in zero-padded `YYYY/MM` form followed by the localized count of 2

<!-- @trace
source: account-book-record-count
updated: 2026-09-20
code:
  - apps/web/src/i18n/messages/zh-TW.json
  - .agents/skills/spectra-review/SKILL.md
  - .github/prompts/spectra-ask.prompt.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-analyze/SKILL.md
  - .github/skills/spectra-audit/SKILL.md
  - .github/skills/spectra-commit/SKILL.md
  - .github/skills/spectra-debug/SKILL.md
  - .github/skills/spectra-propose/SKILL.md
  - .github/prompts/spectra-apply.prompt.md
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/web/src/i18n/messages/en-US.json
  - .github/skills/spectra-archive/SKILL.md
  - .github/skills/spectra-discuss/SKILL.md
  - .github/skills/spectra-review/SKILL.md
  - GEMINI.md
  - .agents/skills/spectra-debug/SKILL.md
  - apps/web/src/components/calendar/TransactionCalendar.tsx
  - .github/prompts/spectra-discuss.prompt.md
  - .agents/skills/spectra-commit/SKILL.md
  - apps/web-e2e/src/helpers/onboarding.ts
  - .github/prompts/spectra-propose.prompt.md
  - .agents/skills/spectra-verify/SKILL.md
  - .github/skills/spectra-ingest/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .github/prompts/spectra-archive.prompt.md
  - CLAUDE.md
  - .github/prompts/spectra-audit.prompt.md
  - AGENTS.md
  - .agents/skills/spectra-apply/SKILL.md
  - .github/prompts/spectra-commit.prompt.md
  - .github/prompts/spectra-drift.prompt.md
  - .agents/skills/spectra-audit/SKILL.md
  - .github/skills/spectra-apply/SKILL.md
  - .github/skills/spectra-ask/SKILL.md
  - .github/skills/spectra-drift/SKILL.md
  - apps/web/src/pages/account-books/[id]/index.tsx
  - .agents/skills/spectra-drift/SKILL.md
  - .github/prompts/spectra-ingest.prompt.md
  - .github/skills/spectra-verify/SKILL.md
  - .github/skills/spectra-analyze/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .github/prompts/spectra-debug.prompt.md
tests:
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web-e2e/src/transactions.spec.ts
-->