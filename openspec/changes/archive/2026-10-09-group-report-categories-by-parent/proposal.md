## Summary

Restructure the report category breakdown around the existing root-category hierarchy so users first see a concise overview of major categories and can drill into an individual major category through either the chart or list to inspect its composition.

## Motivation

The original flat report was replaced with collapsible parent and child rows, but the chart still remains at the root level and hierarchy navigation is split across a small disclosure control. Users need the chart and list to communicate the same current level, make the path back to all categories obvious, and keep filtering and transaction details distinct from hierarchy navigation.

## Proposed Solution

- Replace the initial flat category ranking with root-category summaries, separately for the existing expense and income tabs.
- Aggregate each root summary from transactions assigned to that root or to its subcategories, and use the root summaries for the donut chart and top-level ranking order.
- Replace inline disclosure with in-place hierarchy navigation: selecting an eligible root from either the donut chart or its primary list action opens a focused child-level view, and a breadcrumb/back control returns to all categories.
- Keep a hierarchy indicator visible above the category content at every level: the root view displays a static localized all-categories label, while a focused view displays the existing back breadcrumb with the selected root name.
- Keep the donut chart and ranking list synchronized to the current hierarchy level. The focused view includes a derived direct-assignment item when transactions were recorded directly against the root, so its visible parts reconcile with the parent total.
- Keep the donut center label fixed to the current category context: the root view displays the localized all-categories label and a focused view displays the selected root category name even when active amounts change.
- Add a subcategory-comparison mode that flattens every root's child and direct-assignment composition into one globally ranked horizontal bar chart, using full root/subcategory paths so users can compare across root categories without losing hierarchy context.
- Preserve category exclusion and transaction-detail actions at both levels: excluding a root affects its full hierarchy, while excluding a subcategory affects only that subcategory.
- Preserve single-book identity grouping, all-books same-name merging, unknown-category handling, and all existing report scope filters while making hierarchy-aware keys deterministic.
- Add localized labels and automated coverage for aggregation, chart/list drill-down, breadcrumb navigation, exclusion, transaction drill-down, and aggregate-view grouping.

## Non-Goals (optional)

- Changing category creation, editing, storage, or the supported root/subcategory model.
- Adding a new report filter, chart type, persisted navigation state, third hierarchy level, or deeper report route.
- Changing time, tag, member, account-book, currency, CSV export, or monthly-trend scope semantics.

## Alternatives Considered (optional)

- Keep the flat list and add a separate root-only chart: rejected because the ranking would remain visually dense and chart/list labels would no longer align.
- Keep inline expansion beside a root-only chart: superseded because it presents two hierarchy levels in the list while the chart continues to present only the root level.

## Impact

- Affected specs: `reports`
- Affected code:
  - Modified: `apps/web/src/utils/reportAggregate.ts`, `apps/web/src/components/report/reportTypes.ts`, `apps/web/src/components/report/ReportSection.tsx`, `apps/web/src/components/report/ReportCategoryBreakdown.tsx`, `apps/web/src/i18n/messages/en-US.json`, `apps/web/src/i18n/messages/zh-TW.json`, `apps/web/specs/reportAggregate.spec.ts`, `apps/web/specs/reportCategoryBreakdown.spec.tsx`, `apps/web/specs/reportSection.spec.tsx`
  - New: none
  - Removed: none
