## MODIFIED Requirements

### Requirement: UserRepo interface encapsulates registered user reads and writes

The system SHALL define a `UserRepo` interface in `entities/user.ts` that encapsulates all local database operations for `RegisteredUser` records, including both read and write operations. Stores SHALL NOT access the database directly for user queries or mutations; they SHALL use an injected `UserRepo` instance instead.

#### Scenario: Fetch registered users by IDs

- **WHEN** `userRepo.findByIds(ids)` is called with an array of user IDs
- **THEN** the implementation SHALL return the `RegisteredUser` records whose `id` is in the provided array
- **THEN** the implementation SHALL return an empty array if no matching records are found

#### Scenario: Create a new registered user

- **WHEN** `userRepo.create(user)` is called with a valid `RegisteredUser` object
- **THEN** the implementation SHALL persist the user record to local storage
- **THEN** the persisted record SHALL be retrievable by `findByIds([user.id])`

#### Scenario: UserLocalRepo persists to IndexedDB

- **WHEN** `UserLocalRepo.findByIds` is called
- **THEN** it SHALL query the `db.users` Dexie table using `anyOf` on the provided IDs

- **WHEN** `UserLocalRepo.create` is called with a `RegisteredUser`
- **THEN** it SHALL write the record to `db.users` using a put operation (upsert semantics)

## MODIFIED Requirements

### Requirement: userStore uses UserRepo via dependency injection

The `createUserStore` factory SHALL accept a `UserRepo` as an injected dependency. It SHALL NOT import or call `db` directly for user reads or writes.

#### Scenario: Store resolves users via repo

- **WHEN** `initialize` is called with a valid `AccountBook`
- **THEN** the store SHALL call `userRepo.findByIds(accountBook.userIds)` to fetch registered users

#### Scenario: Store creates users via repo

- **WHEN** `createRegisteredUser(name, email)` is called on the store
- **THEN** the store SHALL call `userRepo.create(user)` to persist the new user
- **THEN** the store SHALL NOT access `db` directly

#### Scenario: Store is testable with a mock repo

- **WHEN** a test creates a `userStore` using a mock `UserRepo`
- **THEN** no real IndexedDB access SHALL occur for registered user resolution or creation
