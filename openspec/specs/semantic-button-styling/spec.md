# semantic-button-styling Specification

## Purpose

TBD - created by archiving change 'standardize-semantic-button-foreground'. Update Purpose after archive.

## Requirements

### Requirement: Solid semantic buttons use an accessible shared foreground

The web application SHALL render the labels and icons of solid primary, danger, and success buttons in white in both light and dark themes. Each corresponding solid fill SHALL provide a contrast ratio of at least 4.5:1 against white at normal button-label size. The warning semantic button SHALL retain a dark foreground when its fill does not meet that threshold with white.

#### Scenario: Render a solid primary action in either theme

- **WHEN** a primary save or create action renders as a solid button in light or dark theme
- **THEN** its computed foreground color SHALL be `rgb(255, 255, 255)`
- **THEN** its semantic fill SHALL provide at least 4.5:1 contrast against that foreground

#### Scenario: Render a solid destructive action in either theme

- **WHEN** a delete or destructive confirmation action renders as a solid danger button in light or dark theme
- **THEN** its computed foreground color SHALL be `rgb(255, 255, 255)`
- **THEN** its semantic fill SHALL provide at least 4.5:1 contrast against that foreground

#### Scenario: Render a warning action

- **WHEN** a warning button renders with the warning semantic color
- **THEN** it SHALL retain a readable dark foreground rather than forcing white text


<!-- @trace
source: standardize-semantic-button-foreground
updated: 2026-08-31
code:
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-mobile-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-tablet-light-chromium-darwin.png
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/src/components/onboarding/AccountBookStep.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-tablet-dark-chromium-darwin.png
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/components/ui/PageScaffold.tsx
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/components/calendar/TransactionCalendar.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-mobile-light-chromium-darwin.png
  - apps/web/src/components/onboarding/EntryShell.tsx
  - apps/web/src/components/TransactionModal/CategorySelector.tsx
  - apps/web/src/components/onboarding/OnboardingWelcomeModal.tsx
  - apps/web/src/components/TransactionModal/PaidByDetailModal.tsx
  - apps/web/public/images/ui/duoji-banner-background.webp
  - apps/web/src/components/settlement/settlementModalStyles.ts
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/pages/onboarding/index.tsx
  - apps/web/src/components/ui/AppButton.tsx
  - apps/web/src/components/accountBookSettings/AccountBookNavHeader.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/report/MemberFilterSelector.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-mobile-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-mobile-light-chromium-darwin.png
  - apps/web/src/components/onboarding/ProfileStep.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-narrow-light-chromium-darwin.png
  - apps/web/PRODUCT.md
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/src/pages/styles.css
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-mobile-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-mobile-light-chromium-darwin.png
  - apps/web/src/components/TransactionModal/formControlStyles.ts
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-tablet-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-tablet-light-chromium-darwin.png
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/onboarding/StepShell.tsx
  - apps/web/src/components/report/TagFilterSelector.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-tablet-dark-chromium-darwin.png
  - apps/web/src/components/categorySettings/CategoryGroupItem.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-tablet-dark-chromium-darwin.png
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-mobile-light-chromium-darwin.png
  - docs/superpowers/specs/2026-08-30-transaction-hero-parallax-design.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-tablet-light-chromium-darwin.png
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/ui/SurfaceCard.tsx
  - apps/web/src/components/TransactionModal/DetailBalanceNotice.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-tablet-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-mobile-dark-chromium-darwin.png
  - apps/web/public/images/ui/duoji-banner-travel.webp
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-tablet-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-tablet-dark-chromium-darwin.png
  - apps/web/src/components/calendar/WeekStrip.tsx
  - apps/web/scripts/process-banner-assets.mjs
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-mobile-light-chromium-darwin.png
  - apps/web/src/components/categorySettings/DeleteConfirmModal.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/components/TransactionModal/SplitDetailModal.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-tablet-light-chromium-darwin.png
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/components/transaction/TransactionHero.tsx
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-mobile-dark-chromium-darwin.png
  - apps/web/.impeccable/design.json
  - apps/web/src/components/onboarding/OnboardingTutorial.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-tablet-dark-chromium-darwin.png
  - apps/web/src/components/settlement/SettlementMarkdownModal.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-mobile-dark-chromium-darwin.png
  - apps/web/.impeccable/live/config.json
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-mobile-dark-chromium-darwin.png
  - apps/web/src/components/calendar/MonthGrid.tsx
  - docs/superpowers/specs/2026-08-30-calendar-width-and-touch-target-design.md
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-mobile-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-tablet-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-tablet-dark-chromium-darwin.png
  - apps/web/DESIGN.md
  - apps/web/src/components/categorySettings/SubCategoryItem.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-tablet-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-mobile-dark-chromium-darwin.png
  - apps/web-e2e/src/helpers/onboarding.ts
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-tablet-dark-chromium-darwin.png
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - apps/web/src/components/onboarding/LanguageStep.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-tablet-light-chromium-darwin.png
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-mobile-light-chromium-darwin.png
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-mobile-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-tablet-light-chromium-darwin.png
  - apps/web/src/pages/login.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/components/TransactionModal/amountInputStyles.ts
  - apps/web/src/components/accountBookSettings/AccountBookForm.tsx
  - apps/web/src/components/categorySettings/AddCategoryModal.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-mobile-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-mobile-dark-chromium-darwin.png
  - apps/web/src/components/ui/TagInput.tsx
  - apps/web/tailwind.config.js
  - apps/web/src/components/layout/navbar.tsx
