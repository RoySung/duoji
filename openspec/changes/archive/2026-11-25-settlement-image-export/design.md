## Context

The settlement record detail shows member balances and transfers and already offers a Markdown export through its actions menu. The route loads linked transactions separately. The approved PNG sketch follows the existing light-theme cards and needs more breathing room.

## Design Source

The Duoji-style PNG reviewed on 2026-11-25 is cached locally at `.spectra/design-cache/settlement-image-export/approved-preview.png`. The PNG establishes the layout and hierarchy. The source of exact visual values is the current app theme and the approved spacing adjustment below.

| Element | Implementation target in logical pixels |
| --- | --- |
| Typeface and scale | jf-openhuninn, 24 px headline, 18 px section title, 14 px body, 12 px secondary labels |
| Colors | Duoji light theme: background hsl(45 22% 96%), foreground hsl(169 22% 16%), white cards, muted inset hsl(150 13% 94%), border hsl(40 10% 85%), primary hsl(166 21% 34%) |
| Status and amounts | Existing warning colors for pending and success colors for completed. Use success for receivable and danger for payable, paired with labels |
| Card shape | 16 px outer corner radius, 12 px inset radius, 1 px quiet card borders |
| Increased whitespace | Use at least 24 px page gutters and card padding, 32 px between sections, 12 px from a heading to its card, and 20 px vertical padding per expense row. Maintain 8 px or more between metadata lines |
| Layout and icons | Small Duoji wordmark and record metadata at the top, three balance columns per member, transfer direction and amount, then itemized expenses. Use a text arrow between names. Report controls live outside the PNG |

## Goals / Non-Goals

**Goals**

- Let people preview and share a PNG of an existing settlement record.
- Preserve complete and readable expense details in one continuous image.
- Match the approved light-theme composition and make the increased spacing easy to verify.

**Non-Goals**

- Report CSV changes, or changes to settlement calculations and records.
- Direct downloads, clipboard image copying, and a separate dark PNG theme.

## Decisions

### Reuse record formatting with separate report layouts

Capture a local snapshot when image preview opens. Use the same members, linked expenses, translations, currency, and auto-rounding selection as the record. Reuse existing amount formatting and record-export inclusion rules from `generateSettlementMarkdown` and share any shaping logic needed to keep values consistent. Use structured records for the image layout. Parsing Markdown or capturing the interactive page would couple output to markup or browser viewport state and make it harder to align labels and rows.

### Render one complete PNG locally

**Supersedes**: settlement-image-export / Generate bounded PNG pages locally

Render every report section once, in order, on a single image shared by the preview and native share action. Measure wrapped text before painting and derive the image height from the entire layout.

**Supersedes**: settlement-image-export / Render one complete PNG locally (the original rule that allowed the raster scale to drop below 1×)

Retain the 448 logical px layout at up to 2× when one raster fits the 8,388,608-pixel canvas budget and the 32,767 px canvas side limit. When meeting either canvas limit would push the raster below 1×, rasterize horizontal bands at 1× in a reusable canvas and stream the rows in order into a single PNG. The canvas limits apply to the working bitmap, and the encoded PNG can exceed them. Check cancellation between bands and use the existing generation error and retry if encoding fails. Verify the PNG dimensions and decoded scanlines for a 500-expense report.

### Share the ready PNG through the system share sheet

Create a named PNG File from the generated image. Use that same File for the preview URL and the one-file Web Share request. Check file-sharing support with canShare and invoke navigator.share directly from the Share image press. Keep the preview visible when sharing is unsupported, cancelled, or fails. Show localized feedback for unsupported sharing and failures. Cancellation returns to the ready preview without an error.

### Share the image layout with settlement drafts

Use the current confirmation review as the draft snapshot when users open the image. Reuse the image preview and native sharing flow. The draft report carries its own title and export time and has suggested transfers and an applicable Shared Wallet summary. Keep record identifiers and transfer completion data specific to recorded settlements. A separate draft renderer would duplicate layout and PNG generation.

## Implementation Contract

- In scope: the existing settlement-record action menu, a localized preview of one complete PNG and native file sharing. In scope also includes a draft image action in the settlement confirmation dialog. Out of scope: changes to Markdown and settlement state, and server-side generation.
- Snapshot record number and date, completion status, formatted member balances, transfer direction and status, suggested and recorded actual amounts and notes when applicable, and all linked expenses eligible for record Markdown export. Use the record's current rounding for member balances and suggested amounts, and retain actual and expense precision according to the existing formatting rules.
- Generate only after linked transactions have loaded successfully for this record. A pending or failed load must never be exported as an empty list. A successfully loaded empty list renders an explicit empty state.
- Show generating, ready, or localized error feedback. Allow retry when loading or generation fails. Disable sharing until the PNG is ready and the browser supports sharing it. Discard stale asynchronous results after close, record navigation, or retry. Release generated object URLs when superseded or closed.
- A recorded settlement uses `settlement-<number>.png`. Opening, sharing, retrying, and closing preserve settlement data.
- Review a 360 px mobile preview using the example from the sketch. Verify that a long report shows each eligible expense once in order in one shared file.

- In settlement confirmation, offer Image (PNG) and Markdown under one Export draft menu. Restore focus to the menu trigger when a preview closes. Disable the menu trigger when the review is empty or submission is in progress. Open a nested preview and return to the confirmation view when it closes. Creating a record remains an explicit confirmation action.
- Freeze the current draft expenses, review members, suggested transfers, rounding setting, and applicable Shared Wallet totals, average, and borrowings when opening the draft. Title the preview and PNG as a draft, use the export time, and use filename `settlement-draft.png`. Apply the same PNG error and sharing behavior.

## Risks / Trade-offs

- Font loading and long Traditional Chinese strings can alter wrapping. Wait for the report font with a bounded wait, then measure and render with the same fallback if needed.
- Small screens need to scale the preview without changing the exported file. Preview the generated image at the available width. Share the same PNG at its generated resolution.
