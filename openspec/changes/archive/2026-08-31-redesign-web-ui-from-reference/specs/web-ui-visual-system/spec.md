## ADDED Requirements

### Requirement: The web interface uses a shared warm visual system

The web application SHALL apply one semantic visual system across transaction, report, settlement, settings, account-book, login, onboarding, form, modal, and state interfaces. Light mode SHALL use a warm porcelain page background, deep-teal foreground, sage primary surfaces, orange emphasis, peach support accents, warm neutral borders, rounded elevated surfaces, and Open Huninn typography. Dark mode SHALL preserve the same hierarchy through corresponding semantic dark tokens rather than reverting to unrelated neutral defaults.

#### Scenario: Open any user-facing route in light mode

- **WHEN** a user opens a user-facing web route with the light theme active
- **THEN** the route SHALL use the shared warm page background, foreground, surface, border, primary, emphasis, focus, and shadow tokens
- **THEN** page-specific content SHALL remain visually subordinate to the shared header and primary heading hierarchy

#### Scenario: Switch to dark mode

- **WHEN** a user changes the application theme from light to dark
- **THEN** the route SHALL retain the same spacing, dimensions, component hierarchy, and selected-state meaning
- **THEN** semantic dark surfaces and foreground colors SHALL replace the light values without exposing an unthemed light surface

#### Scenario: Render a modal over a redesigned page

- **WHEN** a form, transaction, category, member, or settlement modal opens
- **THEN** its surface, controls, focus treatment, status colors, and spacing SHALL use the shared visual system
- **THEN** the underlying workflow and submitted data SHALL remain unchanged

### Requirement: Pages use a mobile-first centered content frame

Every user-facing page SHALL render through a centered content frame with 16px horizontal gutters below 640px, 24px gutters at and above 640px, and a maximum content width of 768px. The content frame SHALL preserve existing vertical scrolling and SHALL reserve enough bottom space for the floating navigation and device safe-area inset.

#### Scenario: Render a 390px mobile viewport

- **WHEN** a primary page is rendered at a viewport width of 390px
- **THEN** its content SHALL use 16px horizontal gutters
- **THEN** cards, headings, and controls SHALL fit without horizontal page scrolling

#### Scenario: Render a 768px or wider viewport

- **WHEN** a primary page is rendered at a viewport width of at least 768px
- **THEN** its content SHALL remain centered within a frame no wider than 768px
- **THEN** the application SHALL retain the mobile-first top-header and bottom-navigation information architecture

#### Scenario: Scroll to the final page control

- **WHEN** a page contains enough content to extend below the viewport
- **THEN** the user SHALL be able to scroll the final interactive element completely above the floating bottom navigation and safe-area inset

### Requirement: The transaction page uses the approved layered banner

The transaction page SHALL render a 200px-tall decorative hero below the 640px viewport breakpoint and a 220px-tall decorative hero at 640px and above. The Hero SHALL combine `apps/web/public/images/ui/duoji-banner-background.webp`, derived from supplied image 2, with `apps/web/public/images/ui/duoji-banner-travel.webp`, derived from supplied image 3 after removal of its black background. On page scroll, the decorative background SHALL move by no more than 24px and the decorative illustration by no more than 10px; below the 640px breakpoint, both distances SHALL be reduced to 60%. The account-book name, transaction label, refresh action, and record count SHALL remain live stationary foreground HTML and SHALL NOT be embedded in either image. The calendar surface SHALL remain in normal document flow, SHALL overlap the Hero bottom edge by 44px at viewport widths of 360px and above or 28px below 360px, and SHALL align its left and right boundaries with transaction-history surfaces. The transaction-history loading, error, empty, and populated roots SHALL use the page scaffold's 16px vertical gap without an additional list-local top margin. Hero live actions SHALL remain fully above the calendar boundary, and expanding the calendar SHALL continue to push the transaction list downward. The calendar's upper-right display-mode button and either glyph state SHALL measure 24 by 24 CSS pixels, and the separate week/month expansion control SHALL measure 32 by 32 CSS pixels, while both controls retain their accessible names and behavior.

#### Scenario: Render the transaction page at 390px

- **WHEN** a user opens a transaction page at a 390px viewport width
- **THEN** the Hero SHALL measure 200 CSS pixels tall
- **THEN** the geometric background SHALL fill the hero from the bottom edge
- **THEN** the transparent travel illustration SHALL appear at the lower right without covering the account-book name, refresh action, or record count
- **THEN** the calendar surface SHALL cross the Hero bottom edge by 44px and SHALL align horizontally with the transaction-history surface
- **THEN** the transaction-history surface SHALL begin 16px after the calendar surface without an additional list-local top margin
- **THEN** the refresh action and record count SHALL remain fully above the calendar top edge
- **THEN** the hero SHALL visually match the approved light layered composition rather than a black rectangular banner

#### Scenario: Render the transaction page below 360px

