## ADDED Requirements

### Requirement: Unified amount formatting with optional rounding
The system SHALL provide a unified amount formatting function `formatAmount` and React hook `useFormatAmount` to format numeric transaction amounts into localized display strings.

#### Scenario: Format amount with ceil rounding
- **WHEN** `roundMode` option is set to `'ceil'` and `formatAmount(150.2)` is invoked
- **THEN** the output SHALL be rounded up to the nearest integer as `"151"`

##### Example: Rounding mode cases
| Input Amount | roundMode | Expected Output | Notes |
| ------------ | --------- | --------------- | ----- |
| 150.2 | "ceil" | "151" | Ceil round up |
| 150.8 | "round" | "151" | Standard round |
| 150.8 | "none" | "150.8" | Preserve decimal |

#### Scenario: Format amount with currency symbol
- **WHEN** `showCurrency` is `true` and `currencySymbol` is `"NT$"`
- **THEN** the output SHALL prefix the formatted string with `"NT$ "`
