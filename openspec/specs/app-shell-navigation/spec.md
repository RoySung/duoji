# app-shell-navigation Specification

## Purpose

TBD - created by archiving change 'migrate-project-instructions-to-spectra'. Update Purpose after archive.

## Requirements

### Requirement: The application provides a shared app shell

The web application SHALL provide a shared app shell that wraps primary pages in a consistent layout. The shell SHALL include a top header bar (containing the app title and contextual controls) and a bottom navigation bar.

#### Scenario: Open a primary application page

- **WHEN** a user navigates to a primary page within the web application
- **THEN** the system SHALL render that page within the shared application shell, with a top header bar visible at the top and the bottom navigation bar visible at the bottom


<!-- @trace
source: add-header-with-account-book-dropdown
updated: 2026-04-11
code:
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/package.json
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/stores/transaction/index.ts
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - .spectra.yaml
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/next.config.js
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/src/components/layout/navbar.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/pages/index.tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/jest.config.ts
  - apps/web/src/pages/settings.tsx
  - apps/web/src/pages/account-books/new.tsx
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - .github/skills/spectra-debug/SKILL.md
  - .github/prompts/spectra-ingest.prompt.md
  - .github/prompts/spectra-propose.prompt.md
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/src/hooks/useSettlement.ts
  - .github/skills/spectra-propose/SKILL.md
  - apps/web/src/entities/settlement.ts
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - .github/prompts/spectra-debug.prompt.md
  - CLAUDE.md
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/repositories/settlementRepo/index.ts
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/pages/settings/account-books/new.tsx
  - .github/prompts/spectra-ask.prompt.md
  - AGENTS.md
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - GEMINI.md
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/stores/transaction/transactionStore.ts
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/.babelrc
  - apps/web/src/pages/_app.tsx
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/src/utils/settlementUtils.ts
  - .github/skills/spectra-ingest/SKILL.md
  - .github/prompts/spectra-apply.prompt.md
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
tests:
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/transactionUtils.spec.ts
-->

---
### Requirement: The application provides primary navigation for Phase 1

The web application SHALL provide primary navigation for the account book area, transaction entry flow, and statistics area. On account book routes, the header SHALL display an account book menu button that opens a drawer for switching and managing account books.

#### Scenario: Use primary navigation

- **WHEN** a user interacts with the main navigation controls
- **THEN** the system SHALL allow movement between the primary Phase 1 areas of the application

#### Scenario: Open account book menu on an account book route

- **WHEN** a user is on an account book route and activates the account book menu button in the header
- **THEN** the system SHALL open a drawer panel rather than a dropdown


<!-- @trace
source: account-book-menu-drawer
updated: 2026-04-11
code:
  - CLAUDE.md
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/jest.config.ts
  - .github/skills/spectra-ingest/SKILL.md
  - AGENTS.md
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/stores/transaction/transactionStore.ts
  - .spectra.yaml
  - .github/prompts/spectra-debug.prompt.md
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/layout/header.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/pages/settings/account-books/new.tsx
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - .github/skills/spectra-propose/SKILL.md
  - GEMINI.md
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - apps/web/next.config.js
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - .github/prompts/spectra-ingest.prompt.md
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/hooks/useSettlement.ts
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/repositories/settlementRepo/index.ts
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/package.json
  - apps/web/src/pages/_app.tsx
  - .github/prompts/spectra-propose.prompt.md
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - .github/prompts/spectra-ask.prompt.md
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/entities/settlement.ts
  - apps/web/src/entities/transaction.ts
  - apps/web/src/pages/index.tsx
  - apps/web/.babelrc
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - .github/prompts/spectra-apply.prompt.md
  - .github/skills/spectra-debug/SKILL.md
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - apps/web/src/stores/transaction/index.ts
tests:
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/transaction.spec.ts
-->

---
### Requirement: The shell supports page title and back navigation patterns

The shared app shell SHALL support page title presentation and contextual back navigation where a page is not a top-level destination. Nested account book settings routes SHALL present titles and back targets that reflect whether the user is on the account book list, a new account book page, an existing account book settings page, or that account book's category settings page.

#### Scenario: Open a nested page

- **WHEN** a user navigates to a non-top-level page inside the application shell
- **THEN** the system SHALL present the page title and a contextual back-navigation control

#### Scenario: Open the new account book page

