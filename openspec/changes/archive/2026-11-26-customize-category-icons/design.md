## Context

The category catalog currently maps semantic keys to Iconify URLs. Default category seeding and both category form callers store those URLs as `Category.imageUrl`. Category settings, transactions, and report summaries then pass the stored value to image elements. The web app already depends on lucide-react.

## Goals / Non-Goals

**Goals**

- Make the built-in catalog render independently of Iconify in new account books.
- Let users choose an HTTPS image URL anywhere the shared category form is used, preview the image, and reopen and change their choice after saving.
- Show either icon source consistently in category settings, transactions, and reports.

**Non-Goals**

- Migration, backfill, or preservation of the original icon selection for categories in existing account books.
- Image uploads, file storage, image proxying, or server-side URL checks.

## Decisions

### Bundled icon catalog and category storage

Map the existing semantic keys to explicitly imported lucide-react components and render their SVG inline. A hosted mirror would retain a runtime dependency. Static SVG files would also remove the third-party dependency but require asset path handling for deployments under a URL subpath. Inline SVGs reuse the installed dependency and travel with the application bundle.

Store a single discriminated `icon` value on newly created categories. A built-in icon uses `{ kind: 'builtin', key: CategoryIconKey }`. A custom icon uses `{ kind: 'custom', url: string }`. A discriminated value lets switching sources replace the prior choice in one category update. Default income and expense seeding and both form callers write this shape.

### Custom image form and URL validation

Add a choice between the built-in grid and a custom image URL to the shared AddCategoryModal. The form trims input and checks for an absolute HTTPS URL with a host and without embedded credentials. It presents a localized field error for invalid input. The browser previews a valid URL through a regular image element, so URLs with query strings or without a file extension work. HTTP URLs can fail on the HTTPS deployment. Client-side format validation with a load fallback allows a user to save a valid URL while its host is temporarily unavailable.

### Shared rendering and fallback

Use one category icon renderer in the picker, preview, settings lists, transaction selector and list, and report breakdown and category transaction details. Report aggregation carries the icon value through to category summaries. Keep the existing chart icon for report rows with no category image, such as uncategorized rows. The custom image renderer uses a local fallback when the image fails to load and attempts to load again when the URL changes or the image is remounted. It loads directly in the browser with a no-referrer policy. A runtime guard for a missing icon can show the generic built-in fallback, with no legacy URL mapping.

Use the bundled Lucide Shapes icon as the initial selection for new categories and as the generic fallback for a failed custom image.

Use the category icon dimensions in apps/web/DESIGN.md for each surface. Keep custom images proportional within the same bounds as bundled icons and fallbacks. The selector and report breakdown retain their specified insets.

## Implementation Contract

- **In scope.** Newly created account books, their default income and expense roots and children, settings-based creation and editing of roots and children, and immediate child creation in the transaction form.
- **Out of scope.** Compatibility verification and migration of legacy icon records, uploads, proxying, and image availability guarantees.
- **Storage and editing.** The category schema, default seed, settings save flow, and quick-add payload agree on the icon value. Opening an edit form preselects the saved source and value. Renaming alone preserves the choice. Saving after a source switch replaces it, and the saved selection survives a reload.
- **Failures.** Empty or invalid custom URLs block submission only when the custom source is selected. A valid URL that fails to load displays a local fallback in the preview and category surfaces. The preview explains the failed load, permits changing the URL, and preserves the valid URL on save. Error state from one URL does not carry over to another.
- **Presentation.** Preserve existing selector and report icon containers and insets, and keep accessible names on picker buttons. Localize the source controls, URL label, and errors in English and Traditional Chinese.
- **Acceptance.** From a fresh account book, block Iconify and verify that default categories, picker choices, transaction icons, and report icons still render. Intercept the custom URL in the browser to verify a decoded image and a network-failure fallback. Cover invalid input, switching sources, and reloading after save.

## Risks / Trade-offs

- External hosts can block embedding or remove content. The built-in fallback keeps the category identifiable and the form keeps the saved URL available for editing.
- The category icon value changes shape. Update report summary producers and consumers together, and use the existing category repository and store entry points for seeding, creation, editing, and reload coverage.

## Migration Plan

Ship the new icon value in the same release as all its readers and writers. The icon is not an IndexedDB index, so the release needs no IndexedDB version upgrade. Existing records need no migration for the new-book acceptance scope.

## Open Questions

None.
