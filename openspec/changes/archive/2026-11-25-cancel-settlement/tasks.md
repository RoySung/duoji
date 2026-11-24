## 1. Cancel settlements

- [x] 1.1 Implement atomic cancellation so users can soft-delete a settlement record and reopen linked expenses. Verify eligibility, repeated requests, isolation, rollback, and saving stale expense edits with IndexedDB tests.
- [x] 1.2 [after: 1.1] Add detail page confirmation with localized messaging and return to the unsettled view after success. Verify dismissal, success navigation, and failure feedback in settlement detail page tests.
- [x] 1.3 [after: 1.2] Serialize settlement creation with cancellation, refresh open settlement views after cancellation, and align the cancellation button with the system’s destructive actions. Verify concurrent writes, updates without remounting, and the button in desktop and mobile layouts.
