## 1. Remove inline CRUD, delegate to settings

- [x] 1.1 Remove inline rename state and handlers (`renamingId`, `renameValue`, `startRename`, `commitRename`, `cancelRename`) from `AccountBookMenu`
- [x] 1.2 Remove inline delete state and handlers (`confirmDeleteId`, `startDelete`, `commitDelete`, `cancelDelete`) from `AccountBookMenu`
- [x] 1.3 Remove inline create state and handlers (`isCreating`, `newName`, `startCreate`, `commitCreate`, `cancelCreate`) from `AccountBookMenu`
- [x] 1.4 Remove unused store action imports (`createAccountBook`, `updateAccountBook`, `deleteAccountBook`) and icon imports (`PiCheckBold`, `PiXBold`, `PiPencilSimpleBold`, `PiTrashBold`, `PiPlusBold`, `Input`)

## 2. Card-style layout per account book

- [x] 2.1 Add `Chip` import from `@heroui/react`
- [x] 2.2 Replace existing list item rendering with card-style `<article>` layout: name, currency `Chip`, and optional description — satisfies requirement "The account book menu drawer displays account books as navigable cards"
- [x] 2.3 Apply active-state styling (`border-primary/30 bg-primary/5`) to the currently active account book card; inactive cards use `border-border bg-card/80 hover:bg-muted/35`
- [x] 2.4 Show "Switch" button only on non-active cards (`onPress` calls `handleSelect`) — satisfies active/inactive card scenarios
- [x] 2.5 Add "View settings" button to each card navigating to `/settings/account-books/[id]` and closing the drawer — satisfies requirement "The account book menu drawer delegates CRUD to settings pages"

## 3. Footer: navigation-only

- [x] 3.1 Replace the conditional inline-create form in `DrawerFooter` with a single full-width "New account book" button that navigates to `/settings/account-books/new` and closes the drawer
