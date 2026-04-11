## ADDED Requirements

### Requirement: Navbar includes a settlement tab

The bottom navigation bar SHALL include a settlement tab (結帳) that navigates to `/account-books/[id]/settlement`, where `[id]` is the account book ID from the current URL context.

The settlement tab SHALL be the third tab, positioned between the add-transaction button and the settings tab.

The settlement tab SHALL display as active (highlighted) when the current route is `/account-books/[id]/settlement` or `/account-books/[id]/settlement/[recordId]`.

#### Scenario: User taps the settlement tab while viewing an account book

- **WHEN** the user is on `/account-books/abc123` and taps the settlement tab
- **THEN** the system SHALL navigate to `/account-books/abc123/settlement`

#### Scenario: Settlement tab is active on settlement pages

- **WHEN** the current route is `/account-books/[id]/settlement` or `/account-books/[id]/settlement/[recordId]`
- **THEN** the settlement tab icon SHALL be in the active/highlighted state
