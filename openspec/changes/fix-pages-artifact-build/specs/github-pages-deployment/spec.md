## ADDED Requirements

### Requirement: GitHub Pages deployment has a guaranteed web artifact

For every GitHub Actions push event targeting the `main` branch, the workflow SHALL build the web static export before uploading the `build-output` artifact from `apps/web/out`. The deployment job SHALL download that artifact and deploy it to GitHub Pages.

#### Scenario: Push changes that do not affect the web project

- **WHEN** a commit that does not affect the web project is pushed to `main`
- **THEN** the workflow SHALL run the web build before the artifact upload
- **THEN** the deployment job SHALL receive an artifact named `build-output`

#### Scenario: Push changes that affect the web project

- **WHEN** a commit that affects the web project is pushed to `main`
- **THEN** the workflow SHALL complete affected-project validation and upload a freshly built web export for Pages deployment

### Requirement: Pull requests do not deploy GitHub Pages

For every pull-request event, the workflow SHALL run its affected-project validation and SHALL NOT upload, download, or deploy the GitHub Pages artifact.

#### Scenario: Pull request validation

- **WHEN** a pull request triggers the workflow
- **THEN** the affected lint, test, build, and end-to-end targets SHALL remain eligible to run
- **THEN** no GitHub Pages deployment step SHALL run
