## Context

duoji is a local-first personal finance app (Next.js 15, Pages Router, Zustand, Dexie/IndexedDB). Currently the home page (`/`) handles both account book selection via a store-backed `currentAccountBookId` state and the transaction list for the active book. There is no settlement capability despite the `paidByDetail` and `splitDetail` fields already existing on every `Transaction`.

The current architecture:
- `AccountBookStore` holds `currentAccountBookId` — the single source of truth for which book is active
- All pages/components that need the active book subscribe to this store value
- The transaction list, category store, user store, and settlement store would all need to scope to the same book

## Goals / Non-Goals

**Goals:**
- Replace store-backed book selection with URL-based selection (`/account-books/[id]`)
- Add settlement entity, repository, store, and calculation utilities
- Add settlement management pages under `/account-books/[id]/settlement`
- Show a "已結算" badge on settled transactions in the transaction list
- Add a settlement tab to the navbar

**Non-Goals:**
- Server-side sync — all data remains local IndexedDB only
- Partial transaction selection for settlement — always settle all unsettled expenses
- Currency conversion — settlement amounts use the account book's currency
- Push notifications for settlement requests

## Decisions

### URL-based account book selection instead of store state

The `currentAccountBookId` is removed from `AccountBookStore`. Pages that need the active book read `router.query.id` and pass it to store `initialize()` calls.

**Why over store state**: URL state is shareable, bookmarkable, and survives page refresh without rehydration complexity. It also eliminates the need for a "current book" synchronization mechanism across stores.

**Home page behavior**: `pages/index.tsx` reads `accountBooks` from the store. If books exist, it calls `router.replace('/account-books/' + books[0].id)` immediately. If no books exist it shows an empty state with a "新增帳本" link.

### SettlementRecord embeds transfers and memberStatuses

`SettlementRecord` contains `transfers: SettlementTransfer[]` and `memberStatuses: SettlementMemberStatus[]` as embedded arrays rather than separate IndexedDB tables.

**Why**: The query pattern is always "fetch a record with all its data". There is no requirement to query transfers independently. Embedding reduces IndexedDB table count and simplifies serialization.

### Settlement scope is always "all unsettled expenses"

When creating a settlement record, the system automatically includes every `expense` transaction in the account book that is not referenced by any existing non-deleted `SettlementRecord.transactionIds`.

**Why**: Simplifies UX — no selection step. Keeps the data model clean: a transaction's settled status is derived from whether its `id` appears in any settlement record's `transactionIds`.

### Minimum-transfer greedy algorithm

Balance each member's net position (paid − split), then greedily match the largest creditor against the largest debtor until all balances reach zero.

**Why**: Produces the fewest possible transfers for the common case (n members → at most n−1 transfers). The algorithm runs in O(n log n) time, which is acceptable since n < 50 for typical account books.

**Floating-point handling**: All intermediate amounts are rounded to 2 decimal places (cents). A balance is considered zero when `|balance| < 0.01`.

### SettlementStore receives transactions as a parameter

The `initialize(accountBookId, transactions)` and related actions accept `Transaction[]` as a parameter rather than reading from `TransactionStore` directly.

**Why**: Avoids cross-store dependencies. Consistent with how `UserStore.initialize` accepts an `AccountBook` parameter. The calling page subscribes to both stores and passes data down.

### Dexie schema — modify version(1) directly

The `settlements` table is added to the existing `version(1)` schema definition. No migration version is created.

**Why**: This is a local dev/prototype app with no production data to preserve. Users are expected to clear IndexedDB if they encounter schema mismatch errors during development.

## Risks / Trade-offs

[Dexie schema conflict] If a user's browser already has version(1) without `settlements`, opening the app will fail silently or throw a Dexie schema error. → Mitigation: Document that developers should clear IndexedDB (`indexedDB.deleteDatabase('DuojiDB')`) after pulling this change.

[URL navigation on home page] Auto-redirect on home page could cause a flash. → Mitigation: Render nothing (or a spinner) until `accountBooks` is initialized, then redirect.

[Settled badge performance] Checking whether a transaction is settled requires building a `Set<string>` from all settlement records' `transactionIds`. For large account books this could be O(n*m). → Mitigation: Store `settledTransactionIds: Set<string>` as derived state in `SettlementStore`, rebuilt only when settlement records change.

## Open Questions

- Should the "已結算" badge be visible in the transaction edit modal? (Out of scope for this change — can be added later.)
- Should deleting a settlement record un-settle its transactions? (Yes — soft-deleting a record removes its `transactionIds` from the settled set, since `computeUnsettledTransactions` filters out deleted records.)
