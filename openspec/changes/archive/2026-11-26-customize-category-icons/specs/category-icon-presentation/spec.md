## MODIFIED Requirements

### Requirement: Category images have a consistent targeted inset in transaction and report surfaces

The system SHALL preserve the existing Avatar box dimensions and interactions for category icons. The transaction category selector root tabs and child cards SHALL have 2px internal icon padding. The report category breakdown rows SHALL have 4px internal icon padding.

#### Scenario: View transaction categories with icons

- **WHEN** a user opens the transaction category selector containing root and child categories with icons
- **THEN** each built-in or custom icon SHALL be displayed inside its existing Avatar box with the selector inset
- **AND** the existing root and child selection interactions SHALL remain available

#### Scenario: View report category summaries with icons

- **WHEN** a user views a report category breakdown containing a category summary with a built-in or custom icon
- **THEN** the icon SHALL be displayed inside its existing Avatar box with the report inset
- **AND** the existing report row interactions SHALL remain available

#### Scenario: View a report category summary without an icon

- **WHEN** a user views a report category summary with no category icon
- **THEN** the system SHALL display the existing chart fallback icon without requiring the category icon inset

## ADDED Requirements

### Requirement: New account books display built-in category icons without Iconify

The system SHALL bundle the built-in category icons and use them for the default income and expense categories of a newly created account book.

#### Scenario: Iconify is unavailable

- **WHEN** a user creates a new account book and Iconify is unreachable
- **THEN** the category settings and transaction selector SHALL show their built-in icons for default roots and children
- **AND** the category modal SHALL show its built-in icon options
- **AND** transactions recorded with built-in icons SHALL display those icons in the transaction list, report breakdown, and report details without sending a request to Iconify

### Requirement: Category surfaces show saved custom images with a local fallback

For categories in newly created account books, the system SHALL use the saved custom image URL wherever it displays the category icon. A custom image that fails to load SHALL display a bundled fallback.

#### Scenario: Display a saved custom image

- **WHEN** the image at the saved custom URL loads
- **THEN** the applicable category settings, transaction selector, transaction list, report breakdown, and report details SHALL show that image

#### Scenario: A saved custom image fails to load

- **WHEN** a category surface cannot load the image at the saved custom URL
- **THEN** the surface SHALL show a built-in fallback in the category icon slot
- **AND** the saved URL SHALL remain available when the category is edited
