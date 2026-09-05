## Context

The web application already has a shared React/Next.js shell, HeroUI components, Tailwind theme variables, Open Huninn typography, light/dark themes, localized English and Traditional Chinese content, and route-specific page components. The current interface mixes a dark custom navigation bar, neutral HeroUI surfaces, page-local spacing, and separate empty/loading/error patterns. The redesign is presentation-only: repositories, Zustand stores, React Query hooks, entities, route shapes, report calculations, settlement rules, and form submissions remain authoritative and unchanged.

The approved direction is a high-fidelity mobile-first interpretation of the supplied reference. The content remains a centered narrow column on larger screens. The transaction page receives the only large illustrative hero. The supplied geometric image becomes the background layer, and the supplied travel illustration is exported without its black background as the foreground layer. Every other route adopts the same visual language through a compact heading and shared surfaces.

After reviewing the completed redesign, the user approved a second density pass that reduces all visible typography and icon glyphs by one semantic scale step, including the transaction hero and brand header. This pass changes visual density only: hit areas, layout widths, surface spacing, banner height, workflows, and accessibility behavior remain stable.

After reviewing the completed transaction composition against the supplied reference, the user approved a third focused layout pass: the calendar surface crosses the Hero bottom edge while remaining in normal document flow. The approved measurements and verification contract are also recorded in `docs/superpowers/specs/2026-08-29-transaction-hero-calendar-overlap-design.md`.

After reviewing the completed report page, the user approved a fourth focused layout pass that removes the large unused regions around the category donut and monthly trend plot. The approved direction retains the existing category-chart/list topology and text priority, uses compact responsive heights, and makes the intermediate ApexCharts wrapper fill its assigned height. The detailed approval is recorded in `docs/superpowers/specs/2026-08-29-report-chart-layout-fix-design.md`.

After reviewing the completed transaction page, the user approved a fifth focused layout pass: the calendar and transaction-history surfaces share identical horizontal boundaries, the calendar's upper-right display-mode button and glyph become 24px, and the site-wide minimum interactive target becomes 24 by 24 CSS pixels. Existing controls larger than that minimum remain unchanged unless explicitly resized. The detailed approval is recorded in `docs/superpowers/specs/2026-08-30-calendar-width-and-touch-target-design.md`.

After reviewing the aligned transaction surfaces, the user approved a sixth focused spacing pass: the page scaffold remains the single owner of the vertical gap between the calendar and transaction-history content. `TransactionList` no longer adds a second top margin to its loading, error, empty, or populated root, while consumers outside a scaffold provide any separation they require at the call site.

After reviewing the transaction page at desktop width, the user approved a seventh focused density pass: the transaction Hero uses the existing 220px mobile height at every supported width instead of growing to 300px. The 28px/44px calendar overlap, Hero live-action safe area, illustration layers, and mobile presentation remain unchanged so the shorter desktop Hero exposes more content below it.

After reviewing the 220px result on mobile, the user approved an eighth focused density pass: the transaction Hero becomes 200px below the existing 640px `sm` breakpoint while remaining 220px from 640px upward. The calendar overlap depths, live controls, semantic image fallback, and wider-layout composition remain unchanged.

## Goals / Non-Goals

**Goals:**

- Give every user-facing web route one recognizable warm visual system in light and dark themes.
- Make shared layout, surface, state, and navigation styling reusable instead of repeating page-local class strings.
- Reproduce the reference hierarchy on the transaction page without obscuring controls or changing transaction/calendar behavior.
- Keep 390px mobile and 768px centered desktop layouts readable in English and Traditional Chinese.
- Preserve keyboard, touch, safe-area, reduced-motion, loading, empty, error, and missing-asset behavior.
- Provide deterministic component and Playwright checks that detect interaction or layout regressions.
- Make the full application hierarchy visibly more compact by reducing type and icon glyphs one semantic step without reducing body text below 14px, secondary metadata below 12px, or interactive targets below 24px.
- Make the transaction calendar visually overlap the Hero without covering the title or actions and without allowing expanded month content to overlap the transaction list.
- Align the transaction calendar and transaction-history surfaces to the same full content width, render the calendar's upper-right display-mode button and glyph at 24px, and use the scaffold's 16px gap as their only vertical separation.
- Make the report donut and monthly trend plotting areas occupy an appropriate compact size without clipping labels, amounts, legends, axes, bars, or category actions.
- Reduce excess Hero whitespace with a 200px mobile and 220px wider-layout height while preserving live content, asset fallback, and the calendar overlap relationship.

