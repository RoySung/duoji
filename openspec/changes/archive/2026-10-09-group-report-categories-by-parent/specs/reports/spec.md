## MODIFIED Requirements

### Requirement: Report page displays category breakdown

The report page SHALL display a hierarchical category breakdown for each scope, with separate views for expense and income categories accessible via a tab control.

The breakdown SHALL include:

- A donut chart visualizing each root category's proportion of the total.
- A donut center label identifying the current category context, using the localized all-categories label at the root level and the selected root category name in a focused view.
- A ranking list showing each root category's display name, total amount, transaction count, and percentage of the total, sorted by amount descending.
- A hierarchy indicator above the category content that remains visible at every level, displaying a static localized all-categories label at the root level and a breadcrumb/back control naming the selected root in a focused view.
- A root-level ranking whose primary row actions and matching donut slices navigate into eligible root categories.
- A focused root view with a breadcrumb/back control and synchronized donut and ranking list showing each subcategory's display name, total amount, transaction count, and percentage of the selected root total, sorted by amount descending.
- A localized direct-assignment item in the focused view when the selected root contains transactions assigned directly to itself.
- A user-selectable subcategory-comparison mode containing a horizontal bar chart and synchronized ranking list that flatten every root's subcategories and direct-assignment item into one globally amount-sorted comparison.

A root category's amount, count, percentage, and transaction detail SHALL include transactions assigned directly to the root and transactions assigned to its descendant categories. A subcategory row's amount, count, and transaction detail SHALL include only transactions assigned to that subcategory. Root-level percentages SHALL use the complete active-type amount as denominator. Focused-view percentages SHALL use the selected root amount as denominator. Navigating between hierarchy levels SHALL NOT change report totals, category exclusion state, or transaction data.

The subcategory-comparison mode SHALL label every entry with its full root/subcategory path, SHALL calculate each percentage against the complete amount for the active transaction type, and SHALL assign stable colors by root identity. Activating a comparison bar SHALL open the transactions represented by that entry. Stored subcategories SHALL retain independent include/exclude and transaction-detail actions in the synchronized list, while direct-assignment entries SHALL remain detail-only. Changing expense/income tabs SHALL return the category breakdown to the root overview.

When the scope is a single account book, root and subcategory entries SHALL be grouped by category identity and display each category's `name` and `imageUrl`.

When the scope is the aggregate view (`all`), root categories SHALL be grouped by root category name so that identically named roots across different account books merge into a single entry. Subcategories SHALL be grouped by subcategory name within the merged root, so identically named subcategories beneath different root names remain separate. A merged entry's image MUST be taken from the first occurrence encountered during aggregation.

Transactions whose `categoryId` cannot be resolved to a known category SHALL be grouped under a single non-expandable `Uncategorized` root entry for their transaction type. A known category whose root cannot be resolved because of a missing or cyclic parent reference SHALL remain visible as a non-expandable top-level entry using the known category's identity.

#### Scenario: Expense tab shows root expense categories initially

- **WHEN** the user activates the `Expense` tab and the scoped expense transactions belong to subcategories under one or more root categories
- **THEN** the donut and ranking list SHALL initially show only the corresponding root expense categories with their descendant amounts and counts rolled up

#### Scenario: Income tab shows root income categories initially

- **WHEN** the user activates the `Income` tab and the scoped income transactions belong to subcategories under one or more root categories
- **THEN** the donut and ranking list SHALL initially show only the corresponding root income categories with their descendant amounts and counts rolled up

#### Scenario: User drills into a root from the list

- **WHEN** the user activates the primary row action for a root category with child or direct-assignment data
- **THEN** the system SHALL replace both the donut and ranking list with that root's focused composition
- **AND** the system SHALL expose a breadcrumb/back control naming the selected root

#### Scenario: User drills into a root from the chart

- **WHEN** the user activates a donut slice for a root category with child or direct-assignment data
- **THEN** the system SHALL show the same focused composition produced by the matching root row action

#### Scenario: Current hierarchy indicator remains visible

- **WHEN** the user views the category breakdown at the root level
- **THEN** a non-interactive localized all-categories label SHALL be visible above the category content
- **AND** when the user drills into `Food`, the indicator SHALL become a breadcrumb/back control displaying `All categories / Food`
- **AND** returning from `Food` SHALL restore the non-interactive all-categories label

#### Scenario: Donut label stays fixed to the current category context

- **WHEN** the user views all categories or drills into a root category
- **THEN** the donut center label SHALL identify the current category context as the localized all-categories label or the selected root category name
- **AND** excluding a child category or changing active amounts SHALL NOT replace that label with a generic total or a different category name

