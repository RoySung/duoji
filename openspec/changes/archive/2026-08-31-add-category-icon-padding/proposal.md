## Why

Category icons in the transaction selector and report breakdown fill their Avatar bounds without an internal buffer, making the artwork appear visually cramped against nearby content.

## What Changes

- Add a visual requirement that category icon images in the transaction selector have 2px internal padding and those in the report category breakdown have 4px internal padding, while preserving their existing Avatar dimensions and interaction behavior.

## Capabilities

### New Capabilities

- category-icon-presentation: Defines the visible inset treatment for category image icons in the transaction selector and report breakdown.

### Modified Capabilities

- (none)

## Impact

- Affected specs: category-icon-presentation
- Affected code:
  - Modified: apps/web/src/components/TransactionModal/CategorySelector.tsx
  - Modified: apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - Modified: apps/web/specs/categoryMemberPresentation.spec.tsx
  - Modified: apps/web/specs/reportCategoryBreakdown.spec.tsx
  - New: none
  - Removed: none
