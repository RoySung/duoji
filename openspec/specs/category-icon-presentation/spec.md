# category-icon-presentation Specification

## Purpose

TBD - created by archiving change 'add-category-icon-padding'. Update Purpose after archive.

## Requirements

### Requirement: Category images have a consistent targeted inset in transaction and report surfaces

The system SHALL render each category image in the transaction category selector root tabs and child cards with 2px internal padding. The system SHALL render each category image in report category breakdown rows with 4px internal padding. The Avatar root dimensions, category image source, category selection behavior, and report row interactions SHALL remain unchanged.

#### Scenario: View transaction categories with images

- **WHEN** a user opens the transaction category selector containing root and child categories with image URLs
- **THEN** every displayed category image SHALL have 2px internal padding inside its existing Avatar box

#### Scenario: View report category summaries with images

- **WHEN** a user views a report category breakdown containing a category summary with an image URL
- **THEN** the displayed category image SHALL have 4px internal padding inside its existing Avatar box

#### Scenario: View a report category summary without an image

- **WHEN** a user views a report category summary with no image URL
- **THEN** the system SHALL retain the existing chart fallback icon and SHALL NOT require image padding for that fallback

<!-- @trace
source: add-category-icon-padding
updated: 2026-08-31
code:
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-tablet-dark-chromium-darwin.png
  - apps/web/src/components/layout/header.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-mobile-dark-chromium-darwin.png
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-tablet-dark-chromium-darwin.png
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web/src/components/calendar/MonthGrid.tsx
  - apps/web/src/pages/onboarding/index.tsx
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/src/pages/login.tsx
  - apps/web/scripts/process-banner-assets.mjs
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/accountBookSettings/AccountBookNavHeader.tsx
  - apps/web/src/components/TransactionModal/amountInputStyles.ts
  - apps/web/src/components/settlement/SettlementMarkdownModal.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-tablet-dark-chromium-darwin.png
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/src/components/transaction/TransactionHero.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/components/onboarding/StepShell.tsx
  - apps/web/src/components/ui/TagInput.tsx
  - apps/web/PRODUCT.md
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-mobile-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-tablet-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-tablet-dark-chromium-darwin.png
  - apps/web/src/components/accountBookSettings/AccountBookForm.tsx
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - docs/superpowers/specs/2026-08-30-calendar-width-and-touch-target-design.md
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-tablet-light-chromium-darwin.png
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/components/onboarding/OnboardingWelcomeModal.tsx
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web-e2e/src/helpers/onboarding.ts
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/components/categorySettings/SubCategoryItem.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-mobile-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-tablet-light-chromium-darwin.png
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/DESIGN.md
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-mobile-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-mobile-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-tablet-dark-chromium-darwin.png
  - apps/web/public/images/ui/duoji-banner-background.webp
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-mobile-dark-chromium-darwin.png
  - apps/web/src/components/categorySettings/AddCategoryModal.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-mobile-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-mobile-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-tablet-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-tablet-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-tablet-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-tablet-light-chromium-darwin.png
  - apps/web/src/components/calendar/WeekStrip.tsx
  - apps/web/src/components/onboarding/OnboardingTutorial.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-mobile-light-chromium-darwin.png
  - apps/web/src/components/TransactionModal/PaidByDetailModal.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-mobile-dark-chromium-darwin.png
  - apps/web/src/components/onboarding/AccountBookStep.tsx
  - apps/web/src/components/onboarding/LanguageStep.tsx
  - apps/web/src/components/report/MemberFilterSelector.tsx
  - apps/web/src/pages/styles.css
  - apps/web/src/components/TransactionModal/formControlStyles.ts
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-mobile-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-tablet-dark-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-mobile-light-chromium-darwin.png
  - apps/web/src/components/calendar/TransactionCalendar.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-mobile-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-tablet-dark-chromium-darwin.png
  - apps/web/src/components/ui/AppButton.tsx
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-mobile-light-chromium-darwin.png
  - apps/web/.impeccable/design.json
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/onboarding/EntryShell.tsx
  - apps/web/src/components/settlement/settlementModalStyles.ts
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/.impeccable/live/config.json
  - apps/web/src/components/categorySettings/DeleteConfirmModal.tsx
  - apps/web/tailwind.config.js
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-category-tablet-light-chromium-darwin.png
  - apps/web/src/components/report/TagFilterSelector.tsx
  - apps/web/src/components/ui/SurfaceCard.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settings-mobile-light-chromium-darwin.png
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/report-populated-trend-mobile-dark-chromium-darwin.png
  - apps/web/src/components/TransactionModal/CategorySelector.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/onboarding-tablet-light-chromium-darwin.png
  - apps/web/src/components/TransactionModal/SplitDetailModal.tsx
  - apps/web/src/components/categorySettings/CategoryGroupItem.tsx
  - apps/web/public/images/ui/duoji-banner-travel.webp
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/transaction-narrow-light-chromium-darwin.png
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/pages/index.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-mobile-light-chromium-darwin.png
  - docs/superpowers/specs/2026-08-30-transaction-hero-parallax-design.md
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-tablet-light-chromium-darwin.png
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/login-mobile-dark-chromium-darwin.png
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/ui/PageScaffold.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/settlement-tablet-dark-chromium-darwin.png
  - apps/web/src/components/onboarding/ProfileStep.tsx
  - apps/web/src/components/TransactionModal/DetailBalanceNotice.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
tests:
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/routeFamilyVisualContract.spec.ts
  - apps/web/specs/transactionCalendarPresentation.spec.tsx
  - apps/web/specs/transactionSurfacePresentation.spec.tsx
  - apps/web/specs/categoryMemberPresentation.spec.tsx
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/onboardingPresentation.spec.tsx
  - apps/web-e2e/src/transaction-modal-mobile.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/bannerAssets.spec.ts
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
  - apps/web-e2e/src/ui-visual-regression.spec.ts
  - apps/web/specs/reportChartsPresentation.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/settlementModals.spec.tsx
  - apps/web/specs/AppButton.spec.tsx
  - apps/web/specs/categoryTransactionsModalPresentation.spec.tsx
  - apps/web/specs/visualPrimitives.spec.tsx
  - apps/web/specs/transactionHero.spec.tsx
-->