## 1. CI deployment artifact contract

- [x] 1.1 Build the web export explicitly for main deployments and gate Pages artifact handling by event and branch in .github/workflows/ci.yml so GitHub Pages deployment has a guaranteed web artifact on every push to main while pull requests do not deploy GitHub Pages; verify with YAML condition assertions and `pnpm build:web` producing apps/web/out.
