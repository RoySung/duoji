## 1. Add CategoryStoreWatcher

- [x] 1.1 Add `CategoryStoreWatcher` component to `_app.tsx` that implements the requirement "A reactive category store loads categories for the active account book" via centralized watcher — mirrors `UserStoreWatcher` pattern, calls `categoryStore.initialize(currentAccountBookId)` when `currentAccountBookId` changes (design: CategoryStoreWatcher mirrors UserStoreWatcher)
- [x] 1.2 Mount `CategoryStoreWatcher` inside the provider tree in `_app.tsx`, alongside existing `UserStoreWatcher`

## 2. Remove Manual Initialization from Pages

- [x] 2.1 Remove `initializeCategories` `useEffect` from `apps/web/src/pages/account-books/[id]/index.tsx` — category store is now initialized automatically when active account book changes
- [x] 2.2 Apply design decision "CategorySettingsPage removes its own `initialize` calls" — remove manual `initialize(accountBookId)` `useEffect` from `CategorySettingsPage`; initialization is handled by watcher and post-save re-init is no longer needed since CRUD actions refresh store state

## 3. Verify

- [x] 3.1 Confirm category store is initialized automatically when the active account book changes — open an account book page and verify categories load without manual init calls
- [x] 3.2 Confirm `CategorySettingsPage` still loads and saves categories correctly after removing manual init
