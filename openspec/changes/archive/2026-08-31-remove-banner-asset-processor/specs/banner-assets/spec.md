## ADDED Requirements

### Requirement: Production banner assets are retained

The repository SHALL retain `apps/web/public/images/ui/duoji-banner-background.webp` and `apps/web/public/images/ui/duoji-banner-travel.webp` after the obsolete source-processing utility is removed. The transaction page SHALL continue to reference both retained assets.

#### Scenario: Removing the processing utility

- **WHEN** `apps/web/scripts/process-banner-assets.mjs` is removed
- **THEN** both production WebP assets remain present and the transaction-page banner continues to reference them
