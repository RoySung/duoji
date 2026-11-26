## Why

Built-in category icons depend on Iconify responding at runtime, so a failed image request can hide icons even in a newly created account book. Users also need a way to use their own hosted image when the built-in choices do not fit a category.

## What Changes

- Bundle the built-in Lucide icons so default categories and the icon picker work without Iconify.
- Add a custom image URL option with a preview to the category form. Accept absolute HTTPS image URLs and display a built-in fallback if the image fails to load.
- Support choosing and changing either icon source for root and child categories in new account books, including when adding a child from the transaction form.
- Show the saved icon in category settings, transaction views, and reports.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `category-settings-ui` adds custom image URL selection, preview, and validation to the shared category modal.
- `categories` extends quick creation in the transaction form to accept a custom image URL.
- `category-icon-presentation` defines bundled icons, custom image fallback, and presentation across category surfaces.

## Impact

- Category data and defaults under apps/web/src/entities and apps/web/src/constants, including the payloads passed through the category store.
- Category settings, transaction forms and list, and report breakdown and details under apps/web/src/components.
- English and Traditional Chinese messages under apps/web/src/i18n/messages and regression coverage in apps/web/specs and apps/web-e2e/src.
- Reuses the existing lucide-react web dependency.