##### Example: Root and focused labels

- **GIVEN** root categories `Food` and `Transport`, with `Food` containing child `Dining`
- **WHEN** the report is at the root level and then focused on `Food`
- **THEN** the donut center labels SHALL be `All categories` and `Food`, respectively
- **AND** excluding `Dining` SHALL leave the focused center label as `Food`

#### Scenario: User returns to all categories

- **WHEN** the user activates the focused view's breadcrumb/back control
- **THEN** the donut and ranking list SHALL return to root categories

#### Scenario: Tab change resets hierarchy navigation

- **WHEN** the user changes between the expense and income tabs while viewing a focused root
- **THEN** the newly active tab SHALL open at its root-category level

#### Scenario: User compares subcategories across roots

- **WHEN** the user switches from the root overview to subcategory comparison
- **THEN** the system SHALL show a horizontal bar and synchronized ranking entry for every scoped child category and non-zero direct-assignment item across all roots
- **AND** the entries SHALL be sorted globally by amount descending
- **AND** each entry SHALL display its full root/subcategory path

##### Example: Cross-root comparison ordering and percentages

- **GIVEN** total scoped expense is `1000`, `Food > Dining` is `300`, `Transport > Taxi` is `200`, and direct assignments to `Food` are `100`
- **WHEN** the user opens subcategory comparison
- **THEN** the entries SHALL appear in the order `Food / Dining`, `Transport / Taxi`, `Food / Directly in Food`
- **AND** their percentages SHALL be `30%`, `20%`, and `10%`, respectively

#### Scenario: Comparison actions preserve represented transactions

- **WHEN** the user activates a child bar or its explicit transaction-detail action
- **THEN** the detail SHALL contain only transactions assigned to that child
- **AND** when the user activates a direct-assignment bar, the detail SHALL contain only transactions assigned directly to that root
- **AND** excluding a stored child from the synchronized list SHALL NOT exclude its siblings

#### Scenario: Tab change leaves comparison mode

- **WHEN** the user changes between expense and income while subcategory comparison is active
- **THEN** the newly active tab SHALL return to the root overview

#### Scenario: Hierarchical totals and ordering are calculated from scoped transactions

- **WHEN** a report contains expense transactions of `120` assigned directly to `Food`, `300` assigned to `Food > Dining`, `80` assigned to `Food > Groceries`, and `200` assigned to `Transport > Transit`
- **THEN** the root ranking SHALL show `Food` first with amount `500` and `Transport` second with amount `200`
- **AND** drilling into `Food` SHALL show `Dining` before `Groceries` plus a localized direct-assignment item for `120`
- **AND** focused percentages SHALL be `60%` for `Dining`, `16%` for `Groceries`, and `24%` for the direct-assignment item

#### Scenario: Root and subcategory details use their represented transactions

- **WHEN** the user opens transaction details from a root row
- **THEN** the detail SHALL contain the scoped transactions assigned directly to that root and to its descendant categories
- **AND** when the user opens transaction details from a subcategory row, the detail SHALL contain only scoped transactions assigned to that subcategory

#### Scenario: Direct root assignments reconcile the focused view

- **WHEN** a selected root contains transactions assigned directly to itself and transactions assigned to child categories
- **THEN** the focused donut and list SHALL include a localized direct-assignment item containing only the direct transactions
- **AND** the focused item amounts SHALL sum to the selected root amount
- **AND** the direct-assignment item SHALL open its represented transaction detail without exposing a category exclusion action

#### Scenario: Aggregate view merges hierarchy by parent-scoped names

- **WHEN** two account books in the same currency section each contain a root named `Food` with a subcategory named `Dining`, and another root named `Travel` also has a subcategory named `Dining`
- **THEN** the breakdown SHALL present one merged `Food` root with one merged `Dining` child for the two books
- **AND** the `Dining` child beneath `Travel` SHALL remain a separate entry

#### Scenario: Excluding hierarchy levels updates active report data

- **WHEN** the user excludes a subcategory row
- **THEN** only that subcategory's transactions SHALL be removed from the donut, summary values, and monthly trend while its active siblings remain included
- **AND** when the user excludes a root row, transactions assigned directly to that root and to all of its descendants SHALL be removed from those report outputs

#### Scenario: Unknown and malformed categories remain visible

- **WHEN** scoped transactions contain unknown category IDs or a known category whose parent chain cannot resolve to a valid root
- **THEN** unknown IDs SHALL aggregate into one non-expandable `Uncategorized` root for the transaction type
- **AND** each known category with a broken parent chain SHALL render as a non-expandable top-level entry instead of being omitted
