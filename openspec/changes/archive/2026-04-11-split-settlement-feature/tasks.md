## 1. Route Refactor — URL-based account book selection

- [x] 1.1 Remove `currentAccountBookId` state from `AccountBookStore` — implement URL-based account book selection instead of store state; active account book is derived from the URL parameter `[id]`
- [x] 1.2 Update `pages/index.tsx` so the home page displays account book list and auto-redirects to the first book when account books exist
- [x] 1.3 Create `pages/account-books/[id]/index.tsx` — transaction list is accessible at the account book route (migrated from the current home page)
- [x] 1.4 Update all components that previously read `currentAccountBookId` from the store to read `router.query.id` instead
- [x] 1.5 Handle account book ID not found: show an error state when the `[id]` URL param does not match any account book

## 2. Data Layer — Settlement Entity and Persistence

- [x] 2.1 Create `src/entities/settlement.ts` with `SettlementMemberStatus`, `SettlementTransfer`, and `SettlementRecord` Zod schemas and TypeScript types; define `SettlementRepo` interface — SettlementRecord embeds transfers and memberStatuses
- [x] 2.2 Update `src/lib/dexie.ts` — Dexie schema — modify version(1) directly to add `settlements` table with indexes `&id, accountBookId, createdAt`
- [x] 2.3 Create `src/repositories/settlementRepo/settlementLocalRepo.ts` implementing `SettlementRepo` with Dexie; add `index.ts` re-export

## 3. Calculation Utilities

- [x] 3.1 Create `src/utils/settlementUtils.ts`: implement `computeUnsettledTransactions` — settlement scope is always "all unsettled expenses" (filters out transactions already referenced by non-deleted settlement records)
- [x] 3.2 Implement `computeMemberStatuses` in `settlementUtils.ts` — system calculates per-member balances from unsettled expense transactions (paidAmount − splitAmount = netAmount)
- [x] 3.3 Implement `computeMinimumTransfers` in `settlementUtils.ts` — system generates minimum-transfer suggestions using minimum-transfer greedy algorithm (creditor/debtor matching, round to 2dp, threshold 0.01)

## 4. Settlement Store

- [x] 4.1 Create `src/stores/settlement/settlementStore.ts` — SettlementStore receives transactions as a parameter in `initialize(accountBookId, transactions)`; derives `settledTransactionIds`, `currentMemberStatuses`, and `currentTransferSuggestions` as computed state
- [x] 4.2 Implement `createSettlementRecord` action: captures unsettled transaction IDs, member statuses snapshot, and transfer list; assigns `sequenceNumber` as existing record count + 1 — users can create a settlement record
- [x] 4.3 Implement `completeTransfer` action: marks individual transfers as completed with `actualAmount`, `note`, and `completedAt` timestamp — users can mark individual transfers as completed
- [x] 4.4 Implement `deleteSettlementRecord` action: soft-delete (sets `deletedAt`) — users can soft-delete a settlement record
- [x] 4.5 Create `src/stores/settlement/settlementStoreProvider.tsx` with Provider component and `useSettlementStore` hook; add `index.ts` re-export
- [x] 4.6 Mount `SettlementStoreProvider` in `pages/_app.tsx`

## 5. Settlement UI — Pages and Components

- [x] 5.1 Create `src/components/settlement/UnsettledTransactionList.tsx` — displays expense transactions not yet in any settlement record, with a "確認結帳金額" CTA button
- [x] 5.2 Create `src/components/settlement/SettlementRecordList.tsx` — users can view settlement record history; list items show "第N次結帳 | 日期" with navigation affordance
- [x] 5.3 Create `src/components/settlement/SettlementRecordDetail.tsx` — users can view settlement record detail; shows per-member splitAmount, paidAmount, netAmount, settlement status badge (已結帳/未結帳), transfer list, and collapsible covered transactions section
- [x] 5.4 Create `src/components/settlement/SettlementConfirmModal.tsx` — confirmation modal showing member summaries and minimum-transfer suggestions before creating a settlement record
- [x] 5.5 Create `src/components/settlement/SettlementTransferModal.tsx` — modal for entering actualAmount and note when marking a transfer as completed
- [x] 5.6 Create `pages/account-books/[id]/settlement/index.tsx` — settlement management page with two tabs (未結帳清單 / 結帳記錄); passes current transactions from TransactionStore to SettlementStore
- [x] 5.7 Create `pages/account-books/[id]/settlement/[recordId].tsx` — settlement record detail page

## 6. Integration

- [x] 6.1 Update `src/components/transaction/TransactionList.tsx`: settled transactions display a settled badge — show "已結算" on transactions whose ID is in `settledTransactionIds`
- [x] 6.2 Update `src/components/layout/navbar.tsx` — navbar includes a settlement tab (結帳, `PiArrowsLeftRight` icon) as the third tab, navigating to `/account-books/[id]/settlement`; tab is active when route matches settlement pages
