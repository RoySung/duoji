## MODIFIED Requirements

### Requirement: Users can manage personal account books

The system SHALL allow users to create, rename, edit, and delete private account books for personal expense tracking during Phase 1. The management interface SHALL use dedicated pages for creating a new account book and editing an existing one. Account book management SHALL be accessible from the AccountBookMenu drawer in the application header. The `/settings` page SHALL NOT contain an entry point to account book management.

#### Scenario: Open the new account book page

- **WHEN** a user selects "New account book" from the AccountBookMenu drawer
- **THEN** the system SHALL navigate to `/account-books/new` with an empty account book form

#### Scenario: Create a personal account book

- **WHEN** a user submits valid details on the `/account-books/new` page
- **THEN** the system SHALL create the account book and navigate to its settings page (`/account-books/[id]/settings`)

#### Scenario: Open an existing account book settings page

- **WHEN** a user selects "Edit" for an account book in the AccountBookMenu drawer
- **THEN** the system SHALL navigate to `/account-books/[id]/settings` displaying that account book's current name, currency, and description in an editable form

#### Scenario: Rename a personal account book

- **WHEN** a user submits a valid new name on `/account-books/[id]/settings`
- **THEN** the system SHALL persist the renamed account book in the available account book list

#### Scenario: Update account book details

- **WHEN** a user submits valid changes to an existing personal account book's currency or description on `/account-books/[id]/settings`
- **THEN** the system SHALL persist the updated currency and description

#### Scenario: Delete a personal account book

- **WHEN** a user confirms deletion from `/account-books/[id]/settings`
- **THEN** the system SHALL remove that account book from the available account book list

#### Scenario: Navigate back from the settings page

- **WHEN** a user activates the back control on `/account-books/[id]/settings`
- **THEN** the system SHALL navigate to `/account-books/[id]`

#### Scenario: Navigate back from the new account book page

- **WHEN** a user activates the back control on `/account-books/new`
- **THEN** the system SHALL navigate back without creating an account book

## REMOVED Requirements

### Requirement: /settings page provides an entry to account book management

**Reason**: Account book management is now accessed exclusively via the AccountBookMenu drawer in the application header. The `/settings` page entry is redundant and removed to simplify the settings page.
**Migration**: Users SHALL access account book create and edit flows from the AccountBookMenu drawer in the app header.

#### Scenario: /settings page no longer shows account book entry

- **WHEN** a user opens the `/settings` page
- **THEN** the system SHALL NOT display an "Account books" entry or any link to `/settings/account-books`
