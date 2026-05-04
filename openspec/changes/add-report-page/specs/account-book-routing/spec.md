## ADDED Requirements

### Requirement: Report page is accessible at the account book route

The report page SHALL be accessible at `/account-books/[id]/report`. The page SHALL scope its data to the account book identified by `[id]`, where `[id]` MAY be either a concrete account book ID or the literal string `all` representing the aggregate view across all non-deleted account books.

When `[id]` is a concrete ID that does not match any existing account book, the system SHALL render the same "account book not found" state used by other `/account-books/[id]/*` routes.

#### Scenario: Viewing the report for a specific account book

- **WHEN** the user navigates to `/account-books/abc123/report`
- **THEN** the system SHALL display the report page scoped to account book `abc123`

#### Scenario: Viewing the aggregate report

- **WHEN** the user navigates to `/account-books/all/report`
- **THEN** the system SHALL display the report page aggregating transactions from all non-deleted account books

#### Scenario: Report page inherits the account book header menu

- **WHEN** the user is on any `/account-books/[id]/report` route
- **THEN** the header SHALL display the account book menu button used on other `/account-books/[id]/*` routes so the user MAY switch between account books
