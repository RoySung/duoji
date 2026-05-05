## ADDED Requirements

### Requirement: DateRangePicker is always visible on the report page

The report page time range selector SHALL render a DateRangePicker at all times. The picker SHALL NOT be hidden behind a tab or toggle.

#### Scenario: User opens report page

- **WHEN** the user navigates to any report page
- **THEN** a DateRangePicker SHALL be visible immediately without any interaction

### Requirement: Quick-select buttons set the date range

The time range selector SHALL provide five quick-select buttons: 當週 (this ISO week), 當月 (this calendar month), 三個月 (last 3 months to today), 一年 (last 1 year to today), and 全部 (all time, no date filter).

#### Scenario: User clicks a quick-select button

- **WHEN** the user clicks any quick-select button
- **THEN** the DateRangePicker SHALL immediately update to display the resolved date range for that preset
- **THEN** the clicked button SHALL appear highlighted (active state)
- **THEN** any previously highlighted button SHALL lose its highlight

#### Scenario: User manually edits the DateRangePicker

- **WHEN** the user manually changes the start or end date in the DateRangePicker
- **THEN** all quick-select buttons SHALL lose their highlight (no preset active)
- **THEN** the report SHALL filter transactions using the manually entered range

### Requirement: Default selection is 當週 (this ISO week)

The time range selector SHALL default to the 當週 preset on initial render, with the week starting on Monday per ISO 8601.

#### Scenario: Report page first renders

- **WHEN** the report page is rendered for the first time
- **THEN** the 當週 button SHALL be highlighted
- **THEN** the DateRangePicker SHALL display the current ISO week (Monday to Sunday)
- **THEN** the report SHALL load transactions filtered to the current ISO week

### Requirement: 全部 shows all transactions without a date filter

When the user selects the 全部 preset, no date filtering SHALL be applied.

#### Scenario: User clicks 全部

- **WHEN** the user clicks the 全部 button
- **THEN** the 全部 button SHALL be highlighted
- **THEN** the DateRangePicker SHALL display no selected range (cleared state)
- **THEN** the report SHALL load all transactions in the account book regardless of date
