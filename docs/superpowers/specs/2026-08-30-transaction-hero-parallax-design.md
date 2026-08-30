# Transaction Hero Parallax Design

## Context

`TransactionHero` already composes a decorative geometric background and a decorative travel illustration beneath live transaction controls. The approved direction adds depth while preserving the existing 200px mobile and 220px wider Hero sizes, foreground content, and calendar overlap.

## Approved Design

- Use the existing `react-use` dependency's `useWindowScroll()` hook inside `TransactionHero`; do not add a dependency or a global bespoke scroll listener.
- Derive a clamped local scroll progress from the Hero's position and the current window scroll position. The effect only changes decorative image transforms; it does not alter the Hero's document geometry.
- Apply GPU-friendly `translate3d` transforms: the geometric background moves by at most 24px and the travel illustration by at most 10px. Below the `sm` breakpoint, use 60% of those distances.
- Keep the transaction label, account-book name, refresh action, record-count chip, gradient scrim, Hero height, and normal-flow calendar overlap fixed in place.
- When `prefers-reduced-motion: reduce` matches, render both decorative layers at their resting transforms. Existing image-load fallback continues to remove only the failed decorative image while live content remains available.

## Scope

In scope: `TransactionHero` scroll-derived decorative transforms, responsive amplitude, and reduced-motion behavior.

Out of scope: changes to the Hero/calendar geometry, action semantics, transaction data flows, assets, dependencies, or new unit tests. The user explicitly declined new unit-test coverage; verification will be TypeScript/lint plus manual browser checks at mobile and wider widths.

## Verification

- Run the relevant TypeScript/lint checks.
- Manually confirm at a mobile and a wider viewport that the background moves more than the illustration, foreground content remains stationary and readable, and Hero/calendar geometry is unchanged.
- Manually confirm a reduced-motion preference leaves both decorative layers static.