**Non-Goals:**

- Changing persisted data, repositories, stores, hooks, entities, calculations, routes, translations, or business rules.
- Adding a desktop sidebar, a second desktop information architecture, a carousel, or new application workflows.
- Replacing Open Huninn, HeroUI, Tailwind, React Icons, Framer Motion, ApexCharts, or next-themes.
- Reworking the content model of reports, settlements, settings, onboarding, forms, or modals.
- Making the decorative banner images carry information that is absent from accessible text.
- Scaling entire components, shrinking unrelated existing controls merely because the minimum target is now 24px, changing unrelated card/page spacing, or making route-specific exceptions that break the shared hierarchy.
- Changing global `PageScaffold` or `SurfaceCard` behavior to create the transaction-only overlap.
- Reordering report sections, changing chart types, changing category row geometry, or making report height depend on the current number of categories or months.

## Decisions

### Shared visual tokens and surface primitives

Define the visual system through semantic CSS variables in the global stylesheet and map the existing Tailwind/HeroUI semantic tokens to them. Light mode uses a porcelain background, deep-teal foreground, translucent warm-white surface, sage primary, orange emphasis, peach support, and warm neutral borders. Dark mode uses corresponding charcoal-green backgrounds, warm-white foregrounds, lighter sage, accessible orange, and opaque elevated surfaces. A separate accessible accent-foreground token is used for normal-size orange text; the brighter reference orange is limited to large text, icons, selection fills, and decoration when its contrast is below 4.5:1.

Add `SurfaceCard` for shared border, radius, background, shadow, and focus behavior. Add `PageScaffold` for centered width, horizontal gutters, vertical rhythm, and bottom-navigation clearance. Page-specific components retain their semantic markup and data handling while composing these primitives.

Alternative rejected: restyling every page with independent Tailwind strings. That would recreate the inconsistency this change is intended to remove and make dark-theme fixes difficult to apply uniformly.

### One-step compact typography and icon scale

Apply a semantic type-size reduction rather than scaling the rendered application. The transaction hero display range changes from 32–56px to 28–48px. Route headings target 24px, card and modal titles target 18–20px, body and primary-control text target 14px, and secondary labels or metadata target 12px. Existing 12px metadata remains at the minimum instead of dropping to 10px. Line heights tighten with their text role but continue to allow English and Traditional Chinese wrapping.

Reduce icon glyphs by the corresponding visual step: 28px glyphs become 24px, 25px become 20px, 22px become 18px, 18px become 16px, and 16px become 14px. Glyphs already at or below 14px remain at least 12px when they communicate state. Interactive containers use a site-wide minimum of 24 by 24 CSS pixels. Existing navigation, header, form, modal, and primary-action containers that are larger than this minimum retain their current dimensions unless another explicit requirement resizes them.

Implement the scale first in the project design foundation and shared shell/form styles, then apply the same semantic mapping across transaction, analysis, settlement, configuration, authentication, and onboarding page families. This keeps type roles consistent while avoiding a brittle global `transform: scale(...)` or root `font-size` override.

Alternative rejected: applying a global visual transform or lowering the root font size. Either approach would also shrink hit areas and rem-based layout, creating accessibility and alignment regressions. Alternative rejected: reducing every Tailwind class mechanically, because existing `text-sm` usage mixes body copy with metadata and must be resolved by semantic role.

### Mobile-first centered app shell

Keep the existing top-header and bottom-navigation information architecture. The shell uses a maximum 768px content frame on larger viewports, 16px mobile gutters, 24px gutters from 640px upward, and full-height scrolling inside the current fixed application root. The header remains above page content. The bottom navigation becomes a warm translucent floating pill with five stable destinations, a visually raised create action, route-selected emphasis, safe-area padding, and touch targets of at least 44 by 44 CSS pixels.

Every scrollable primary page receives bottom padding equal to the navigation height, safe-area inset, and 24px breathing room. This makes the final interactive element fully reachable without changing route behavior or event handlers.

Alternative rejected: a desktop sidebar and two-column home layout. The user selected the high-fidelity centered option, and a separate desktop navigation model would expand the information architecture beyond this visual redesign.

### Layered transaction banner assets

