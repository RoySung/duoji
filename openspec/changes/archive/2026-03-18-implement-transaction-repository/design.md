## Context

- Approved specs already require transaction creation, editing, deletion, and local persistence in IndexedDB.
- The current web app has local repositories for account books and categories, but transaction storage is missing: there is no persisted transaction entity, no transaction repository, and no Dexie transactions table.
- The transaction UI currently keeps draft state in modal components, and that layer had started to diverge from the persisted model through a separate Expense alias that omitted identity, discriminator, and timestamp fields.
- Transaction UI save handlers are still TODO, so this change is limited to the data layer foundation that later UI work will consume.

## Goals / Non-Goals

**Goals:**

- Introduce a persisted transaction record shape that fits the project's Zod-first entity pattern.
- Keep transaction-facing form state aligned with that persisted record shape so repository-backed flows have one canonical transaction model.
- Add a local transaction repository that supports CRUD operations and account-book-scoped reads.
- Extend the Dexie schema and add repository-focused tests without changing UI submission flows.

**Non-Goals:**

- Wiring TransactionModal or form components to save through the repository.
- Adding remote sync, analytics, reporting, or transaction summary features.
- Refactoring existing account book or category repositories beyond consistency work needed for transaction storage.

## Decisions

### Define a normalized transaction record schema and repository contract

Use one persisted transaction entity with a type discriminator and shared fields for identity, account book, amount, date, description, tags, category reference, and audit timestamps. Split-related details remain part of the stored record so existing expense inputs can be preserved, while income records can store empty detail arrays.

The same Transaction and TransactionType definitions SHALL also be reused by transaction modal components instead of maintaining a separate Expense alias. Expense form state can initialize temporary id and timestamp values locally until the save flow is wired, which keeps the form layer structurally aligned with repository expectations without introducing a second transaction-shaped type.

Alternative considered: separate expense and income repository contracts, or keeping Expense as a form-only alias / replacing it with a new TransactionDraft type. Rejected because those options duplicate the transaction shape, add maintenance overhead, and do not correspond to any approved behavioral difference in the current scope.

### Add a dedicated IndexedDB transactions store with account-book query indexes

Store transactions in a dedicated Dexie table with indexes for primary key, accountBookId, date, type, and categoryId. This keeps transaction persistence aligned with the existing Dexie repository pattern and supports account-book-scoped reads without rewriting whole account-book records. Alternative considered: embedding transactions inside account book documents. Rejected because selective updates, deletes, and future query support would become harder.

### Match existing local repository result semantics and test strategy

Follow the semantics already used by local repositories in the web app: create throws on duplicate or invalid writes, read methods return nullable or array results, update returns null for missing records, delete returns a boolean, and clear supports local development and test setup. Add repository-level tests that verify CRUD behavior, validation failures, and account-book isolation against IndexedDB. Alternative considered: an exception-only API for every failure mode. Rejected to preserve consistency with current repository consumers.

## Risks / Trade-offs

- [Schema drift between form payloads and stored transactions] → Keep the persisted transaction schema in the transaction entity module and validate repository writes against it.
- [Draft form state now carries temporary persisted-only fields such as id and timestamps] → Treat those values as local placeholders until a later change wires save handlers and server-independent ID generation rules.
- [IndexedDB version upgrades can affect existing local databases] → Add the transactions store with a Dexie version bump and keep initialization idempotent.
- [Initial indexes may not cover every future filter] → Start with account-book and core metadata indexes, then extend only when a new query requirement is approved.

## Migration Plan

- Introduce the transactions table through a Dexie version upgrade so existing local databases remain readable.
- Keep transaction seed data optional; no backfill is required because the repository does not exist yet.
- If rollback is needed during development, removing the new repository and Dexie version block restores the prior behavior.

## Open Questions

- Whether future UI integration will call the repository directly or through a separate store/service layer is deferred to a later change.
- If transaction list queries need pagination or additional sorting helpers, those behaviors should be proposed separately.
