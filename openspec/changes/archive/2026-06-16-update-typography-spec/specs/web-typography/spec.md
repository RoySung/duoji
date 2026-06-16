## ADDED Requirements

### Requirement: Application uses open huninn as the default font

The web application SHALL load and apply the "jf-openhuninn" font as its primary sans-serif typeface, sourcing from the official [open 粉圓 - justfont](https://justfont.com/huninn/) release (version 2.1).

#### Scenario: Verify default font configuration

- **WHEN** a user visits any page of the web application
- **THEN** the system SHALL apply "jf-openhuninn" as the first font in the sans-serif font-family fallback list
