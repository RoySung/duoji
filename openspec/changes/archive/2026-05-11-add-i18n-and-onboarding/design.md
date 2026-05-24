## Context

Duoji is a purely client-side PWA built on Next.js 15 (Pages Router) + React 19 + Zustand + Dexie (IndexedDB). All UI strings are currently English literals; user preferences are limited to a `next-themes` value in `localStorage`. There is no `Settings` entity and no first-run onboarding. Default categories come from two factory functions in `apps/web/src/constants/defaultCategories.ts` that produce 39 English categories, seeded at `AccountBookCreatePage.tsx:37`.

This change introduces i18n, single-row settings persistence, and a coachmark-driven tutorial that runs on the user's real first account book — without breaking the existing layered architecture (UI → Usecase → Repo → Entity). Existing users must not be forced through the tutorial after upgrading.

## Goals / Non-Goals

**Goals:**

- Mount an i18n provider in `_app.tsx` driven by `settingsStore.language`; switching language must not require a page reload.
- Add a `Settings` entity / repo / store with fields `language`, `onboardingCompleted`, `updatedAt`, persisted as a single row in the Dexie `appSettings` table (`id = 'app'`).
- Seed default categories in the active locale at account book creation time; later user edits must not be overwritten.
- Auto-detect locale from `navigator.language` on first run; allow the user to override during onboarding step 1.
- Onboarding is a dedicated `/onboarding` route with five fixed-order steps; every step is skippable; tutorial steps highlight elements on real pages via coachmarks.
- Existing users with data are marked `onboardingCompleted: true` on upgrade and never see the tutorial.

**Non-Goals:**

- No SSR-time localization (the app is client-only).
- No back-translation of existing English category names to Chinese on upgrade (preserve any user renames).
- No locales beyond `en-US` and `zh-TW`; no RTL.
- No sandbox account book for the tutorial; coachmarks run on the user's real book.
- No domain-behavior changes in transactions, settlement, or reports.

## Decisions

### Decision: Adopt next-intl as the i18n library

We picked `next-intl`: it has first-class support for the Next.js Pages Router, a small bundle, a `useTranslations` hook, and ICU MessageFormat. Message catalogs can ship as static JSON, and we drive the active locale from `settingsStore.language`.

Alternatives: `react-i18next` (large ecosystem, but the Next.js integration needs more boilerplate) and `@lingui/react` (compile-time message extraction, but requires extra babel/swc setup not present in this project). Both add toolchain cost over `next-intl`, and the user has already confirmed `next-intl`.

### Decision: Persist user settings in a single-row Dexie table

Add an `appSettings` table holding exactly one row with `id = 'app'`. Reasons:

- Matches the existing `local-persistence` capability — every other entity is already in Dexie.
- Future preferences (e.g. default currency) can be added as new fields without introducing yet another table.
- Easier to unit-test than `localStorage` (we already have a fake-indexeddb test setup) and reusable for future cloud sync.

Alternatives: `localStorage` (lightest, but breaks the layering and ends up coexisting awkwardly with `next-themes`); a multi-row key/value table (over-engineered for two fields today).

### Decision: Seed translated category names at ledger creation, not at read time

`defaultCategories.ts` becomes `getDefaultExpenseCategories(accountBookId, locale, startSortOrder)` (and the income equivalent). Names and descriptions are read from the i18n catalog (keys like `categories.defaults.expense.food.name`) and written into the database. Once written, they do not change when the user later switches language.

Reason: users can already rename categories under the `categories` capability. A "key + translate-on-read" approach would either lose translatability the moment the user renames a category, or require an extra `nameKey` field layered on top of `name` — added complexity. Translate-on-seed keeps the existing entity shape.

Alternative: store `nameKey` and translate in the UI with a fallback. Explicitly rejected — the migration cost and data-model expansion isn't worth it.

### Decision: Onboarding is a dedicated `/onboarding` route with route-level gating

When the app starts, if `settings.onboardingCompleted === false` and `accountBookStore.list.length === 0`, `apps/web/src/pages/index.tsx` (after `apps/web/src/pages/_app.tsx`) does `router.replace('/onboarding')`. Inside onboarding, step 1 (language) and step 2 (create account book) are full-screen standalone steps; steps 3–5 (tutorials) overlay coachmarks on the real transactions / settlement / reports pages, driven by `onboardingStore.currentStep`. The user advances with "Next" or "Skip".

Reason: the requirement is "guidance on the real app" rather than a sandbox; the coachmark pattern covers all three pages with minimal code; using a dedicated route keeps steps 1–2 from getting tangled with the empty-state logic in `apps/web/src/pages/index.tsx`.

