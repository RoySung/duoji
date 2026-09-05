## Context

The transaction category selector displays a root-category Avatar in each tab and a child-category Avatar in each selectable category card. The report category breakdown displays an Avatar for every summary with an image URL. Those Avatar roots already define the rendered 20px or 32px box; only their internal image needs an inset. The report's larger 32px Avatar uses a 4px inset, while transaction's 20px Avatars retain a 2px inset.

## Goals / Non-Goals

**Goals:**

- Add exactly 2px of internal padding to category image content in the transaction selector and exactly 4px in the report category breakdown.
- Preserve each Avatar root size, source URL, alternate/name fallback, selection state, and interaction behavior.
- Cover both locations with focused component presentation assertions.

**Non-Goals:**

- Do not change category icons in settings, navigation, transaction lists, charts, or any other surface.
- Do not resize Avatar roots, replace icon assets, or introduce a shared category-icon component.

## Decisions

### Apply Avatar image padding locally

Pass the HeroUI Avatar image slot `p-0.5` in the transaction selector, which equals 2px, and `p-1` in the report category breakdown, which equals 4px. Keep every existing root `className` unchanged so parent layout and touch targets do not change. This is preferable to applying padding to the Avatar root because root padding would alter the layout box; a shared wrapper would broaden scope and create a new API for only two call sites.

### Assert image-slot presentation in existing component tests

Extend the transaction surface and report breakdown tests to assert that transaction image slots receive `p-0.5` and report image slots receive `p-1` when category images render. This verifies the requested visual contract without snapshot churn or browser-only checks.

## Implementation Contract

- Behavior: category images rendered in the transaction selector root tabs and child cards SHALL have 2px internal padding. Category images in report breakdown rows SHALL have 4px internal padding. Icons render inside their existing 20px or 32px Avatar boxes.
- Interface and data: use the existing Avatar component API and its `classNames.img` slot; do not modify Category or CategorySummary data shapes, image URLs, callbacks, or translations.
- Failure and fallback behavior: when a report summary has no image URL, retain its current chart fallback icon with no new padding requirement. Avatar image load behavior remains delegated to HeroUI.
- Acceptance criteria: focused web component tests prove the transaction Avatar image slots include `p-0.5`, the report Avatar image slot includes `p-1`, and the relevant test command passes.
- Scope: only the transaction category selector and report category breakdown are in scope; all other category-icon surfaces are out of scope.

## Risks / Trade-offs

- [Risk] Applying padding to the Avatar root can shrink or misalign the visible layout box. → Mitigation: apply the class only to the Avatar image slot.
- [Risk] Test mocks can hide slot props. → Mitigation: update the existing mocks to expose `classNames.img` for direct assertions.
