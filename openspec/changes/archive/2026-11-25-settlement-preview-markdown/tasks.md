## 1. Settlement overview and Markdown

- [x] 1.1 Implement Reviewed settlement data so the User can review a settlement before creating the record. Derive one preview through the settlement hook and show its eligible expense count and expandable details in the existing confirmation dialog with balances, transfers, and Shared Wallet summary. Cover expense eligibility, detail fields, rounding, and Shared Wallet data in the settlement page test.
- [x] 1.2 Implement Markdown draft download so the User can download a Markdown settlement draft before creating the record. Use the displayed preview, localize the action and draft content, and show download failures in the open dialog. Verify filename, timestamp, UTF-8 content, delimiter handling, parity with the overview under both rounding settings, and unchanged expense links in formatter and page tests. Run the historical Markdown tests to verify output compatibility. [after: 1.1]

## 2. Confirmation and regression checks

- [x] 2.1 Implement Confirmation against current expenses at the repository boundary. A guarded creation SHALL compare the entire account book's current eligible set against the preview and reject staleness atomically, while preserving current repository callers. Extend the settlement repository tests for an added expense, a same-ID edit, an expense removed or settled elsewhere, and an unchanged preview that links the reviewed expenses.
- [x] 2.2 Ensure Settlement creation requires confirmation of current review data. Wire the page and hook to save the reviewed unrounded values through guarded creation, refresh and announce stale reviews, and disable actions when the updated preview is empty. In the settlement page test, induce a same-count split edit before save, verify that the stale attempt writes nothing, and verify that a new confirmation saves the replacement preview. Also verify the empty-preview and ordinary save-error paths. [after: 1.2, 2.1]
- [x] 2.4 Recheck the persisted Shared Wallet member inputs atomically with expenses and refresh the review on membership changes. Verify that adding a third member during confirmation leaves the expense unsettled and that a second confirmation saves both wallet repayments. [after: 2.2]

## 3. Copyable Markdown draft

Task history: The inline expense details completed in 1.1 move to the Markdown draft. The download behavior completed in 1.2 and the pending download checks in 2.3 are superseded by the Copyable Markdown draft preview decision. Tasks 3.1 and 3.2 cover the replacement.

Review follow-up for task 3.1: The draft escapes custom currency labels throughout. The formatter regression test `escapes custom currency delimiters throughout the draft` verifies the balance table, transfer suggestions, Shared Wallet summary, and included expense details with `A|B`.

- [x] 3.1 Implement User can preview and copy a Markdown settlement draft before creating the record using the shared export dialog. Keep expense details in the existing unsettled list and the draft. Verify draft expense eligibility, return to review, clipboard success and failure, displayed rounding on reopening, unchanged settlement links, and literal member names in Markdown list items. [after: 1.2]
- [x] 3.2 Run the Web regression suite and verify preview, copy, and return to review in both supported locales in a browser. Verify the historical copy action and explicit confirmation after closing the draft. [after: 2.4, 3.1]
