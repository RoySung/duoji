## 1. Shared Semantic Button Foundation

- [x] [P] 1.1 Configure semantic solid foregrounds in the HeroUI theme so solid primary, danger, and success buttons use white labels over fills that meet 4.5:1 contrast in light and dark mode while warning remains dark-foreground; verify the updated `apps/web/specs/visualPrimitives.spec.tsx` contrast assertions with `pnpm test:web -- --runInBand apps/web/specs/visualPrimitives.spec.tsx`.
- [x] [P] 1.2 Provide AppButton as the application-owned semantic entry point, mapping `tone` and `appearance` to HeroUI without changing forwarded disabled, loading, keyboard, press, ARIA, or test-id behavior; verify the `apps/web/specs/AppButton.spec.tsx` treatment and prop-forwarding cases with `pnpm test:web -- --runInBand apps/web/specs/AppButton.spec.tsx`.

## 2. Adopt and Verify the Shared Treatment

- [x] 2.1 Migrate representative transaction and confirmation actions so transaction save/create and destructive actions, category deletion, and account-book deletion use `AppButton` with the existing labels, dialog lifecycle, enabled rules, and non-solid cancellation treatment; verify relevant modal and transaction unit suites with `pnpm test:web -- --runInBand apps/web/specs/transactionSurfacePresentation.spec.tsx apps/web/specs/homeTransactions.spec.tsx`.
- [x] 2.2 Verify computed colors and treatment contracts by extending `apps/web-e2e/src/transaction-modal-mobile.spec.ts` to read white foregrounds from disabled primary and destructive transaction actions, then run the focused mobile browser test and `pnpm lint:web`; this completes Solid semantic buttons use an accessible shared foreground, Application button treatments communicate semantic intent, and High-visibility transaction and deletion actions adopt the shared primitive.
