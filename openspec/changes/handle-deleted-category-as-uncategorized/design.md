## Context

The app stores a `categoryId` string on each transaction. Categories can be hard-deleted (including cascade-delete of sub-categories) from the Category Settings page. After deletion, affected transactions still hold the old `categoryId`, which no longer resolves to any category object.

Currently:

- `TransactionList` shows `"Uncategorized"` (English) as a silent fallback when the categoryId lookup fails.
- `createTransactionDraft` (via `resolveTransactionCategoryId`) silently replaces a missing categoryId with the first available category of the same type when building the edit draft — the user has no indication their category was deleted.

## Goals / Non-Goals

**Goals:**

- Display "未分類" (Traditional Chinese) wherever a transaction's category cannot be resolved.
- Preserve the uncategorized state (empty `categoryId`) in edit modal when the original category is missing, keeping the save button disabled until the user explicitly selects a replacement.
- No database migration: existing dangling categoryIds are handled purely at the display/utility layer.

**Non-Goals:**

- Soft-deleting categories (out of scope for this fix).
- Retroactively cleaning or re-assigning dangling categoryIds in the database.
- Changing the `Transaction` or `Category` entity schemas.

## Decisions

### `resolveTransactionCategoryId` returns empty string for missing categories

**Decision**: When the `currentCategoryId` is not found in the provided categories list, return `''` instead of falling back to `getDefaultTransactionCategoryId`.

**Rationale**: Silently re-assigning a category overwrites user data without consent. Returning `''` preserves fidelity to the original record and lets `isSaveDisabled` (which already checks `!draft.categoryId`) block silent saves.

**Alternative considered**: Auto-assign first available category — rejected because the user would not know their category was deleted and might save incorrect categorization.

### Fallback label "未分類" (not "Uncategorized")

**Decision**: Replace the English fallback `"Uncategorized"` with the Traditional Chinese `"未分類"` in both the transaction list heading and the Avatar `name` fallback.

**Rationale**: The app targets Traditional Chinese users. Mixing English fallback text is inconsistent with the app's language conventions.

### No CategorySelector changes needed

**Decision**: `CategorySelector` does not need modification.

**Rationale**: When `selectedCategoryId` is `''`, `findRootCategoryId` returns `undefined` so no tab or child category is highlighted — this already expresses "no selection" visually.

## Risks / Trade-offs

- [Risk] Existing transactions with a dangling `categoryId` will now show "未分類" and be non-saveable in edit modal until re-categorized. → Mitigation: This is the intended behavior; users can always re-select a category to save.
- [Risk] `resolveTransactionCategoryId` is used by `createTransactionDraft` for edit mode only. The new build (new transaction) path uses `getDefaultTransactionCategoryId` which is unchanged and always picks an available category. → No regression for new transaction creation.
