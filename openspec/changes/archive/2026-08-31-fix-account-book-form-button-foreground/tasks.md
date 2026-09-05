## 1. Shared account-book form actions

- [x] 1.1 Use AppButton for shared account-book form actions in apps/web/src/components/accountBookSettings/AccountBookForm.tsx so both create and edit save actions use solid primary white-foreground treatment, and the optional cancel action retains neutral light treatment; verify with the focused account-book settings suite.

## 2. Regression verification

- [x] 2.1 Verify the account-book form at the shared component boundary and Application button treatments communicate semantic intent by asserting its save action preserves primary-solid, disabled, and loading behavior in apps/web/specs/accountBookSettings.spec.tsx; verify with pnpm --filter web test -- accountBookSettings.spec.tsx.
- [x] 2.2 Run the web lint target and Spectra analysis to verify Use AppButton for shared account-book form actions has no new static-analysis or specification findings.
