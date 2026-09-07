## Context

The CI workflow uses an Nx affected-target command to validate changes and then uploads `apps/web/out` for a separate GitHub Pages deployment job. A commit such as the Node-version update can leave the web project unaffected, so no web export exists for the artifact upload. The deployment job currently runs for both pushes and pull requests without verifying that the artifact was produced.

## Goals / Non-Goals

**Goals:**

- Preserve affected-project validation for lint, test, build, and end-to-end targets.
- Ensure every push to `main` creates the static web export before Pages artifact upload.
- Limit Pages artifact upload and deployment to pushes to `main`.

**Non-Goals:**

- Changing the application build output directory or Next.js export configuration.
- Changing Node runtime versions or action versions.
- Deploying preview environments for pull requests.

## Decisions

### Build the web export explicitly for main deployments

The workflow SHALL keep the affected-target command and add a separate `web:build` invocation for `main` pushes. This decouples Pages deployment input from Nx affected-project selection. Replacing the affected command with a full workspace build would perform unnecessary validation work and does not improve the deployment contract.

### Gate Pages artifact handling by event and branch

The explicit web build, artifact upload, and deploy job SHALL run only when the event is a push to `refs/heads/main`. This prevents pull-request runs from attempting a production deployment and makes the upload/download contract conditional as one unit. Retrying missing-artifact downloads would conceal the missing producer rather than fixing it.

## Implementation Contract

For a push to `main`, the workflow SHALL run the existing affected lint, test, build, and end-to-end validation, then run `npx nx run web:build` before uploading the `build-output` artifact from `apps/web/out`. The deploy job SHALL download that artifact and deploy it to GitHub Pages.

For a pull-request event, the workflow SHALL run the existing affected validation but SHALL NOT run the explicit deployment build, artifact upload, artifact download, or Pages deployment.

The workflow SHALL continue to use the existing artifact name and build output path. Verification SHALL inspect the YAML syntax and conditions, then run the web build locally to confirm it creates `apps/web/out`.

## Risks / Trade-offs

- [Main pushes take one additional web build when Nx does not consider web affected] → This is required to guarantee a Pages artifact and is limited to production deployment runs.
- [GitHub Actions conditions are not executable locally] → YAML assertions and the existing local web build validate the producer path; the next main push validates the runner behavior.
