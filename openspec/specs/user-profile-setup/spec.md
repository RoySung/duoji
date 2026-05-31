# user-profile-setup Specification

## Purpose

TBD - created by archiving change 'remove-mock-users-add-profile-step'. Update Purpose after archive.

## Requirements

### Requirement: User creates a profile during onboarding before the first account book

During first-time onboarding, the system SHALL present a profile setup step that collects the user's name and email address. The system SHALL persist this information as a `RegisteredUser` record in local storage before the account book creation step. The system SHALL NOT allow the user to proceed to account book creation without a valid name and email.

#### Scenario: Valid profile is submitted

- **WHEN** the user enters a non-empty name and a valid email address and submits the profile form
- **THEN** the system SHALL create a `RegisteredUser` record in `db.users` with the given name, email, a generated UUID as `id`, an avatar URL derived from the name via `ui-avatars.com`, and `createdAt`/`updatedAt` timestamps set to the current time
- **THEN** the system SHALL advance to the account book creation step, passing the newly created user's ID as the account book owner

#### Scenario: Profile submission is blocked when name is empty

- **WHEN** the user leaves the name field empty and attempts to submit
- **THEN** the system SHALL NOT create a user record or advance to the next step
- **THEN** the system SHALL display an error notification indicating that name and email are required

#### Scenario: Profile submission is blocked when email is invalid

- **WHEN** the user enters a non-empty name but an email that does not match a standard email format, and attempts to submit
- **THEN** the system SHALL NOT create a user record or advance to the next step
- **THEN** the system SHALL display an error notification indicating that a valid email is required

#### Scenario: Profile step is skipped for returning users

- **WHEN** the user opens the application and `Settings.onboardingCompleted` is `true`
- **THEN** the system SHALL NOT display the profile setup step
- **THEN** the system SHALL route directly to the user's existing account book


<!-- @trace
source: remove-mock-users-add-profile-step
updated: 2026-05-31
code:
  - apps/web/src/components/onboarding/ManageCategoriesTutorial.tsx
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/components/onboarding/ReportTutorial.tsx
  - apps/web/src/components/onboarding/LanguageStep.tsx
  - apps/web/src/components/onboarding/TransactionTutorial.tsx
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/components/onboarding/LedgerStep.tsx
  - apps/web/src/components/onboarding/SplitTutorial.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/entities/user.ts
  - apps/web/specs/fixtures/index.ts
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/pages/onboarding/index.tsx
  - apps/web/src/utils/accountBookUtils.ts
  - apps/web/src/components/onboarding/AddMemberTutorial.tsx
  - apps/web/src/components/onboarding/EditAccountBookTutorial.tsx
  - apps/web/src/repositories/userRepo/userLocalRepo.ts
  - apps/web/src/components/onboarding/OnboardingTutorial.tsx
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/components/onboarding/ProfileStep.tsx
  - apps/web/src/mocks/user.ts
tests:
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/category.spec.ts
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/userStore.spec.ts
  - apps/web-e2e/src/onboarding.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
-->

---
### Requirement: Account book owner is set to the profile-step user

The system SHALL use the `RegisteredUser` created in the profile step as the sole owner of the first account book. The account book's `ownerId` and `userIds` array SHALL both reference the profile-step user's ID. The system SHALL NOT use any hardcoded or mock user ID as the account book owner.

#### Scenario: Account book is created with real user as owner

- **WHEN** the user completes the profile step and then creates the first account book
- **THEN** the created account book SHALL have `ownerId` equal to the profile-step user's `id`
- **THEN** the created account book SHALL have `userIds` equal to `[profile-step-user-id]`

#### Scenario: No mock users exist after fresh install

- **WHEN** the application is launched for the first time on a clean install
- **THEN** `db.users` SHALL contain zero records before the profile step is completed
- **THEN** `db.users` SHALL contain exactly one record after the profile step is completed

<!-- @trace
source: remove-mock-users-add-profile-step
updated: 2026-05-31
code:
  - apps/web/src/components/onboarding/ManageCategoriesTutorial.tsx
  - apps/web/src/i18n/messages/en-US.json
  - apps/web/src/components/onboarding/ReportTutorial.tsx
  - apps/web/src/components/onboarding/LanguageStep.tsx
  - apps/web/src/components/onboarding/TransactionTutorial.tsx
  - apps/web/src/i18n/messages/zh-TW.json
  - apps/web/src/components/onboarding/LedgerStep.tsx
  - apps/web/src/components/onboarding/SplitTutorial.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/entities/user.ts
  - apps/web/specs/fixtures/index.ts
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/pages/onboarding/index.tsx
  - apps/web/src/utils/accountBookUtils.ts
  - apps/web/src/components/onboarding/AddMemberTutorial.tsx
  - apps/web/src/components/onboarding/EditAccountBookTutorial.tsx
  - apps/web/src/repositories/userRepo/userLocalRepo.ts
  - apps/web/src/components/onboarding/OnboardingTutorial.tsx
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/components/onboarding/ProfileStep.tsx
  - apps/web/src/mocks/user.ts
tests:
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/category.spec.ts
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/userStore.spec.ts
  - apps/web-e2e/src/onboarding.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
-->