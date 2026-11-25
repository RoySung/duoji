## Why

The settlement confirmation dialog shows balances and suggested transfers, but the underlying expenses are already visible on the settlement page. A copyable Markdown draft gives members a combined view for external review before they create the settlement record.

## What Changes

- Keep expense details in the existing unsettled list and the Markdown draft. The confirmation dialog shows balances, suggested transfers, and the applicable Shared Wallet summary.
- Allow the user to preview and copy a Markdown settlement draft for external review using the settlement detail export dialog, with an export timestamp and the same expenses, calculations, and rounding setting as the on-screen overview.
- Preserve custom currency labels in copied drafts, including labels that contain Markdown delimiters.
- Refresh the overview and require another confirmation when the reviewed settlement data changes before record creation.

## Capabilities

### New Capabilities

### Modified Capabilities

- `settlement` adds an in-app pre-settlement overview, a copyable Markdown draft preview, and confirmation against the reviewed data.

## Impact

- The settlement page at apps/web/src/pages/account-books/[id]/settlement/index.tsx, its confirmation dialog at apps/web/src/components/settlement/SettlementConfirmModal.tsx, and the preview and save flow in apps/web/src/hooks/useSettlement.ts.
- The shared Markdown preview in `SettlementMarkdownModal.tsx`, Markdown formatting in apps/web/src/utils/settlementMarkdown.ts and settlement labels in apps/web/src/i18n/messages/en-US.json and apps/web/src/i18n/messages/zh-TW.json.