- **WHEN** the transaction hero is rendered at a viewport width below 360px
- **THEN** the Hero SHALL measure 200 CSS pixels tall
- **THEN** the foreground illustration SHALL shift or reduce visual prominence to preserve the text-safe area
- **THEN** the calendar surface SHALL cross the Hero bottom edge by 28px and SHALL align horizontally with the transaction-history surface
- **THEN** every live control SHALL remain fully visible and operable

#### Scenario: Render the transaction page at 768px

- **WHEN** a user opens a transaction page at a 768px viewport width
- **THEN** the Hero SHALL measure 220 CSS pixels tall
- **THEN** the calendar surface SHALL cross the Hero bottom edge by 44px and SHALL align horizontally with the transaction-history surface
- **THEN** the transaction-history surface SHALL begin 16px after the calendar surface without an additional list-local top margin
- **THEN** the centered content-frame width SHALL remain unchanged

#### Scenario: Toggle the compact calendar display mode

- **WHEN** a user activates the calendar's upper-right display-mode button
- **THEN** the button and the rendered dot or amount glyph SHALL each measure 24 by 24 CSS pixels
- **THEN** the calendar SHALL preserve the existing accessible name, title, focus treatment, persisted display mode, and dot/amount switching behavior

#### Scenario: Toggle the calendar week or month view

- **WHEN** a user activates the calendar's week/month expansion control
- **THEN** the control SHALL measure 32 by 32 CSS pixels
- **THEN** the calendar SHALL preserve its accessible name, expanded state, focus treatment, and week/month switching behavior

#### Scenario: Expand the overlapping calendar

- **WHEN** a user expands the transaction calendar from week view to month view
- **THEN** the calendar surface SHALL remain in normal document flow while retaining its Hero overlap
- **THEN** the transaction list SHALL begin at or below the expanded calendar surface bottom edge

#### Scenario: A banner asset fails to load

- **WHEN** either decorative banner asset is unavailable or returns an error
- **THEN** the hero SHALL retain its semantic background, layout height, account-book name, transaction label, refresh action, and record count
- **THEN** the missing decorative image SHALL NOT create an additional accessibility announcement

#### Scenario: Scroll the layered banner

- **WHEN** a user scrolls while the transaction Hero is visible and reduced motion is not requested
- **THEN** the geometric background SHALL move farther than the travel illustration, within their responsive maximum distances
- **THEN** the Hero's live content, height, and calendar overlap SHALL remain stationary

#### Scenario: Request reduced motion for the layered banner

- **WHEN** the operating system reports `prefers-reduced-motion: reduce`
- **THEN** the Hero's decorative background and travel illustration SHALL remain static

### Requirement: Shared surfaces present content and application states consistently

Cards, calendars, lists, charts, forms, filters, modals, and loading, empty, error, and not-found states SHALL use the shared surface contract for radius, border, background, elevation, spacing, and focus treatment. State views SHALL preserve their existing localized message and available recovery action.

#### Scenario: Display transaction, report, and settlement content

- **WHEN** populated transaction, report, and settlement views are rendered
- **THEN** their primary content groups SHALL use the same surface hierarchy and spacing rhythm
- **THEN** amounts, status labels, categories, participants, and action controls SHALL retain their existing semantic meaning

#### Scenario: Display a non-happy-path state

- **WHEN** a page receives a loading, empty, error, or missing-resource state
- **THEN** the state SHALL appear in a shared state surface
- **THEN** the current localized message and any existing retry, navigation, or creation action SHALL remain visible

#### Scenario: Display long localized content

- **WHEN** Traditional Chinese or English content includes a long account-book name, category, tag, participant summary, or amount
- **THEN** the content SHALL wrap or truncate according to its existing information priority
- **THEN** the amount and interactive controls SHALL remain visible without overlap at a 320px viewport width

### Requirement: The redesigned interface remains accessible

Normal text SHALL meet a minimum 4.5:1 contrast ratio in both themes. Large text and non-text interactive boundaries SHALL meet a minimum 3:1 contrast ratio. Interactive controls SHALL provide a target of at least 24 by 24 CSS pixels, controls already larger than that minimum SHALL retain their dimensions unless another explicit requirement resizes them, keyboard focus SHALL remain visible, and non-essential movement SHALL be removed when the user requests reduced motion.

#### Scenario: Navigate with a keyboard

- **WHEN** a user navigates header, page, modal, and bottom-navigation controls using a keyboard
- **THEN** each focused control SHALL expose a visible focus indicator against its current surface
- **THEN** the focus order and activation behavior SHALL remain equivalent to the pre-redesign interface

#### Scenario: Use a touch viewport

- **WHEN** a user operates the header, calendar navigation, primary actions, or bottom navigation on a touch device
- **THEN** each interactive control SHALL expose a target of at least 24 by 24 CSS pixels
- **THEN** controls larger than 24 by 24 CSS pixels SHALL remain at their existing size unless an explicit component requirement resizes them

