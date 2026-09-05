## 1. Regression Coverage

- [x] 1.1 Verify computed color in the existing mobile transaction-modal flow by adding a failing Playwright assertion in `apps/web-e2e/src/transaction-modal-mobile.spec.ts`: when the new-transaction submission control is disabled, the Transaction submission controls use a readable primary foreground requirement renders `rgb(255, 255, 255)`; verify the focused mobile-webkit test fails before the style correction.

## 2. Button Foreground Correction

- [x] 2.1 Use an explicit foreground utility on the transaction submit button in `apps/web/src/components/TransactionModal/TransactionModal.tsx` so its localized create and save labels remain white without changing `isDisabled` or `onPress`; verify the focused mobile-webkit test and `pnpm test:web -- --runInBand apps/web/specs/homeTransactions.spec.tsx` pass.
