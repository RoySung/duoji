## Why

duoji supports recording `paidByDetail` (who paid) and `splitDetail` (who shares the cost) per transaction, but has no way to calculate balances or settle debts between members. Users need a settlement flow to see who owes whom, record settlements, and track payment status.

## What Changes

- **BREAKING**: Home page (`/`) changes from transaction list + account book switcher to an account book list. The current active account book is no longer stored in the store — it is derived from the URL parameter.
- New route `/account-books/[id]` replaces the current home page's transaction list view.
- New route `/account-books/[id]/settlement` provides the settlement management page (tab 1: unsettled transactions, tab 2: settlement records).
- New route `/account-books/[id]/settlement/[recordId]` shows settlement record detail (per-member breakdown + transfer status).
- New `SettlementRecord` entity stored in IndexedDB under the account book scope.
- Settlement calculation uses a greedy minimum-transfer algorithm (creditor/debtor matching).
- Settled transactions display a "已結算" (settled) badge in the transaction list.
- Navbar gains a fourth tab: 結帳 (settlement), navigating to the settlement page for the current account book.

## Capabilities

### New Capabilities

- `settlement`: Settlement management — calculate per-member balances from expense transactions, generate minimum-transfer suggestions, create settlement records with member summaries and transfer lists, track individual transfer completion status.
- `account-book-routing`: URL-based account book selection — the active account book is determined by the URL parameter `[id]` rather than stored state. Home page shows account book list with auto-redirect to the first book.

### Modified Capabilities

- `transactions`: Transactions gain a settled state — a transaction included in a settlement record displays a "已結算" badge. No requirement changes to how transactions are created or stored.
- `app-shell-navigation`: Navbar gains a fourth tab (結帳) that navigates to `/account-books/[id]/settlement`.

## Impact

- Affected specs: `settlement` (new), `account-book-routing` (new), `transactions` (settled badge), `app-shell-navigation` (navbar tab)
- Affected code:
  - `apps/web/src/pages/index.tsx` — refactored to account book list
  - `apps/web/src/pages/account-books/[id]/index.tsx` — new, replaces current home transaction view
  - `apps/web/src/pages/account-books/[id]/settlement/index.tsx` — new
  - `apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx` — new
  - `apps/web/src/stores/accountBook/accountBookStore.ts` — remove `currentAccountBookId`
  - `apps/web/src/lib/dexie.ts` — add `settlements` table to schema
  - `apps/web/src/entities/settlement.ts` — new
  - `apps/web/src/repositories/settlementRepo/` — new
  - `apps/web/src/stores/settlement/` — new
  - `apps/web/src/utils/settlementUtils.ts` — new
  - `apps/web/src/components/settlement/` — new components
  - `apps/web/src/components/layout/navbar.tsx` — add settlement tab
  - `apps/web/src/components/transaction/TransactionList.tsx` — settled badge
  - `apps/web/src/pages/_app.tsx` — mount SettlementStoreProvider