Alternatives: a stack of modals playing in sequence (no real interaction, doesn't meet the requirement); a plain screen with screenshots (low implementation confidence, will drift from the real UI).

### Decision: Evaluate a third-party tour library before hand-rolling coachmarks

Before building `Coachmark.tsx` from scratch, evaluate established libraries and prefer adopting one if it meets our needs. Candidates to compare:

- `react-joyride` — React-native API, mature, supports step state, beacons, and skip controls; MIT.
- `@reactour/tour` — React-only, hooks-based, smaller surface; MIT.
- `driver.js` — framework-agnostic, very small bundle, simple highlight + popover; MIT.
- `shepherd.js` — framework-agnostic, rich step orchestration; MIT.
- `intro.js` — popular but AGPL for the open-source build, which is incompatible with our licensing posture → exclude.

Evaluation criteria, in priority order:

1. Bundle size impact (gzipped, on top of our existing client bundle).
2. Ability to anchor on stable `data-onboarding-anchor` attributes without us giving up control of step state to the library (we already keep `currentStep` in our own store).
3. Accessibility behavior out of the box (focus trap, Esc-to-skip, ARIA labelling) — we don't want to re-implement HeroUI Modal a11y inside a third-party tour.
4. Style customizability so the coachmark matches our existing HeroUI / Tailwind design tokens.
5. Active maintenance (last release within the past 12 months, no major open security advisories).

Decision rule: adopt the smallest library that passes criteria 2–4; only fall back to a hand-rolled `Coachmark.tsx` if every candidate forces us to surrender step state or fails accessibility. Record the chosen library (or the explicit decision to hand-roll, with reasoning) in this file before starting task 7.1.

**Outcome (2026-05-11):** Adopt **`@reactour/tour`**.

- React-only, hooks-based API that fits our existing React 19 / HeroUI stack idiomatically.
- Supports controlled mode (`currentStep` + `setCurrentStep`), so the library's tour state can mirror our `?onboarding=N` URL parameter without us giving up step control.
- Ships ARIA-correct focus management and Esc handling out of the box — no need to re-implement HeroUI Modal a11y inside the coachmark.
- Smaller surface than `react-joyride` while still providing the full step-orchestration UX we need; bundle cost is acceptable for an onboarding-only flow.
- We rejected `driver.js` (smallest but imperative API forces ad-hoc React glue), `react-joyride` (heaviest), `shepherd.js` (heavier dep tree, framework-agnostic features we don't need), and hand-rolling (highest maintenance cost vs. a maintained library that already covers our needs).

### Decision: Auto-detect locale from `navigator.language` on first hydration

When `settingsStore` hydrates and finds no `appSettings` row, it creates `{ language: detect(), onboardingCompleted: false, updatedAt: now }`. The `detect()` rule: `navigator.language?.toLowerCase().startsWith('zh') ? 'zh-TW' : 'en-US'`.

Reason: the user asked for auto-detection; anything that doesn't match `zh-*` falls back to `en-US`.

### Decision: Existing users (with data) skip onboarding on upgrade

When `settingsStore` hydrates and finds no `appSettings` row but `accountBookStore.list.length > 0`, it sets `onboardingCompleted` to `true` directly, so existing users aren't forced through the tutorial after an upgrade.

Alternatives: force everyone through it once (poor experience); never show the tutorial (then new users never see it either — contradictory).

## Risks / Trade-offs

- [Bundle size growth] `next-intl` plus two message JSONs → load the non-active catalog via dynamic import, and keep the initial catalog limited to keys actually needed by onboarding / categories / settings.
- [Coachmark coupling to real-page layout] If the highlighted element's DOM structure changes, coachmark positioning breaks → anchor on stable `data-onboarding-anchor="..."` attributes (not CSS selectors), and cover every step in e2e tests.
- [Dexie schema upgrade] Adding the `appSettings` table requires a version bump; if the user closes the tab mid-upgrade we could end up with partial state → in the `apps/web/src/lib/dexie.ts` upgrade callback wrap the seed in `try/catch` and make it idempotent (upsert by `id = 'app'`, not add).
- [Existing-user detection ordering] Settings hydration can only judge "mark complete" once accountBook hydration is done → in `_app.tsx`, await `initializeDB()` first, then hydrate accountBook and settings in order, then run the onboarding gate.
- [Existing category names don't change on locale switch] Users may expect them to → add helper text under the language dropdown on the settings page: "Switching language won't rename existing categories."
- [Coachmark + modal/keyboard accessibility] Must handle Esc-to-skip and Tab focus trap → reuse HeroUI `Modal`'s a11y behavior as the coachmark container scaffold.
