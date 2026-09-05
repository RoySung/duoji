---
name: Duoji
description: A warm, trustworthy shared-expense product for everyday life and travel.
colors:
  porcelain-canvas: '#F8F7F4'
  surface: '#FFFFFFEA'
  surface-muted: '#EEF2EF'
  deep-teal-ink: '#20322F'
  muted-teal-ink: '#586A65'
  sage-waypoint: '#6F958C'
  sage-action: '#456A62'
  tangerine-marker: '#ED7A35'
  tangerine-text: '#993C0C'
  peach-glow: '#F0D7C1'
  warm-divider: '#DEDCD6'
  success: '#287A4B'
  danger: '#B63832'
typography:
  display:
    fontFamily: 'jf-openhuninn, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(1.75rem, 8vw, 3rem)'
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: '-0.03em'
  headline:
    fontFamily: 'jf-openhuninn, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1.5rem'
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: '-0.02em'
  title:
    fontFamily: 'jf-openhuninn, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1.125rem'
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: 'jf-openhuninn, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: 'jf-openhuninn, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 550
    lineHeight: 1.3
rounded:
  sm: '8px'
  md: '12px'
  lg: '16px'
  pill: '999px'
spacing:
  xs: '4px'
  sm: '8px'
  md: '16px'
  lg: '24px'
  xl: '32px'
components:
  button-primary:
    backgroundColor: '{colors.sage-action}'
    textColor: '#FFFFFF'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '10px 16px'
    height: '44px'
  button-ghost:
    backgroundColor: '{colors.surface-muted}'
    textColor: '{colors.deep-teal-ink}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '10px 16px'
    height: '44px'
  surface-card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.deep-teal-ink}'
    rounded: '{rounded.lg}'
    padding: '16px'
  chip-selected:
    backgroundColor: '{colors.tangerine-marker}'
    textColor: '#FFFFFF'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    padding: '6px 10px'
---

# Design System: Duoji

## Overview

**Creative North Star: "The Shared Journey Ledger"**

Duoji feels like a trusted shared notebook carried through ordinary days, meals, homes, and trips. It is warm without becoming nostalgic, friendly without becoming childish, and distinctive without changing familiar financial-product affordances. The interface gives amounts, dates, people, and available actions first priority; travel imagery and brand color create atmosphere around that work.

This is a restrained product system with one expressive exception: the transaction hero. All other screens use compact headings, clear groups, and familiar controls. The design explicitly rejects cold corporate-finance severity, neon trading-terminal density, pervasive glass blur, decorative gradients, excessive shadows, and motion without state meaning.

**Key Characteristics:**

- Mobile-first, centered, and calm at widths from 320px through the 768px content maximum.
- Deep-teal information hierarchy with sage actions, rare tangerine emphasis, and restrained peach atmosphere.
- Familiar controls with complete hover, focus, active, disabled, loading, and error states.
- Flat or softly lifted surfaces; decoration never competes with amounts or settlement outcomes.
- One Open Huninn family across headings, labels, data, and body text.

## Colors

The palette combines quiet neutral space with travel-led sage, tangerine, and peach cues; every saturated color has a specific semantic job.

### Primary

- **Sage Waypoint** (`#6F958C`): selected surfaces, supportive icons, charts, and calm wayfinding.
- **Sage Action** (`#456A62`): primary buttons and text-sized active controls that require AA contrast.

### Secondary

- **Tangerine Marker** (`#ED7A35`): selected dates, large amounts, active navigation icons, and the single highest-priority visual marker on a screen.
- **Tangerine Text** (`#993C0C`): normal-size accent text and labels where the brighter marker does not meet 4.5:1.

### Tertiary

- **Peach Glow** (`#F0D7C1`): decorative banner atmosphere, quiet status backgrounds, and chart support. Never use it as body text.

### Neutral

