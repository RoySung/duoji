## 1. Person Entity and Data Model

- [x] 1.1 Create `apps/web/src/entities/person.ts` implementing Person as a discriminated union (`type: 'user' | 'virtual'`) — covers "Person as a discriminated union" design decision
- [x] 1.2 Add `VirtualUser` schema and type to `person.ts` with fields `id`, `name`, `accountBookId`, `createdAt`, `updatedAt` — covers "VirtualUser stored as an embedded array on AccountBook" design decision
- [x] 1.3 Update `AccountBookSchema` in `apps/web/src/entities/accountBook.ts` to add `virtualUsers: VirtualUser[]` field — ensures account books support a people list with registered and virtual users
- [x] 1.4 Update `AccountBookRepo` interface in `accountBook.ts` to support updating `virtualUsers`

## 2. Transaction Schema Migration

- [x] 2.1 Update `PaidByDetailItemSchema` and `SplitDetailItemSchema` in `apps/web/src/entities/transaction.ts` to use `{ personId: string, personType: 'user' | 'virtual', amount: number }` — covers "Transaction references PersonId, not the full Person object" design decision
- [x] 2.2 Rename `receivedByUserId` to `receivedByPersonId` in `TransactionSchema` — covers "receivedByUserId → receivedByPersonId" design decision
- [x] 2.3 Write a Dexie startup migration in `apps/web/src/lib/dexie.ts` that converts existing embedded user objects in `paidByDetail` and `splitDetail` to person-reference format — covers "Data migration converts embedded user objects to person references"

## 3. People Store

- [x] 3.1 Create `apps/web/src/stores/people/peopleStore.ts` that merges `userIds` (resolved to Users) and `virtualUsers` into a unified `Person[]` list for the active account book — covers "New peopleStore scoped to active account book" design decision
- [x] 3.2 Create `apps/web/src/stores/people/index.ts` exporting the people store
- [x] 3.3 Add actions to `peopleStore`: `addVirtualUser`, `renameVirtualUser`, `removeVirtualUser` — covers "Users can create a virtual user in an account book", "Users can rename a virtual user", "Users can remove a virtual user from an account book"
- [x] 3.4 Wire `peopleStore` to reload when the active account book changes in `accountBookStore`

## 4. Account Book Settings — People Management UI

- [x] 4.1 Add a People section component to the account book settings page that lists all people (registered + virtual) — covers "Account book settings include a People management section"
- [x] 4.2 Implement Add Virtual User form in settings (name input + submit) — covers "Add a virtual user from settings" scenario
- [x] 4.3 Implement Remove virtual user button with confirmation in settings — covers "Remove a virtual user from settings" scenario
- [x] 4.4 Update `AccountBook` settings page to display people list using the `peopleStore` — covers "Users can manage personal account books" modified requirement ("display … people list in an editable form")

## 5. Transaction Form — Person Pickers

- [x] 5.1 Update payer picker in `TransactionModal` to load options from `peopleStore` (registered and virtual users) — covers "Transaction form allows selecting people from the account book" and "Select a registered user as payer" scenario
- [x] 5.2 Update payer picker to display virtual users alongside registered users — covers "Select a virtual user as payer" scenario
- [x] 5.3 Update split-participant picker in `TransactionModal` to load all people from `peopleStore` — covers "Select participants for expense split" scenario
- [x] 5.4 Update income transaction `receivedByPersonId` picker to use `peopleStore` — covers "Users can record income and expense transactions" modified requirement

## 6. Repo and Persistence

- [x] 6.1 Update `accountBookLocalRepo.ts` to persist and retrieve `virtualUsers` array as part of account book documents
- [x] 6.2 Update `transactionLocalRepo.ts` to store and retrieve the new `personId`/`personType`/`receivedByPersonId` fields correctly

## 7. Tests and Mocks

- [x] 7.1 Update `apps/web/src/mocks/accountBook.ts` mock data to include sample `virtualUsers`
- [x] 7.2 Update transaction mocks to use the new `personId`/`personType` format for `paidByDetail` and `splitDetail`
- [x] 7.3 Verify the Dexie migration runs correctly on startup with existing data — covers "Migrate existing transactions on startup" scenario
