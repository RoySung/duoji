## ADDED Requirements

### Requirement: Tag filter is available on the report page

The report page SHALL display a tag filter control in the header toolbar for both single-book and all-books views.

#### Scenario: Tag filter visible in single-book view

- **WHEN** the user navigates to the report page for a specific account book
- **THEN** a tag filter control SHALL be visible alongside the existing report filters

#### Scenario: Tag filter visible in all-books view

- **WHEN** the user navigates to the all-books report page
- **THEN** a tag filter control SHALL be visible alongside the book filter and other existing report filters

### Requirement: Tag filter options are derived from the current report dataset

The system SHALL derive tag filter options from tags used by transactions that remain in scope after the current time-range filter and, in all-books view, the current book filter have been applied. The system SHALL NOT derive tag options from category exclusion state or from transactions belonging to books already excluded from the current report scope.

#### Scenario: Time-range changes update available tags

- **WHEN** the user changes the report time range and the resulting transaction set contains a different set of used tags
- **THEN** the available tag filter options SHALL update to match the tags used by the transactions in the newly selected time range

#### Scenario: All-books book filtering updates available tags

- **WHEN** the user excludes one or more account books in the all-books report view
- **THEN** the available tag filter options SHALL be recalculated from the remaining visible books only

#### Scenario: Invalid selected tags are cleared when they leave scope

- **WHEN** a previously selected tag no longer exists in the current report dataset after a time-range or book-filter change
- **THEN** the system SHALL remove that tag from the active tag filter selection

### Requirement: Tag filter uses inclusive matching and preserves untagged transactions

The report page SHALL leave transactions unfiltered when no tags are selected. When one or more tags are selected, the page SHALL keep every transaction whose tag list contains at least one selected tag, and SHALL also keep transactions whose tag list is empty.

#### Scenario: No selected tags leaves the report unchanged

- **WHEN** the user has not selected any report tags
- **THEN** the report SHALL show the same transactions it would show without tag filtering

#### Scenario: A tagged transaction remains when any selected tag matches

- **WHEN** the user selects multiple tags and a transaction contains one or more of those selected tags
- **THEN** that transaction SHALL remain included in the report dataset

#### Scenario: Untagged transactions remain visible while tag filtering is active

- **WHEN** the user selects one or more report tags and a transaction has no tags
- **THEN** that untagged transaction SHALL remain included in the report dataset

### Requirement: Tag filter state is page-local

The report page SHALL maintain tag filter state only within the current page session. The tag filter state SHALL NOT be persisted in the URL and SHALL NOT change the CSV export scope.

#### Scenario: Navigating away resets the selected tags

- **WHEN** the user leaves the report page and later opens it again
- **THEN** the tag filter SHALL start with no selected tags

#### Scenario: CSV export ignores the report tag filter

- **WHEN** the user exports transactions from the report page while one or more report tags are selected
- **THEN** the CSV export SHALL follow the existing export scope and SHALL NOT be narrowed by the tag filter
