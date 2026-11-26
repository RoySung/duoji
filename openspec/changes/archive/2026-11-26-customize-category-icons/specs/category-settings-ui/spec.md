## MODIFIED Requirements

### Requirement: Category modal displays icon selection in a grid layout without text labels

For categories in newly created account books, the category modal SHALL offer a choice of a built-in icon or a custom image URL. The built-in choices SHALL appear in a scrollable icon-only grid.

#### Scenario: View icon options in the category modal

- **WHEN** the category modal opens with the built-in icon source selected
- **THEN** the system SHALL display all built-in icons in a scrollable grid and highlight the active icon
- **AND** the system SHALL provide accessible titles and ARIA labels using the corresponding translation keys

#### Scenario: Select an icon from the grid

- **WHEN** a user clicks a built-in icon
- **THEN** the system SHALL select and highlight that icon

#### Scenario: Preview and save a custom image

- **WHEN** a user creating or editing a root or child category chooses the custom source and enters an absolute HTTPS URL without embedded credentials
- **THEN** the system SHALL preview the image from the trimmed URL
- **AND** submitting and saving the category settings SHALL persist that URL as the icon choice

##### Example: Image endpoint with a query string and no file extension

- **GIVEN** `https://images.example.com/icon?id=coffee` returns an image
- **WHEN** the user enters that URL with surrounding whitespace and saves the category
- **THEN** the image SHALL load in preview and the system SHALL store `https://images.example.com/icon?id=coffee`

#### Scenario: Reject invalid custom URL input

- **WHEN** a user submits with the custom source selected and the URL is empty, relative, malformed, uses a scheme other than HTTPS, or contains embedded credentials
- **THEN** the system SHALL display a URL field error and keep the category modal open without submitting

##### Example: Invalid inputs in custom mode

| Input | Expected Output |
| --- | --- |
| Empty or whitespace only | URL field error and no submission |
| `/icons/coffee.svg` | URL field error and no submission |
| `https://` | URL field error and no submission |
| `http://images.example.com/coffee.svg` | URL field error and no submission |
| `https://user@images.example.com/coffee.svg` | URL field error and no submission |

#### Scenario: Save an unavailable custom image URL

- **WHEN** a valid custom image URL fails to load in the preview
- **THEN** the system SHALL show a built-in fallback and indicate the preview could not load
- **AND** the user SHALL be able to save the valid URL and edit it later

#### Scenario: Reopen or switch a saved icon choice

- **WHEN** a user opens a saved category for editing after reloading the app
- **THEN** the form SHALL prefill the saved icon source and its key or URL
- **AND** changing only the name SHALL preserve the saved icon
- **AND** selecting and saving a different source SHALL replace the saved icon with the selected built-in key or custom URL
