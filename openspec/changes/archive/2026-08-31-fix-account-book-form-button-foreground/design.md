## Context

`AccountBookForm` is shared by the account-book creation and edit routes. Its save and optional cancel actions still instantiate HeroUI `Button` directly, bypassing the semantic foreground safeguard in `AppButton`. HeroUI's disabled slot can override the theme foreground, so a direct primary button does not meet the shared solid-action contract when disabled or loading.

## Goals / Non-Goals

**Goals:**

- Render the shared account-book save action through `AppButton` with the primary solid treatment.
- Preserve the current cancel treatment, interaction callbacks, disabled condition, loading indication, sizing, and layout.
- Add a focused regression assertion for the shared form action mapping.

**Non-Goals:**

- Migrate other direct HeroUI buttons.
- Change account-book validation, labels, persistence, or navigation.
- Change the warning-button foreground exception.

## Decisions

### Use AppButton for shared account-book form actions

The save button will use `AppButton` with its default primary solid treatment, and the optional cancel button will use `AppButton` with the neutral light treatment. This reuses the shared foreground guard, including HeroUI disabled and loading behavior. A one-off `!text-white` class is rejected because it would repeat the original escape hatch instead of adopting the common component.

### Verify the account-book form at the shared component boundary

The existing account-book settings suite will assert that the rendered save action preserves its disabled and loading behavior and receives the shared primary-solid treatment. Since both create and edit routes use this component, this regression check covers both entry points without duplicating route-level tests.

## Implementation Contract

**Behavior:** Both account-book creation and editing SHALL render their shared save action as a solid semantic primary application button. Its label foreground SHALL remain white while disabled or loading. The optional cancel action SHALL retain a readable neutral light appearance.

**Interface:** `AccountBookForm` SHALL continue accepting the same props and invoking `onSubmit` and `onCancel` exactly as before. Its existing validity-derived `isDisabled` and `isSubmitting`-derived `isLoading` props SHALL be forwarded to `AppButton`.

**Failure modes:** Invalid account-book values SHALL continue disabling submission; an in-progress submission SHALL continue exposing the loading state and block duplicate presses. No new error state is introduced.

**Acceptance criteria:** Focused account-book settings tests SHALL pass and confirm the shared save action uses the primary solid treatment while keeping disabled/loading behavior. Type checking or linting for the web project SHALL report no new errors.

**Scope boundaries:** Only the two actions inside the shared account-book form are in scope. The existing `AppButton` implementation and other feature buttons are out of scope.

## Risks / Trade-offs

- [Risk] The wrapper could alter a HeroUI prop mapping. → Mitigation: retain the existing props and assert disabled/loading behavior in the existing form test suite.
