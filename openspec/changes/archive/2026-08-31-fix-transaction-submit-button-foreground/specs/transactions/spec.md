## ADDED Requirements

### Requirement: Transaction submission controls use a readable primary foreground

The transaction modal's primary create and save controls SHALL render their text in white over the primary surface, including while validation or submission state leaves the control disabled. The controls SHALL retain their existing localized label, disabled behavior, and submission behavior.

#### Scenario: Open a new transaction modal before all required values are valid

- **WHEN** a user opens the transaction modal and the primary create control is disabled
- **THEN** the control's label SHALL render in white over its primary surface
- **THEN** the control SHALL remain disabled until the existing validation conditions are met

#### Scenario: Save an editable transaction

- **WHEN** a user opens an existing transaction in edit mode
- **THEN** the primary save control's label SHALL render in white over its primary surface
- **THEN** activating an enabled control SHALL preserve the existing save workflow
