## Why

The app UI currently ships English-only and offers no first-run guidance, so new users have to figure out how to create an account book, record transactions, settle splits, and read reports on their own. To support Traditional Chinese users and lower the new-user barrier, we need to introduce i18n (`en-US`, `zh-TW`) together with a first-run onboarding tutorial, so the app can show its UI, seed categories, and walk through tutorials in the user's locale from the very first launch.

## What Changes

- Add `next-intl` as the i18n library, mount `NextIntlClientProvider` in `apps/web/src/pages/_app.tsx`, and ship two message catalogs (`en-US`, `zh-TW`).
- Add a `Settings` entity (single-row Dexie table `appSettings`, `id = 'app'`) with fields `language: 'en-US' | 'zh-TW'`, `onboardingCompleted: boolean`, `updatedAt`.
- Add `settingsLocalRepo` and `settingsStore`; hydrate during app bootstrap in `apps/web/src/pages/_app.tsx`. Switching the language never requires a page reload.
- On first run, auto-detect locale from `navigator.language` (`zh-*` → `zh-TW`, otherwise `en-US`); the user can override during onboarding step 1.
- Change `apps/web/src/constants/defaultCategories.ts` to accept a `locale` argument; on account book creation, seed category names and descriptions read from the i18n catalog. Existing records are not back-translated, preserving any user renames.
- Add an `onboarding` flow: when `onboardingCompleted === false` and no account book exists, `apps/web/src/pages/index.tsx` redirects to `/onboarding` and runs five sequential steps:
  1. Pick the language (write to settings)
  2. Create the first account book (reuse `AccountBookCreatePage`, seed categories in the active locale)
  3. Tutorial: create a transaction (coachmark on the real transactions page CTA)
  4. Tutorial: split a transaction (coachmark on the settlement page explaining balance computation)
  5. Tutorial: view reports (coachmark walking through filters on the reports page)
- On completion, set `onboardingCompleted` to `true`; every step is skippable (except step 2); the settings page gains a language switcher.
- The settings page (`apps/web/src/pages/settings.tsx`) gains a language dropdown; selection takes effect immediately.
- `apps/web/src/lib/dexie.ts` schema version is bumped to add the `appSettings` table.

## Non-Goals

- Existing categories in existing account books are not auto-translated to the new locale; users may rename them manually.
- No locales other than `en-US` and `zh-TW`, and no RTL support.
- No translation of CSV column headers in `transaction-csv-export`.
- No SSR-time localization (the app is purely client-rendered).
- No separate demo sandbox or seed data for the tutorial; coachmarks run on the user's real first account book.
- No behavioral changes to transactions, settlement, or reports — only an added coachmark overlay.

## Capabilities

### New Capabilities

- `i18n`: locale resolution, message catalog loading, the `useTranslations` API, and the language-switching flow.
- `app-settings`: global user preferences (currently `language`, `onboardingCompleted`), with entity / repo / store and Dexie persistence.
- `onboarding`: step state for the first-run flow, plus enter / skip / complete conditions and coachmark triggers.

### Modified Capabilities

- `categories`: default-category seeding must accept a locale, with names and descriptions sourced from the i18n catalog.

## Impact

- Affected specs: `i18n` (new), `app-settings` (new), `onboarding` (new), `categories` (modified).
- Affected code:
  - New: `apps/web/src/i18n/config.ts`, `apps/web/src/i18n/messages/en-US.json`, `apps/web/src/i18n/messages/zh-TW.json`
  - New: `apps/web/src/entities/settings.ts`
  - New: `apps/web/src/repositories/settingsRepo/settingsLocalRepo.ts`, `apps/web/src/repositories/settingsRepo/index.ts`
  - New: `apps/web/src/stores/settings/settingsStore.ts`, `settingsStoreProvider.tsx`, `index.ts`
  - New: `apps/web/src/pages/onboarding/index.tsx`
  - New: `apps/web/src/components/onboarding/` (StepShell, LanguageStep, LedgerStep, TransactionTutorial, SplitTutorial, ReportTutorial, Coachmark)
  - Modified: `apps/web/package.json` (add `next-intl`)
  - Modified: `apps/web/src/pages/_app.tsx` (mount provider, hydrate settings, onboarding route gate)
  - Modified: `apps/web/src/pages/index.tsx` (redirect to `/onboarding` when not completed and no account book exists)
  - Modified: `apps/web/src/pages/settings.tsx` (language dropdown)
  - Modified: `apps/web/src/constants/defaultCategories.ts` (accept `locale`, source names from the message catalog)
  - Modified: `apps/web/src/components/accountBookSettings/AccountBookCreatePage.tsx` (pass language to the seeder)
  - Modified: `apps/web/src/lib/dexie.ts` (add the `appSettings` table, bump schema version)
  - Modified: user-visible strings scattered across transactions, settlement, reports, and shell components — replaced with `t('...')` incrementally.
- Dependencies: add `next-intl`.
- User data: existing users will have an empty `appSettings` on first upgrade — populate it via `navigator.language` detection and mark `onboardingCompleted = true` so they aren't forced through the tutorial.
