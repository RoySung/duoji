## 1. Deliberate calendar view changes

- [x] 1.1 Update `apps/web/src/pages/account-books/[id]/index.tsx` so the Calendar supports month grid view only through its explicit view-mode control: remove page scroll-wheel and touch pull/swipe transitions while retaining the scroll container ref for Hero parallax. Verify with the `changes the calendar view only through its explicit control` regression test in `apps/web/specs/homeTransactions.spec.tsx` and the full web Jest suite.
