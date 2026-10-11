## Context

The report currently turns every matching transaction category into a flat `CategorySummary`. `ReportSection` derives that list from the time-, book-, member-, and tag-scoped transactions, while `ReportCategoryBreakdown` renders the same list as donut slices and ranking rows. Category exclusion keys are also resolved from the assigned category and are used to remove transactions from the summary cards and monthly trend.

Categories already carry `parentId`: root categories use `null`, and transaction-facing subcategories refer to a root category. The design must add hierarchy to the report without changing category persistence or any upstream report scope. It must work in single-book mode, where category IDs identify buckets, and all-books mode, where same-name categories are merged within each currency section.

## Goals / Non-Goals

**Goals:**

- Make the initial expense and income breakdowns show only root-category totals.
- Let users navigate from a root category into a focused breakdown and back from either the chart or list.
- Keep the current hierarchy context visible above the category content at both the root and focused levels.
- Let users compare subcategory amounts across different roots on a common quantitative axis.
- Keep totals, counts, percentages, exclusion behavior, and transaction drill-down correct at both levels.
- Retain mobile usability, keyboard access, localization, and the existing report filters.

**Non-Goals:**

- Changing the stored `Category` entity, repository, settings UI, or supported category-management workflow.
- Persisting drill-down state across tab changes, navigation, or reloads.
- Introducing a third reporting level or a new route.
- Changing CSV export or report scope semantics.

## Decisions

### Aggregate root summaries with nested child summaries

`groupByCategory` will continue to accept scoped transactions, categories, transaction type, and `mergeByName`, but its returned `CategorySummary[]` will contain root nodes only. `CategorySummary` will add `children`, `directAmount`, and `directTransactionCount` fields:

- A root node's `totalAmount`, `transactionCount`, and `transactions` cover every matching transaction assigned to the root or any descendant.
- A root node's `directAmount` and `directTransactionCount` cover only transactions assigned directly to that root.
- Each child node represents one non-root assigned category and contains its own totals and transactions; its `children` is empty and its direct values equal its totals.
- Root and child percentages use the complete amount for the active transaction type as the denominator, preserving the existing “percentage of report total” meaning.
- Root nodes and their children are independently sorted by `totalAmount` descending. Stable encounter order resolves equal amounts.

Walking `parentId` to the root makes aggregation tolerant of existing data deeper than one parent/child edge, but the report intentionally flattens every non-root assigned category into one detail level under its resolved root. A known category with a missing parent or a parent cycle falls back to a non-expandable top-level bucket using its own identity. Transactions with an unknown category ID remain in one non-expandable `Uncategorized` root bucket per transaction type, as required by the existing reports spec.

This keeps the current aggregation entry point and adds only the data needed to render and filter the hierarchy. A separate flat root-only model was rejected because it would require a second aggregation pass for every expansion and make root and detail totals easier to diverge.

### Use parent-scoped names when merging all-books detail rows

Single-book root and child keys remain category-ID based and transaction-type scoped. In all-books mode, root nodes merge by root name and transaction type, preserving the first encountered root image. Child nodes merge by the pair `(merged root name, child name)` and transaction type, preserving the first encountered child image.

Including the root name in an all-books child key prevents equally named subcategories beneath different major categories from collapsing into one detail row. Root keys remain compatible with the current `name::<type>::<root name>` form; child keys add the root and child path. All generated keys include transaction type, so excluding an expense hierarchy cannot exclude an income hierarchy with the same names.

Global child-name merging was rejected because a label such as “Other” can have different meanings beneath different root categories.

### Synchronize chart and list drill-down

**Supersedes**: group-report-categories-by-parent / Keep expansion separate from filtering and drill-down

`ReportCategoryBreakdown` will keep one in-memory drilled root key for the active tab. At the root level, selecting an eligible donut slice or the primary action of its matching row opens the same focused view. The focused view replaces both chart series and ranking rows with the selected root's immediate report children, and exposes a breadcrumb/back button that returns to all categories. Changing expense/income tabs resets the drilled root so the new tab always opens at its root level.

Chart slices and rows are derived from the same level model and use the same stable color map. A root with no child data and no direct assignment has no deeper view; its chart slice and primary row action open transaction detail instead. Inside a focused view, selecting a leaf slice or primary row action opens transaction detail because no third report level exists.

Each row keeps separate native buttons for its primary navigation/detail action, include/exclude filtering, and explicit transaction detail. Controls are siblings rather than nested interactive elements. Root detail contains the hierarchy union; a child detail contains only that child's transactions.

Keeping inline expansion was rejected because a root-only donut beside a two-level list makes the two visualizations disagree about the user's current level. A separate route was rejected because the interaction is local, temporary, and does not require another data request.

### Keep the current hierarchy indicator visible at every level

`ReportCategoryBreakdown` will render a hierarchy indicator above the chart-and-list area regardless of the current level. At the root level, the indicator is a non-interactive label containing the localized `All categories` text. In a focused root, that same position contains the existing breadcrumb/back button with `All categories / {root name}`.