#### Scenario: Request reduced motion

- **WHEN** the operating system reports `prefers-reduced-motion: reduce`
- **THEN** non-essential scaling and translation animations SHALL be disabled
- **THEN** calendar and modal state changes SHALL remain understandable without motion

### Requirement: Existing application workflows remain behaviorally compatible

The redesign SHALL NOT change route targets, query parameters, store selections, repository calls, persisted data, calculation results, translation keys, test identifiers, ARIA labels, or enabled and disabled action rules except where a presentational wrapper forwards an existing DOM attribute unchanged.

#### Scenario: Complete an existing workflow after the redesign

- **WHEN** a user creates or edits a transaction, changes a calendar range, applies a report filter, records a settlement, changes a setting, edits an account book, or advances onboarding
- **THEN** the application SHALL produce the same route, persisted data, calculation result, and localized feedback as the corresponding pre-redesign workflow

#### Scenario: Open aggregate account-book mode

- **WHEN** a user views all account books
- **THEN** actions that are unavailable in aggregate mode SHALL remain disabled
- **THEN** the existing explanatory tooltip SHALL remain available

### Requirement: The interface uses a one-step compact typography and icon scale

The web application SHALL render typography and icon glyphs one semantic scale step smaller across every user-facing route, including the transaction hero, header identity, account-book selector, route headings, cards, forms, modals, controls, and bottom navigation. The compact scale SHALL preserve the existing visual hierarchy, SHALL keep body and primary-control text at least 14px, SHALL keep secondary labels and metadata at least 12px, and SHALL NOT reduce interactive targets below 24 by 24 CSS pixels. Existing controls larger than 24 by 24 CSS pixels SHALL retain their dimensions unless another explicit requirement resizes them, including the transaction calendar's explicit 32 by 32 CSS pixel week/month expansion control.

#### Scenario: View the compact transaction shell

- **WHEN** the transaction page is rendered at a 390px viewport width
- **THEN** the hero title SHALL render within a 28px-to-48px responsive range and the header and navigation glyphs SHALL use the compact icon scale
- **THEN** the banner SHALL use the 200px mobile height defined by the layered-banner requirement while page gutters, navigation geometry, and existing larger control dimensions SHALL remain unchanged

#### Scenario: View compact content across route families

- **WHEN** a user opens transaction, report, settlement, settings, account-book, login, or onboarding content
- **THEN** route headings SHALL target 24px, card and modal titles SHALL target 18px to 20px, body and primary-control text SHALL target 14px, and secondary metadata SHALL target 12px
- **THEN** icon glyphs SHALL reduce by one corresponding size step without changing their control container dimensions or accessible labels

#### Scenario: Render compact localized content at the minimum width

- **WHEN** long English or Traditional Chinese content is rendered at a 320px viewport width
- **THEN** text SHALL wrap or truncate according to its existing information priority without overlapping amounts, status indicators, or actions
- **THEN** body text SHALL remain at least 14px and secondary metadata SHALL remain at least 12px

#### Scenario: Compare deterministic compact layouts

- **WHEN** the responsive visual suite renders the application at 390x844 and 768x1024 in light and dark themes
- **THEN** transaction, report, settlement, settings, login, and onboarding snapshots SHALL show the approved compact hierarchy
- **THEN** selected navigation state, missing-banner fallback, reduced-motion behavior, and unobstructed final content SHALL remain unchanged

### Requirement: Report charts use compact full-height plotting areas

The report category donut and monthly trend SHALL use compact responsive plotting heights, and the shared ApexCharts wrapper SHALL fill the height assigned by its parent. The report SHALL preserve the existing category-chart/list structure, complete chart series, semantic theme colors, text priority, category interactions, and accessible text alternatives.

#### Scenario: View a populated report at supported widths

- **WHEN** a populated report is rendered at 320px, 390px, or 768px width
- **THEN** the category donut and monthly trend SHALL remove excessive unused vertical space without clipping the donut total, chart legend, axes, bars, category names, formatted amounts, or category action controls
- **THEN** the category donut SHALL remain left of the category list at the existing tablet breakpoint and SHALL remain stacked above the list at narrower widths

#### Scenario: View a one-month trend

- **WHEN** the monthly trend contains one month of fixed income and expense data
- **THEN** both series, the legend, axes, formatted labels, and visible bars SHALL fit within the compact plotting surface
- **THEN** the screen-reader data table SHALL expose the same month and formatted values as the visual chart

#### Scenario: View a category list taller than its donut

- **WHEN** the active report tab contains enough category rows to exceed the compact donut height
- **THEN** the category list SHALL increase the breakdown section height naturally without clipping rows or adding a fixed-height list scroller
- **THEN** long category names SHALL retain their existing truncation priority while formatted amounts and 44px category actions remain visible
