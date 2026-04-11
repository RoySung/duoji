# user-repo Specification

## Purpose

TBD - created by archiving change 'add-user-repo'. Update Purpose after archive.

## Requirements

### Requirement: UserRepo interface encapsulates registered user reads

The system SHALL define a `UserRepo` interface in `entities/user.ts` that encapsulates all local database read operations for `RegisteredUser` records. Stores SHALL NOT access the database directly for user queries; they SHALL use an injected `UserRepo` instance instead.

#### Scenario: Fetch registered users by IDs

- **WHEN** `userRepo.findByIds(ids)` is called with an array of user IDs
- **THEN** the implementation SHALL return the `RegisteredUser` records whose `id` is in the provided array
- **THEN** the implementation SHALL return an empty array if no matching records are found

#### Scenario: UserLocalRepo persists to IndexedDB

- **WHEN** `UserLocalRepo.findByIds` is called
- **THEN** it SHALL query the `db.users` Dexie table using `anyOf` on the provided IDs


<!-- @trace
source: add-user-repo
updated: 2026-04-11
code:
  - .github/prompts/spectra-debug.prompt.md
  - .github/prompts/spectra-ask.prompt.md
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/mocks/accountBook.ts
  - apps/web/src/pages/_app.tsx
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - .github/skills/spectra-propose/SKILL.md
  - apps/web/src/lib/dexie.ts
  - apps/web/src/stores/user/index.ts
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/.babelrc
  - apps/web/src/stores/transaction/transactionStore.ts
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/components/TransactionModal/PaidByDetailModal.tsx
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/package.json
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/pages/settings.tsx
  - apps/web/src/repositories/settlementRepo/index.ts
  - CLAUDE.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/repositories/userRepo/userLocalRepo.ts
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - AGENTS.md
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/stores/transaction/index.ts
  - apps/web/src/entities/user.ts
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/next.config.js
  - .github/prompts/spectra-apply.prompt.md
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - .github/prompts/spectra-propose.prompt.md
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/repositories/userRepo/index.ts
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - GEMINI.md
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/utils/accountBookUtils.ts
  - .spectra.yaml
  - apps/web/src/pages/account-books/[id]/index.tsx
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/src/entities/settlement.ts
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/stores/user/userStoreProvider.tsx
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - .github/skills/spectra-ingest/SKILL.md
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/TransactionModal/SplitDetailModal.tsx
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/mocks/user.ts
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/entities/transaction.ts
  - phase-1.todo.md
  - apps/web/src/entities/accountBook.ts
  - apps/web/jest.config.ts
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
tests:
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/userStore.spec.ts
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/transactionStore.spec.ts
-->

---
### Requirement: userStore uses UserRepo via dependency injection

The `createUserStore` factory SHALL accept a `UserRepo` as an injected dependency. It SHALL NOT import or call `db` directly for user reads.

#### Scenario: Store resolves users via repo

- **WHEN** `initialize` is called with a valid `AccountBook`
- **THEN** the store SHALL call `userRepo.findByIds(accountBook.userIds)` to fetch registered users

#### Scenario: Store is testable with a mock repo

- **WHEN** a test creates a `userStore` using a mock `UserRepo`
- **THEN** no real IndexedDB access SHALL occur for registered user resolution

<!-- @trace
source: add-user-repo
updated: 2026-04-11
code:
  - .github/prompts/spectra-debug.prompt.md
  - .github/prompts/spectra-ask.prompt.md
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/mocks/accountBook.ts
  - apps/web/src/pages/_app.tsx
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - .github/skills/spectra-propose/SKILL.md
  - apps/web/src/lib/dexie.ts
  - apps/web/src/stores/user/index.ts
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/.babelrc
  - apps/web/src/stores/transaction/transactionStore.ts
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/components/TransactionModal/PaidByDetailModal.tsx
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/package.json
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/pages/settings.tsx
  - apps/web/src/repositories/settlementRepo/index.ts
  - CLAUDE.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/accountBookSettings/UserSection.tsx
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/repositories/userRepo/userLocalRepo.ts
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - AGENTS.md
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/stores/transaction/index.ts
  - apps/web/src/entities/user.ts
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/next.config.js
  - .github/prompts/spectra-apply.prompt.md
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - .github/prompts/spectra-propose.prompt.md
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/repositories/userRepo/index.ts
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - GEMINI.md
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/utils/accountBookUtils.ts
  - .spectra.yaml
  - apps/web/src/pages/account-books/[id]/index.tsx
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/src/entities/settlement.ts
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/stores/user/userStoreProvider.tsx
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - .github/skills/spectra-ingest/SKILL.md
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/TransactionModal/SplitDetailModal.tsx
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/mocks/user.ts
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/entities/transaction.ts
  - phase-1.todo.md
  - apps/web/src/entities/accountBook.ts
  - apps/web/jest.config.ts
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
tests:
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/userStore.spec.ts
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/transactionStore.spec.ts
-->