- **Porcelain Canvas** (`#F8F7F4`): the light-theme application background.
- **Surface** (`#FFFFFFEA`): elevated content groups, modals, calendar panels, and the floating navigation.
- **Surface Muted** (`#EEF2EF`): secondary controls, disabled backgrounds, and low-priority groups.
- **Deep Teal Ink** (`#20322F`): primary text, icons, headings, and high-emphasis data.
- **Muted Teal Ink** (`#586A65`): secondary text that still meets AA on the canvas and surfaces.
- **Warm Divider** (`#DEDCD6`): structural separators and input boundaries when a shadow is not used.

**The One Marker Rule.** Tangerine identifies the current selection or highest-priority amount; it never becomes a decorative wash across an entire page.

**The Semantic Pair Rule.** Every dark-theme role has the same meaning and hierarchy as its light-theme counterpart; no isolated light surface survives a theme switch.

## Typography

**Display Font:** Open Huninn (`jf-openhuninn`) with a system sans fallback  
**Body Font:** Open Huninn (`jf-openhuninn`) with a system sans fallback  
**Label Font:** Open Huninn (`jf-openhuninn`) with a system sans fallback

**Character:** Open Huninn makes financial tasks approachable while remaining clear at compact product sizes. One family prevents display styling from overtaking operational labels and data.

### Hierarchy

- **Display** (700, `1.75rem`–`3rem`, 0.95): account-book names in the transaction hero only; never use it for ordinary page titles.
- **Headline** (650, `1.5rem`, 1.2): route-level headings for reports, settlements, settings, authentication, and onboarding.
- **Title** (600, `1.125rem`, 1.3): card titles, modal headings, and primary list labels.
- **Body** (400, `0.875rem`, 1.5): instructions, values, descriptions, and primary-control text; prose is capped at 70ch.
- **Label** (550, `0.75rem`, 1.25): secondary labels, chips, metadata, and compact states. Uppercase and wide tracking are reserved for the single transaction-section label.

The compact icon scale maps `28px → 24px`, `25px → 20px`, `22px → 18px`, `18px → 16px`, and `16px → 14px`. Glyphs at or below `14px` stay at least `12px` when they communicate state. Interactive targets have a site-wide minimum of `24px`; existing larger navigation, form, modal, and primary-action controls keep their current dimensions unless a component requirement explicitly resizes them.

**The Data Before Display Rule.** Amounts, dates, people, and action labels remain legible at product sizes; display scale is confined to the decorative transaction hero.

## Elevation

Duoji is flat by default and uses depth only to separate overlays, the floating navigation, and primary content from the page canvas. A surface uses either a warm divider or a compact ambient shadow, never both as decoration. Tonal layering carries most hierarchy in dark mode.

### Shadow Vocabulary

- **Ambient Low** (`0 2px 8px rgba(32, 50, 47, 0.08)`): floating navigation and standalone content surfaces on the page canvas.
- **Overlay** (`0 8px 24px rgba(20, 31, 29, 0.18)`): drawers, popovers, and modals only.
- **Focus** (`0 0 0 3px rgba(69, 106, 98, 0.28)`): keyboard focus when a component cannot use an outline.

**The Structural Depth Rule.** If a card has a visible border, its decorative shadow is removed. If it has an ambient shadow, its border remains transparent.

## Components

### Buttons

- **Shape:** gently curved rectangles (`12px`) with a minimum height of `44px`; pills are limited to compact filters and chips.
- **Primary:** Sage Action with white text and `10px 16px` padding; one primary action per immediate decision area.
- **Hover / Focus:** darken the current semantic color, use a 150–200ms color transition, and expose the focus treatment without movement.
- **Secondary / Ghost:** use Surface Muted or a single Warm Divider boundary. Disabled controls retain readable labels and expose their existing explanation.

### Chips

- **Style:** full-pill geometry with compact `6px 10px` padding; use neutral or semantic tinted backgrounds instead of borders plus shadows.
- **State:** selected dates and highest-priority states use Tangerine Marker; payment methods and metadata remain neutral; success and danger retain semantic labels or icons in addition to color.

### Cards / Containers

