## ADDED Requirements

### Requirement: First-time users are routed into the onboarding flow

The system SHALL route the user to the onboarding flow on application start when `Settings.onboardingCompleted` is `false` and no account book exists in local persistence. Users with `onboardingCompleted: true`, or with at least one existing account book, SHALL NOT be routed into onboarding automatically.

#### Scenario: New user lands on onboarding

- **WHEN** a user opens the application, `Settings.onboardingCompleted` is `false`, and no account books exist
- **THEN** the system SHALL replace the current route with the onboarding entry route

#### Scenario: Returning user is not redirected

- **WHEN** a user opens the application and `Settings.onboardingCompleted` is `true`
- **THEN** the system SHALL NOT redirect to the onboarding flow regardless of account book count

### Requirement: Onboarding flow consists of five sequential steps

The system SHALL present the onboarding flow as five steps in this order: (1) language selection, (2) create the first account book, (3) tutorial for creating a transaction, (4) tutorial for splitting transactions (settlement), (5) tutorial for viewing reports. Steps SHALL be advanced explicitly by the user.

#### Scenario: Advance through steps in order

- **WHEN** a user completes the current onboarding step
- **THEN** the system SHALL advance to the next step in the defined order, and SHALL NOT allow skipping intermediate steps when advancing

#### Scenario: Step 1 sets the language

- **WHEN** a user picks a language in step 1 and confirms
- **THEN** the system SHALL persist the chosen language to `Settings` and proceed to step 2

#### Scenario: Step 2 creates the first account book

- **WHEN** a user submits a valid account book name and currency in step 2
- **THEN** the system SHALL create the account book, seed default categories localized to the active language, and proceed to step 3

### Requirement: Tutorial steps overlay coachmarks on real pages

The system SHALL render tutorial steps 3, 4, and 5 as coachmark overlays on the real transactions, settlement, and reports pages of the user's first account book. Tutorial steps SHALL NOT render against mock or sandbox data.

#### Scenario: Tutorial highlights live UI

- **WHEN** the system enters tutorial step 3, 4, or 5
- **THEN** the system SHALL navigate to the corresponding real page (transactions, settlement, or reports) for the user's first account book and SHALL display a coachmark anchored to a stable element on that page

### Requirement: Each onboarding step can be skipped

The system SHALL provide a "skip" control on every onboarding step. Activating skip SHALL advance the flow to the next step without performing the step's action, except that step 2 cannot be skipped because at least one account book is required for the tutorial steps.

#### Scenario: Skip a tutorial step

- **WHEN** a user activates skip on tutorial step 3, 4, or 5
- **THEN** the system SHALL advance to the next step (or complete the flow if on step 5) without requiring the demonstrated action

#### Scenario: Step 2 is mandatory

- **WHEN** a user is on step 2 and attempts to skip
- **THEN** the system SHALL NOT advance until the user creates an account book

### Requirement: Onboarding completion is recorded

The system SHALL set `Settings.onboardingCompleted` to `true` when the user finishes step 5 or skips out of the final tutorial. After completion, the system SHALL NOT route the user back into onboarding automatically.

#### Scenario: Mark complete after final step

- **WHEN** a user completes or skips step 5
- **THEN** the system SHALL set `Settings.onboardingCompleted` to `true` and navigate to the user's first account book home view
