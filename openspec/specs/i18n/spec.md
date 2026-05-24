# i18n Specification

## Purpose

TBD - created by archiving change 'add-i18n-and-onboarding'. Update Purpose after archive.

## Requirements

### Requirement: Application supports en-US and zh-TW locales

The system SHALL provide user-facing strings in English (`en-US`) and Traditional Chinese (`zh-TW`) and SHALL render every visible string through the i18n message catalog rather than as a hard-coded literal.

#### Scenario: Render UI in the active locale

- **WHEN** the application renders a screen with the active locale set to `zh-TW`
- **THEN** every visible label, button, helper text, and error message SHALL come from the `zh-TW` message catalog

#### Scenario: Fallback to English for missing keys

- **WHEN** a key is not present in the `zh-TW` catalog
- **THEN** the system SHALL render the value from the `en-US` catalog and SHALL NOT display the raw key


<!-- @trace
source: add-i18n-and-onboarding
updated: 2026-05-11
code:
  - apps/web/src/components/onboarding/TransactionTutorial.tsx
  - apps/web/src/components/onboarding/LanguageStep.tsx
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/onboarding/StepShell.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/repositories/settingsRepo/index.ts
  - apps/web/src/constants/defaultCategories.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/package.json
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/onboarding/SplitTutorial.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/i18n/__mocks__/next-intl.ts
  - apps/web/src/repositories/settingsRepo/settingsLocalRepo.ts
  - apps/web/jest.config.ts
  - apps/web/src/stores/settings/settingsStore.ts
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/entities/settings.ts
  - apps/web/src/stores/settings/index.ts
  - apps/web/test-setup.ts
  - apps/web/src/i18n/config.ts
  - apps/web/src/components/onboarding/OnboardingTutorial.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/components/onboarding/ReportTutorial.tsx
  - apps/web/src/components/accountBookSettings/AccountBookForm.tsx
  - apps/web/src/stores/settings/settingsStoreProvider.tsx
  - apps/web/tsconfig.json
  - apps/web/src/components/onboarding/LedgerStep.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/pages/onboarding/index.tsx
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/pages/_app.tsx
  - apps/web/next.config.js
tests:
  - apps/web-e2e/src/onboarding.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/src/stores/settings/settingsStore.test.ts
  - apps/web/src/constants/defaultCategories.test.ts
  - apps/web/specs/homeTransactions.spec.tsx
-->

---
### Requirement: Locale changes apply without a full page reload

The system SHALL re-render visible UI strings when the active locale changes, without requiring the user to reload the page or restart the application.

#### Scenario: Switch language in settings

- **WHEN** a user changes the language selector on the settings page from `en-US` to `zh-TW`
- **THEN** the system SHALL persist the new language and re-render the current page in `zh-TW` without a page reload


<!-- @trace
source: add-i18n-and-onboarding
updated: 2026-05-11
code:
  - apps/web/src/components/onboarding/TransactionTutorial.tsx
  - apps/web/src/components/onboarding/LanguageStep.tsx
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/onboarding/StepShell.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/repositories/settingsRepo/index.ts
  - apps/web/src/constants/defaultCategories.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/package.json
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/onboarding/SplitTutorial.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/i18n/__mocks__/next-intl.ts
  - apps/web/src/repositories/settingsRepo/settingsLocalRepo.ts
  - apps/web/jest.config.ts
  - apps/web/src/stores/settings/settingsStore.ts
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/entities/settings.ts
  - apps/web/src/stores/settings/index.ts
  - apps/web/test-setup.ts
  - apps/web/src/i18n/config.ts
  - apps/web/src/components/onboarding/OnboardingTutorial.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/components/onboarding/ReportTutorial.tsx
  - apps/web/src/components/accountBookSettings/AccountBookForm.tsx
  - apps/web/src/stores/settings/settingsStoreProvider.tsx
  - apps/web/tsconfig.json
  - apps/web/src/components/onboarding/LedgerStep.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/pages/onboarding/index.tsx
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/pages/_app.tsx
  - apps/web/next.config.js
tests:
  - apps/web-e2e/src/onboarding.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/src/stores/settings/settingsStore.test.ts
  - apps/web/src/constants/defaultCategories.test.ts
  - apps/web/specs/homeTransactions.spec.tsx
-->

---
### Requirement: Initial locale is auto-detected from the browser on first run

On first application start (no persisted settings), the system SHALL initialize the active locale from `navigator.language`, mapping any value beginning with `zh` (case-insensitive) to `zh-TW` and all other values to `en-US`.

#### Scenario: Detect Traditional Chinese browser

- **WHEN** the application starts for the first time and `navigator.language` is `zh-TW` or `zh-Hant`
- **THEN** the system SHALL set the active locale to `zh-TW`

#### Scenario: Detect non-Chinese browser

- **WHEN** the application starts for the first time and `navigator.language` does not begin with `zh`
- **THEN** the system SHALL set the active locale to `en-US`

<!-- @trace
source: add-i18n-and-onboarding
updated: 2026-05-11
code:
  - apps/web/src/components/onboarding/TransactionTutorial.tsx
  - apps/web/src/components/onboarding/LanguageStep.tsx
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/onboarding/StepShell.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/repositories/settingsRepo/index.ts
  - apps/web/src/constants/defaultCategories.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/package.json
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/onboarding/SplitTutorial.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/i18n/__mocks__/next-intl.ts
  - apps/web/src/repositories/settingsRepo/settingsLocalRepo.ts
  - apps/web/jest.config.ts
  - apps/web/src/stores/settings/settingsStore.ts
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/entities/settings.ts
  - apps/web/src/stores/settings/index.ts
  - apps/web/test-setup.ts
  - apps/web/src/i18n/config.ts
  - apps/web/src/components/onboarding/OnboardingTutorial.tsx
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/components/onboarding/ReportTutorial.tsx
  - apps/web/src/components/accountBookSettings/AccountBookForm.tsx
  - apps/web/src/stores/settings/settingsStoreProvider.tsx
  - apps/web/tsconfig.json
  - apps/web/src/components/onboarding/LedgerStep.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/pages/onboarding/index.tsx
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/pages/_app.tsx
  - apps/web/next.config.js
tests:
  - apps/web-e2e/src/onboarding.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/src/stores/settings/settingsStore.test.ts
  - apps/web/src/constants/defaultCategories.test.ts
  - apps/web/specs/homeTransactions.spec.tsx
-->
