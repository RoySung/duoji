## Context

The Next.js web app already derives `basePath` and `assetPrefix` from `NEXT_PUBLIC_BASE_PATH`. The GitHub Pages workflow invokes the same web build without that variable, so static HTML references root-relative `_next` assets even though GitHub Pages publishes the site at `/duoji`.

## Goals / Non-Goals

**Goals:**

- Build the GitHub Pages artifact with `/duoji` as its public base path.
- Fail the deployment job before upload when the exported entry page does not reference `/duoji/_next/` assets.
- Preserve root-relative development behavior when the variable is absent.

**Non-Goals:**

- Derive the repository name dynamically from GitHub Actions context.
- Change browser routing, local development commands, or non-GitHub-Pages deployments.

## Decisions

### Set the Pages base path in the GitHub Pages build step

Set `NEXT_PUBLIC_BASE_PATH` only on the Pages-specific build step and invoke that Nx target with `--skip-nx-cache`. The generic affected build can cache an export created without the Pages environment variable, while Nx's task cache does not include that variable by default. Skipping the cache for the Pages export ensures the output is built with the declared path. This keeps local development and generic CI builds unprefixed. Deriving the path in application configuration would broaden the change and introduce deployment-context coupling into local builds.

### Validate exported asset references before upload

After the Pages build, inspect `apps/web/out/index.html` and fail the job unless it contains a stylesheet or script URL rooted at `/duoji/_next/`. The assertion directly detects the browser-facing failure before GitHub uploads the artifact. A full deployed-site check is out of scope because it would require waiting for and probing a published environment.

## Implementation Contract

- **Behavior:** A push to `main` that enters the GitHub Pages deployment path SHALL build the web export with `NEXT_PUBLIC_BASE_PATH=/duoji` and SHALL bypass any Nx task cache created by an earlier generic build.
- **Output:** The produced `apps/web/out/index.html` SHALL reference Next.js static assets beneath `/duoji/_next/`; it SHALL NOT reference the root-level `/_next/` asset location for those assets.
- **Failure mode:** The GitHub Pages build job SHALL fail before uploading the artifact when the entry page lacks a `/duoji/_next/` reference.
- **Acceptance criteria:** Running the Pages build command locally with `NEXT_PUBLIC_BASE_PATH=/duoji` and inspecting the exported entry page demonstrates the prefixed asset URL. The CI workflow contains the equivalent build setting and assertion.
- **Scope boundaries:** This contract covers only the GitHub Pages production build and exported asset references. It excludes local development paths, route logic, custom domains, and deployment providers other than GitHub Pages.

## Risks / Trade-offs

- [Repository rename changes the required prefix] → The workflow uses the current repository path as an explicit deployment contract; a rename requires updating this single value and its assertion.
- [A malformed build can contain one valid prefixed reference while other assets are wrong] → Next.js derives all static asset references from the same `basePath` and `assetPrefix` configuration; the local artifact check also covers the observed stylesheet failure.

## Migration Plan

1. Merge the workflow change to `main`.
2. Let the existing GitHub Pages workflow publish the new export.
3. Load `https://roysung.github.io/duoji/` and confirm its network requests use `/duoji/_next/`.
4. If deployment must be rolled back, remove the Pages-only environment variable and validation step, then redeploy the previous artifact behavior.

## Open Questions

None.
