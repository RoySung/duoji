## Context

The app currently uses a single-zone layout: a bottom `NavBar` (72 px) for primary navigation and a `<main>` content area filling the rest of the viewport. Account book switching is done via `AccountBookSwitch`, a horizontal pill-button row hard-coded at the top of `pages/account-books/[id]/index.tsx`. This means switching is only available on that one page.

The layout file is `apps/web/src/components/layout/layout.tsx`. The account book store (`useAccountBookStore`) is initialized in `_app.tsx` and available throughout the tree. The current account book ID is derived from `router.query.id` on dynamic routes.

## Goals / Non-Goals

**Goals:**

- Add a persistent `Header` (56 px) to the global layout, visible on all pages
- Replace the inline `AccountBookSwitch` with an `AccountBookMenu` dropdown in the header
- Keep the existing account book name display in `[id]/index.tsx` section intact
- Delete the now-obsolete `AccountBookSwitch` component

**Non-Goals:**

- Changing the bottom `NavBar` or its behavior
- Adding other header controls (search, notifications, user avatar)
- Responsive hide/show logic for the header on desktop

## Decisions

### Component split: pure UI `AccountBookMenu` + smart `Header`

`AccountBookMenu` receives `accountBooks`, `currentAccountBook`, `onSelect`, and `onNew` as props — no router or store access. `Header` owns the coupling to `useRouter` and `useAccountBookStore` and passes derived values down.

**Why**: Keeps `AccountBookMenu` easily testable and reusable without mocking router/store. `Header` is the single place where route-derived state is resolved.

**Alternative considered**: Inline everything in `Header`. Rejected because it tangles UI rendering with store/router side-effects, making snapshot testing harder.

### Dropdown via HeroUI `Dropdown`

Use `@heroui/react` `Dropdown` + `DropdownTrigger` + `DropdownMenu` with `selectionMode="single"` and `selectedKeys` for active highlighting. A sentinel key `__new__` in a second `DropdownSection` triggers the "New account book" navigation.

**Why**: Already a project dependency; consistent interaction model with the rest of the UI; built-in keyboard navigation and accessibility.

**Alternative considered**: Custom Tailwind popover. Rejected — unnecessary re-implementation of focus management and keyboard handling.

### Conditional menu display: regex on `router.pathname`

The account book dropdown is only shown when `router.pathname` matches `/account-books/[id]` and sub-routes (regex: `/^\/account-books\/[^/]+(\/.*)?$/`). On all other pages only the app title "Duoji" is shown.

**Why**: The dropdown is only meaningful when a current account book can be inferred from the URL. Settings pages and the index page have no account book context.

**Alternative considered**: Always show the dropdown, defaulting to the first account book when no `id` is in the URL. Rejected — introduces ambiguity about which book is "current" outside account-book routes.

### Height: `calc(100dvh - 128px)`

Header is 56 px, NavBar is 72 px. `<main>` height becomes `h-[calc(100dvh-72px-56px)]`.

**Why**: Existing inner pages use `h-full overflow-y-auto` — they inherit `<main>`'s height directly, so adjusting `<main>` is the single change needed.

## Risks / Trade-offs

- **Next.js hydration gap** → `router.query.id` is `undefined` on first render. The dropdown button shows "Account Books" as fallback label, then updates after hydration. This is a minor cosmetic flicker, acceptable for now.
- **Deleted component** → `AccountBookSwitch.tsx` is removed. Any future branch that still imports it will get a compile error. Low risk given it's only used in one place.