- **WHEN** a user navigates from the account book settings list to the new account book page
- **THEN** the system SHALL present a page title for creating an account book and a back-navigation control that returns to the account book settings list

#### Scenario: Open an existing account book settings page

- **WHEN** a user navigates from the account book settings list to a specific account book's settings page
- **THEN** the system SHALL present that page within the shared shell with a title, account-book-scoped actions, and a back-navigation control that returns to the account book settings list

#### Scenario: Open category settings from account book settings

- **WHEN** a user navigates from an account book's settings page to that account book's category settings page
- **THEN** the system SHALL present a contextual back-navigation control that returns to the originating account book settings page


<!-- @trace
source: pageify-account-book-settings-flow
updated: 2026-03-28
code:
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormModal.tsx
  - apps/web/package.json
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/components/accountBookSettings/AccountBookForm.tsx
  - apps/web/src/constants/theme.ts
  - apps/web/tailwind.config.js
  - .impeccable.md
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/test-setup.ts
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - apps/web/src/pages/styles.css
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - apps/web/src/components/accountBookSettings/AccountBookNavHeader.tsx
  - apps/web/src/pages/_app.tsx
  - apps/web/src/pages/settings.tsx
  - apps/web/src/pages/_document.tsx
tests:
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/accountBookSettings.spec.tsx
-->

---
### Requirement: The shell is usable on mobile-first and desktop layouts

The shared app shell SHALL remain usable on mobile-first layouts and on wider desktop viewports.

#### Scenario: Resize the viewport

- **WHEN** the application is viewed on a phone-sized viewport or a desktop-sized viewport
- **THEN** the system SHALL preserve primary navigation access and readable page structure

<!-- @trace
source: migrate-project-instructions-to-spectra
updated: 2026-03-18
code:
  - .github/prompts/spectra-debug.prompt.md
  - .github/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - .github/prompts/spectra-apply.prompt.md
  - .github/skills/spectra-propose/SKILL.md
  - .github/skills/spectra-ask/SKILL.md
  - .github/skills/spectra-apply/SKILL.md
  - .github/prompts/spectra-ask.prompt.md
  - .github/prompts/spectra-discuss.prompt.md
  - .github/prompts/spectra-ingest.prompt.md
  - .github/prompts/spectra-propose.prompt.md
  - .github/copilot-instructions.md
  - .github/instructions/phase-1-todo.instructions.md
  - .github/skills/spectra-debug/SKILL.md
  - .github/instructions/prd.instructions.md
  - .github/prompts/spectra-audit.prompt.md
  - .github/skills/spectra-archive/SKILL.md
  - .github/skills/spectra-audit/SKILL.md
  - .github/skills/spectra-ingest/SKILL.md
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - .github/prompts/spectra-archive.prompt.md
  - AGENTS.md
-->

---
### Requirement: The account book menu drawer displays account books as navigable cards

The account book menu drawer in the app header SHALL present each account book as a card showing its name, currency, and description (when present). The active account book SHALL be visually distinguished from inactive ones.

#### Scenario: Open the account book menu drawer

- **WHEN** a user opens the account book menu drawer on an account book page
- **THEN** the system SHALL display each account book as a card with its name, currency, and description

#### Scenario: Active account book card

- **WHEN** the account book menu drawer is open
- **THEN** the system SHALL visually highlight the currently active account book card and SHALL NOT show a "Switch" button for it

#### Scenario: Inactive account book card

- **WHEN** the account book menu drawer is open and there are multiple account books
- **THEN** each non-active account book card SHALL display a "Switch" button and a "View settings" button


<!-- @trace
source: refactor-account-book-menu-drawer
updated: 2026-04-11
code:
  - apps/web/src/stores/transaction/index.ts
  - apps/web/package.json
  - .github/skills/spectra-debug/SKILL.md
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - .github/prompts/spectra-ask.prompt.md
  - apps/web/src/components/layout/header.tsx
  - CLAUDE.md
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/hooks/useSettlement.ts
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/pages/_app.tsx
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/jest.config.ts
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - .github/prompts/spectra-propose.prompt.md
  - .spectra.yaml
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - .github/prompts/spectra-debug.prompt.md
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/entities/settlement.ts
  - apps/web/.babelrc
  - GEMINI.md
  - .github/skills/spectra-propose/SKILL.md
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/next.config.js
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/stores/transaction/transactionStore.ts
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/pages/settings.tsx
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/repositories/settlementRepo/index.ts
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - .github/skills/spectra-ingest/SKILL.md
  - .github/prompts/spectra-ingest.prompt.md
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/pages/index.tsx
  - .github/prompts/spectra-apply.prompt.md
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - AGENTS.md
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
tests:
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
-->

