## ADDED Requirements

### Requirement: UserRepo interface encapsulates registered user reads

The system SHALL define a `UserRepo` interface in `entities/user.ts` that encapsulates all local database read operations for `RegisteredUser` records. Stores SHALL NOT access the database directly for user queries; they SHALL use an injected `UserRepo` instance instead.

#### Scenario: Fetch registered users by IDs

- **WHEN** `userRepo.findByIds(ids)` is called with an array of user IDs
- **THEN** the implementation SHALL return the `RegisteredUser` records whose `id` is in the provided array
- **THEN** the implementation SHALL return an empty array if no matching records are found

#### Scenario: UserLocalRepo persists to IndexedDB

- **WHEN** `UserLocalRepo.findByIds` is called
- **THEN** it SHALL query the `db.users` Dexie table using `anyOf` on the provided IDs

### Requirement: userStore uses UserRepo via dependency injection

The `createUserStore` factory SHALL accept a `UserRepo` as an injected dependency. It SHALL NOT import or call `db` directly for user reads.

#### Scenario: Store resolves users via repo

- **WHEN** `initialize` is called with a valid `AccountBook`
- **THEN** the store SHALL call `userRepo.findByIds(accountBook.userIds)` to fetch registered users

#### Scenario: Store is testable with a mock repo

- **WHEN** a test creates a `userStore` using a mock `UserRepo`
- **THEN** no real IndexedDB access SHALL occur for registered user resolution
