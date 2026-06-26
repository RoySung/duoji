## ADDED Requirements

### Requirement: A virtual user can be marked as a shared wallet

The system SHALL allow marking a virtual user as a shared wallet via an `isSharedWallet` boolean field on the `VirtualUser` entity. A shared wallet represents a communal fund account whose expenses and income are logically distributed among all real members of the account book.

The `isSharedWallet` field SHALL default to `false` and SHALL be optional to ensure backward compatibility with existing virtual user records.

#### Scenario: Create a virtual user marked as shared wallet

- **WHEN** a user creates a new virtual user in the account book settings and enables the "shared wallet" toggle
- **THEN** the system SHALL persist the virtual user with `isSharedWallet: true`

#### Scenario: Create a regular virtual user

- **WHEN** a user creates a new virtual user without enabling the "shared wallet" toggle
- **THEN** the system SHALL persist the virtual user with `isSharedWallet: false`

#### Scenario: Edit a virtual user to toggle shared wallet status

- **WHEN** a user edits an existing virtual user and changes the "shared wallet" toggle
- **THEN** the system SHALL persist the updated `isSharedWallet` value

---

### Requirement: Each account book has at most one shared wallet

The system SHALL enforce that at most one virtual user per account book can be marked as a shared wallet. When a shared wallet already exists in an account book, the shared wallet toggle for other virtual users SHALL be disabled with a descriptive tooltip or message.

#### Scenario: Attempt to create a second shared wallet

- **WHEN** an account book already has a virtual user with `isSharedWallet: true` and the user tries to create or edit another virtual user to set `isSharedWallet: true`
- **THEN** the system SHALL prevent the action by disabling the shared wallet toggle and displaying a message indicating that a shared wallet already exists

#### Scenario: Existing shared wallet is deleted

- **WHEN** the virtual user marked as shared wallet is deleted (soft-delete)
- **THEN** the system SHALL allow another virtual user to be marked as shared wallet

---

### Requirement: Shared wallet member is visually distinguished in the people list

The system SHALL display a distinct visual indicator (icon or badge) next to a shared wallet virtual user in the account book's people list, so users can immediately identify which member represents the shared wallet.

#### Scenario: Shared wallet member displays visual indicator

- **WHEN** the people list renders a virtual user with `isSharedWallet: true`
- **THEN** the system SHALL display a wallet icon or badge next to the member's name

#### Scenario: Regular virtual user has no wallet indicator

- **WHEN** the people list renders a virtual user with `isSharedWallet: false`
- **THEN** the system SHALL NOT display the wallet indicator

---

### Requirement: Report member filter excludes shared wallet from selectable members

The member filter selector on the report page SHALL NOT include the shared wallet virtual user as a selectable filter option. The shared wallet's amounts are distributed to real members and selecting the shared wallet itself would produce misleading results.

#### Scenario: Shared wallet excluded from member filter options

- **WHEN** the report page derives available member filter options from transactions that include a shared wallet member in `splitDetail` or as `receivedByUserId`
- **THEN** the shared wallet member SHALL NOT appear in the member filter selector's option list

---

### Requirement: Report member filter distributes shared wallet amounts to the selected member

When a member filter is active on the report page, the report calculations SHALL include the selected member's proportional share of any shared wallet amounts, in addition to the member's direct amounts.

For an expense transaction, the selected member's effective amount SHALL be:
- Their direct `splitDetail` amount (if present), PLUS
- The shared wallet's `splitDetail` amount divided by the number of real members in the account book (excluding the shared wallet itself)

For an income transaction where the `receivedByUserId` is the shared wallet, the selected member's effective income SHALL be:
- The transaction's full amount divided by the number of real members in the account book (excluding the shared wallet itself)

For an income transaction where the `receivedByUserId` is neither the selected member nor the shared wallet, the transaction SHALL be excluded from the selected member's report (existing behavior).

#### Scenario: Expense with shared wallet split is distributed to selected member

- **WHEN** a member filter is active and an expense transaction has both the selected member and a shared wallet member in `splitDetail`
- **THEN** the report SHALL use the selected member's direct split amount plus their proportional share of the shared wallet's split amount

##### Example: Two real members with shared wallet split

- **GIVEN** account book members: UserA, UserB, SharedWallet (isSharedWallet: true)
- **GIVEN** expense transaction tx1: amount=1500, splitDetail=[UserA: 500, UserB: 500, SharedWallet: 500]
- **WHEN** filtering by UserA
- **THEN** UserA's effective expense from tx1 = 500 (direct) + 500/2 (shared wallet share) = 750

#### Scenario: Expense only in shared wallet split is distributed to selected member

- **WHEN** a member filter is active and an expense transaction has a shared wallet member in `splitDetail` but NOT the selected member
- **THEN** the report SHALL include the selected member's proportional share of the shared wallet's split amount

##### Example: Member not directly in split but shares wallet

- **GIVEN** account book members: UserA, UserB, SharedWallet (isSharedWallet: true)
- **GIVEN** expense transaction tx2: amount=1000, splitDetail=[UserB: 500, SharedWallet: 500]
- **WHEN** filtering by UserA
- **THEN** UserA's effective expense from tx2 = 0 (not in direct split) + 500/2 (shared wallet share) = 250

#### Scenario: Income received by shared wallet is distributed to selected member

- **WHEN** a member filter is active and an income transaction has `receivedByUserId` set to the shared wallet member
- **THEN** the report SHALL include the selected member's proportional share of the income amount

##### Example: Income to shared wallet distributed

- **GIVEN** account book members: UserA, UserB, SharedWallet (isSharedWallet: true)
- **GIVEN** income transaction tx3: amount=1200, receivedByUserId=SharedWallet
- **WHEN** filtering by UserA
- **THEN** UserA's effective income from tx3 = 1200/2 = 600

#### Scenario: No shared wallet in transaction leaves existing behavior unchanged

- **WHEN** a member filter is active and the transaction does not involve any shared wallet member in `splitDetail` or `receivedByUserId`
- **THEN** the existing member filter calculation logic SHALL apply without modification
