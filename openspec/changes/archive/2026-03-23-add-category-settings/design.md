## Context

Category management currently lacks any UI. Categories are seeded from mock templates when an account book is created, but users cannot view or modify them. The category entity uses a flat model with `parentId: string | null` to represent a two-level hierarchy (root → sub-category), and the `CategoryLocalRepo` already supports full CRUD with cascading deletes.

Icons are currently embedded as raw Iconify API URLs directly in the mock data (e.g., `https://api.iconify.design/lucide:utensils.svg?color=%23666666&width=100&height=100`). This means the icon set is invisible at a glance and duplicated across every category entry.

## Goals / Non-Goals

**Goals:**

- Provide a per-account-book category settings page showing the two-level hierarchy
- Allow users to add new root category groups and sub-categories via a modal
- Centralize all available category icons in a typed constants map
- Refactor mock data to reference icon keys instead of raw URLs
- Add store CRUD mutations to support UI interactions

**Non-Goals:**

- Editing or deleting existing categories (deferred to a follow-up iteration)
- Icon picker UI with visual grid (text/key input is sufficient for MVP)
- Drag-and-drop reordering of categories
- Moving sub-categories between root groups

## Decisions

### Centralize icons in a typed constants map

Define `apps/web/src/constants/categoryIcons.ts` that exports:
- A `CategoryIconKey` union type of all available icon identifiers (e.g., `'utensils' | 'coffee' | ...`)
- A `CATEGORY_ICONS` record mapping each key to its full Iconify URL string
- A `DEFAULT_CATEGORY_ICON_KEY` fallback constant

Rationale: Raw Iconify URLs scattered across mocks are fragile (URL params can drift) and invisible. A typed map makes the available icon set explicit, allows icon references by semantic key, and enables a future icon picker that iterates `Object.keys(CATEGORY_ICONS)`.

The mock data (`src/mocks/category.ts`) is updated to use `CATEGORY_ICONS[key]` lookups, eliminating the raw URL strings.

### Route structure: sub-page under account books

Use Next.js Pages Router dynamic route: `/settings/account-books/[id]/categories`.

Rationale: Keeps category settings scoped to the account book context. The `[id]` segment provides the `accountBookId` needed to initialize the category store for that book without extra prop drilling.

Alternative considered: A separate `/settings/categories` page with a book selector — rejected because the UX in the reference design shows the account book name prominently, meaning the page is always entered from a specific book.

### Category store CRUD mutations

Add `addCategory`, `updateCategory`, and `deleteCategory` to `CategoryStoreActions`. Each action:
1. Calls the corresponding `categoryRepo` method
2. Reloads the full category list from the repo and updates `categories`, `expenseCategories`, and `incomeCategories` in state
3. Returns the operation result to the caller

Rationale: Re-fetching after mutations keeps the store as a projection of the repo state, consistent with the existing `initialize` pattern.

### Component structure: feature folder

Create `apps/web/src/components/categorySettings/` with four components:
- `CategorySettingsPage` — page-level layout, header, scrollable list
- `CategoryGroupItem` — accordion row for a root category (icon, name, sub-count, chevron, expanded sub-list + add sub button)
- `SubCategoryItem` — single row for a sub-category (smaller icon, name)
- `AddCategoryModal` — HeroUI Modal with name input and icon key selector; when adding a sub-category, type is inherited from parent

### Account book card navigation

Add a "Category Settings" button to each account book card in `AccountBookSettingsPage`. Use `next/link` with href `/settings/account-books/{id}/categories`. This is the primary entry point to the new page.

## Risks / Trade-offs

- [Risk] Icon key typos in mock data if not validated at compile time → Mitigation: `CategoryIconKey` is a string union type; TypeScript will flag invalid keys at compile time when using `CATEGORY_ICONS[key]`
- [Risk] Category store initialized for one account book, but user navigates directly to another book's category settings → Mitigation: `CategorySettingsPage` calls `initialize(accountBookId)` on mount using the route `id`; the store already handles re-initialization when `accountBookId` changes
- [Risk] Add flow without delete makes categories grow unbounded → Trade-off accepted for MVP; delete is the next logical follow-up and the repo already supports cascading deletes
