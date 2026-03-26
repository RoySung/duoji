## Why

The `Category` entity is currently embedded in `entities/transaction.ts` alongside unrelated transaction logic, and category data is served only from static mock arrays. Categories need to be scoped to an account book (`accountBookId`) to support per-book customization, and a reactive store is required so components can consume live category data rather than hard-coded mocks.

## What Changes

- Extract `Category`, `CategorySchema`, and `CategoryRepo` from `entities/transaction.ts` into a dedicated `entities/category.ts` file.
- Add `accountBookId: string` field to the `Category` entity and update `CategorySchema` accordingly; this is a **BREAKING** change to the category data model.
- Create `categoryStore` (Zustand vanilla store + React provider) under `stores/category/`, following the same pattern as `transactionStore`.
- Update `CategoryRepo` interface to add `findByAccountBookId(accountBookId: string): Promise<Category[]>` and update `CategoryLocalRepo` to filter by `accountBookId`.
- Replace all component and utility usages of `expenseCategoryList` / `incomeCategoryList` mock arrays with data sourced from `categoryStore`.
- Update mock data in `mocks/category.ts` to include `accountBookId` for use during store seeding/testing.

## Capabilities

### New Capabilities

- `category-store`: Reactive Zustand store that loads categories scoped to the active account book and exposes them to the component tree via a React context provider.

### Modified Capabilities

- `categories`: Category entity gains `accountBookId`, making categories account-book-scoped; `CategoryRepo` interface gains `findByAccountBookId`.

## Impact

- Affected specs: `category-store` (new), `categories` (modified — account-book-scoped requirement)
- Affected code:
  - `apps/web/src/entities/transaction.ts` — remove Category definitions
  - `apps/web/src/entities/category.ts` — new file
  - `apps/web/src/repositories/categoryRepo/categoryLocalRepo.ts` — add `accountBookId` filtering
  - `apps/web/src/mocks/category.ts` — add `accountBookId` to mock entries
  - `apps/web/src/stores/category/categoryStore.ts` — new file
  - `apps/web/src/stores/category/categoryStoreProvider.tsx` — new file
  - `apps/web/src/stores/category/index.ts` — new file
  - `apps/web/src/components/TransactionModal/CategorySelector.tsx` — use store
  - `apps/web/src/components/TransactionModal/ExpenseForm.tsx` — use store
  - `apps/web/src/components/TransactionModal/IncomeForm.tsx` — use store
  - `apps/web/src/utils/transactionUtils.ts` — update category imports
