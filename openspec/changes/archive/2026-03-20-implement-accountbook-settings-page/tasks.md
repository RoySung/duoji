## 1. Settings structure and shell

- [x] 1.1 Keep settings as a two-step flow by replacing the placeholder settings page with a settings landing page that links to `/settings/account-books`.
- [x] 1.2 Implement The shell supports page title and back navigation patterns for the nested account-book settings route and keep settings navigation active for `/settings` descendant routes.

## 2. Current account-book context and management flow

- [x] 2.1 Keep current account book selection outside settings by removing current-selection controls from `/settings/account-books` while preserving Users can manage personal account books CRUD flows.
- [x] 2.2 Use a simple home-page selector for current account book choice and default it to the first available account book after bootstrap so The application maintains an active account book through the new current-account-book flow.
- [x] 2.3 Rename active account book state to current account book terminology across the store, selectors, tests, and consumer components.
- [x] 2.4 Reuse AccountBook Store as the only account-book state source for the home-page selector, transaction form defaults, and settings CRUD state.
- [x] 2.5 Use a list page with modal-based create and edit flows so Users can manage personal account books from `/settings/account-books` without current-selection actions in settings.
- [x] 2.6 Shape new account-book payloads at the UI boundary until real user context exists for create and edit submissions that include `name`, `currency`, and `description`.

## 3. Verification

- [x] 3.1 Verify current selection and settings behavior at the UI layer with tests for the home-page selector, nested title and back UI, current selection indication, Users can manage personal account books interactions, and The account book list indicates the current selection coverage.
- [x] 3.2 Run `pnpm nx test web --runInBand` and confirm current account book terminology and settings behavior do not regress existing web tests.