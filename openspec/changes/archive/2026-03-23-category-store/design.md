## Context

The `Category` entity is currently co-located in `entities/transaction.ts` alongside transaction schemas and the `TransactionRepo` interface, making the module responsible for two unrelated domain concerns. Category data is served entirely from static mock arrays (`expenseCategoryList`, `incomeCategoryList`) imported directly in components, with no reactive state layer. The existing `CategoryLocalRepo` already persists categories to IndexedDB but is not wired to any store.

The project follows the Zustand vanilla store + React context provider pattern established by `transactionStore` and `accountBookStore`.

## Goals / Non-Goals

**Goals:**

- Extract `Category`, `CategorySchema`, `CategoryRepo` into `entities/category.ts`.
- Add `accountBookId` to the `Category` model so categories are scoped per account book.
- Implement `categoryStore` (Zustand) with a `findByAccountBookId`-scoped load, following the `transactionStore` pattern.
- Create a `CategoryStoreProvider` React context provider analogous to `TransactionStoreProvider`.
- Replace mock array imports in `CategorySelector`, `ExpenseForm`, and `IncomeForm` with store-sourced data.
- Update `CategoryLocalRepo` to support `findByAccountBookId` and include `accountBookId` in its Dexie queries.
- Seed mock data with a valid `accountBookId` for dev/test usage.

**Non-Goals:**

- No UI for creating, editing, or deleting categories (Phase 1 scope uses default seeded categories only).
- No backend sync; categories remain local-only.
- No migration of existing IndexedDB records (dev environment assumed clean or cleared on schema change).

## Decisions

### Separate `entities/category.ts` from `entities/transaction.ts`

`Transaction` and `Category` are distinct domain concepts. Co-location in `transaction.ts` couples them at import time and grows the module. Extraction follows the same pattern used for `entities/accountBook.ts`.

`TransactionSchema` references `categoryId: z.string()` only — no direct Category import is needed. `entities/transaction.ts` can drop the Category definitions with no circular dependency risk.

### Add `accountBookId` to `Category`

Categories will eventually be customizable per account book. Introducing `accountBookId` now aligns the data model with that direction and mirrors the scoping pattern already used in `Transaction`. Default seeded categories will use the active account book's ID at seed time.

Alternative considered: a shared "global" category pool keyed to a system constant. Rejected because it conflicts with the per-book customization direction and complicates future user-owned categories.

### Zustand vanilla store + React context (mirror `transactionStore` pattern)

`transactionStore` already establishes this pattern: `createTransactionStore` produces a vanilla store, `TransactionStoreProvider` wraps it in React context, and `useTransactionStore` is the consumer hook. Reusing this pattern for `categoryStore` keeps the architecture consistent and avoids Redux-style global singletons.

### `CategoryRepo.findByAccountBookId` for scoped loading

The store needs to load only the categories relevant to the active account book. Adding `findByAccountBookId` to `CategoryRepo` keeps the filtering concern in the repository layer and avoids loading all categories and filtering in the store.

### Seed mock data with `accountBookId` at store initialization

Rather than removing mock usage immediately, the store's `initialize` method will seed default categories (from updated `mocks/category.ts`) if none exist for the given `accountBookId`. This preserves existing dev/test data coverage while enabling the migration path.

## Risks / Trade-offs

- **[Risk] Breaking change to `Category` type** → All files importing `Category` from `entities/transaction` need updating. Mitigation: TypeScript will surface every import error at compile time; the impact list in the proposal covers all known sites.
- **[Risk] Dexie schema version** → Adding `accountBookId` to the categories table requires a Dexie schema migration. Mitigation: bump the Dexie version number and add the `accountBookId` index; in dev, assume a clean DB or use `clear()`.
- **[Risk] Mock data `accountBookId` value** → Seeded mock categories need a valid `accountBookId` that exists in the DB. Mitigation: the store's `initialize(accountBookId)` call receives the active account book ID and seeds categories using that value.
