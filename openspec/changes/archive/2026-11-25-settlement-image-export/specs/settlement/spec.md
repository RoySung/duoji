## ADDED Requirements

### Requirement: User can preview and share an existing settlement as PNG

The settlement record actions menu SHALL provide an image export action that opens a preview and shares the displayed complete PNG using the system share sheet on request. The report SHALL include the record number and date, settlement status, member balances, transfer directions and statuses, applicable recorded actual amounts and notes, and the count and itemized details of the active linked expenses. Each item SHALL include its date, description, category, total amount, payers and their amounts, and participants and their split amounts. The image SHALL use the current rounding setting for displayed member balances and suggested transfers and preserve the existing amount formatting for actual amounts and expense details.

#### Scenario: Preview and share a settlement image

- **WHEN** the user opens image export from an existing settlement with loaded linked expenses and shares the previewed image
- **THEN** the shared PNG SHALL show the same complete report as the preview, with no preview controls in the file, and the settlement and its linked expenses SHALL remain unchanged

#### Scenario: Suggested amounts follow automatic rounding

- **WHEN** the user previews a record with a suggested transfer of 150.20 while automatic rounding is enabled
- **THEN** the suggested amount SHALL display as 151 in the record currency, and recorded actual amounts and expense amounts SHALL retain their existing display precision

#### Scenario: Linked expenses have not been loaded successfully

- **WHEN** the user opens image export during loading or after a failed load of the current record's expenses
- **THEN** the system SHALL show the loading or error state, prevent sharing a partial report, and provide a retry after failure

#### Scenario: A record has no active linked expenses

- **WHEN** image export opens after linked expenses load successfully and none are active
- **THEN** the report SHALL show an expense count of zero and an empty state

#### Scenario: PNG generation fails

- **WHEN** generation of the report image fails
- **THEN** the preview SHALL show an error with a retry action and SHALL prevent sharing until a valid PNG is ready

### Requirement: Image exports include all detail in one continuous PNG

The system SHALL show one preview and share one PNG containing all report content in order, including long or wrapped expense details.

#### Scenario: A report contains a long list and wrapped descriptions

- **WHEN** the user exports a report with long or numerous expense entries
- **THEN** the preview and the single PNG offered for sharing SHALL include all entries and their details in order without omission or duplication

### Requirement: The preview handles unavailable, cancelled, and failed file sharing

The preview SHALL show localized feedback when its PNG cannot be shared on the device or when the system share action fails. The preview SHALL remain available for inspection and allow a retry after a sharing error.

#### Scenario: File sharing is unsupported

- **WHEN** the browser does not support sharing the generated PNG
- **THEN** the preview SHALL remain open, indicate that file sharing is unavailable, and disable the share action

#### Scenario: User cancels the share sheet

- **WHEN** the user cancels the native share sheet
- **THEN** the preview SHALL remain ready for sharing without an error

### Requirement: User can preview and share a PNG draft before confirming settlement

The settlement confirmation dialog SHALL offer an Export draft menu with Image (PNG) and Markdown. It SHALL provide an image draft preview and PNG sharing when eligible expenses exist and submission is idle. The draft SHALL be identified in the shared image and include the export time, reviewed member balances, suggested transfers, applicable Shared Wallet summary, and reviewed expense details. Suggested amounts SHALL use the rounding setting at the time the preview opens. Closing the preview SHALL return to confirmation. Previewing and sharing SHALL leave records and expense links unchanged.

#### Scenario: Preview and share a draft before confirmation

- **WHEN** the user opens and shares an image draft for a review with eligible expenses and an applicable Shared Wallet summary
- **THEN** the preview and shared PNG SHALL show the drafted review with the same data and rounding, including the Shared Wallet summary, and no settlement record SHALL be created or expense relinked

#### Scenario: Draft export is unavailable during submission or for an empty review

- **WHEN** the user reviews a settlement with no eligible expenses, or confirmation is in progress
- **THEN** the Export draft menu trigger SHALL be disabled
