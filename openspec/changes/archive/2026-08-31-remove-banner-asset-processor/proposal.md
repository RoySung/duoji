## Why

The banner source images have already been converted into production WebP assets. The one-off processing utility is no longer needed in the repository.

## What Changes

- Remove the obsolete banner asset-processing script.
- Preserve the generated banner WebP assets, their runtime consumers, and their asset verification coverage.

## Non-Goals

- Do not replace, regenerate, rename, or remove the production banner assets.
- Do not alter transaction-page banner behavior or visual presentation.

## Capabilities

### New Capabilities

- `banner-assets`: Defines the production banner assets that remain after removal of their one-off source-processing utility.

### Modified Capabilities

(None.)

## Impact

- Affected specs: none; runtime requirements are unchanged.
- Affected code:
  - Removed: apps/web/scripts/process-banner-assets.mjs
