## Context

`categoryStore.initialize(accountBookId)` is currently called manually via `useEffect` in each page/component that needs categories (`account-books/[id]/index.tsx`, `CategorySettingsPage`). This is inconsistent with `userStore`, which is driven by a centralized `UserStoreWatcher` in `_app.tsx`.

The pattern divergence means:
- New pages that need categories must remember to add the `useEffect`
- There is no single source of truth for "when categories are loaded"
- `CategorySettingsPage.tsx` also calls `initialize` on mount and after save, creating two separate initialization flows

## Goals / Non-Goals

**Goals:**
- Add a `CategoryStoreWatcher` in `_app.tsx` that calls `categoryStore.initialize(currentAccountBookId)` when the account book changes
- Remove manual `initialize` `useEffect` calls from pages and components

**Non-Goals:**
- Changing the shape or behavior of `categoryStore` itself
- Merging categories into `accountBookStore`
- Changing how `userStore` or any other store is initialized

## Decisions

### CategoryStoreWatcher mirrors UserStoreWatcher

Place a `CategoryStoreWatcher` component inside `_app.tsx`, alongside the existing `UserStoreWatcher`. It subscribes to `currentAccountBookId` from `accountBookStore` and calls `categoryStore.initialize()` reactively.

```
function CategoryStoreWatcher() {
  const currentAccountBookId = useAccountBookStore(s => s.currentAccountBookId)
  const initializeCategories = useCategoryStore(s => s.initialize)

  useEffect(() => {
    void initializeCategories(currentAccountBookId)
  }, [currentAccountBookId, initializeCategories])

  return null
}
```

This is the same pattern as `UserStoreWatcher` — proven, consistent, easy to follow.

**Alternative considered**: Add a subscriber inside `accountBookStore` that calls `categoryStore.initialize()` directly. Rejected because it creates a cross-store dependency at the store level, which is harder to test and violates separation of concerns.

### CategorySettingsPage removes its own `initialize` calls

`CategorySettingsPage` currently calls `initialize(accountBookId)` on mount and again after saving. After this change:
- Mount initialization is handled by the watcher
- The post-save `initialize` call can be replaced by directly re-reading store state (the CRUD actions already refresh the store after mutations)

## Risks / Trade-offs

- **Timing**: `CategoryStoreWatcher` fires when `currentAccountBookId` changes. If a page renders before the watcher fires, it may briefly see stale/empty category state. This is the same behavior as before (the `useEffect` approach has the same timing), so no regression.
- **Over-initialization**: If multiple watchers call `initialize` concurrently, `categoryStore` handles it gracefully (overwrites with latest). No race condition risk beyond what already exists.