Create `duoji-banner-background.webp` from supplied image 2 and `duoji-banner-travel.webp` from supplied image 3 after removing its black background. `TransactionHero` renders the background as a decorative bottom-anchored cover layer and the travel illustration as a decorative right-bottom contain layer. The transaction label, account-book name, refresh action, and record-count chip remain live HTML in the foreground; they are never baked into either image.

The hero uses a fixed 200px height from the 320px minimum viewport through 639px and a fixed 220px height from the 640px `sm` breakpoint through the 768px centered content width. At widths below 360px, the illustration shifts farther right and receives reduced opacity behind the text-safe area. In dark mode, a semantic surface scrim and adjusted image opacity maintain readable foreground contrast without switching to the rejected black-background composition.

If either image is unavailable or fails to load, the hero retains its semantic background color, geometric CSS accents, text, refresh action, record count, and layout height. The images are decorative and therefore have empty alternative text or are applied through CSS with no duplicate accessible announcement.

Alternative rejected: preserving image 3 as a black rectangular banner. It conflicts with the approved layered light composition and creates a visually disconnected surface in the selected design.

### Layered transaction-banner parallax

Use the existing `react-use` `useScroll()` hook within `TransactionHero`, supplied with the transaction page's existing scroll-container ref, to derive a clamped local scroll progress for the two decorative image layers. The geometric background moves by at most 24px and the travel illustration by at most 10px through GPU-friendly `translate3d` transforms, giving the background a greater apparent depth. Below the 640px `sm` breakpoint, use 60% of these distances. The label, account-book name, refresh action, record-count chip, gradient scrim, Hero height, and calendar overlap remain fixed.

When the operating system expresses `prefers-reduced-motion: reduce`, both decorative layers remain at their resting transforms. Existing failed-image fallback remains unchanged: only the failed decorative layer disappears, while the semantic Hero structure remains available. The user explicitly declined new unit tests for this visual adjustment; implementation verification is limited to TypeScript/lint and manual browser checks at mobile and wider viewports.

Alternative rejected: `background-attachment: fixed`, because its mobile-browser behavior and performance are unreliable. Alternative rejected: `useWindowScroll()`, because transaction routes scroll a page-local `overflow-y-auto` container rather than the browser window.

### Responsive 200px and 220px transaction hero height

Set `TransactionHero` to `200px` below the existing 640px `sm` breakpoint and `220px` at `sm` and above. This removes another 20px on mobile while retaining the user-approved 220px wider-layout composition. Keep the existing 48px, 64px, and 68px responsive bottom-safe padding because it protects the live action row from the unchanged 28px/44px calendar overlap. Compact the title's bottom spacing below `sm` and restore the wider spacing at `sm` so representative mobile names and the 44px action row fit above the calendar boundary without changing typography or control dimensions. Keep the full-width live-content area so representative account-book names have the maximum available wrapping space; the existing semantic scrim preserves readability over the decorative illustration.

The background remains bottom-cover and the travel illustration remains bottom-right so shortening the mobile container crops decorative space rather than moving or scaling live content. Asset fallback, dark-theme scrim, title typography, action dimensions, and the calendar's normal-flow behavior remain unchanged. Responsive verification SHALL prove that the live action row remains fully above the calendar boundary at 390px and 768px.

Alternative rejected: applying 200px only below 360px, because the user's goal is to reclaim space across the mobile layout rather than only on the narrowest devices. Alternative rejected: interpolating from 200px to 220px below 640px, because a fixed breakpoint contract is easier to reason about and verify while matching the application's existing responsive system.

### Normal-flow transaction hero/calendar overlap

Group `TransactionHero` and the transaction calendar surface in one page-local wrapper. Keep both elements in normal document flow and pull the calendar upward with a negative block margin: 44px at viewport widths of 360px and above, and 28px below 360px. Let the calendar use the wrapper's full width and assign it a foreground stacking role.

Reserve the overlap depth inside `TransactionHero` by adding it to the existing bottom content padding: 48px below 360px, 64px from 360px through 639px, and 68px at 640px and above. This preserves the existing clearance between the Hero action row and the calendar boundary within the responsive 200px/220px Hero heights.

The wrapper owns only the visual relationship between the two surfaces. `TransactionCalendar`, its week/month state, gestures, range callbacks, and animations remain unchanged. Because the calendar stays in flow, month expansion increases the wrapper height and continues to place the transaction list after the calendar.

