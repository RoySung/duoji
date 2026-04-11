## 1. Rewrite AccountBookMenu component

- [x] 1.1 AccountBookMenu component is fully rewritten — use HeroUI Drawer component to replace the Dropdown; the account book menu opens as a drawer from the right side
- [x] 1.2 Add drawer open/close state management inside `AccountBookMenu`
- [x] 1.3 Implement the drawer trigger button (same appearance as current button)
- [x] 1.4 Drawer contains account book list + settings actions inline — the drawer lists all account books for switching with active one highlighted, and surfaces inline management actions
- [x] 1.5 Implement switch account book from drawer (select row → navigate + close drawer)

## 2. Inline account book management actions in drawer

- [x] 2.1 The drawer provides inline account book management actions — add "New account book" action at the bottom of the drawer
- [x] 2.2 Add per-row rename action with inline edit input for each account book row
- [x] 2.3 Add per-row delete action with inline confirmation before deleting the account book
- [x] 2.4 Wire rename and delete actions to the account book store

## 3. Update header and navigation

- [x] 3.1 Verify `header.tsx` passes correct props to the updated `AccountBookMenu` — the application provides primary navigation for Phase 1 via drawer on account book routes
- [x] 3.2 AccountBookSettingsPage inner content remains as-is — confirm the page and `/settings/account-books` routes are unaffected by this change

## 4. Verification

- [x] 4.1 Manual test: open drawer, switch account books, create/rename/delete on mobile viewport
- [x] 4.2 Manual test: verify drawer closes after account book switch and on backdrop tap

