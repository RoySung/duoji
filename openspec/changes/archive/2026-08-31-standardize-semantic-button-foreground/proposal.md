## Why

Filled semantic buttons currently receive foreground colors from scattered HeroUI defaults and component-local classes. This has already produced unreadable dark text on a saturated transaction action; a shared rule is needed so every primary, destructive, and success action remains legible without turning light secondary actions into white text.

## What Changes

- Define application-wide semantic button foreground rules for solid primary, danger, and success actions in both light and dark themes.
- Add an application-owned `AppButton` primitive that makes solid, flat, ghost, and light button treatments explicit while retaining HeroUI behavior and accessibility.
- Migrate the transaction modal's primary and destructive actions plus shared confirmation actions to the primitive.
- Add regression coverage for computed foreground colors and light-versus-solid button treatment.

## Capabilities

### New Capabilities

- `semantic-button-styling`: Consistent, accessible foreground treatment for semantic application buttons.

### Modified Capabilities

(none)

## Impact

- Affected specs: semantic-button-styling (new)
- Affected code:
  - Modified: apps/web/tailwind.config.js
  - Modified: apps/web/src/components/TransactionModal/TransactionModal.tsx
  - Modified: apps/web/src/components/categorySettings/DeleteConfirmModal.tsx
  - Modified: apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - Modified: apps/web/src/components/ui/button.tsx
  - Modified: apps/web/specs/visualPrimitives.spec.tsx
  - Modified: apps/web-e2e/src/transaction-modal-mobile.spec.ts
  - New: apps/web/src/components/ui/AppButton.tsx
  - New: apps/web/specs/AppButton.spec.tsx