Alternative rejected: a 64px overlap paired with a taller Hero, because it changes the approved banner geometry and increases pressure on long names. Alternative rejected: absolute calendar positioning, because month expansion would require synchronized spacer height and could reintroduce overlap with the transaction list.

### Aligned transaction calendar and history surfaces

Remove the calendar surface's page-local 8px mobile and 16px tablet horizontal margins so both the calendar and every transaction-history state inherit the same width from `PageScaffold`. Keep the Hero/calendar negative overlap, calendar padding, stacking, expanded-month flow, and all calendar data behavior unchanged.

Keep `PageScaffold`'s 16px `gap-4` as the single vertical spacing owner between the Hero/calendar group and transaction-history content. Remove the list-local 24px `mt-6` from every top-level `TransactionList` state so the two values do not accumulate into a 40px blank region. `SurfaceCard` remains spacing-neutral. Consumers that do not already provide sibling spacing add it to their local wrapper rather than restoring a global margin inside `TransactionList`.

Set the calendar's upper-right display-mode button and both of its glyph states to 24 by 24 CSS pixels. Keep the separate week/month expansion control at its approved compact 32 by 32 CSS pixel size. Preserve both controls' accessible names, focus rings, semantic colors, and behaviors, including local-storage persistence for dot/amount display and `aria-expanded` for week/month view. Unrelated controls retain their existing sizes.

Alternative rejected: keeping the calendar inset while widening the history surface, because the visible edges remain misaligned. Alternative rejected: changing the global scaffold gutters, because it would alter every route instead of correcting the page-local margin.

### Twenty-four-pixel minimum touch targets

Define 24 by 24 CSS pixels as the minimum target size for interactive controls across the web application. This is a lower bound rather than a universal size token: existing 44px navigation, primary actions, form controls, and other larger components remain unchanged unless a specific component requirement says otherwise.

Update project design documentation and automated minimum-size assertions to use 24px. Continue to require visible keyboard focus and existing semantic states. The calendar display-mode control uses the 24px minimum, and the separate week/month expansion control is explicitly 32px.

Alternative rejected: mechanically shrinking every interactive element to 24px, because it would reduce usability and change the established geometry without a product requirement. Alternative rejected: retaining a transparent 44px hit area around a 24px calendar control, because the approved control and target are both 24px.

### Compact full-height report chart plotting areas

Keep the existing report composition: the category donut remains left of the category list at the current tablet breakpoint and stacks above it on mobile, while the monthly trend remains a separate surface below the category breakdown. Assign each chart a compact responsive height and make `ReportApexChart` fill the height provided by its parent so ApexCharts resolves `height="100%"` against an explicit block size instead of an auto-height intermediary.

The category list continues to determine the overall breakdown height when it is taller than the donut. The monthly trend preserves its heading, screen-reader table, legend, axes, tooltips, and complete series. Long category names retain the existing truncation behavior, while amounts and 44px category actions remain visible.

Alternative rejected: unconstrained aspect-ratio chart containers, because they produce unstable vertical density across the supported 320px-to-768px width range. Alternative rejected: deriving height from category or month count, because filters would cause avoidable layout shifts. Alternative rejected: changing chart types or category-list topology, because the approved fix is presentation-only.

### Page-family migration without business-logic changes

Migrate the interface by page family so review and rollback remain bounded:

1. Foundation and shared shell: theme variables, `PageScaffold`, `SurfaceCard`, header, account-book selector, and bottom navigation.
2. Transaction family: hero, calendar, transaction list, transaction modal, and all-books/not-found states.
3. Analysis family: report filters, summary cards, charts, category breakdowns, and empty states.
4. Settlement family: unsettled lists, record list/detail, transfer and confirmation modals.
5. Configuration family: settings, account-book create/edit, category/member management, login, onboarding, and shared form/modal surfaces.

Each migration changes component composition and presentation only. Existing callbacks, route pushes, query parameters, test identifiers, ARIA labels, store selectors, hook calls, and loading/error inputs remain intact unless a test proves that a presentational wrapper must forward an existing attribute.

Alternative rejected: a single large rewrite of page files. Page-family migration provides reviewable checkpoints and exposes styling gaps without mixing unrelated behavior changes.

### Theme, state, localization, and accessibility contracts

