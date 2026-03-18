## 1. Data model and storage setup

- [x] 1.1 Define a normalized transaction record schema and repository contract in `apps/web/src/entities/transaction.ts`.
- [x] 1.2 Add a dedicated IndexedDB transactions store with account-book query indexes in `apps/web/src/lib/dexie.ts`.
- [x] 1.3 Implement Define a normalized transaction record schema and repository contract by removing the standalone Expense alias and reusing Transaction and TransactionType across `apps/web/src/entities/transaction.ts` and the transaction modal components.

## 2. Repository implementation

- [x] 2.1 Implement Transaction records persist through a dedicated repository in `apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts` and its public export.
- [x] 2.2 Implement Transaction queries remain scoped to the target account book through repository read methods for transaction ID and account-book-scoped lists.
- [x] 2.3 Implement Local transaction data can be cleared for development workflows through repository delete and clear behavior.

## 3. Verification

- [x] 3.1 Match existing local repository result semantics and test strategy with transaction repository coverage in `apps/web/specs/`.
- [x] 3.2 Validate the `transaction-storage` scenarios for create, update, delete, invalid writes, and account-book isolation.
- [x] 3.3 Validate the aligned transaction modal typing by running `pnpm nx build web` after the Transaction and TransactionType consolidation.
