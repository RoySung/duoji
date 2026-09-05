## Why

Duoji's current web interface uses inconsistent page-level spacing, surfaces, navigation styling, and state presentation, which makes the product feel fragmented even though its workflows are already coherent. The supplied reference establishes a distinctive warm travel-led visual direction that will be applied across the full application without changing its data or business behavior.

## What Changes

- Introduce a shared warm visual system for every user-facing web route, using a porcelain background, deep-teal text, sage primary surfaces, orange emphasis, peach support tones, translucent cards, soft shadows, and the existing Open Huninn typeface.
- Reduce the complete interface typography and icon glyphs by one semantic scale step, including the transaction banner, header identity, route headings, content, controls, and navigation, while retaining readable 14px body text, 12px minimum metadata, and a site-wide 24px minimum interactive target without shrinking existing larger controls unless explicitly required; the calendar week/month expansion control is explicitly 32 by 32 CSS pixels.
- Refactor the shared application shell into a mobile-first centered layout with a lightweight header, account-book selector, floating pill-shaped bottom navigation, safe-area spacing, and a maximum content width on larger screens.
- Add a transaction-page hero that layers the user-supplied geometric background image with a transparent-background version of the supplied travel illustration, while keeping the page title, refresh action, and record count readable when assets are loading or unavailable.
- Add a subtle scroll-driven parallax to the transaction Hero's decorative background and travel illustration, while keeping all live content, Hero geometry, and the calendar overlap fixed and disabling the movement for reduced-motion users.
- Render the transaction Hero at 200px below the 640px breakpoint and 220px from 640px upward so mobile and wider centered layouts expose more calendar and transaction-history content without changing live controls, illustration layers, or calendar overlap depth.
- Compose the transaction calendar as a normal-flow raised surface that overlaps the Hero bottom edge by a responsive fixed depth, aligns its left and right edges with transaction-history surfaces, uses a 24px upper-right display-mode control and glyph, keeps Hero actions unobscured, continues to push the transaction list downward when expanded to month view, and leaves exactly the shared page-scaffold gap before transaction-history content instead of stacking a list-local top margin on that gap.
- Remove excessive blank space from the report category donut and monthly trend surfaces by giving their ApexCharts wrappers compact responsive plotting heights, while preserving the existing category-list structure, text priority, chart data, and interactions.
- Restyle transaction/calendar views, reports, settlement views, settings, account-book forms, onboarding, authentication, modals, empty/loading/error states, and long localized content with the same component language.
- Preserve all existing routes, stores, repositories, queries, calculations, form behavior, calendar gestures, navigation semantics, light/dark theme switching, and English/Traditional Chinese translations.
- Add representative responsive and visual-regression coverage for 390px mobile and 768px centered desktop layouts, including light/dark themes and key non-happy-path states.

## Capabilities

### New Capabilities

- `web-ui-visual-system`: Defines the shared color, surface, responsive layout, banner composition, state presentation, accessibility, and theme requirements for the complete web interface.

### Modified Capabilities

- `app-shell-navigation`: Extends the shared shell contract with the centered mobile-first content frame, safe-area-aware floating bottom navigation, and unobstructed page content requirements.

## Impact

- Affected specs: `web-ui-visual-system`, `app-shell-navigation`
- Affected code:
  - New:
    - `apps/web/public/images/ui/duoji-banner-background.webp`
    - `apps/web/public/images/ui/duoji-banner-travel.webp`
    - `apps/web/src/components/ui/PageScaffold.tsx`
    - `apps/web/src/components/transaction/TransactionHero.tsx`
    - `apps/web/src/components/ui/SurfaceCard.tsx`
    - `apps/web-e2e/src/ui-visual-regression.spec.ts`
  - Modified:
    - `apps/web/tailwind.config.js`
    - `apps/web/src/pages/styles.css`
    - `apps/web/src/components/layout/layout.tsx`
    - `apps/web/src/components/layout/header.tsx`
    - `apps/web/src/components/layout/navbar.tsx`
    - `apps/web/src/pages/account-books/[id]/index.tsx`
    - `apps/web/src/pages/account-books/[id]/report.tsx`
    - `apps/web/src/pages/account-books/[id]/settlement/index.tsx`
    - `apps/web/src/pages/account-books/[id]/settlement/[recordId].tsx`
    - `apps/web/src/pages/account-books/[id]/settings.tsx`
    - `apps/web/src/pages/account-books/new.tsx`
    - `apps/web/src/pages/settings.tsx`
    - `apps/web/src/pages/login.tsx`
    - `apps/web/src/pages/onboarding/index.tsx`
    - `apps/web/src/components/calendar/TransactionCalendar.tsx`
    - `apps/web/src/components/calendar/WeekStrip.tsx`
    - `apps/web/src/components/calendar/MonthGrid.tsx`
    - `apps/web/src/components/transaction/TransactionList.tsx`
    - `apps/web/src/components/TransactionModal/TransactionModal.tsx`
    - `apps/web/src/components/report/ReportSection.tsx`
    - `apps/web/src/components/report/ReportApexChart.tsx`
    - `apps/web/src/components/report/ReportCategoryBreakdown.tsx`
    - `apps/web/src/components/report/ReportMonthlyTrend.tsx`
    - `apps/web/src/components/settlement/SettlementRecordList.tsx`
    - `apps/web/src/components/accountBookSettings/AccountBookForm.tsx`
    - `apps/web/src/components/onboarding/StepShell.tsx`
    - `apps/web/DESIGN.md`
    - `apps/web/specs/homeTransactions.spec.tsx`
    - `apps/web/specs/transactionHero.spec.tsx`
    - `apps/web/specs/reportCategoryBreakdown.spec.tsx`
    - `apps/web/specs/reportChartsPresentation.spec.tsx`
    - `docs/superpowers/specs/2026-08-30-calendar-width-and-touch-target-design.md`
    - `docs/superpowers/specs/2026-08-29-report-chart-layout-fix-design.md`
    - `docs/superpowers/specs/2026-08-29-transaction-hero-calendar-overlap-design.md`
    - `apps/web-e2e/src/ui-visual-regression.spec.ts-snapshots/*.png`
  - Removed: none
- APIs, persisted data, dependencies, and routing contracts remain unchanged.
