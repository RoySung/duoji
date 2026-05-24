## ADDED Requirements

### Requirement: Application supports en-US and zh-TW locales

The system SHALL provide user-facing strings in English (`en-US`) and Traditional Chinese (`zh-TW`) and SHALL render every visible string through the i18n message catalog rather than as a hard-coded literal.

#### Scenario: Render UI in the active locale

- **WHEN** the application renders a screen with the active locale set to `zh-TW`
- **THEN** every visible label, button, helper text, and error message SHALL come from the `zh-TW` message catalog

#### Scenario: Fallback to English for missing keys

- **WHEN** a key is not present in the `zh-TW` catalog
- **THEN** the system SHALL render the value from the `en-US` catalog and SHALL NOT display the raw key

### Requirement: Locale changes apply without a full page reload

The system SHALL re-render visible UI strings when the active locale changes, without requiring the user to reload the page or restart the application.

#### Scenario: Switch language in settings

- **WHEN** a user changes the language selector on the settings page from `en-US` to `zh-TW`
- **THEN** the system SHALL persist the new language and re-render the current page in `zh-TW` without a page reload

### Requirement: Initial locale is auto-detected from the browser on first run

On first application start (no persisted settings), the system SHALL initialize the active locale from `navigator.language`, mapping any value beginning with `zh` (case-insensitive) to `zh-TW` and all other values to `en-US`.

#### Scenario: Detect Traditional Chinese browser

- **WHEN** the application starts for the first time and `navigator.language` is `zh-TW` or `zh-Hant`
- **THEN** the system SHALL set the active locale to `zh-TW`

#### Scenario: Detect non-Chinese browser

- **WHEN** the application starts for the first time and `navigator.language` does not begin with `zh`
- **THEN** the system SHALL set the active locale to `en-US`
