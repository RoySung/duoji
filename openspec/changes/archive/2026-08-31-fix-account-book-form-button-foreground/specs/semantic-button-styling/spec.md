## MODIFIED Requirements

### Requirement: Application button treatments communicate semantic intent

The application SHALL provide an `AppButton` primitive with semantic tones `primary`, `danger`, `success`, `warning`, and `neutral`, and appearances `solid`, `flat`, `light`, and `ghost`. It SHALL forward HeroUI button behavior for disabled, loading, keyboard focus, press events, accessibility attributes, and supplied test identifiers. Shared account-book form actions SHALL use this primitive: save uses a solid primary treatment and the optional cancel uses a neutral light treatment.

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

#### Scenario: Render an account-book form save action

- **WHEN** a user opens either the create or edit account-book form
- **THEN** its save action SHALL use the solid primary `AppButton` treatment
- **THEN** its optional cancel action SHALL use the neutral light `AppButton` treatment