tests:
  - apps/web/specs/transactionHero.spec.tsx
  - apps/web/specs/AppButton.spec.tsx
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/reportChartsPresentation.spec.tsx
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/onboardingPresentation.spec.tsx
  - apps/web/specs/settlementModals.spec.tsx
  - apps/web/specs/categoryMemberPresentation.spec.tsx
  - apps/web/specs/transactionCalendarPresentation.spec.tsx
  - apps/web/specs/transactionSurfacePresentation.spec.tsx
  - apps/web/specs/categoryTransactionsModalPresentation.spec.tsx
  - apps/web-e2e/src/transaction-modal-mobile.spec.ts
  - apps/web/specs/routeFamilyVisualContract.spec.ts
  - apps/web/specs/visualPrimitives.spec.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/bannerAssets.spec.ts
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
-->

---
### Requirement: Application button treatments communicate semantic intent

The application SHALL provide an `AppButton` primitive with semantic tones `primary`, `danger`, `success`, `warning`, and `neutral`, and appearances `solid`, `flat`, `light`, and `ghost`. It SHALL forward HeroUI button behavior for disabled, loading, keyboard focus, press events, accessibility attributes, and supplied test identifiers. Shared account-book form actions SHALL use this primitive: save uses a solid primary treatment and the optional cancel uses a neutral light treatment.

#### Scenario: Use a solid semantic AppButton

- **WHEN** a feature renders `AppButton` with `appearance="solid"` and tone `primary`, `danger`, or `success`
- **THEN** it SHALL use the shared solid semantic fill and white foreground treatment
- **THEN** existing button handlers and disabled state SHALL remain unchanged

#### Scenario: Use a non-solid AppButton

- **WHEN** a feature renders `AppButton` with `appearance="flat"`, `light`, or `ghost`
- **THEN** it SHALL use the corresponding non-solid treatment with a readable dark foreground
- **THEN** it SHALL NOT inherit the white foreground reserved for solid semantic actions

#### Scenario: Render a disabled solid AppButton

- **WHEN** a solid primary, danger, or success `AppButton` is disabled
- **THEN** it SHALL remain non-interactive
- **THEN** its label foreground SHALL remain white

#### Scenario: Render an account-book form save action

- **WHEN** a user opens either the create or edit account-book form
- **THEN** its save action SHALL use the solid primary `AppButton` treatment
- **THEN** its optional cancel action SHALL use the neutral light `AppButton` treatment


