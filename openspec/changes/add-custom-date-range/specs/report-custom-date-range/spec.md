## ADDED Requirements

### Requirement: User can select a custom date range on the report page

The report time range selector SHALL include a "Custom" option that allows users to specify an arbitrary start date and end date for the report.

#### Scenario: Custom option is available

- **WHEN** the user views the report page
- **THEN** the time range selector SHALL display a "Custom" tab alongside the existing preset tabs

#### Scenario: Date inputs appear after selecting Custom

- **WHEN** the user selects the "Custom" tab
- **THEN** the system SHALL display a start date input and an end date input

#### Scenario: Report updates when both dates are provided

- **WHEN** the user has selected "Custom" and provides both a valid start date and a valid end date
- **THEN** the system SHALL fetch and display transactions within that date range

#### Scenario: Report does not fetch while custom range is incomplete

- **WHEN** the user has selected "Custom" but has not yet provided both a start date and an end date
- **THEN** the system SHALL NOT issue a data fetch and SHALL display a prompt asking the user to select a date range

#### Scenario: End date must not be before start date

- **WHEN** the user selects an end date that is earlier than the start date
- **THEN** the system SHALL indicate the date range is invalid and SHALL NOT fetch transactions
