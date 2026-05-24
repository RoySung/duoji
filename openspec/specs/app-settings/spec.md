# app-settings Specification

## Purpose

TBD - created by archiving change 'add-i18n-and-onboarding'. Update Purpose after archive.

## Requirements

### Requirement: Application maintains a persistent Settings record

The system SHALL persist a single `Settings` record locally containing the user's `language` (`en-US` or `zh-TW`), an `onboardingCompleted` boolean, and an `updatedAt` timestamp. The record SHALL survive page reloads and SHALL be the authoritative source of these preferences for the running session.

#### Scenario: Persist settings across reloads

- **WHEN** a user changes their language preference and reloads the application
- **THEN** the system SHALL load the previously saved language as the active locale on startup

#### Scenario: Settings is a single record

- **WHEN** the system reads the settings store
- **THEN** the system SHALL return exactly one `Settings` record (creating it on first access if absent)


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
### Requirement: Settings store is hydrated before any locale-dependent UI renders

The system SHALL complete `Settings` hydration during application bootstrap before rendering any UI that depends on the active locale, so users do not see a flash of the wrong language.

#### Scenario: Bootstrap order

- **WHEN** the application starts
- **THEN** the system SHALL hydrate the `Settings` store before mounting the i18n provider that wraps the page tree


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
### Requirement: Existing users with prior data skip onboarding on first upgrade

The system SHALL set `onboardingCompleted` to `true` when initializing `Settings` for the first time if at least one account book already exists in local persistence, so users who already use the app are not interrupted by the onboarding flow after upgrading.

#### Scenario: Upgrade with existing account book

- **WHEN** the application starts for the first time after this change ships, no `Settings` record exists, and at least one account book is present in local persistence
- **THEN** the system SHALL create the `Settings` record with `onboardingCompleted: true`

#### Scenario: Fresh install with no data

- **WHEN** the application starts for the first time after this change ships, no `Settings` record exists, and no account books are present
- **THEN** the system SHALL create the `Settings` record with `onboardingCompleted: false`


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
### Requirement: Settings page exposes language selection

The system SHALL expose a language selector on the settings page that updates the active locale immediately.

#### Scenario: Change language from settings

- **WHEN** a user selects a different language in the settings page
- **THEN** the system SHALL persist the change to `Settings`, update the active locale, and re-render the visible UI in the new locale

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