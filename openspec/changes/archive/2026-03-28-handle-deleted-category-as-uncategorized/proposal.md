## Why

When a category is hard-deleted, transactions that referenced it still hold the deleted `categoryId`. Currently the list displays "Uncategorized" in English as a silent fallback, and opening the edit modal silently replaces the category with the first available one—overwriting user data without consent. This needs to be fixed so deleted-category transactions display "未分類" consistently and the edit modal preserves the uncategorized state until the user explicitly selects a new category.

## What Changes

- Transaction list fallback label changes from English `"Uncategorized"` to Traditional Chinese `"未分類"`
- `resolveTransactionCategoryId` in `transactionUtils.ts` returns `''` (empty) when the existing `categoryId` is not found in the current category list, instead of falling back to the first available category
- Edit modal's save button remains disabled when `categoryId` is empty, forcing the user to re-select a category before saving
- Avatar `name` fallback in `TransactionList` updated to `'未分類'` for consistency

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `categories`: Transactions that reference a deleted category SHALL display as "未分類" in the transaction list
- `transactions`: When editing a transaction whose category no longer exists, the system SHALL NOT auto-assign a replacement category; the user MUST manually select a category before saving

## Impact

- Affected specs: `categories`, `transactions`
- Affected code:
  - `apps/web/src/components/transaction/TransactionList.tsx`
  - `apps/web/src/utils/transactionUtils.ts`
  - `apps/web/specs/transactionUtils.spec.ts`
  - `apps/web/specs/homeTransactions.spec.tsx`
