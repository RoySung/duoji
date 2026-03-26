## 1. Entity Extraction and Model Update

- [x] 1.1 Separate `entities/category.ts` from `entities/transaction.ts` — create `apps/web/src/entities/category.ts` with `Category`, `CategorySchema`, `CategoryRepo`, and supporting imports moved out of `transaction.ts`
- [x] 1.2 Add `accountBookId` to `Category` — extend the `Category` type and `CategorySchema` with `accountBookId: string` (categories are scoped to an account book)
- [x] 1.3 Add `CategoryRepo.findByAccountBookId` for scoped loading — add `findByAccountBookId(accountBookId: string): Promise<Category[]>` to the `CategoryRepo` interface in `entities/category.ts`
- [x] 1.4 Remove `Category`, `CategorySchema`, and `CategoryRepo` from `entities/transaction.ts` and update its imports

## 2. Repository Update

- [x] 2.1 Update `CategoryLocalRepo` to implement `findByAccountBookId` — add the scoped query method filtering by `accountBookId` in Dexie
- [x] 2.2 Update Dexie schema to add `accountBookId` index on the categories table and bump the DB version number
- [x] 2.3 Update all `CategoryLocalRepo` import paths to use `@/entities/category`

## 3. Mock Data Update

- [x] 3.1 Add `accountBookId` to all entries in `mocks/category.ts` — seed mock data with `accountBookId` at store initialization (use a placeholder/default value suitable for dev seeding)
- [x] 3.2 Update `mocks/category.ts` import of `Category` to source from `@/entities/category`

## 4. Category Store Implementation

- [x] 4.1 Create `stores/category/categoryStore.ts` — implement Zustand vanilla store + React context (mirror `transactionStore` pattern) to support `A reactive category store loads categories for the active account book`
- [x] 4.2 Implement `initialize(accountBookId)` action — loads categories via `findByAccountBookId`, seeds default categories if none exist for the account book, exposes `expenseCategories` and `incomeCategories` derived lists (separate expense and income categories)
- [x] 4.3 Create `stores/category/categoryStoreProvider.tsx` — React context provider analogous to `TransactionStoreProvider`
- [x] 4.4 Create `stores/category/index.ts` — re-export store, provider, and hooks

## 5. Component Wiring

- [x] 5.1 Update `CategorySelector.tsx` — replace mock imports with category store data (components replace mock imports with store data)
- [x] 5.2 Update `ExpenseForm.tsx` — replace `expenseCategoryList` mock import with store-sourced expense categories (default categories exist for income and expense flows)
- [x] 5.3 Update `IncomeForm.tsx` — replace `incomeCategoryList` mock import with store-sourced income categories (default categories exist for income and expense flows)
- [x] 5.4 Update `transactionUtils.ts` — change any `Category` import from `@/entities/transaction` to `@/entities/category`

## 6. Provider Integration

- [x] 6.1 Add `CategoryStoreProvider` to the app provider tree so the store is available to all components that need it
- [x] 6.2 Wire `initialize` call so the store is seeded when the active account book is set
- [x] 6.3 Automatically seed default categories on account book creation — call `categoryStore.seedDefaults(accountBookId)` (or equivalent) in the account book creation flow so the new book immediately has the default category set available

## 7. Verification

- [x] 7.1 Confirm TypeScript compiles with no errors after all import path updates
- [x] 7.2 Confirm existing tests still pass after entity extraction