<!-- @trace
source: fix-account-book-form-button-foreground
updated: 2026-08-31
code:
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-mobile-dark-chromium-darwin.png
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-tablet-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-tablet-dark-chromium-darwin.png
  - apps/web/tailwind.config.js
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-tablet-dark-chromium-darwin.png
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/components/calendar/MonthGrid.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-tablet-light-chromium-darwin.png
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/onboarding/LanguageStep.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/src/components/ui/AppButton.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-tablet-dark-chromium-darwin.png
  - apps/web/src/components/TransactionModal/PaidByDetailModal.tsx
  - apps/web/src/components/report/TagFilterSelector.tsx
  - apps/web/public/images/ui/duoji-banner-background.webp
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-mobile-dark-chromium-darwin.png
  - apps/web/src/components/onboarding/OnboardingWelcomeModal.tsx
  - apps/web/src/components/categorySettings/SubCategoryItem.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-tablet-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-mobile-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-tablet-light-chromium-darwin.png
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-mobile-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-mobile-light-chromium-darwin.png
  - apps/web/src/components/calendar/WeekStrip.tsx
  - apps/web/scripts/process-banner-assets.mjs
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/TransactionModal/SplitDetailModal.tsx
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/src/components/TransactionModal/CategorySelector.tsx
  - apps/web/src/pages/onboarding/index.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-tablet-light-chromium-darwin.png
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-mobile-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-mobile-dark-chromium-darwin.png
  - apps/web/.impeccable/live/config.json
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-mobile-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-narrow-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-tablet-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-tablet-light-chromium-darwin.png
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-mobile-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-tablet-dark-chromium-darwin.png
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - apps/web/src/components/categorySettings/DeleteConfirmModal.tsx
  - apps/web/src/components/onboarding/ProfileStep.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-mobile-dark-chromium-darwin.png
  - apps/web/src/components/transaction/TransactionHero.tsx
  - apps/web/src/components/settlement/SettlementMarkdownModal.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-mobile-light-chromium-darwin.png
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-mobile-light-chromium-darwin.png
  - apps/web/DESIGN.md
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/components/accountBookSettings/AccountBookForm.tsx
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/TransactionModal/DetailBalanceNotice.tsx
  - apps/web/src/components/TransactionModal/formControlStyles.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - docs/superpowers/specs/2026-08-30-transaction-hero-parallax-design.md
  - apps/web/src/components/onboarding/EntryShell.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-tablet-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-tablet-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-mobile-light-chromium-darwin.png
  - apps/web/src/components/categorySettings/CategoryGroupItem.tsx
  - apps/web/src/components/TransactionModal/amountInputStyles.ts
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-tablet-light-chromium-darwin.png
  - apps/web/src/components/onboarding/OnboardingTutorial.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-mobile-dark-chromium-darwin.png
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/components/categorySettings/AddCategoryModal.tsx
  - apps/web/src/components/ui/TagInput.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-mobile-dark-chromium-darwin.png
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web-e2e/src/helpers/onboarding.ts
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-tablet-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-mobile-light-chromium-darwin.png
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-mobile-dark-chromium-darwin.png
  - docs/superpowers/specs/2026-08-30-calendar-width-and-touch-target-design.md
  - apps/web/src/pages/styles.css
  - apps/web/src/components/calendar/TransactionCalendar.tsx
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/src/components/onboarding/AccountBookStep.tsx
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/public/images/ui/duoji-banner-travel.webp
  - apps/web/PRODUCT.md
  - apps/web/src/components/ui/PageScaffold.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-tablet-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-tablet-light-chromium-darwin.png
  - apps/web/src/components/accountBookSettings/AccountBookNavHeader.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/.impeccable/design.json
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-tablet-dark-chromium-darwin.png
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/components/ui/SurfaceCard.tsx
  - apps/web/src/components/report/MemberFilterSelector.tsx
  - apps/web/src/components/onboarding/StepShell.tsx
  - apps/web/src/components/settlement/settlementModalStyles.ts
  - apps/web/src/pages/login.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-mobile-light-chromium-darwin.png
tests:
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/transactionHero.spec.tsx
  - apps/web/specs/transactionCalendarPresentation.spec.tsx
  - apps/web/specs/categoryMemberPresentation.spec.tsx
  - apps/web/specs/reportChartsPresentation.spec.tsx
  - apps/web/specs/settlementModals.spec.tsx
  - apps/web/specs/transactionSurfacePresentation.spec.tsx
  - apps/web/specs/visualPrimitives.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/routeFamilyVisualContract.spec.ts
  - apps/web/specs/bannerAssets.spec.ts
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts
  - apps/web/specs/onboardingPresentation.spec.tsx
  - apps/web-e2e/src/transaction-modal-mobile.spec.ts
  - apps/web/specs/categoryTransactionsModalPresentation.spec.tsx
  - apps/web/specs/AppButton.spec.tsx
  - apps/web/specs/settlementPage.spec.tsx
-->

---
### Requirement: High-visibility transaction and deletion actions adopt the shared primitive

The transaction modal save/create action, transaction deletion actions, category deletion confirmation, and account-book deletion confirmation SHALL use `AppButton` with their current semantic tone and appearance. Their labels, enabled rules, dialog lifecycle, and associated persistence behavior SHALL remain unchanged.

#### Scenario: Save an invalid transaction

- **WHEN** a user opens a new transaction modal before all existing validation requirements are met
- **THEN** the solid primary create action SHALL be disabled with a white label
- **THEN** the action SHALL remain disabled until the existing validation conditions are satisfied

#### Scenario: Confirm deletion

- **WHEN** a user opens a transaction, category, or account-book deletion confirmation
- **THEN** the destructive confirmation action SHALL render as a solid danger `AppButton` with a white label
- **THEN** the cancellation action SHALL retain its existing non-solid readable treatment

