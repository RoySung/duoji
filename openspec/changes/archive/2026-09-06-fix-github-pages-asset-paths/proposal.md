## Why

The GitHub Pages deployment serves this repository from `/duoji`, but its build currently emits root-relative Next.js asset URLs. Browsers therefore request CSS and JavaScript from `https://roysung.github.io/_next/...`, which returns 404 instead of loading the deployed application assets.

## What Changes

- Configure the GitHub Pages production build with the repository base path.
- Add a CI assertion that the exported entry page references Next.js assets beneath `/duoji/_next/`.

## Non-Goals

- Change local development URLs or the application router.
- Add support for custom GitHub Pages domains or arbitrary repository names.
- Change hosting providers or the deployment action.

## Capabilities

### New Capabilities

- `github-pages-static-export`: GitHub Pages builds produce and validate repository-scoped Next.js asset URLs.

### Modified Capabilities

(none)

## Impact

- Affected code:
  - Modified: `.github/workflows/ci.yml`
  - New: `openspec/changes/fix-github-pages-asset-paths/specs/github-pages-static-export/spec.md`
