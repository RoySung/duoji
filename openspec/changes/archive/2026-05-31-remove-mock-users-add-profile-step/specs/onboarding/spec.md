## MODIFIED Requirements

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
