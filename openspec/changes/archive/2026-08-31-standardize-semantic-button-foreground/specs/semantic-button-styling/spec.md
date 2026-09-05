## ADDED Requirements

### Requirement: Solid semantic buttons use an accessible shared foreground

The web application SHALL render the labels and icons of solid primary, danger, and success buttons in white in both light and dark themes. Each corresponding solid fill SHALL provide a contrast ratio of at least 4.5:1 against white at normal button-label size. The warning semantic button SHALL retain a dark foreground when its fill does not meet that threshold with white.

#### Scenario: Render a solid primary action in either theme

- **WHEN** a primary save or create action renders as a solid button in light or dark theme
- **THEN** its computed foreground color SHALL be `rgb(255, 255, 255)`
- **THEN** its semantic fill SHALL provide at least 4.5:1 contrast against that foreground

#### Scenario: Render a solid destructive action in either theme

- **WHEN** a delete or destructive confirmation action renders as a solid danger button in light or dark theme
- **THEN** its computed foreground color SHALL be `rgb(255, 255, 255)`
- **THEN** its semantic fill SHALL provide at least 4.5:1 contrast against that foreground

#### Scenario: Render a warning action

- **WHEN** a warning button renders with the warning semantic color
- **THEN** it SHALL retain a readable dark foreground rather than forcing white text

### Requirement: Application button treatments communicate semantic intent

The application SHALL provide an `AppButton` primitive with semantic tones `primary`, `danger`, `success`, `warning`, and `neutral`, and appearances `solid`, `flat`, `light`, and `ghost`. It SHALL forward HeroUI button behavior for disabled, loading, keyboard focus, press events, accessibility attributes, and supplied test identifiers.

#### Scenario: Use a solid semantic AppButton

- **WHEN** a feature renders `AppButton` with `appearance="solid"` and tone `primary`, `danger`, or `success`
- **THEN** it SHALL use the shared solid semantic fill and white foreground treatment
- **THEN** existing button handlers and disabled state SHALL remain unchanged

#### Scenario: Use a non-solid AppButton

- **WHEN** a feature renders `AppButton` with `appearance="flat"`, `light`, or `ghost`
- **THEN** it SHALL use the corresponding non-solid treatment with a readable dark foreground
- **THEN** it SHALL NOT inherit the white foreground reserved for solid semantic actions

#### Scenario: Render a disabled solid AppButton

- **WHEN** a solid primary, danger, or success `AppButton` is disabled
- **THEN** it SHALL remain non-interactive
- **THEN** its label foreground SHALL remain white

### Requirement: High-visibility transaction and deletion actions adopt the shared primitive

The transaction modal save/create action, transaction deletion actions, category deletion confirmation, and account-book deletion confirmation SHALL use `AppButton` with their current semantic tone and appearance. Their labels, enabled rules, dialog lifecycle, and associated persistence behavior SHALL remain unchanged.

#### Scenario: Save an invalid transaction

- **WHEN** a user opens a new transaction modal before all existing validation requirements are met
- **THEN** the solid primary create action SHALL be disabled with a white label
- **THEN** the action SHALL remain disabled until the existing validation conditions are satisfied

#### Scenario: Confirm deletion

- **WHEN** a user opens a transaction, category, or account-book deletion confirmation
- **THEN** the destructive confirmation action SHALL render as a solid danger `AppButton` with a white label
- **THEN** the cancellation action SHALL retain its existing non-solid readable treatment
