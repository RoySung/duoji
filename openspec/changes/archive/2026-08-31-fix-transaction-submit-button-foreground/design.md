## Context

The transaction modal uses HeroUI's primary button treatment for its create and save action. The rendered label is dark against the deep-teal primary surface, despite the design system's intended white primary foreground. The correction must be isolated to this submission action and must not alter submission validation or enablement.

## Goals / Non-Goals

**Goals:**

- Render the transaction modal's primary create and save labels in white when the action is enabled or disabled.
- Preserve the existing button semantics, interaction handlers, validation, and disabled state.
- Add a browser-level regression assertion for the rendered foreground color.

**Non-Goals:**

- Change HeroUI's global primary palette or the foreground treatment of unrelated controls.
- Change when a transaction can be created or saved.
- Modify transaction data, persistence, localization, or the modal layout.

## Decisions

### Use an explicit foreground utility on the transaction submit button

The submit button will explicitly apply a white text utility in addition to its existing primary color. This isolates the contrast correction from HeroUI's disabled-state slot styling without changing the shared theme used by other primary buttons. Changing the global primary foreground was rejected because it could modify unrelated components and dark-mode states.

### Verify computed color in the existing mobile transaction-modal flow

The existing mobile Playwright flow already opens the real transaction modal after onboarding. It will assert that the submit control's computed foreground is white. A class-only unit assertion was rejected because it would not prove the final CSS cascade that caused the regression.

## Implementation Contract

**Behavior:** The transaction modal's primary submission control displays its localized create or save label in white over the primary surface, whether the control is currently actionable or disabled.

**Interface and data:** The button retains its current localized label, `color="primary"`, `isDisabled` value, and `onPress` handler. No transaction draft, validation rule, or persistence interface changes.

**Failure behavior:** A disabled submit control remains disabled and non-submitting; only its label foreground changes.

**Acceptance criteria:** The mobile browser regression test opens a new transaction modal and confirms the submission button's computed `color` is `rgb(255, 255, 255)`. The existing mobile modal layout test and targeted web test suite must pass.

**Scope boundaries:** In scope is only the transaction modal's primary create/save button and its focused browser regression coverage. Global HeroUI theme changes, other buttons, and modal behavior are out of scope.

## Risks / Trade-offs

- [Risk] A utility class loses to a high-specificity component disabled selector. → Mitigation: use the browser-computed-color assertion and adjust only the button-local class precedence if necessary.
- [Risk] The rendered button can be disabled in the test fixture. → Mitigation: assert the foreground independently of enablement, which is the required behavior.

## Migration Plan

No data migration or rollout step is required. Reverting the component-local class restores the prior presentation without affecting stored transactions.

## Open Questions

None.
