## Context

`SettlementConfirmModal` already displays member balances, suggested transfers, an applicable Shared Wallet summary, and the auto-rounding toggle. The settlement page subscribes to current unsettled expenses. `useSettlement` calculates a preview and independently recalculates when creating a record. `SettlementLocalRepo.create` adds the record and links expenses in one Dexie transaction.

The history page has an existing Markdown formatter and copy workflow. The formatter currently takes a saved record and its sequence number.

## Goals / Non-Goals

**Goals**

- In scope are the in-app transaction review, a copyable Markdown draft preview, and verification of the reviewed data during settlement creation.
- Keep the screen, export, and saved calculations aligned while preserving full stored precision and the existing account-book eligibility rules.

**Non-Goals**

- Out of scope are changes to settlement math, storage schema, historical Markdown, transfer completion, and the choice of which expenses to settle.
- Out of scope are sending the draft from the app, recording external approval, and retaining drafts in the app after closing the dialog.

## Decisions

### Review without an inline expense list

**Supersedes**: settlement-preview-markdown / Reviewed settlement data

Keep balances and transfer suggestions in the confirmation dialog. Leave expense details in the existing unsettled list and the Markdown draft. Use a single in-memory preview containing eligible expenses, member statuses, suggested transfers, and the Shared Wallet summary. Associate it with the account book and the current display settings. Derive its calculations together through the existing settlement utilities, including the Shared Wallet transfers to be persisted. The screen, export, and create handler consume the same preview. A separate review page would duplicate the existing confirmation flow and require passing review state across navigation.

### Copyable Markdown draft preview

**Supersedes**: settlement-preview-markdown / Markdown draft download

Reuse the report formatter's shared amount, member, transfer, and expense formatting with distinct draft and historical inputs. A draft needs an export timestamp, the rounding setting, and the applicable Shared Wallet summary. Draft transfers are suggestions without completion checkboxes, and the title has no settlement sequence number. Open the existing `SettlementMarkdownModal` with the draft text and a localized draft title. Closing it returns to the open settlement review. Reusing formatting with draft-specific inputs avoids manufacturing a persisted record and reduces formatting drift. The historical entry point retains its current output and copy behavior.

### Confirmation against current settlement inputs

Use the preview's unrounded balances and transfer suggestions as the values to save once current inputs match. The existing live update path can refresh the open review and show a notice when reviewed data changes. It cannot close the gap between the last rendered preview and the write, so the repository rechecks the current eligible expense set and the member inputs used for Shared Wallet calculations inside the existing write transaction. Observe changes to persisted members so the open review can recalculate between attempts. Compare identities and the values used for review or computation, including date, description, amount, category, payers, and splits. A comparison uses stable ordering by expense ID so delivery order alone does not invalidate the review. The page uses current calculation inputs to detect changes in derived balances and Shared Wallet data before invoking the write.

## Implementation Contract

- The confirmation dialog presents balances, suggested transfers, and the applicable Shared Wallet summary. The existing unsettled list remains available before opening confirmation. The Markdown draft shows the included expense count and each expense’s date, description, category, amount, payers, and splits. The current auto-rounding toggle governs formatted balances and suggested transfers. Original transaction amounts and stored monetary values keep their existing precision rules.
- The user can open a Markdown draft preview from the same dialog and copy its raw text through the historical export modal. Generate the timestamp when the preview opens. Include the displayed rounding setting, expense details, balances, suggested transfers, and applicable Shared Wallet summary. Escape user-entered text in tables and wherever it can change Markdown structure. Apply Markdown escaping to the draft currency label before formatting amounts so balances, transfers, Shared Wallet amounts, and expense details share the same literal label. Historical Markdown keeps its existing amount formatting.
- Opening, closing, or copying the draft performs no settlement write. Closing the preview returns to the settlement review. A clipboard error keeps the draft visible for manual selection and uses the existing localized copy failure message.
- A stale confirmation returns a distinguishable outcome, leaves all record and expense links intact, and refreshes the open overview with a localized notice. A later explicit confirmation is required. If the refreshed set is empty, the actions to preview Markdown or create a settlement are unavailable. Other save errors use the existing failure feedback.
- Verify in the settlement page flow with rounding on and off, an edit that keeps the expense count the same, and no modification from previewing or copying. Verify the write guard against an intervening expense addition, edit, removal, settlement, or change to Shared Wallet member inputs in the local repository.

## Risks / Trade-offs

- A draft shared outside the app can become outdated. Label the Markdown as a draft, include its export time, and require fresh confirmation in the app after a change.
- Saving a guard based only on IDs or counts misses in-place edits. Compare the expense values used by review and calculation within the write transaction.
- Shared formatting can introduce regressions in historical Markdown. Preserve existing fixtures and cover draft-only headings and sections separately.
