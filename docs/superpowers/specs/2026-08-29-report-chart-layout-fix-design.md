# Report Chart Layout Fix Design

## Goal

Remove the excessive blank space around the report category donut and monthly trend chart while preserving the current report structure, readable chart sizing, text priority, data, ordering, and interactions.

## Chosen Approach

Use compact responsive chart heights with an explicit full-height chart wrapper. The category breakdown keeps the donut on the left and the category list on the right at tablet widths, while retaining the existing stacked mobile layout. The monthly trend keeps its current heading, accessible table, legend, axes, and bar chart.

This approach is preferred over an unconstrained aspect-ratio container because it gives stable mobile and tablet screenshots. It is preferred over data-count-driven heights because it avoids layout shifts when filters change the number of categories or months.

## Components and Layout

- `ReportApexChart` will allow its wrapper to occupy the height assigned by its parent so the ApexCharts canvas can use the intended plotting area instead of resolving against an auto-height intermediary.
- `ReportCategoryBreakdown` will use a compact responsive chart height that remains large enough for the donut total label and slice selection while removing unused vertical space.
- `ReportMonthlyTrend` will use a compact responsive height that retains legible axis labels, legend text, tooltips, and bars without leaving a large empty lower region.
- The existing category row layout, 44px action targets, amount emphasis, truncation behavior, and responsive two-column topology remain unchanged.

## Data Flow and Behavior

No report aggregation, filtering, exclusion, chart series, label, theme-token, modal, or navigation logic changes. Parent components continue to supply the same options, series, currency, category summaries, and monthly points. The fix is presentation-only.

## Responsive and Text Requirements

- At the existing mobile and tablet visual-regression widths, both charts remain fully visible and do not overflow their cards.
- Traditional Chinese and English headings, legend labels, category names, percentages, record counts, and formatted currency amounts retain their current display priority.
- Long category names may continue to truncate where already specified; amounts and action buttons must not be obscured.
- Empty states and the screen-reader table remain unchanged.

## Failure and Edge Cases

- A report containing one month must still show readable axes, legend, and a visible bar without reserving the previous oversized card height.
- A report with many categories keeps the list-driven section height; the donut stays vertically centered without forcing the list into a fixed-height viewport.
- Theme changes continue to rebuild semantic chart colors without mutating caller options.
- A chart rendered before client hydration retains the existing dynamic-import behavior and does not introduce layout overflow.

## Verification

- Extend the report chart presentation tests to assert the full-height chart wrapper and the new compact responsive height contracts.
- Run the focused report chart and category-breakdown component tests.
- Run the web test suite and web build.
- Render or update the mobile and tablet report visual-regression screenshots in light and dark themes, then confirm the highlighted blank areas are removed while text and chart labels remain readable.

## Scope Boundary

This fix does not redesign report cards, reorder sections, change report calculations, alter category interactions, change chart types, or modify the application shell.
