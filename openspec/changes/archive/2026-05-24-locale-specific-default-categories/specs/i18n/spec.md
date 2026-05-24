## REMOVED Requirements

### Requirement: Default category names are managed through the i18n message catalog

**Reason**: Default categories are locale-specific static data used only once at account book creation. Managing them through the i18n catalog couples `defaultCategories.ts` to the JSON message files and prevents locale-specific category structures. Inline data per locale is simpler and allows cultural customization.

**Migration**: Default category names SHALL be defined as inline static data in `defaultCategories.ts`, keyed by `Language`. The `categories.defaults` block in `en-US.json` and `zh-TW.json` SHALL be removed.

#### Scenario: Default category names no longer in message catalog

- **WHEN** `en-US.json` or `zh-TW.json` is loaded at runtime
- **THEN** neither file SHALL contain a `categories.defaults` key

#### Scenario: Default categories still resolved by locale

- **WHEN** `getDefaultExpenseCategories` is called with locale `zh-TW`
- **THEN** the returned categories SHALL have names in Traditional Chinese, sourced from inline static data in `defaultCategories.ts`, not from the i18n message catalog
