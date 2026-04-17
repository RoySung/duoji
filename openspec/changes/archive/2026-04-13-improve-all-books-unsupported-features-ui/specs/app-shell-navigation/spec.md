## MODIFIED Requirements

### Requirement: Navbar includes a settlement tab

The bottom navigation bar SHALL include a settlement tab (結帳) that navigates to `/account-books/[id]/settlement`, where `[id]` is the account book ID from the current URL context.

The settlement tab SHALL be the third tab, positioned between the add-transaction button and the settings tab.

The settlement tab SHALL display as active (highlighted) when the current route is `/account-books/[id]/settlement` or `/account-books/[id]/settlement/[recordId]`.

When the user is in the aggregate view (no specific account book selected, or `id === "all"`), the settlement tab SHALL be disabled and SHALL render a visible prohibition overlay (e.g., a semi-transparent mask with a `🚫` or CSS-based prohibition symbol) on top of the icon to communicate that the action is unavailable. The tab SHALL NOT respond to user interaction in this state.

#### Scenario: User taps the settlement tab while viewing an account book

- **WHEN** the user is on `/account-books/abc123` and taps the settlement tab
- **THEN** the system SHALL navigate to `/account-books/abc123/settlement`

#### Scenario: Settlement tab is active on settlement pages

- **WHEN** the current route is `/account-books/[id]/settlement` or `/account-books/[id]/settlement/[recordId]`
- **THEN** the settlement tab icon SHALL be in the active/highlighted state

#### Scenario: Settlement tab is disabled in aggregate view

- **WHEN** the user is in the aggregate view (`/account-books/all` or no account book selected)
- **THEN** the settlement tab SHALL render a prohibition overlay on the icon and SHALL NOT navigate when tapped

## ADDED Requirements

### Requirement: Add Transaction button shows a prohibition overlay in aggregate view

When the user is in the aggregate view, the Add Transaction button in the bottom navigation bar SHALL render a visible prohibition overlay on top of the button icon to communicate that the action is unavailable. The button SHALL NOT trigger any action when pressed in this state.

#### Scenario: Add Transaction button in aggregate view

- **WHEN** the user is in the aggregate view (`/account-books/all` or no account book selected)
- **THEN** the Add Transaction button SHALL display a prohibition overlay and SHALL NOT open the transaction creation modal when pressed

#### Scenario: Add Transaction button in a specific account book view

- **WHEN** the user is viewing a specific account book
- **THEN** the Add Transaction button SHALL display normally without any overlay and SHALL open the transaction creation modal when pressed
