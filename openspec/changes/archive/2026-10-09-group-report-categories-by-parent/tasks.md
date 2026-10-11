<!--
Each task description MUST state:
- the behavior or contract being delivered (what is observably true when the
  task is complete), and
- the verification target that proves completion (test, CLI invocation,
  analyzer check, manual assertion, or content review).

File paths are supporting context for locating the work, never the task
itself. "Edit file X" is not a valid task — it is missing both behavior and
verification.
-->

## 1. Hierarchical aggregation

- [x] 1.1 Add focused `groupByCategory` test cases in `apps/web/specs/reportAggregate.spec.ts` for the **Report page displays category breakdown** requirement: root roll-up, direct-root transactions, child ordering and percentages, all-books parent-scoped merging, a single unknown-category bucket, and missing/cyclic-parent fallback; verify the new cases fail against the current flat aggregation with `pnpm test:web -- --runInBand apps/web/specs/reportAggregate.spec.ts`.
- [x] 1.2 [after: 1.1] Implement **Aggregate root summaries with nested child summaries** and **Use parent-scoped names when merging all-books detail rows** in `CategorySummary`, `groupByCategory`, and hierarchy identity helpers so the tested root/child amounts, transaction sets, ordering, keys, and fallbacks are returned; verify `pnpm test:web -- --runInBand apps/web/specs/reportAggregate.spec.ts` passes.

## 2. Hierarchy-aware report state

- [x] 2.1 [after: 1.2] Add `ReportSection` tests in `apps/web/specs/reportSection.spec.tsx` proving root exclusions remove direct and descendant transactions, child exclusions retain active siblings, and the full tag-scoped hierarchy still reaches the breakdown; verify the new assertions fail before the section logic changes with `pnpm test:web -- --runInBand apps/web/specs/reportSection.spec.tsx`.
- [x] 2.2 [after: 2.1] Implement **Recompute chart slices from active hierarchy** and **Preserve scoped detail transactions and fallback buckets** in `ReportSection` and its aggregation inputs so summary cards, the donut input, and monthly trend agree after root or child exclusion while detail rows retain their scoped transactions; verify `pnpm test:web -- --runInBand apps/web/specs/reportSection.spec.tsx apps/web/specs/reportAggregate.spec.ts` passes.

## 3. Expandable category presentation

- [x] 3.1 [after: 2.2] Add `ReportCategoryBreakdown` interaction tests in `apps/web/specs/reportCategoryBreakdown.spec.tsx` for initially collapsed roots, accessible expand/collapse, root-only donut series, nested child rows, independent include/exclude and detail actions, correct root/child modal data, and stale selection cleanup; verify the new cases fail against the current flat list with `pnpm test:web -- --runInBand apps/web/specs/reportCategoryBreakdown.spec.tsx`.
- [x] 3.2 [after: 3.1] Implement **Keep expansion separate from filtering and drill-down** in `ReportCategoryBreakdown` and add matching English and Traditional Chinese labels so each action is independently keyboard-accessible and expansion never changes chart grouping or filters; verify `pnpm test:web -- --runInBand apps/web/specs/reportCategoryBreakdown.spec.tsx` passes.

## 4. Integrated verification

- [x] 4.1 [after: 3.2] Confirm the complete web test suite and production build preserve existing report filters, transaction detail editing, and responsive rendering alongside the hierarchy by running `pnpm test:web -- --runInBand` and `pnpm build:web`, with both commands exiting successfully.
- [x] 4.2 [after: 4.1] Confirm the completed change remains consistent with its proposal, design, and modified reports contract by running `spectra analyze group-report-categories-by-parent --json` with no Critical or Warning findings and `spectra validate group-report-categories-by-parent` successfully.

## 5. Synchronized hierarchy navigation

- [x] 5.1 [after: 4.2] Update `apps/web/specs/reportCategoryBreakdown.spec.tsx` for the **Report page displays category breakdown** requirement and the **Synchronize chart and list drill-down** decision, proving that a root row or matching donut slice opens the same focused child-level chart and list, breadcrumb navigation returns to root categories, changing tabs resets the level, filtering and transaction detail remain independent, leaf activation opens detail, and stale drilled state is cleared; verify the focused cases fail before the presentation changes with `pnpm test:web -- --runInBand apps/web/specs/reportCategoryBreakdown.spec.tsx`.
- [x] 5.2 [after: 5.1] Implement **Synchronize chart and list drill-down** and **Recompute chart slices from the active hierarchy level** in `ReportCategoryBreakdown`, with matching English and Traditional Chinese labels, so the chart and list always show one shared hierarchy level and all navigation/filter/detail controls remain keyboard accessible; verify `pnpm test:web -- --runInBand apps/web/specs/reportCategoryBreakdown.spec.tsx` passes.

