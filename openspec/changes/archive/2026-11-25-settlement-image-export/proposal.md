## Why

People sharing a settlement need a readable image they can send in a group chat. The existing Markdown export provides the underlying detail, but recipients see the intended formatting only in tools that render Markdown.

## What Changes

- Add an Export Image action to an existing settlement record. Put PNG and Markdown draft previews in one Export draft menu in the settlement confirmation dialog.
- Include member balances, transfers and their statuses, and itemized expenses. Follow the record's current automatic rounding setting for suggested amounts.
- Use the approved Duoji light-theme card layout with more space between report sections, within cards, and between expense items.
- Generate one continuous PNG for the entire settlement or draft and share that file through the system share sheet.

- Label pre-confirmation images as settlement drafts. Include the same suggested transfers, applicable Shared Wallet summary, and expenses as the confirmation view.

## Capabilities

### New Capabilities

### Modified Capabilities

- `settlement`: Add image preview and PNG export for a settlement record or draft.

## Impact

- Settlement record actions and export UI in apps/web/src/components/settlement/.
- Export formatting in apps/web/src/utils/settlementMarkdown.ts and the new image export code.
- Localized export controls and feedback in apps/web/src/i18n/messages/.
- PNG generation runs in the browser using the record data already available to the page.