- **Corner Style:** `16px` maximum for cards and sections; nested cards are forbidden.
- **Background:** Surface for standalone content and Surface Muted for subordinate groups.
- **Shadow Strategy:** Ambient Low only when separation from the canvas is necessary.
- **Border:** Warm Divider replaces the shadow for forms, lists, and grouped settings.
- **Internal Padding:** `16px` on mobile and `24px` for spacious route-level groups.

### Inputs / Fields

- **Style:** Surface background, Warm Divider boundary, `12px` corners, and a minimum `44px` control height.
- **Focus:** Sage Action boundary or Focus elevation with an explicit `:focus-visible` state.
- **Error / Disabled:** Danger uses text plus an icon or message; disabled fields use Surface Muted and remain readable.

### Navigation

- **Style:** a light header and a floating full-pill bottom navigation preserve the same destination order on mobile and desktop. Inactive icons use Muted Teal Ink; the active route uses Tangerine Marker plus an underline or selected surface. The create action uses Sage Action and remains visually central without changing its enabled rules.

### Transaction Calendar

- **Alignment:** the calendar and transaction-history surfaces inherit the same full content width from `PageScaffold`; only the negative top margin creates the Hero overlap.
- **Spacing:** `PageScaffold` owns the 16px gap between the Hero/calendar group and every transaction-history state. `TransactionList` remains margin-free so consumers outside the scaffold provide their own separation.
- **Display Mode:** the upper-right dot/amount control and either glyph state are `24px × 24px`; the separate week/month expansion control is explicitly `32px × 32px`.
- **Behavior:** accessible names, visible focus, persisted display mode, date selection, range navigation, and expanded-month document flow remain unchanged.

### Transaction Hero

- **Style:** the geometric background from supplied image 2 anchors to the bottom; the transparent travel illustration from supplied image 3 sits at the lower right. Account-book name, refresh action, and record count remain live HTML in a protected text-safe area.
- **Height:** use `200px` below the 640px `sm` breakpoint and `220px` from `sm` upward so mobile and wider centered layouts expose more calendar and transaction-history content; preserve the responsive Hero content padding and 28px/44px calendar overlap.
- **Text-safe Area:** live content may use the full Hero width so representative long account-book names stay above the action row instead of forcing it into the calendar overlap; the semantic scrim keeps text readable over the decorative illustration.
- **Mobile Rhythm:** below `sm`, use the compact title-to-action spacing while retaining the existing 48px/64px bottom-safe padding; restore the wider title spacing at `sm` so live actions remain above the calendar at both Hero heights.
- **Fallback:** missing images leave a semantic background, subtle CSS geometry, stable height, and every live control intact.
- **Dark Theme:** use a semantic scrim and adjusted image opacity; never restore the source illustration's black rectangle.

## Do's and Don'ts

### Do:

- **Do** keep amounts, dates, payers, split details, and primary actions above decoration in the visual hierarchy.
- **Do** use the same component vocabulary and state meaning across transaction, report, settlement, settings, authentication, and onboarding screens.
- **Do** keep normal text at 4.5:1 contrast, large text and non-text boundaries at 3:1, interactive targets at least 24 × 24 CSS pixels, and layouts usable at 320px. Keep existing larger controls at their established dimensions unless an explicit component requirement resizes them.
- **Do** pair color with text, shape, iconography, or labels, and respect `prefers-reduced-motion`.
- **Do** reserve travel imagery and the largest display type for the transaction hero.

### Don't:

- **Don't** use cold, severe, or overly authoritative corporate-finance interfaces.
- **Don't** use black, saturated neon, or dense information to imitate a technical trading terminal.
- **Don't** rely on pervasive glass blur, decorative gradients, excessive shadows, or animation that communicates no state.
- **Don't** reinvent familiar controls for style or give the same action inconsistent visual treatments across pages.
- **Don't** let illustrations, brand colors, or motion reduce the readability of amounts, split results, errors, or action states.
- **Don't** use side-stripe accents, gradient text, nested cards, card radii above `16px`, or a border combined with a wide decorative shadow.
