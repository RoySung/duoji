# onboarding Specification

## Purpose

TBD - created by archiving change 'add-i18n-and-onboarding'. Update Purpose after archive.

## Requirements

### Requirement: First-time users are routed into the onboarding flow

The system SHALL route the user to the onboarding flow on application start when `Settings.onboardingCompleted` is `false` and no account book exists in local persistence. Users with `onboardingCompleted: true`, or with at least one existing account book, SHALL NOT be routed into onboarding automatically.

#### Scenario: New user lands on onboarding

- **WHEN** a user opens the application, `Settings.onboardingCompleted` is `false`, and no account books exist
- **THEN** the system SHALL replace the current route with the onboarding entry route

#### Scenario: Returning user is not redirected

- **WHEN** a user opens the application and `Settings.onboardingCompleted` is `true`
- **THEN** the system SHALL NOT redirect to the onboarding flow regardless of account book count


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
### Requirement: Onboarding flow consists of eight sequential steps

The system SHALL present the onboarding flow as nine steps in this order: (1) language selection, (2) user profile setup (name and email), (3) create the first account book, (4) tutorial for editing the account book, (5) tutorial for adding members, (6) tutorial for managing categories, (7) tutorial for creating a transaction, (8) tutorial for splitting transactions (settlement), (9) tutorial for viewing reports. Steps SHALL be advanced explicitly by the user.

#### Scenario: Advance through steps in order

- **WHEN** a user completes the current onboarding step
- **THEN** the system SHALL advance to the next step in the defined order, and SHALL NOT allow skipping intermediate steps when advancing

#### Scenario: Step 1 sets the language

- **WHEN** a user picks a language in step 1 and confirms
- **THEN** the system SHALL persist the chosen language to `Settings` and proceed to step 2

#### Scenario: Step 2 collects the user profile

- **WHEN** a user submits a valid name and email in step 2
- **THEN** the system SHALL create a `RegisteredUser` record in local storage and proceed to step 3

#### Scenario: Step 3 creates the first account book

- **WHEN** a user submits a valid account book name and currency in step 3
- **THEN** the system SHALL create the account book owned by the step-2 user, seed default categories localized to the active language, and proceed to step 4

#### Scenario: Steps 4 through 6 introduce account book management

- **WHEN** a user reaches step 4 after creating an account book
- **THEN** the system SHALL present, in order, the edit-account-book tutorial (step 4), the add-members tutorial (step 5), and the manage-categories tutorial (step 6) before entering the transaction tutorial (step 7)


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
### Requirement: Tutorial steps overlay coachmarks on real pages

The system SHALL render tutorial steps 3 through 8 as coachmark overlays on the real pages of the user's first account book (account book settings for steps 3, 4, and 5; transactions for step 6; settlement for step 7; reports for step 8). Tutorial steps SHALL NOT render against mock or sandbox data. Step 6 SHALL be presented as a sequence of six sub-step coachmarks that walk the user through the entire transaction creation flow; steps 4, 5, 7, and 8 SHALL each remain a single coachmark.

#### Scenario: Tutorial highlights live UI

- **WHEN** the system enters any tutorial step from 3 through 8
- **THEN** the system SHALL navigate to the corresponding real page (account book settings, transactions, settlement, or reports) for the user's first account book and SHALL display a coachmark anchored to a stable element on that page

#### Scenario: Step 6 begins with the create-transaction sub-step

- **WHEN** the system enters tutorial step 6
- **THEN** the system SHALL display the first sub-step coachmark anchored to the "create transaction" button on the transactions page, and SHALL NOT yet open the transaction creation form


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
### Requirement: Each onboarding step can be skipped

The system SHALL provide a "skip" control on every onboarding step. Activating skip SHALL advance the flow to the next step without performing the step's action, except that step 2 cannot be skipped because at least one account book is required for the subsequent tutorial steps. For step 6, the skip control SHALL be available on every sub-step coachmark, and activating skip from any sub-step SHALL exit the entire step 6 and advance to step 7. The system SHALL NOT provide a "skip this sub-step only" control.

#### Scenario: Skip a tutorial step

- **WHEN** a user activates skip on any tutorial step from 3 through 8
- **THEN** the system SHALL advance to the next step (or complete the flow if on step 8) without requiring the demonstrated action

#### Scenario: Step 2 is mandatory

- **WHEN** a user is on step 2 and attempts to skip
- **THEN** the system SHALL NOT advance until the user creates an account book

#### Scenario: Account book management steps do not block transaction tutorial

- **WHEN** a user activates skip on step 3, step 4, or step 5
- **THEN** the system SHALL advance to the next step without blocking eventual entry into the transaction tutorial at step 6

#### Scenario: Skip from a step-6 sub-step exits the entire step

- **WHEN** a user activates skip on any sub-step of step 6 (sub-steps 1 through 6)
- **THEN** the system SHALL advance directly to step 7 and SHALL NOT advance to the next sub-step within step 6


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
### Requirement: Step 6 walks the user through six transaction-creation sub-steps

The system SHALL drive tutorial step 6 as an ordered sequence of six sub-steps, in this order: (1) tap the create-transaction button, (2) enter the amount, (3) select a category, (4) set the payer, (5) set the split, (6) submit the transaction. Each sub-step SHALL display a coachmark anchored to the relevant UI element with a localized title and description and a skip control.

#### Scenario: Sub-steps appear in defined order

- **WHEN** step 6 begins or a sub-step advances
- **THEN** the system SHALL display the next sub-step coachmark in the order (1) create button → (2) amount → (3) category → (4) payer → (5) split → (6) submit

