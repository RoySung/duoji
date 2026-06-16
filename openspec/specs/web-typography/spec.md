# web-typography Specification

## Purpose

This specification defines the default typography requirements for the web application, ensuring the branding font "Open Huninn" is consistently loaded and applied as the primary typeface.

## Requirements

### Requirement: Application uses open huninn as the default font

The web application SHALL load and apply the "jf-openhuninn" font as its primary sans-serif typeface, sourcing from the official [Open Huninn - justfont](https://justfont.com/huninn/) release (version 2.1).

#### Scenario: Verify default font configuration

- **WHEN** a user visits any page of the web application
- **THEN** the system SHALL apply "jf-openhuninn" as the first font in the sans-serif font-family fallback list

<!-- @trace
source: update-typography-spec
updated: 2026-06-16
code:
  - apps/web/public/fonts/jf-openhuninn-2.1.ttf
  - apps/web/tailwind.config.js
  - apps/web/src/pages/styles.css
-->