## 6. Direct-assignment composition and verification

- [x] 6.1 [after: 5.2] Add focused assertions for **Represent direct root assignments in the focused level**, proving a localized direct-assignment item contains only direct transactions, focused values reconcile to the root amount, focused percentages use the root denominator, and the derived item has detail but no exclusion action; verify these cases fail before the derived presentation summary is implemented with `pnpm test:web -- --runInBand apps/web/specs/reportCategoryBreakdown.spec.tsx`.
- [x] 6.2 [after: 6.1] Implement **Represent direct root assignments in the focused level** without changing persisted categories or `CategorySummary`, then confirm the full web suite, production build, and Spectra artifacts remain valid by running `pnpm test:web -- --runInBand`, `pnpm build:web`, `spectra analyze group-report-categories-by-parent --json`, and `spectra validate group-report-categories-by-parent` successfully.

## 7. Fixed category context label

- [x] 7.1 [after: 6.2] Add focused assertions for **Keep the current category label fixed in the donut** in `apps/web/specs/reportCategoryBreakdown.spec.tsx`, proving the root label identifies all categories, the focused label identifies the selected root, and child exclusion does not change the focused label; verify the cases fail before the label logic changes with `pnpm test:web -- --runInBand apps/web/specs/reportCategoryBreakdown.spec.tsx`.
- [x] 7.2 [after: 7.1] Implement **Keep the current category label fixed in the donut** in `ReportCategoryBreakdown` with localized root and focused labels derived from category hierarchy state, then verify the focused test, full web suite, production build, `spectra analyze group-report-categories-by-parent --json`, and `spectra validate group-report-categories-by-parent` all succeed.

## 8. Persistent hierarchy indicator

- [x] 8.1 [after: 7.2] Add focused assertions for the **Report page displays category breakdown** requirement and **Keep the current hierarchy indicator visible at every level** in `apps/web/specs/reportCategoryBreakdown.spec.tsx`, proving a static `All categories` indicator is visible at the root level, drill-down replaces it with the existing `All categories / Food` back breadcrumb, and returning restores the root indicator; verify the new root assertion fails before the presentation changes with `pnpm test:web -- --runInBand apps/web/specs/reportCategoryBreakdown.spec.tsx`.
- [x] 8.2 [after: 8.1] Implement **Keep the current hierarchy indicator visible at every level** in `ReportCategoryBreakdown` so the root context is always visible without a misleading interactive control and focused navigation remains keyboard accessible, then verify the focused test, full web suite, production build, `spectra analyze group-report-categories-by-parent --json`, and `spectra validate group-report-categories-by-parent` all succeed.

## 9. Cross-root subcategory comparison

- [x] 9.1 [after: 8.2] Add `ReportCategoryBreakdown` interaction tests for the **Report page displays category breakdown** requirement and **Compare all subcategories with a horizontal bar chart** decision, proving comparison mode flattens child and direct-assignment entries across roots, uses full-path labels, globally sorts by amount, calculates percentages against the active-type total, opens represented detail from bars, keeps filtering independent, and resets to overview on tab change; verify the focused cases fail before implementation with `pnpm test:web -- --runInBand apps/web/specs/reportCategoryBreakdown.spec.tsx`.
- [x] 9.2 [after: 9.1] Implement **Compare all subcategories with a horizontal bar chart** in `ReportCategoryBreakdown` with matching English and Traditional Chinese labels so the existing root donut drill-down remains the default while the comparison chart and synchronized list expose cross-root ranking and existing actions; verify the focused test, full web suite, production build, `spectra analyze group-report-categories-by-parent --json`, and `spectra validate group-report-categories-by-parent` all succeed.

## 10. Review corrections

- [x] 10.1 [after: 9.2] Add `ReportCategoryBreakdown` regression tests for the **Report page displays category breakdown** requirement and the **Represent direct root assignments in the focused level** and **Recompute chart slices from the active hierarchy level** decisions, proving focused child and direct-assignment entries are jointly sorted by amount and re-including a root clears descendant exclusions even when a descendant is outside the current report scope; verify the focused cases fail before the corrective implementation with `pnpm test:web -- --runInBand apps/web/specs/reportCategoryBreakdown.spec.tsx`.
- [x] 10.2 [after: 10.1] Correct focused composition ordering and root re-inclusion in `ReportCategoryBreakdown` and its hierarchy inputs so direct-assignment entries participate in stable amount ordering and every stored descendant exclusion is cleared independently of the current report scope; verify the focused test, full web suite, source type check, `spectra analyze group-report-categories-by-parent --json`, and `spectra validate group-report-categories-by-parent` all succeed.
