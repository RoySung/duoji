## ADDED Requirements

### Requirement: Category images have a consistent targeted inset in transaction and report surfaces

The system SHALL render each category image in the transaction category selector root tabs and child cards with 2px internal padding. The system SHALL render each category image in report category breakdown rows with 4px internal padding. The Avatar root dimensions, category image source, category selection behavior, and report row interactions SHALL remain unchanged.

#### Scenario: View transaction categories with images

- **WHEN** a user opens the transaction category selector containing root and child categories with image URLs
- **THEN** every displayed category image SHALL have 2px internal padding inside its existing Avatar box

#### Scenario: View report category summaries with images

- **WHEN** a user views a report category breakdown containing a category summary with an image URL
- **THEN** the displayed category image SHALL have 4px internal padding inside its existing Avatar box

#### Scenario: View a report category summary without an image

- **WHEN** a user views a report category summary with no image URL
- **THEN** the system SHALL retain the existing chart fallback icon and SHALL NOT require image padding for that fallback
