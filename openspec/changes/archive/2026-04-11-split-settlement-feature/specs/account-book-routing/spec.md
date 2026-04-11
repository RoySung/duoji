## ADDED Requirements

### Requirement: Home page displays account book list

The home page (`/`) SHALL display a list of all non-deleted account books owned by or shared with the current user.

If at least one account book exists, the home page SHALL automatically redirect to `/account-books/[firstBookId]` where `firstBookId` is the ID of the first account book in the list.

If no account books exist, the home page SHALL display an empty state with a call-to-action to create a new account book.

#### Scenario: User has account books

- **WHEN** the user navigates to `/` and at least one account book exists
- **THEN** the system SHALL redirect to `/account-books/[firstBookId]` without showing the list

#### Scenario: User has no account books

- **WHEN** the user navigates to `/` and no account books exist
- **THEN** the system SHALL display an empty state with a "新增帳本" affordance

### Requirement: Active account book is derived from the URL

The system SHALL determine the active account book from the `[id]` URL parameter on pages under `/account-books/[id]`. The active account book SHALL NOT be stored as persistent state in `AccountBookStore`.

Pages and components that need the active account book SHALL read `router.query.id` and use it to scope their data queries.

#### Scenario: Navigating to an account book page

- **WHEN** the user navigates to `/account-books/abc123`
- **THEN** the transaction list, settlement page, and navbar tabs SHALL all operate in the context of account book `abc123`

#### Scenario: Account book ID not found

- **WHEN** the `[id]` in the URL does not match any account book
- **THEN** the system SHALL display a "找不到帳本" (account book not found) message

### Requirement: Transaction list is accessible at the account book route

The transaction list view previously at `/` SHALL be accessible at `/account-books/[id]`. The page SHALL display transactions scoped to the account book identified by `[id]`.

#### Scenario: Viewing transactions for a specific account book

- **WHEN** the user navigates to `/account-books/[id]`
- **THEN** the system SHALL display only transactions belonging to that account book
