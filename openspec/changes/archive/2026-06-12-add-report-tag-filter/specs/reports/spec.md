## ADDED Requirements

### Requirement: Report outputs reflect the active tag filter

When the report page has an active tag filter selection, the report's derived outputs SHALL be recalculated from the tag-filtered transaction dataset for the current page scope.

#### Scenario: Summary values reflect the active tag filter

- **WHEN** one or more report tags are selected
- **THEN** the income, expense, and net summary values SHALL be calculated from only the transactions that remain in scope after tag filtering

#### Scenario: Category breakdown reflects the active tag filter

- **WHEN** one or more report tags are selected
- **THEN** the category breakdown chart and ranking list SHALL use only the transactions that remain in scope after tag filtering

#### Scenario: Monthly trend reflects the active tag filter

- **WHEN** one or more report tags are selected
- **THEN** the monthly trend chart SHALL use only the transactions that remain in scope after tag filtering