Light and dark themes use the same hierarchy and component dimensions. Loading, empty, error, and not-found views use shared surfaces but preserve current messages and available actions. English and Traditional Chinese are tested with representative long account-book, category, tag, and participant strings; rows wrap or truncate according to their existing information priority without overlapping amounts or controls.

Visible focus rings use the semantic focus color and remain visible against both themes. Interactive targets are at least 24 by 24 CSS pixels; controls already larger than that minimum remain unchanged unless explicitly resized. Motion remains limited to existing calendar and modal transitions, and `prefers-reduced-motion: reduce` removes non-essential translation and scaling. Normal text meets a 4.5:1 contrast ratio; large text and non-text interactive boundaries meet 3:1.

Alternative rejected: matching reference colors literally in every text role. The bright orange and pale sage in the reference do not provide sufficient contrast for all text sizes, so accessible semantic variants are required.

### Deterministic responsive and visual verification

Retain existing Jest/component assertions for behavior and extend them only where wrappers, roles, or states need regression coverage. Add Playwright coverage with explicit 390x844 and 768x1024 viewports for representative transaction, report, settlement, settings, login, and onboarding views. Stable screenshots cover light and dark themes after fonts and application data are ready. DOM assertions verify that the shell's final content remains reachable above the navigation, selected navigation state is preserved, the transaction hero's live controls remain interactive, and missing banner assets do not remove the title or actions.

Alternative rejected: manual visual review as the only acceptance gate. A cross-page redesign needs repeatable evidence in addition to human comparison with the supplied reference.

## Implementation Contract

**Observable behavior**

- Every user-facing route uses the warm visual tokens, centered page frame, consistent surfaces, and shared light/dark hierarchy.
- The transaction page alone displays the large layered hero using the two supplied images. Its title, refresh action, and record count remain live, readable, and interactive at widths from 320px through the 768px content maximum.
- The transaction Hero measures 200px below 640px and 220px at 640px and above; mobile layouts expose another 20px and wider layouts expose up to 80px more calendar and transaction-history content than the previous responsive maximum without changing the 28px/44px calendar overlap.
- Existing transaction, calendar, report, settlement, settings, account-book, login, onboarding, and modal workflows produce the same route, data, and mutation results as before the redesign.
- The fixed/floating shell never prevents the user from reaching or activating the final control in a scrolling page.
- The transaction hero, header identity, account-book selector, route headings, content text, control labels, and icon glyphs render one semantic scale step smaller than the completed redesign while preserving their relative hierarchy.
- Body and primary-control text remain at least 14px, secondary metadata remains at least 12px, and interactive targets remain at least 24 by 24 CSS pixels; existing larger controls retain their dimensions unless explicitly resized.
- The transaction calendar is visibly raised across the Hero bottom edge by 44px at 360px and wider or 28px below 360px; its left and right boundaries align with transaction-history surfaces, the refresh action and record count remain fully above the calendar boundary, month expansion keeps the transaction list below the calendar, and the page-scaffold 16px gap is the only vertical separation before every transaction-history state.
- The calendar's upper-right display-mode control and either rendered glyph state measure 24 by 24 CSS pixels, while the separate week/month expansion control measures 32 by 32 CSS pixels; both preserve their accessible names, visible focus, state, and behavior.
- The report category donut and monthly trend use compact responsive plotting areas that remove the previously excessive blank space while preserving readable totals, labels, legends, axes, bars, category text, amounts, and actions at 320px, 390px, and 768px widths.

**Interfaces and data shape**

- `PageScaffold` accepts React children plus optional class names and renders the standard centered scroll-content frame; it owns layout spacing only.
- `SurfaceCard` accepts standard div attributes plus React children and applies the shared surface contract without owning data or navigation.
- `TransactionHero` receives the current account-book label, translated section label, refresh label/state/callback, and record count. It does not query stores or repositories.
- The transaction page owns a local normal-flow wrapper around `TransactionHero` and the calendar surface; the wrapper adds no component prop, runtime state, or persisted data shape.
- `ReportApexChart` keeps its existing options, series, type, height, and width props; its presentation wrapper fills the parent-assigned chart height without changing option or series values.
- Typography and icon changes use existing component props, Tailwind classes, and design tokens; they introduce no new runtime interface, component prop, or persisted setting.
- No route, entity, persisted record, repository method, query result, translation key contract, or API shape changes.