#### Scenario: Final sub-step completes step 6

- **WHEN** the user advances past sub-step 6 (submit)
- **THEN** the system SHALL exit step 6 and advance to step 7

<!-- @trace
source: expand-onboarding-step3-substeps
updated: 2026-05-15
-->

---
### Requirement: Step 6 sub-steps advance via user operation, with a fallback "next" button when no completion event exists

The system SHALL advance step-6 sub-steps in response to the user's actual operation on the transaction creation form: pressing the create button advances from sub-step 1 to 2; entering a non-empty amount advances from 2 to 3; submitting the transaction advances from 6 to step 7. For sub-steps where no unambiguous completion event exists (category selection, payer selection, split configuration), the coachmark SHALL also expose a "next" control as a fallback advancement mechanism.

#### Scenario: Pressing the create button advances to the amount sub-step

- **WHEN** the user is on sub-step 1 and presses the create-transaction button
- **THEN** the system SHALL open the transaction creation form and SHALL advance to sub-step 2 (amount)

#### Scenario: Entering an amount advances to the category sub-step

- **WHEN** the user is on sub-step 2 and the amount input contains a non-empty, non-zero value
- **THEN** the system SHALL advance to sub-step 3 (category)

#### Scenario: Fallback next control on sub-steps without a completion event

- **WHEN** the user is on sub-step 3 (category), 4 (payer), or 5 (split)
- **THEN** the coachmark SHALL display a "next" control that, when activated, advances to the following sub-step

#### Scenario: Submitting the transaction completes step 6

- **WHEN** the user is on sub-step 6 and submits the transaction
- **THEN** the system SHALL advance to step 7 and SHALL treat step 6 as completed

<!-- @trace
source: expand-onboarding-step3-substeps
updated: 2026-05-15
-->

---
### Requirement: Step 6 sub-step coachmarks wait for their anchor to appear, with a timeout fail-open

The system SHALL wait for each step-6 sub-step's anchor element to be present in the DOM before rendering the coachmark, because anchors for sub-steps 2 through 6 live inside the transaction creation form, which is not mounted until the user opens it. The system SHALL apply a wait timeout of no more than 1500 milliseconds per sub-step. If the timeout elapses without the anchor appearing, the system SHALL exit step 6 and advance to step 7 without rendering an error state.

#### Scenario: Anchor appears after the form opens

- **WHEN** the user advances to a sub-step whose anchor is not yet in the DOM, and the anchor appears within 1500 ms
- **THEN** the system SHALL render the sub-step coachmark anchored to that element

#### Scenario: Anchor never appears

- **WHEN** the user advances to a sub-step and the anchor element does not appear within 1500 ms
- **THEN** the system SHALL exit step 6, advance to step 7, and SHALL NOT display an error message

<!-- @trace
source: expand-onboarding-step3-substeps
updated: 2026-05-15
-->

---
### Requirement: Step 6 does not expand the global onboarding progress display

The system SHALL continue to display onboarding progress as eight total steps even while step 6 is internally subdivided. Sub-step transitions within step 6 SHALL NOT change the progress indicator's "current step" value or the route's `?onboarding=` query.

#### Scenario: Progress indicator stays at step 6 during sub-step transitions

- **WHEN** the user advances between any of the six sub-steps within step 6
- **THEN** the progress indicator SHALL continue to read "step 6 of 8" and the route SHALL continue to indicate step 6

<!-- @trace
source: expand-onboarding-step3-substeps
updated: 2026-05-15
-->

---
### Requirement: Onboarding completion is recorded

The system SHALL set `Settings.onboardingCompleted` to `true` when the user finishes step 8 or skips out of the final tutorial. After completion, the system SHALL NOT route the user back into onboarding automatically.

#### Scenario: Mark complete after final step

- **WHEN** a user completes or skips step 8
- **THEN** the system SHALL set `Settings.onboardingCompleted` to `true` and navigate to the user's first account book home view

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
### Requirement: Account book management tutorial steps introduce edit, members, and categories

The system SHALL include three account-book-management tutorial steps in the onboarding flow, presented immediately after the user creates the first account book and before the transaction tutorial. The three steps SHALL be, in order: (a) edit account book, (b) add members, (c) manage categories. Each step SHALL render as a coachmark overlay anchored to a stable element on the real account book settings surface (not on mock data), and each step SHALL introduce the corresponding capability without requiring the user to actually perform the edit, member addition, or category modification.

#### Scenario: Edit account book step highlights the edit entry

- **WHEN** the system enters the edit-account-book tutorial step
- **THEN** the system SHALL navigate to the account book settings surface for the user's first account book and SHALL display a coachmark anchored to the UI element that opens the account book edit form (name and currency)

#### Scenario: Add members step highlights the members entry

- **WHEN** the system enters the add-members tutorial step
- **THEN** the system SHALL display a coachmark anchored to the UI element that lets the user add a member to the account book

#### Scenario: Manage categories step highlights the categories entry

- **WHEN** the system enters the manage-categories tutorial step
- **THEN** the system SHALL display a coachmark anchored to the UI element that opens category management for the account book

#### Scenario: Steps do not require completion of the demonstrated action

- **WHEN** the system is on any of the three account-book-management tutorial steps
- **THEN** the system SHALL allow the user to advance to the next step without requiring the user to actually edit the account book, add a member, or modify a category

<!-- @trace
source: expand-onboarding-account-book-management
updated: 2026-05-15
-->