---
### Requirement: The account book menu drawer delegates CRUD to settings pages

The account book menu drawer SHALL NOT provide inline rename, delete, or create forms. All account book management SHALL be delegated to the settings pages via navigation.

#### Scenario: Switch to a different account book

- **WHEN** a user presses "Switch" on a non-active account book card in the drawer
- **THEN** the system SHALL navigate to that account book's page and close the drawer

#### Scenario: Navigate to account book settings from the drawer

- **WHEN** a user presses "View settings" on any account book card in the drawer
- **THEN** the system SHALL navigate to `/settings/account-books/[id]` for that account book and close the drawer

#### Scenario: Navigate to create a new account book from the drawer

- **WHEN** a user presses "New account book" in the drawer footer
- **THEN** the system SHALL navigate to `/settings/account-books/new` and close the drawer

<!-- @trace
source: refactor-account-book-menu-drawer
updated: 2026-04-11
code:
  - apps/web/src/stores/transaction/index.ts
  - apps/web/package.json
  - .github/skills/spectra-debug/SKILL.md
  - .github/skills/spectra-ask/SKILL.md
  - apps/web/src/components/accountBookSettings/DeleteAccountBookModal.tsx
  - apps/web/src/stores/transaction/transactionStoreProvider.tsx
  - apps/web/src/components/settlement/SettlementRecordList.tsx
  - apps/web/src/pages/account-books/new.tsx
  - apps/web/src/repositories/settlementRepo/settlementLocalRepo.ts
  - apps/web/src/utils/settlementUtils.ts
  - apps/web/src/components/categorySettings/CategorySettingsPage.tsx
  - .github/prompts/spectra-ask.prompt.md
  - apps/web/src/components/layout/header.tsx
  - CLAUDE.md
  - apps/web/src/components/accountBookSettings/AccountBookSettingsPage.tsx
  - apps/web/src/pages/settings/account-books.tsx
  - apps/web/src/components/layout/layout.tsx
  - apps/web/src/utils/transactionUtils.ts
  - apps/web/src/hooks/useSettlement.ts
  - .github/skills/spectra-discuss/SKILL.md
  - apps/web/src/pages/account-books/[id]/settlement/index.tsx
  - apps/web/src/pages/_app.tsx
  - apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/jest.config.ts
  - apps/web/src/components/categorySettings/CategorySettingsModal.tsx
  - .github/prompts/spectra-propose.prompt.md
  - .spectra.yaml
  - apps/web/src/pages/settings/account-books/new.tsx
  - apps/web/src/components/TransactionModal/ExpenseForm.tsx
  - .github/prompts/spectra-debug.prompt.md
  - apps/web/src/pages/settings/account-books/[id]/categories.tsx
  - apps/web/src/entities/settlement.ts
  - apps/web/.babelrc
  - GEMINI.md
  - .github/skills/spectra-propose/SKILL.md
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/hooks/useUnsettledTransactions.ts
  - apps/web/next.config.js
  - apps/web/src/pages/settings/account-books/[id]/index.tsx
  - apps/web/src/components/settlement/SettlementTransferModal.tsx
  - .github/skills/spectra-apply/SKILL.md
  - apps/web/src/stores/transaction/transactionStore.ts
  - apps/web/src/stores/accountBook/index.ts
  - apps/web/src/pages/settings.tsx
  - apps/web/src/components/settlement/UnsettledTransactionList.tsx
  - apps/web/src/repositories/settlementRepo/index.ts
  - apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx
  - apps/web/src/components/accountBookSettings/AccountBookFormPage.tsx
  - .github/skills/spectra-ingest/SKILL.md
  - .github/prompts/spectra-ingest.prompt.md
  - .github/prompts/spectra-discuss.prompt.md
  - apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx
  - apps/web/src/pages/index.tsx
  - .github/prompts/spectra-apply.prompt.md
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/components/accountBookSettings/AccountBookEditPage.tsx
  - apps/web/src/entities/transaction.ts
  - apps/web/src/components/settlement/SettlementConfirmModal.tsx
  - AGENTS.md
  - apps/web/src/hooks/useSettlementRecordTransactions.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/components/settlement/SettlementRecordDetail.tsx
  - apps/web/src/pages/account-books/[id]/settings.tsx
  - apps/web/src/stores/accountBook/accountBookStore.ts
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/lib/dexie.ts
  - apps/web/src/components/TransactionModal/IncomeForm.tsx
