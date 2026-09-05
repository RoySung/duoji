## 1. Remove obsolete tooling

- [x] 1.1 Fulfil the Production banner assets are retained requirement by deleting `apps/web/scripts/process-banner-assets.mjs` while leaving both production WebP banner assets and their transaction-page references untouched; verify with `pnpm test:web --runTestsByPath specs/bannerAssets.spec.ts` and a repository search that finds no remaining script reference.
