## ADDED Requirements

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

## RENAMED Requirements

- FROM: `### Requirement: Onboarding flow consists of five sequential steps`
- TO: `### Requirement: Onboarding flow consists of eight sequential steps`

## MODIFIED Requirements

### Requirement: Onboarding flow consists of eight sequential steps

The system SHALL present the onboarding flow as eight steps in this order: (1) language selection, (2) create the first account book, (3) tutorial for editing the account book, (4) tutorial for adding members, (5) tutorial for managing categories, (6) tutorial for creating a transaction, (7) tutorial for splitting transactions (settlement), (8) tutorial for viewing reports. Steps SHALL be advanced explicitly by the user.

#### Scenario: Advance through steps in order

- **WHEN** a user completes the current onboarding step
- **THEN** the system SHALL advance to the next step in the defined order, and SHALL NOT allow skipping intermediate steps when advancing

#### Scenario: Step 1 sets the language

- **WHEN** a user picks a language in step 1 and confirms
- **THEN** the system SHALL persist the chosen language to `Settings` and proceed to step 2

#### Scenario: Step 2 creates the first account book

- **WHEN** a user submits a valid account book name and currency in step 2
- **THEN** the system SHALL create the account book, seed default categories localized to the active language, and proceed to step 3

#### Scenario: Steps 3 through 5 introduce account book management

- **WHEN** a user reaches step 3 after creating an account book
- **THEN** the system SHALL present, in order, the edit-account-book tutorial (step 3), the add-members tutorial (step 4), and the manage-categories tutorial (step 5) before entering the transaction tutorial (step 6)

### Requirement: Tutorial steps overlay coachmarks on real pages

The system SHALL render tutorial steps 3 through 8 as coachmark overlays on the real pages of the user's first account book (account book settings for steps 3, 4, and 5; transactions for step 6; settlement for step 7; reports for step 8). Tutorial steps SHALL NOT render against mock or sandbox data.

#### Scenario: Tutorial highlights live UI

- **WHEN** the system enters any tutorial step from 3 through 8
- **THEN** the system SHALL navigate to the corresponding real page (account book settings, transactions, settlement, or reports) for the user's first account book and SHALL display a coachmark anchored to a stable element on that page

### Requirement: Each onboarding step can be skipped

The system SHALL provide a "skip" control on every onboarding step. Activating skip SHALL advance the flow to the next step without performing the step's action, except that step 2 cannot be skipped because at least one account book is required for the subsequent tutorial steps.

#### Scenario: Skip a tutorial step

- **WHEN** a user activates skip on any tutorial step from 3 through 8
- **THEN** the system SHALL advance to the next step (or complete the flow if on step 8) without requiring the demonstrated action

#### Scenario: Step 2 is mandatory

- **WHEN** a user is on step 2 and attempts to skip
- **THEN** the system SHALL NOT advance until the user creates an account book

#### Scenario: Account book management steps do not block transaction tutorial

- **WHEN** a user activates skip on step 3, step 4, or step 5
- **THEN** the system SHALL advance to the next step without blocking eventual entry into the transaction tutorial at step 6

### Requirement: Onboarding completion is recorded

The system SHALL set `Settings.onboardingCompleted` to `true` when the user finishes step 8 or skips out of the final tutorial. After completion, the system SHALL NOT route the user back into onboarding automatically.

#### Scenario: Mark complete after final step

- **WHEN** a user completes or skips step 8
- **THEN** the system SHALL set `Settings.onboardingCompleted` to `true` and navigate to the user's first account book home view
