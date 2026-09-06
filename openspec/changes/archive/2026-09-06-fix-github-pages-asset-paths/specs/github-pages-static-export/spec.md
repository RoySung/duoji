## ADDED Requirements

### Requirement: GitHub Pages export uses repository-scoped assets

The GitHub Pages deployment build SHALL set `NEXT_PUBLIC_BASE_PATH` to `/duoji`. The exported entry page SHALL reference Next.js static assets beneath `/duoji/_next/` and SHALL NOT reference their root-level `/_next/` location.

#### Scenario: Build for the GitHub Pages repository path

- **WHEN** the workflow builds the web application for a push to `main`
- **THEN** the exported entry page contains Next.js static asset URLs beginning with `/duoji/_next/`

### Requirement: CI rejects an unscoped GitHub Pages asset export

Before uploading the GitHub Pages artifact, the workflow SHALL verify that the exported entry page contains a `/duoji/_next/` asset reference. The workflow SHALL fail when that reference is absent.

#### Scenario: Base-path configuration is missing from the Pages build

- **WHEN** the Pages build produces an entry page with `/_next/` asset URLs
- **THEN** the workflow fails before uploading the build artifact
