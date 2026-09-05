## Why

The account-book form still renders its save action through a direct HeroUI button. In disabled or loading states HeroUI can override the themed foreground, leaving the filled primary action with dark text instead of the established white foreground.

## What Changes

- Route the shared account-book form's save action through the application-owned semantic button component.
- Route the form's optional cancel action through the same component while preserving its existing light appearance.
- Cover both account-book creation and editing, which share this form.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `semantic-button-styling`: Extend shared semantic button adoption to account-book form actions.

## Impact

- Affected code:
  - Modified: apps/web/src/components/accountBookSettings/AccountBookForm.tsx
  - Modified: apps/web/specs/accountBookSettings.spec.tsx
- Affected specs: semantic-button-styling
