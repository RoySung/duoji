## ADDED Requirements

### Requirement: Navbar includes a report tab

The bottom navigation bar SHALL include a report tab that navigates to `/account-books/[id]/report`, where `[id]` is the account book ID from the current URL context (or the persisted current account book ID when the URL has none).

The report tab SHALL be positioned as the fourth item, between the add-transaction button (the center item) and the settings tab. The final tab order SHALL be: Home, Settlement, Add Transaction, Report, Settings.

The report tab SHALL display as active (highlighted) when the current route matches `/account-books/[id]/report`.

The report tab SHALL remain enabled in the aggregate view (`accountBookId === 'all'` or no specific account book selected) and SHALL navigate to `/account-books/all/report` in that case. The report tab SHALL NOT display a prohibition overlay.

#### Scenario: User taps the report tab while viewing an account book

- **WHEN** the user is on `/account-books/abc123` and taps the report tab
- **THEN** the system SHALL navigate to `/account-books/abc123/report`

#### Scenario: Report tab is active on report pages

- **WHEN** the current route is `/account-books/[id]/report`
- **THEN** the report tab icon SHALL be in the active/highlighted state

#### Scenario: Report tab is enabled in aggregate view

- **WHEN** the user is in the aggregate view (`/account-books/all` or no account book selected)
- **THEN** the report tab SHALL remain enabled, SHALL NOT render a prohibition overlay, and SHALL navigate to `/account-books/all/report` when tapped