**Failure modes**

- Missing or failed decorative image assets fall back to the semantic hero background and CSS accents while leaving all live content present.
- Loading, empty, error, and not-found inputs continue to surface the existing localized state and action instead of being hidden by decorative containers.
- Long localized content wraps within cards; amounts and icon actions remain visible and do not overlap at 320px width.
- In aggregate account-book mode, existing unavailable actions remain disabled and keep their explanatory tooltip.
- Long English or Traditional Chinese strings continue to wrap or truncate without overlapping amounts or actions after line-height and glyph reductions.
- At 320px, the overlap reduces to 28px and the Hero bottom content padding reduces to 48px so the live actions remain above the calendar; expanding the calendar never removes it from normal flow.
- A one-month trend retains visible bars, legend, axes, and formatted labels within the compact surface; a long category list increases the breakdown section naturally instead of being clipped or placed in a fixed-height scroller.

**Acceptance criteria**

- `pnpm test:web` passes with existing behavior assertions and added presentational regression assertions.
- `pnpm build:web` completes with both WebP assets emitted by the static export.
- `pnpm nx e2e web-e2e -- --project=chromium` passes the representative responsive and visual checks after the web build. The explicit Nx passthrough separator is required so Playwright, rather than Nx, receives the browser-project filter.
- Playwright assertions confirm 390x844 and 768x1024 layouts in light and dark themes, a visible selected navigation item, at least 24px interactive targets, unobstructed final content, and intact hero controls when asset requests fail.
- Manual comparison confirms the approved high-fidelity direction: warm layered page background, sage/orange emphasis, rounded translucent surfaces, centered narrow desktop layout, and supplied images 2 and 3 combined in the transaction hero.
- Component assertions and refreshed Playwright baselines confirm the smaller type/icon hierarchy at 320px, 390x844, and 768x1024 in light and dark themes, including the 24px minimum target and unobstructed final content.
- Focused DOM and Playwright bounding-box assertions confirm the 28px/44px overlap, equal calendar and transaction-history horizontal boundaries, a 16px calendar-to-history gap without a list-local top margin, unobscured Hero actions, a 24px display-mode control and glyph, a 32px week/month expansion control, and a non-overlapping transaction list after month expansion.
- Focused component and Playwright assertions confirm a 200px Hero bounding box at the 390px viewport and a 220px bounding box at the 768px viewport while preserving unobscured live actions and the established calendar overlap.
- Focused report presentation assertions confirm that the ApexCharts wrapper fills the parent height and that the category and monthly chart containers use the approved compact responsive height classes; report snapshots at 390x844 and 768x1024 in both themes confirm removed blank space and readable chart and category text.

**Scope boundaries**

- In scope: all visible web page shells, route-level presentation, shared cards, states, charts' theme colors, forms, modals, navigation, banner assets, responsive layout, and regression tests.
- In scope for the compact pass: the project design foundation, semantic typography roles, icon glyph dimensions, representative component assertions, and deterministic visual baselines.
- In scope for the overlap pass: the transaction-page Hero/calendar wrapper, Hero content-safe bottom padding, focused layout assertions, and affected transaction visual baselines.
- In scope for the report chart layout pass: the ApexCharts presentation wrapper, category donut and monthly trend container heights, focused report presentation assertions, and affected report visual baselines.
- In scope for the calendar alignment and minimum-target pass: the transaction-page calendar margin, calendar display-mode control and glyph, site-wide minimum target documentation and assertions, and affected transaction visual baselines.
- In scope for the Hero height pass: `TransactionHero` block height, the corresponding design-system contract, focused component assertions, and affected transaction visual baselines.
- Out of scope: backend code, data migrations, storage schema, calculations, route changes, new features, new dependencies, copy rewrites, and a separate desktop navigation architecture.
- Out of scope for the compact pass: component geometry, touch-target dimensions, card/page spacing, banner height, data visualization dimensions, image assets, route behavior, and business logic.
- The report chart layout pass is the sole exception to the compact pass restriction on data-visualization dimensions; no other component geometry or chart type changes.
- Out of scope for the overlap pass: global scaffold/card primitives, calendar state or gestures, Hero assets or height, navigation, other routes, and all data behavior.
- Out of scope for the report chart layout pass: report aggregation, filters, series, labels, semantic colors, category order, row interactions, modal navigation, section order, application shell, and all persisted or business data.
- Out of scope for the calendar alignment and minimum-target pass: Hero/calendar overlap depth, calendar padding, unrelated larger control dimensions, global scaffold gutters, calendar state, queries, persistence shape, and all business logic.
- Out of scope for the Hero height pass: Hero content padding, title or action dimensions, illustration assets, calendar geometry or behavior, global scaffold spacing, navigation, other routes, and all business logic.