Keeping the root indicator non-interactive avoids presenting a control that cannot navigate anywhere, while matching the focused breadcrumb's footprint and making the current category context visible before and after drill-down. Reusing the existing `All categories` localization keeps the indicator consistent with the donut center label and avoids introducing a duplicate translation key.

### Compare all subcategories with a horizontal bar chart

The category breakdown will add an in-memory presentation toggle between the existing root overview and a new subcategory-comparison mode. The overview remains the default and preserves the synchronized donut/list drill-down. Comparison mode flattens every root's focused composition into one list: stored child categories plus a presentation-only direct-assignment item when the root has direct transactions.

Comparison entries are labeled with their full `{root} / {subcategory}` path and sorted globally by amount descending, with stable encounter order resolving ties. Percentages use the complete amount for the active expense or income type so entries under different roots share the same denominator. The chart uses horizontal bars on one numeric scale; each entry inherits a stable color from its root so color reinforces, but does not replace, the visible path label. Selecting a bar opens the represented transaction detail. The synchronized ranking list keeps the existing stored-category include/exclude and explicit detail actions; direct-assignment entries remain detail-only.

The comparison toggle resets to the overview when the expense/income tab changes. Comparison state is not persisted. A horizontal bar chart was selected over a treemap because the shared baseline supports more accurate cross-root magnitude comparison, while a flattened donut was rejected because numerous child slices become difficult to label and compare.

### Keep the current category label fixed in the donut

**Supersedes**: group-report-categories-by-parent / Keep the current report label fixed in the donut

The donut center label identifies the active category context rather than the expense/income tab or numeric series state. The root view uses the localized `All categories` label; a focused view uses the selected root's display name. Excluding a child, changing active amounts, or refreshing scoped transactions changes the series and center amount but MUST NOT replace the category label with an expense/income label, a generic total, or an active-child name.

Deriving the label from the drilled root state keeps it synchronized with the breadcrumb and independent from the active summary list. A label based on the first active slice was rejected because exclusions and zero-valued slices would make the center label jump between categories.

### Represent direct root assignments in the focused level

When a drilled root has transactions assigned directly to itself, the focused level derives a presentation-only summary named from the localized `Directly in {name}` label. Its amount, count, and transactions are calculated from the root's `directAmount`, `directTransactionCount`, and the root transaction set after removing child transaction IDs. Child percentages and the direct item percentage are recalculated against the drilled root amount, so the focused list and donut reconcile to 100 percent when all items are active.

The derived direct item does not change `CategorySummary`, category persistence, or report aggregation keys. It opens transaction detail but does not expose an include/exclude action because the existing exclusion contract identifies stored categories, while a direct-assignment item is not a stored category. The root filter remains available from the root-level view.

Omitting direct assignments from the focused chart was rejected because the visible child slices would not reconcile with the root total. Adding a persistent synthetic category was rejected because this is a reporting presentation concern rather than category-management data.

### Recompute chart slices from the active hierarchy level

The ranking list is derived from the full tag-scoped hierarchy so excluded stored-category rows stay visible and can be re-included. The donut chart is derived from the active summaries at the currently displayed level:

- An explicitly excluded root contributes zero and all of its descendants are inactive.
- An excluded child contributes zero to its root slice without removing sibling contributions.
- Direct-to-root transactions continue contributing unless the root itself is excluded.
- Roots with zero active amount are omitted from the donut but remain in the ranking list.
- In a focused root, active child amounts and the active direct amount form the donut series; excluded child rows remain in the list but contribute zero to the chart.

`ReportSection` will resolve both root and assigned-category keys for each transaction when calculating `activeTransactions`. This keeps summary cards and monthly trend aligned with the donut. Re-including a root clears exclusions for its descendant keys, preserving the existing parent-filter contract.

Removing an entire root slice whenever any child is excluded was rejected because it would hide still-active sibling categories and misstate the filtered total.

### Preserve scoped detail transactions and fallback buckets

All hierarchy aggregation happens after existing time, account-book, currency, member, and tag scope has been applied. The `transactions` array attached to each summary is the source for `CategoryTransactionsModal`, so a root modal receives the union of its direct and descendant transactions and a child modal receives only its assigned transactions. Changing the scoped inputs prunes expanded or selected keys that no longer exist, preventing stale empty disclosures or modals.

No additional repository query or persistent state is introduced. Category lookup and hierarchy resolution remain pure report aggregation concerns.

## Implementation Contract

**Behavior**

