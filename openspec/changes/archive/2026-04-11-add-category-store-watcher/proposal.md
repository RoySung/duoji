## Why

Category store initialization is manually triggered in each page via `useEffect`, duplicating the same pattern across routes. This is inconsistent with how `userStore` is handled (via a centralized `UserStoreWatcher` in `_app.tsx`) and introduces risk of missing initialization on new pages.

## What Changes

- Add a `CategoryStoreWatcher` component in `_app.tsx` that automatically re-initializes the category store whenever `currentAccountBookId` changes
- Remove manual `initializeCategories` `useEffect` calls from individual pages (`account-books/[id]/index.tsx`, `categorySettings`)
- Category store becomes self-managing in response to account book selection — no page needs to call `initialize()` manually

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `category-store`: Initialization is now driven by a centralized watcher, not individual pages

## Impact

- Affected specs: `category-store`
- Affected code:
  - `apps/web/src/pages/_app.tsx` — add `CategoryStoreWatcher`
  - `apps/web/src/pages/account-books/[id]/index.tsx` — remove manual `initialize` effect
  - `apps/web/src/components/categorySettings/CategorySettingsPage.tsx` — remove manual `initialize` effect