tests:
  - apps/web/specs/settlementRecordDetailPage.spec.tsx
  - apps/web/specs/transaction.spec.ts
  - apps/web/specs/transactionStore.spec.ts
  - apps/web/specs/transactionUtils.spec.ts
  - apps/web/specs/accountBookStore.spec.ts
  - apps/web/specs/settlementPage.spec.tsx
  - apps/web/specs/settlementStore.spec.ts
  - apps/web/specs/homeTransactions.spec.tsx
  - apps/web/specs/settlement.spec.ts
  - apps/web/specs/accountBookSettings.spec.tsx
-->

---
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


<!-- @trace
source: improve-all-books-unsupported-features-ui
updated: 2026-04-13
code:
  - apps/web/src/components/calendar/WeekStrip.tsx
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/calendar/calendarUtils.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/pages/_app.tsx
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/components/calendar/MonthGrid.tsx
  - apps/web/src/components/calendar/TransactionCalendar.tsx
-->

---
### Requirement: Add Transaction button shows a prohibition overlay in aggregate view

When the user is in the aggregate view, the Add Transaction button in the bottom navigation bar SHALL render a visible prohibition overlay on top of the button icon to communicate that the action is unavailable. The button SHALL NOT trigger any action when pressed in this state.

#### Scenario: Add Transaction button in aggregate view

- **WHEN** the user is in the aggregate view (`/account-books/all` or no account book selected)
- **THEN** the Add Transaction button SHALL display a prohibition overlay and SHALL NOT open the transaction creation modal when pressed

#### Scenario: Add Transaction button in a specific account book view

- **WHEN** the user is viewing a specific account book
- **THEN** the Add Transaction button SHALL display normally without any overlay and SHALL open the transaction creation modal when pressed

<!-- @trace
source: improve-all-books-unsupported-features-ui
updated: 2026-04-13
-->

<!-- @trace
source: improve-all-books-unsupported-features-ui
updated: 2026-04-13
code:
  - apps/web/src/components/calendar/WeekStrip.tsx
  - apps/web/src/stores/category/categoryStore.ts
  - apps/web/src/pages/account-books/[id]/index.tsx
  - apps/web/src/components/accountBook/AccountBookMenu.tsx
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/calendar/calendarUtils.ts
  - apps/web/src/components/transaction/TransactionList.tsx
  - apps/web/src/components/TransactionModal/TransactionModal.tsx
  - apps/web/src/hooks/useAccountBookTransactions.ts
  - apps/web/src/pages/_app.tsx
  - apps/web/src/stores/user/userStore.ts
  - apps/web/src/components/calendar/MonthGrid.tsx
  - apps/web/src/components/calendar/TransactionCalendar.tsx
-->

---
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

<!-- @trace
source: add-report-page
updated: 2026-05-05
code:
  - apps/web/src/utils/reportAggregate.ts
  - apps/web/src/components/report/ReportSummaryCards.tsx
  - apps/web/src/components/report/TimeRangeSelector.tsx
  - apps/web/src/components/report/ReportApexChart.tsx
  - apps/web/src/components/report/BookFilterSelector.tsx
  - apps/web/src/hooks/useReportTransactions.ts
  - apps/web/tsconfig.spec.json
  - apps/web/src/components/report/ReportCategoryBreakdown.tsx
  - apps/web/src/components/report/CategoryTransactionsModal.tsx
  - apps/web/src/pages/account-books/[id]/report.tsx
  - apps/web/src/components/report/ReportSection.tsx
  - apps/web/package.json
  - apps/web/src/components/layout/navbar.tsx
  - apps/web/src/components/report/reportTypes.ts
  - apps/web/src/components/report/ReportMonthlyTrend.tsx
  - apps/web/src/components/report/ReportEmptyState.tsx
  - apps/web/src/pages/styles.css
tests:
  - apps/web/specs/reportAggregate.spec.ts
  - apps/web/specs/timeRangeSelector.spec.tsx
  - apps/web/specs/reportSection.spec.tsx
  - apps/web/specs/reportCategoryBreakdown.spec.tsx
-->