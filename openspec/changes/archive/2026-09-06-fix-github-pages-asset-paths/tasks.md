## 1. GitHub Pages asset-path repair

- [x] 1.1 Implement GitHub Pages export uses repository-scoped assets by running the Pages-only web build with `NEXT_PUBLIC_BASE_PATH=/duoji` and `--skip-nx-cache`; verify with `NEXT_PUBLIC_BASE_PATH=/duoji pnpm exec nx run web:build --skip-nx-cache` and an inspection of `apps/web/out/index.html` showing `/duoji/_next/` asset URLs.
- [x] 1.2 Implement CI rejects an unscoped GitHub Pages asset export by checking the Pages build entry page for `/duoji/_next/` before artifact upload; verify the workflow content includes the failing assertion and the Pages build command passes locally with its configured base path.

## 2. Validation

- [x] 2.1 Validate Set the Pages base path in the GitHub Pages build step and Validate exported asset references before upload by running the targeted export build, confirming it has no `href="/_next/` or `src="/_next/` references, and running `spectra validate fix-github-pages-asset-paths`.
