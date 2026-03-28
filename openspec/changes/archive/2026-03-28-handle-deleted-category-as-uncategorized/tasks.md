## 1. Core Logic Fix

- [x] 1.1 Implement `resolveTransactionCategoryId` returns empty string for missing categories — update `transactionUtils.ts` so when `currentCategoryId` is not found in categories list, the function returns `''` instead of falling back to `getDefaultTransactionCategoryId`
- [x] 1.2 Add unit tests in `transactionUtils.spec.ts` verifying `resolveTransactionCategoryId` returns `''` when category does not exist in the provided list

## 2. Transaction List Display

- [x] 2.1 Update fallback label in `TransactionList.tsx` — implement fallback label "未分類" (not "Uncategorized") for transactions with a deleted category display as uncategorized
- [x] 2.2 Update Avatar `name` fallback in `TransactionList.tsx` from `'Transaction'` to `'未分類'` to be consistent

## 3. Edit Modal Behaviour

- [x] 3.1 Verify editing a transaction with a deleted category requires re-selection — confirm `isSaveDisabled` in `TransactionModal.tsx` already blocks save when `draft.categoryId` is `''` (no CategorySelector changes needed); add or update test in `homeTransactions.spec.tsx` covering the scenario where a transaction's category no longer exists
- [x] 3.2 No CategorySelector changes needed — confirm `findRootCategoryId` with empty `selectedCategoryId` produces no highlighted tab (read-only verification, no code change)
