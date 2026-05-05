## ADDED Requirements

### Requirement: Category filter button is always visible on the report page

The report page SHALL display a category filter button in the header toolbar for both single-book and all-books views.

#### Scenario: Filter button visible in single-book view

- **WHEN** the user navigates to the report page for a specific account book
- **THEN** a "Filter categories" button SHALL be visible in the header alongside the time range selector

#### Scenario: Filter button visible in all-books view

- **WHEN** the user navigates to the all-books report page
- **THEN** a "Filter categories" button SHALL be visible in the header alongside the book filter and time range selector

### Requirement: Category filter excludes selected categories from report data

The report page SHALL filter transactions based on the user's excluded category set, hiding all transactions whose category is excluded.

#### Scenario: Excluding a category removes its transactions

- **WHEN** the user unchecks a category in the category filter
- **THEN** all transactions belonging to that category SHALL be removed from all report summaries and charts

#### Scenario: Including all categories restores full report data

- **WHEN** the user checks all categories (or presses "Include all")
- **THEN** all transactions SHALL appear in the report

#### Scenario: Filter badge shows excluded count

- **WHEN** one or more categories are excluded
- **THEN** the filter button SHALL display a badge with the count of excluded categories

### Requirement: Excluding a parent category also excludes its child categories

When a parent category is excluded, all transactions belonging to any of its child categories SHALL also be excluded from the report.

#### Scenario: Parent exclusion cascades to children

- **WHEN** the user excludes a parent category that has child categories
- **THEN** transactions whose categoryId matches any child of the excluded parent SHALL also be removed from the report

#### Scenario: Child categories remain excluded when parent is re-included

- **WHEN** the user excludes a parent category and then re-includes it
- **THEN** only the parent SHALL be re-included; child exclusions SHALL follow the parent's toggle state (re-including the parent re-includes children automatically)

### Requirement: Category filter drawer groups categories by type

The filter drawer SHALL display categories in two sections — Expense and Income — with child categories indented beneath their parent.

#### Scenario: Expense categories listed first

- **WHEN** the category filter drawer is open
- **THEN** all expense categories SHALL appear under an "Expense" section heading before the "Income" section

#### Scenario: Child categories are visually indented

- **WHEN** a parent category has child categories
- **THEN** child categories SHALL be displayed with increased left indentation beneath their parent row

### Requirement: Category filter provides include-all and exclude-all quick actions

The filter drawer SHALL provide buttons to include or exclude all categories at once.

#### Scenario: Exclude all removes all category transactions

- **WHEN** the user presses "Exclude all" in the category filter drawer
- **THEN** all transactions SHALL be removed from the report

#### Scenario: Include all restores all category transactions

- **WHEN** the user presses "Include all" in the category filter drawer
- **THEN** all transactions SHALL be shown in the report regardless of previous exclusions