## Risks / Trade-offs

- [Risk] A broad visual migration leaves isolated legacy styles on less-traveled routes. → Mitigation: complete the five page-family checklists and capture one representative assertion for every route family.
- [Risk] Removing the illustration's black background introduces halos or excessive WebP size. → Mitigation: inspect the transparent edge at 1x and 2x density, export within the hero's rendered resolution, and keep each asset below 350 KB.
- [Risk] Translucent surfaces or bright accents fail dark-theme contrast. → Mitigation: use semantic opaque dark surfaces and verify WCAG contrast before approving screenshots.
- [Risk] Snapshot tests become brittle because of fonts, dates, or animations. → Mitigation: load the bundled font, freeze representative fixture data/date, disable non-essential motion, and scope screenshots to stable route containers.
- [Risk] Shared wrappers accidentally absorb event handlers or test attributes. → Mitigation: keep primitives presentation-only, forward standard DOM attributes, and run existing component and end-to-end tests after each page family.
- [Risk] A mechanical class replacement makes body text too small or shrinks controls that were not approved for resizing. → Mitigation: audit sizes by semantic role, enforce 14px body and 12px metadata floors, assert the 24px site-wide minimum, and resize only the calendar display-mode control.
- [Risk] Smaller headings and icons weaken hierarchy or create stale snapshots. → Mitigation: preserve weight/color/spacing relationships, review 390px and 768px screenshots in both themes, and refresh baselines only after manual comparison.
- [Risk] Pulling the calendar out of normal flow causes month content to collide with the transaction list. → Mitigation: use a normal-flow negative margin and assert the expanded calendar bottom remains above the transaction list top.
- [Risk] The raised calendar covers the Hero action row at narrow widths. → Mitigation: pair each overlap depth with an explicit Hero bottom-safe padding and verify control/calendar bounding boxes at 320px and 390px.
- [Risk] Compact chart heights clip ApexCharts legends, axes, tooltips, or the donut total at a supported width. → Mitigation: make the wrapper fill an explicit responsive parent height and verify fixed one-month and multi-category fixtures plus 390px/768px light/dark screenshots.
- [Risk] A 24px calendar display-mode glyph has no internal padding inside its 24px control. → Mitigation: preserve a simple circular silhouette, verify both glyph states visually, and retain a visible focus ring and accessible name.

## Migration Plan

1. Add semantic tokens and presentation primitives while keeping current pages visually intact.
2. Add optimized banner assets and the transaction hero with fallback behavior.
3. Migrate the shared shell and then each page family in the stated order, running focused tests after each family.
4. Add deterministic responsive/visual checks and complete light/dark plus localization review.
5. Ship as one frontend release. No data migration or feature flag is required because the change does not alter persisted state or contracts.
6. Roll back by reverting the UI change set; stored user data and routes remain compatible.
7. Apply the report chart layout pass as presentation-only component changes, then refresh only affected report baselines after focused tests and manual text-readability review.
8. Apply the calendar alignment and minimum-target pass as presentation-only changes, then refresh affected transaction baselines after bounding-box and interaction verification.
9. Apply the fixed 220px Hero height as a presentation-only change, then refresh affected transaction baselines after component and Playwright bounding-box verification.
10. Apply the 200px mobile Hero height below 640px as a presentation-only change, preserve the 220px wider-layout height, then refresh affected mobile transaction baselines after component and Playwright bounding-box verification.

## Open Questions

None. The user approved the high-fidelity mobile-first centered layout, full-web scope, layered light banner composition, preservation of existing behavior, the full one-step reduction including the banner and brand header, the normal-flow calendar overlap with 28px/44px responsive depths, compact full-height report chart plotting areas that preserve the existing report structure and text priority, equal calendar/history widths, a 24px calendar display-mode control and glyph, a 24px site-wide minimum interactive target that leaves larger controls unchanged, and a 200px mobile transaction Hero below 640px with a 220px wider-layout Hero from 640px upward.