- On either category tab, the initial ranking and donut show only root categories with transactions in the current report scope.
- The user can switch from the root overview to a subcategory-comparison mode where a horizontal bar chart and synchronized ranking list show every child and direct-assignment entry across roots, globally sorted by amount descending.
- Comparison labels use the full root/subcategory path, percentages use the complete active-type amount, colors remain stable by root identity, and bar activation opens the represented transaction detail.
- Changing expense/income tabs restores the root overview instead of carrying comparison mode across transaction types.
- A hierarchy indicator is always visible above the category content: a static localized `All categories` label at the root level, and a back breadcrumb naming the selected root in a focused view.
- The donut center label identifies the current category context: localized `All categories` at the root level and the selected root display name in a focused view; active amount changes do not change this label.
- Activating an eligible root's chart slice or primary row action replaces both the chart and list with that root's child-level composition. A breadcrumb/back control returns both surfaces to the root level.
- The focused level presents child categories and, when non-zero, a localized direct-assignment item so displayed parts reconcile with the selected root total. Focused percentages use the selected root amount as their denominator.
- Changing expense/income tabs resets hierarchy navigation to the root level. A drilled key that disappears after inputs change also returns to the root level.
- Root totals and counts include direct and descendant transactions. Child totals and counts include only transactions assigned to that child. Every displayed percentage is relative to the complete active-type amount before category exclusions, matching the existing list behavior.
- At the root level, displayed percentages remain relative to the complete active-type amount. At the focused level, displayed percentages are relative to the selected root amount. Exclusions update the donut, summary cards, and monthly trend using the active portions of the hierarchy.
- Root and child detail actions open the existing transaction modal with exactly the transactions represented by the selected row.
- In all-books mode, root names merge across books; child names merge only under the same merged root name and currency section.
- Unknown category IDs appear under one non-expandable `Uncategorized` root per transaction type. Broken hierarchy references render as non-expandable named roots instead of dropping transactions.

**Interface and data shape**

- `CategorySummary` retains `key`, `displayName`, `imageUrl`, `totalAmount`, `transactionCount`, `percentage`, and `transactions`, and adds `children: CategorySummary[]`, `directAmount: number`, and `directTransactionCount: number`.
- `groupByCategory(...)` retains its public parameters and returns root `CategorySummary` nodes with nested child summaries.
- Exclusion identity resolution must provide both the root key and assigned-category key for a transaction. Root and child keys remain type-scoped; all-books child keys also include their root name.
- New hierarchy navigation, direct-assignment, filtering, and detail labels are added to both `apps/web/src/i18n/messages/en-US.json` and `apps/web/src/i18n/messages/zh-TW.json`.
- New overview/comparison mode labels and chart accessibility text are added to both locale catalogs.

**Failure and fallback behavior**

- Missing category records use the existing localized `Uncategorized` presentation with no disclosure.
- A missing parent or cyclic parent reference does not throw, recurse indefinitely, or omit a transaction; the known assigned category becomes a top-level fallback.
- A selected or drilled key that disappears after report inputs change is closed or removed from component state.

**Acceptance criteria**

- `apps/web/specs/reportAggregate.spec.ts` demonstrates root roll-up, direct-root amounts, child ordering, parent-scoped all-books merging, and unknown/broken hierarchy fallback.
- `apps/web/specs/reportCategoryBreakdown.spec.tsx` demonstrates synchronized chart/list drill-down, breadcrumb return, direct-assignment reconciliation, separate filter/detail actions, tab reset, leaf detail, and reactive cleanup when summaries change.
- `apps/web/specs/reportCategoryBreakdown.spec.tsx` demonstrates that the hierarchy indicator shows `All categories` at the root level, changes to the focused breadcrumb after drill-down, and returns to the root indicator after navigating back.
- `apps/web/specs/reportCategoryBreakdown.spec.tsx` demonstrates that root and focused donut center labels remain tied to the current hierarchy context while active slices change.
- `apps/web/specs/reportCategoryBreakdown.spec.tsx` demonstrates comparison-mode flattening, full-path labels, global amount ordering, active-type percentages, direct-assignment coverage, bar detail activation, independent filtering, and tab reset.
- `apps/web/specs/reportSection.spec.tsx` demonstrates root and child exclusion propagation into summary and trend data while the full scoped hierarchy remains available to the breakdown.
- `pnpm test:web -- --runInBand` passes.
- `spectra validate group-report-categories-by-parent` passes.

**Scope boundaries**

- In scope: report aggregation types and utilities, report section filtering, category breakdown presentation, localized report strings, and focused web unit tests.
- Out of scope: category storage and management, backend APIs, other report filters, exports, routes, and persistent UI preferences.

## Risks / Trade-offs

- [Risk] A presentation-only direct-assignment item could be mistaken for a stored category. → Use an explicit localized `Directly in {name}` label, omit the category image/filter action, and keep it confined to the focused report view.
- [Risk] Existing tests and call sites construct flat `CategorySummary` fixtures. → Update focused fixtures and keep the existing fields intact while adding required hierarchy fields.
- [Risk] All-books same-name merging can combine intentionally distinct categories. → Preserve the existing root-name contract and narrow child merging to names under the same root.
- [Risk] Hierarchy traversal can encounter malformed data. → Track visited IDs, apply the explicit fallback behavior, and cover it with aggregation tests.
