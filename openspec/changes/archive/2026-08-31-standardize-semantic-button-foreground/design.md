## Context

The application uses HeroUI `Button` directly in most feature surfaces, while a legacy shadcn-derived button exists but is not the common application entry point. HeroUI's light and dark semantic palettes currently use different foreground assumptions. A local `!text-white` override already fixes the transaction submit action, but other destructive and confirmation actions can still inherit an unsuitable foreground. The existing dark-mode primary CSS token remains intentionally light for text and selected-state uses, so it must not be repurposed as the solid button background.

## Goals / Non-Goals

**Goals:**

- Give solid primary, danger, and success buttons a white foreground in both themes with a background that meets a 4.5:1 normal-text contrast ratio.
- Keep warning, default, flat, ghost, light, and uncolored actions on their contrast-appropriate dark foreground.
- Establish an `AppButton` interface for future application actions without changing HeroUI interaction semantics or accessibility.
- Cover the shared treatment with unit and browser-level regression tests.

**Non-Goals:**

- Replace every existing HeroUI import in one change.
- Make every colored control use white text; warning intentionally keeps a dark foreground.
- Change action labels, enablement rules, persistence, routes, or dialog behavior.
- Alter CSS primary text and selected-state tokens solely to control solid button contrast.

## Decisions

### Configure semantic solid foregrounds in the HeroUI theme

HeroUI's `primary`, `danger`, and `success` defaults will use white foregrounds and dark-enough default fills in both themes. The dark theme will retain its existing light CSS `--primary` token for non-button text and selected states, while HeroUI's button palette will use a separately darker solid default. This gives existing direct HeroUI usages a safe baseline immediately. Changing only component-local classes was rejected because it repeats the original inconsistency.

### Provide AppButton as the application-owned semantic entry point

`AppButton` will wrap HeroUI `Button` and expose semantic `tone` (`primary`, `danger`, `success`, `warning`, `neutral`) and visual `appearance` (`solid`, `flat`, `light`, `ghost`) props. Its mappings will retain HeroUI's keyboard, loading, disabled, and `onPress` behavior. Solid primary, danger, and success actions will receive the semantic theme treatment; warning remains a dark-foreground exception. A second independent button implementation was rejected because it would duplicate HeroUI behavior and widen migration risk.

### Migrate representative transaction and confirmation actions

The transaction modal's save/create and delete actions, category deletion confirmation, and account-book deletion confirmation will switch to `AppButton`. They demonstrate solid primary and danger behavior plus flat cancellation behavior in the screens where the contrast issue is most visible. Existing direct HeroUI buttons outside these flows rely on the shared theme and can migrate opportunistically in later work.

### Verify computed colors and treatment contracts

Unit tests will prove `AppButton` maps each appearance and tone to the intended HeroUI treatment. The browser regression will assert computed white foregrounds for the transaction solid primary and destructive actions. Theme-token assertions will verify light and dark semantic fills keep the required contrast. Class-string-only tests were rejected because they cannot detect CSS cascade regressions.

## Implementation Contract

**Behavior:** Solid primary, danger, and success actions render white labels over their semantic fills in light and dark modes. Warning and all non-solid treatments retain a dark, readable label. Existing action behavior remains unchanged.

**Interface:** `AppButton` accepts HeroUI button props plus `tone` and `appearance`; it forwards the existing accessibility, disabled, loading, event, and test-id props to HeroUI. Feature code uses `tone="danger"` rather than exposing the HeroUI `danger` color string as application vocabulary.

**Failure modes:** A disabled action remains disabled and preserves its foreground treatment. Unsupported custom styling can still be supplied through the existing `className` escape hatch, but it must not be required for the shared semantic foreground behavior.

**Acceptance criteria:** The focused unit suite demonstrates semantic-to-HeroUI mappings; the visual primitive test calculates at least 4.5:1 foreground contrast for solid primary, danger, and success in both themes; the mobile transaction browser test reads `rgb(255, 255, 255)` for the save/create and deletion action labels; existing transaction modal behavior tests remain green.

**Scope boundaries:** This change covers theme-level semantic button fills, the new application primitive, and the listed transaction and deletion confirmation surfaces. It excludes a repository-wide import migration and non-button color changes.

## Risks / Trade-offs

- [Risk] Darkening HeroUI solid defaults can make their dark-mode fill less bright. → Mitigation: preserve the brighter CSS semantic tokens used for text, selected states, and iconography.
- [Risk] HeroUI disabled slots can override a foreground class. → Mitigation: validate the final computed color in the browser for a disabled transaction action.
- [Risk] A wrapper can drift from HeroUI's prop API. → Mitigation: define its props as HeroUI-compatible component props and forward all remaining properties.

## Migration Plan

Deploy the theme and `AppButton` together, then migrate the identified high-visibility actions. The change is reversible by restoring the prior semantic defaults and replacing migrated wrappers with HeroUI `Button`; no data migration is involved.

## Open Questions

None.
