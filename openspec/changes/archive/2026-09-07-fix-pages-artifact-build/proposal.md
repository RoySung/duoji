## Why

A push that does not affect the web project can pass the affected-target checks without creating the GitHub Pages build output. The unconditional deployment job then fails because the expected artifact does not exist.

## What Changes

- Build the web export explicitly for GitHub Pages deployments triggered by pushes to `main`.
- Upload and deploy the Pages artifact only for pushes to `main`.
- Retain affected-project lint, test, build, and end-to-end checks for both push and pull-request workflows.

## Capabilities

### New Capabilities

- `github-pages-deployment`: GitHub Pages deployments receive a fresh web export artifact on every push to the main branch.

### Modified Capabilities

- None.

## Impact

- Affected code:
  - Modified: .github/workflows/ci.yml
