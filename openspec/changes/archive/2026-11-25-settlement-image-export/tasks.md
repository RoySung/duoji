## 1. Report content and layout

- [x] 1.1 Reuse record formatting with separate report layouts by building a snapshot of formatted balances, transfers, and active linked expense fields. Verify the 150.20 rounding toggle, recorded actual precision, and exclusion of deleted expenses with focused formatter tests.
- [x] 1.2 [after: 1.1] Render a single-page PNG using the design's visual values. Review the two-member, two-expense reference at a 360 px viewport and verify heading gaps, card padding, and expense spacing against Design Source.
- [x] 1.3 [after: 1.2] Generate bounded PNG pages locally so long settlement image exports preserve expense details across numbered pages. Verify exact-fit rows, a whole row moved to the next page, an oversized expense continued with no clipped text, and ordered page numbering with a pagination test.

## 2. Preview and download

- [x] 2.1 [after: 1.3] User can preview and download an existing settlement as PNG via the record action and localized preview. Verify that choosing another page changes both preview and filename, the downloaded PNG matches the displayed page, and Markdown and record state remain available as before.
- [x] 2.2 [after: 2.1] Integrate current-record transaction readiness, generation feedback, retry, and stale-result cleanup in the preview. Verify that loading and failed expense queries never produce a partial download, a loaded empty result shows zero expenses, generation failure permits retry, and a late result after close or record navigation does not publish an image.

## 3. Settlement draft

- [x] 3.1 [after: 2.2] Share the image layout with settlement drafts. Verify that the draft snapshot uses the review's rounding and includes suggested transfers, applicable Shared Wallet data, and all active reviewed expenses without record status.
- [x] 3.2 [after: 3.1] User can preview and download a PNG draft before confirming settlement. Verify that the action opens the draft preview, disables during empty review and submission, downloads with a draft filename, returns to confirmation on close, and does not submit or relink expenses.

- [x] 3.3 [after: 3.2] Consolidate PNG and Markdown into one Export draft menu. Verify both options open their matching preview, Escape dismisses only the menu, closing a preview restores focus to the menu trigger, and an empty or submitting review disables the trigger.

## 4. Single-image sharing

- [x] 4.1 [after: 3.3] Render one complete PNG locally so Image exports include all detail in one continuous PNG. Replace the completed pagination behavior with a single measured canvas. Verify long content is rendered in order into one PNG and the raster dimensions respect the canvas budget.
- [x] 4.2 [after: 4.1] Share the ready PNG through the system share sheet. User can preview and share an existing settlement as PNG and User can preview and share a PNG draft before confirming settlement. Verify one named PNG matches the preview without page controls. The preview handles unavailable, cancelled, and failed file sharing. Verify localized status, cancellation and retry, and no settlement mutation.

- [x] 4.3 [after: 4.2] Keep the single shared PNG at a minimum of 1× for long settlements by rendering bounded canvas bands. Verify that a 500-expense report retains the full report width and that its decoded rows span the original expense order.
