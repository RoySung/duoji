## MODIFIED Requirements

### Requirement: Tutorial steps overlay coachmarks on real pages

The system SHALL render tutorial steps 3, 4, and 5 as coachmark overlays on the real transactions, settlement, and reports pages of the user's first account book. Tutorial steps SHALL NOT render against mock or sandbox data. Step 3 SHALL be presented as a sequence of six sub-step coachmarks that walk the user through the entire transaction creation flow; steps 4 and 5 SHALL each remain a single coachmark.

#### Scenario: Tutorial highlights live UI

- **WHEN** the system enters tutorial step 3, 4, or 5
- **THEN** the system SHALL navigate to the corresponding real page (transactions, settlement, or reports) for the user's first account book and SHALL display a coachmark anchored to a stable element on that page

#### Scenario: Step 3 begins with the create-transaction sub-step

- **WHEN** the system enters tutorial step 3
- **THEN** the system SHALL display the first sub-step coachmark anchored to the "create transaction" button on the transactions page, and SHALL NOT yet open the transaction creation form

### Requirement: Each onboarding step can be skipped

The system SHALL provide a "skip" control on every onboarding step. Activating skip SHALL advance the flow to the next step without performing the step's action, except that step 2 cannot be skipped because at least one account book is required for the tutorial steps. For step 3, the skip control SHALL be available on every sub-step coachmark, and activating skip from any sub-step SHALL exit the entire step 3 and advance to step 4. The system SHALL NOT provide a "skip this sub-step only" control.

#### Scenario: Skip a tutorial step

- **WHEN** a user activates skip on tutorial step 3, 4, or 5
- **THEN** the system SHALL advance to the next step (or complete the flow if on step 5) without requiring the demonstrated action

#### Scenario: Step 2 is mandatory

- **WHEN** a user is on step 2 and attempts to skip
- **THEN** the system SHALL NOT advance until the user creates an account book

#### Scenario: Skip from a step-3 sub-step exits the entire step

- **WHEN** a user activates skip on any sub-step of step 3 (sub-steps 1 through 6)
- **THEN** the system SHALL advance directly to step 4 and SHALL NOT advance to the next sub-step within step 3

## ADDED Requirements

### Requirement: Step 3 walks the user through six transaction-creation sub-steps

The system SHALL drive tutorial step 3 as an ordered sequence of six sub-steps, in this order: (1) tap the create-transaction button, (2) enter the amount, (3) select a category, (4) set the payer, (5) set the split, (6) submit the transaction. Each sub-step SHALL display a coachmark anchored to the relevant UI element with a localized title and description and a skip control.

#### Scenario: Sub-steps appear in defined order

- **WHEN** step 3 begins or a sub-step advances
- **THEN** the system SHALL display the next sub-step coachmark in the order (1) create button → (2) amount → (3) category → (4) payer → (5) split → (6) submit

#### Scenario: Final sub-step completes step 3

- **WHEN** the user advances past sub-step 6 (submit)
- **THEN** the system SHALL exit step 3 and advance to step 4

### Requirement: Step 3 sub-steps advance via user operation, with a fallback "next" button when no completion event exists

The system SHALL advance step-3 sub-steps in response to the user's actual operation on the transaction creation form: pressing the create button advances from sub-step 1 to 2; entering a non-empty amount advances from 2 to 3; submitting the transaction advances from 6 to step 4. For sub-steps where no unambiguous completion event exists (category selection, payer selection, split configuration), the coachmark SHALL also expose a "next" control as a fallback advancement mechanism.

#### Scenario: Pressing the create button advances to the amount sub-step

- **WHEN** the user is on sub-step 1 and presses the create-transaction button
- **THEN** the system SHALL open the transaction creation form and SHALL advance to sub-step 2 (amount)

#### Scenario: Entering an amount advances to the category sub-step

- **WHEN** the user is on sub-step 2 and the amount input contains a non-empty, non-zero value
- **THEN** the system SHALL advance to sub-step 3 (category)

#### Scenario: Fallback next control on sub-steps without a completion event

- **WHEN** the user is on sub-step 3 (category), 4 (payer), or 5 (split)
- **THEN** the coachmark SHALL display a "next" control that, when activated, advances to the following sub-step

#### Scenario: Submitting the transaction completes step 3

- **WHEN** the user is on sub-step 6 and submits the transaction
- **THEN** the system SHALL advance to step 4 and SHALL treat step 3 as completed

### Requirement: Step 3 sub-step coachmarks wait for their anchor to appear, with a timeout fail-open

The system SHALL wait for each step-3 sub-step's anchor element to be present in the DOM before rendering the coachmark, because anchors for sub-steps 2 through 6 live inside the transaction creation form, which is not mounted until the user opens it. The system SHALL apply a wait timeout of no more than 1500 milliseconds per sub-step. If the timeout elapses without the anchor appearing, the system SHALL exit step 3 and advance to step 4 without rendering an error state.

#### Scenario: Anchor appears after the form opens

- **WHEN** the user advances to a sub-step whose anchor is not yet in the DOM, and the anchor appears within 1500 ms
- **THEN** the system SHALL render the sub-step coachmark anchored to that element

#### Scenario: Anchor never appears

- **WHEN** the user advances to a sub-step and the anchor element does not appear within 1500 ms
- **THEN** the system SHALL exit step 3, advance to step 4, and SHALL NOT display an error message

### Requirement: Step 3 does not expand the global onboarding progress display

The system SHALL continue to display onboarding progress as five total steps even while step 3 is internally subdivided. Sub-step transitions within step 3 SHALL NOT change the progress indicator's "current step" value or the route's `?onboarding=` query.

#### Scenario: Progress indicator stays at step 3 during sub-step transitions

- **WHEN** the user advances between any of the six sub-steps within step 3
- **THEN** the progress indicator SHALL continue to read "step 3 of 5" and the route SHALL continue to indicate step 3
