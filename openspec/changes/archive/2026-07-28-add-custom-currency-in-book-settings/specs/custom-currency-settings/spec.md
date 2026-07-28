## ADDED Requirements

### Requirement: Preset and custom currency selection in book settings
The system SHALL allow users to select from an expanded preset list of common currencies (TWD, USD, JPY, EUR, GBP, CNY, HKD, SGD, AUD, CAD, KRW) or specify a custom currency string when creating or editing an account book.

#### Scenario: Select a common currency from preset dropdown
- **WHEN** the user opens the account book form and selects "EUR" from the currency dropdown
- **THEN** the account book currency SHALL be set to "EUR" upon saving

#### Scenario: Enter a custom currency code or name
- **WHEN** the user selects "Custom" in the currency dropdown and types "BTC" into the custom currency input field
- **THEN** the account book currency SHALL be set to "BTC" upon saving

#### Scenario: Validation of empty custom currency
- **WHEN** the user selects "Custom" in the currency dropdown and leaves the custom currency input field empty
- **THEN** the system SHALL surface a validation error preventing form submission
