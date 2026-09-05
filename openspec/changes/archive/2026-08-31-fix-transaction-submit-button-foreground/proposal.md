## Why

The transaction modal's primary submit button renders dark text over its dark teal surface, reducing contrast and contradicting the intended white foreground treatment.

## What Changes

- Ensure the create and save controls in the transaction modal render white label text whenever they use the primary visual treatment, including when submission is unavailable.
- Add a regression check that verifies the primary submit control's rendered foreground color.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `transactions`: The transaction modal's primary submission control must retain a white foreground over the primary surface.

## Impact

- Affected code:
  - Modified: apps/web/src/components/TransactionModal/TransactionModal.tsx
  - Modified: apps/web-e2e/src/transaction-modal-mobile.spec.ts
