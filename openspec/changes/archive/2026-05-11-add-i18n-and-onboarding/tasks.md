## 1. Install and base setup

- [x] 1.1 Decision: Adopt next-intl as the i18n library — add `next-intl` to `apps/web/package.json` and run `pnpm install`
- [x] 1.2 Create `apps/web/src/i18n/config.ts` exporting the supported locale list and the default fallback rule (zh-* → zh-TW, otherwise en-US)
- [x] 1.3 Create `apps/web/src/i18n/messages/en-US.json` and `zh-TW.json`, seeded with the keys needed by onboarding, settings, and categories for this change

## 2. App Settings entity, repo, and store

- [x] 2.1 Decision: Persist user settings in a single-row Dexie table — create `apps/web/src/entities/settings.ts` with a Zod schema for Settings (`language`, `onboardingCompleted`, `updatedAt`), satisfying the "Application maintains a persistent Settings record" requirement
- [x] 2.2 Bump the schema version in `apps/web/src/lib/dexie.ts` and add the `appSettings` table (id primary key); ensure the upgrade is idempotent
- [x] 2.3 Create `apps/web/src/repositories/settingsRepo/settingsLocalRepo.ts` and `index.ts` with `getSettings()` / `upsertSettings()` operating on the single 'app' row
- [x] 2.4 Create `apps/web/src/stores/settings/settingsStore.ts`, `settingsStoreProvider.tsx`, and `index.ts` (Zustand store) exposing `language`, `onboardingCompleted`, `setLanguage`, `markOnboardingComplete`

## 3. Bootstrap sequence and i18n provider

- [x] 3.1 Decision: Auto-detect locale from `navigator.language` on first hydration — add the bootstrap sequence in `apps/web/src/pages/_app.tsx` (`initializeDB()` → hydrate accountBook store → hydrate settings store), using `navigator.language` on first run, satisfying the "Initial locale is auto-detected from the browser on first run" requirement
- [x] 3.2 Mount `NextIntlClientProvider` in `_app.tsx` driven by `settingsStore.language`, satisfying the "Application supports en-US and zh-TW locales" and "Locale changes apply without a full page reload" requirements
- [x] 3.3 Satisfy "Settings store is hydrated before any locale-dependent UI renders": complete settings hydration before mounting the i18n provider, and add a fallback render in the `_app` bootstrap sequence
- [x] 3.4 Decision: Existing users (with data) skip onboarding on upgrade — when no Settings row exists but the accountBook list is non-empty, create the Settings record with `onboardingCompleted: true`, satisfying the "Existing users with prior data skip onboarding on first upgrade" requirement

## 4. Localized default categories

- [x] 4.1 Add `categories.defaults.expense.*` and `categories.defaults.income.*` name and description keys to `apps/web/src/i18n/messages/en-US.json` and `apps/web/src/i18n/messages/zh-TW.json`
- [x] 4.2 Decision: Seed translated category names at ledger creation, not at read time — refactor `apps/web/src/constants/defaultCategories.ts` to `getDefaultExpenseCategories(accountBookId, locale, startSortOrder)` (and the income equivalent), reading names and descriptions from the message catalog; ensure the MODIFIED "Categories are scoped to an account book" requirement is satisfied
- [x] 4.3 Update `apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx:37` to pass `settingsStore.language` to the seeder
- [x] 4.4 Add Jest tests covering both `zh-TW` and `en-US` seeding outputs, and verify that switching locale afterwards does not rename existing categories

## 5. Onboarding route and shell

- [x] 5.1 Decision: Onboarding is a dedicated `/onboarding` route with route-level gating — create `apps/web/src/pages/onboarding/index.tsx` and `apps/web/src/components/onboarding/StepShell.tsx` (step container, progress indicator, skip-button scaffold)
- [x] 5.2 Satisfy "Onboarding flow consists of five sequential steps": add step state (Zustand or `useReducer`) tracking `currentStep` 1..5, enforcing in-order progression, and supporting `?step=N` querystring
- [x] 5.3 Add the onboarding gate in `apps/web/src/pages/index.tsx`: when `Settings.onboardingCompleted === false` and no account book exists, `router.replace('/onboarding')`, satisfying the "First-time users are routed into the onboarding flow" requirement

## 6. Onboarding steps 1–2

- [x] 6.1 Build `LanguageStep.tsx` (step 1): render language options; on selection, persist to settings and advance; verify i18n takes effect immediately
- [x] 6.2 Build `LedgerStep.tsx` (step 2): embed or route to `AccountBookCreatePage`; on success, seed locale-matched default categories and advance; verify step 2 is not skippable
- [x] 6.3 Add a Playwright e2e test covering: first launch → step 1 picks zh-TW → step 2 creates an account book → default categories appear in Chinese

## 7. Onboarding steps 3–5: coachmark tutorials

- [x] 7.0 Decision: Evaluate a third-party tour library before hand-rolling coachmarks — compare `react-joyride`, `@reactour/tour`, `driver.js`, and `shepherd.js` against the criteria in design.md (bundle size, anchor + own-step-state compatibility, a11y, style customizability, maintenance); record the chosen library (or the explicit decision to hand-roll, with reasoning) in design.md before starting 7.1
- [x] 7.1 Satisfy "Tutorial steps overlay coachmarks on real pages": implement the coachmark using the library chosen in 7.0 (or `apps/web/src/components/onboarding/Coachmark.tsx` if hand-rolling), anchored to real-page elements via `data-onboarding-anchor`, with focus trap and Esc-to-skip — reusing HeroUI Modal a11y only if the chosen library doesn't already provide it
- [x] 7.2 Build `TransactionTutorial.tsx` (step 3): navigate to the user's first account book home/transactions page; coachmark highlights the "create transaction" CTA
- [x] 7.3 Build `SplitTutorial.tsx` (step 4): navigate to the settlement page; coachmark explains balance computation and split records
- [x] 7.4 Build `ReportTutorial.tsx` (step 5): navigate to the reports page; coachmark walks through filters and time ranges
- [x] 7.5 Add `data-onboarding-anchor` attributes to the relevant elements on the transactions, settlement, and reports pages
- [x] 7.6 Add e2e tests verifying every tutorial step highlights the right element, that "Next" advances, and that "Skip" advances — satisfying "Each onboarding step can be skipped" (with step 2 as the documented exception)

## 8. Completion and settings page

- [x] 8.1 On step 5 complete or skip, call `markOnboardingComplete()` and `router.replace('/account-books/[id]')`, satisfying the "Onboarding completion is recorded" requirement
- [x] 8.2 Update `apps/web/src/pages/settings.tsx` to add a language dropdown (with helper text: switching language won't rename existing categories) wired to the settings store, satisfying the "Settings page exposes language selection" requirement
- [x] 8.3 Add a Jest test covering the settings store's language-switch behavior

## 9. String-localization coverage and final verification

- [x] 9.1 Replace literal strings in onboarding, settings, navbar, and empty-state pages with `t('...')`, and fill in the corresponding `en-US`/`zh-TW` catalog entries
- [x] 9.2 Replace user-visible literal strings in the transactions, settlement, and reports pages and their components with `t('...')`
- [x] 9.3 Run `pnpm -C apps/web test` and `pnpm -C apps/web e2e` and ensure both new and existing tests pass
- [x] 9.4 Manual verification: clear IndexedDB → re-enter the app → walk through all five steps → switch language on the settings page and confirm it takes effect immediately, and that existing categories are not back-translated
