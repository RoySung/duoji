## ADDED Requirements

### Requirement: Category modal displays icon selection in a grid layout without text labels

The system SHALL display the available category icons in a grid layout inside the category modal, showing only the icon images without text labels.

#### Scenario: View icon options in the category modal
- **WHEN** the category modal is opened
- **THEN** the system SHALL display a scrollable grid containing all available category icons, with the active category icon highlighted
- **AND** the system SHALL provide accessible titles and ARIA labels for each icon using the corresponding translation keys

#### Scenario: Select an icon from the grid
- **WHEN** a user clicks on an icon in the grid
- **THEN** the system SHALL update the selected icon state to the clicked icon and highlight it in the grid