<!-- @trace
source: standardize-semantic-button-foreground
updated: 2026-08-31
code:
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-mobile-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-tablet-light-chromium-darwin.png
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/src/components/onboarding/AccountBookStep.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-tablet-dark-chromium-darwin.png
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/components/ui/PageScaffold.tsx
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/components/calendar/TransactionCalendar.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-mobile-light-chromium-darwin.png
  - apps/web/src/components/onboarding/EntryShell.tsx
  - apps/web/src/components/TransactionModal/CategorySelector.tsx
  - apps/web/src/components/onboarding/OnboardingWelcomeModal.tsx
  - apps/web/src/components/TransactionModal/PaidByDetailModal.tsx
  - apps/web/public/images/ui/duoji-banner-background.webp
  - apps/web/src/components/settlement/settlementModalStyles.ts
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/pages/onboarding/index.tsx
  - apps/web/src/components/ui/AppButton.tsx
  - apps/web/src/components/accountBookSettings/AccountBookNavHeader.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/report/MemberFilterSelector.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-mobile-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-mobile-light-chromium-darwin.png
  - apps/web/src/components/onboarding/ProfileStep.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-narrow-light-chromium-darwin.png
  - apps/web/PRODUCT.md
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/src/pages/styles.css
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-mobile-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-mobile-light-chromium-darwin.png
  - apps/web/src/components/TransactionModal/formControlStyles.ts
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-tablet-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-tablet-light-chromium-darwin.png
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/onboarding/StepShell.tsx
  - apps/web/src/components/report/TagFilterSelector.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-tablet-dark-chromium-darwin.png
  - apps/web/src/components/categorySettings/CategoryGroupItem.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-tablet-dark-chromium-darwin.png
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-mobile-light-chromium-darwin.png
  - docs/superpowers/specs/2026-08-30-transaction-hero-parallax-design.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-tablet-light-chromium-darwin.png
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/ui/SurfaceCard.tsx
  - apps/web/src/components/TransactionModal/DetailBalanceNotice.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-tablet-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-mobile-dark-chromium-darwin.png
  - apps/web/public/images/ui/duoji-banner-travel.webp
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-tablet-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-tablet-dark-chromium-darwin.png
  - apps/web/src/components/calendar/WeekStrip.tsx
  - apps/web/scripts/process-banner-assets.mjs
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-mobile-light-chromium-darwin.png
  - apps/web/src/components/categorySettings/DeleteConfirmModal.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/components/TransactionModal/SplitDetailModal.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-tablet-light-chromium-darwin.png
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/components/transaction/TransactionHero.tsx
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-mobile-dark-chromium-darwin.png
  - apps/web/.impeccable/design.json
  - apps/web/src/components/onboarding/OnboardingTutorial.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-tablet-dark-chromium-darwin.png
  - apps/web/src/components/settlement/SettlementMarkdownModal.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-mobile-dark-chromium-darwin.png
  - apps/web/.impeccable/live/config.json
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-mobile-dark-chromium-darwin.png
  - apps/web/src/components/calendar/MonthGrid.tsx
  - docs/superpowers/specs/2026-08-30-calendar-width-and-touch-target-design.md
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-mobile-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-tablet-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-tablet-dark-chromium-darwin.png
  - apps/web/DESIGN.md
  - apps/web/src/components/categorySettings/SubCategoryItem.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-tablet-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-mobile-dark-chromium-darwin.png
  - apps/web-e2e/src/helpers/onboarding.ts
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-tablet-dark-chromium-darwin.png
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - apps/web/src/components/onboarding/LanguageStep.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-tablet-light-chromium-darwin.png
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-mobile-light-chromium-darwin.png
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-mobile-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-tablet-light-chromium-darwin.png
  - apps/web/src/pages/login.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/components/TransactionModal/amountInputStyles.ts
  - apps/web/src/components/accountBookSettings/AccountBookForm.tsx
  - apps/web/src/components/categorySettings/AddCategoryModal.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-mobile-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-mobile-dark-chromium-darwin.png
  - apps/web/src/components/ui/TagInput.tsx
  - apps/web/tailwind.config.js
  - apps/web/src/components/layout/navbar.tsx
tests:
  - apps/web/specs/transactionHero.spec.tsx
  - apps/web/specs/AppButton.spec.tsx
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web/specs/reportChartsPresentation.spec.tsx
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/onboardingPresentation.spec.tsx
  - apps/web/specs/settlementModals.spec.tsx
  - apps/web/specs/categoryMemberPresentation.spec.tsx
  - apps/web/specs/transactionCalendarPresentation.spec.tsx
  - apps/web/specs/transactionSurfacePresentation.spec.tsx
  - apps/web/specs/categoryTransactionsModalPresentation.spec.tsx
  - apps/web-e2e/src/transaction-modal-mobile.spec.ts
  - apps/web/specs/routeFamilyVisualContract.spec.ts
  - apps/web/specs/visualPrimitives.spec.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/bannerAssets.spec.ts
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
-->