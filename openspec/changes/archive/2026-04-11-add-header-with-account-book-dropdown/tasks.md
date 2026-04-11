## 1. Create AccountBookMenu component

- [x] 1.1 Apply component split: pure UI `AccountBookMenu` + smart `Header` — create `apps/web/src/components/accountBook/AccountBookMenu.tsx` with props `accountBooks`, `currentAccountBook`, `onSelect`, `onNew`
- [x] 1.2 Implement dropdown via HeroUI `Dropdown` with `selectionMode="single"` and `selectedKeys` for active highlight
- [x] 1.3 Add two DropdownSections: account book list (with `PiBooksBold` icons) and "New account book" sentinel key `__new__`
- [x] 1.4 Trigger button shows current account book name (fallback "Account Books") with `PiBooksBold` + `PiCaretDownBold` icons

## 2. Create Header component

- [x] 2.1 Create `apps/web/src/components/layout/header.tsx` — smart Header owns useRouter + useAccountBookStore coupling (component split: pure UI `AccountBookMenu` + smart `Header`)
- [x] 2.2 Implement conditional menu display: regex on `router.pathname` (`/^\/account-books\/[^/]+(\/.*)?$/`) — header shows app title only on non-account-book pages
- [x] 2.3 Derive `currentAccountBook` from `router.query.id` and `accountBooks` store
- [x] 2.4 Pass derived values to `AccountBookMenu`; wire `onSelect` → `router.push(/account-books/${id})` and `onNew` → `router.push(/settings/account-books/new)`
- [x] 2.5 Header layout: `h-[56px]` flex row, app title "Duoji" on left, AccountBookMenu on right (only on account book routes)

## 3. Update layout and shell

- [x] 3.1 Import and render `<Header />` in `apps/web/src/components/layout/layout.tsx` above `<main>` — the application provides a shared app shell with top header bar and bottom navigation bar
- [x] 3.2 Adjust `<main>` height to height: `calc(100dvh - 128px)` (subtract 56px header + 72px NavBar)

## 4. Remove AccountBookSwitch

- [x] 4.1 Remove `AccountBookSwitch` import and usage from `apps/web/src/pages/account-books/[id]/index.tsx`
- [x] 4.2 Verify no other files import `AccountBookSwitch`, then delete `apps/web/src/components/accountBook/AccountBookSwitch.tsx`

## 5. Verification

- [x] 5.1 Run `pnpm dev` in `apps/web` and confirm header renders on all pages
- [x] 5.2 Verify the header displays the current account book and allows switching — dropdown opens, selecting a book navigates and updates header label
- [x] 5.3 Verify "New account book" option navigates to `/settings/account-books/new`
- [x] 5.4 Navigate to `/settings` — confirm the header shows the app title on non-account-book pages (no dropdown visible)
- [x] 5.5 Confirm transaction list scroll still works with updated `<main>` height
