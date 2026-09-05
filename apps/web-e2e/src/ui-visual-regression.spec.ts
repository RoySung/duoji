import { expect, test, type Locator, type Page } from '@playwright/test'

import {
  clearLocalData,
  createAccountBookAndSkipOnboarding,
} from './helpers/onboarding'

const FIXED_NOW = new Date('2026-08-28T08:00:00.000Z')

const variants = [
  { height: 844, name: 'mobile', theme: 'light', width: 390 },
  { height: 844, name: 'mobile', theme: 'dark', width: 390 },
  { height: 1024, name: 'tablet', theme: 'light', width: 768 },
  { height: 1024, name: 'tablet', theme: 'dark', width: 768 },
] as const

async function stabilize(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(async () => {
    const browserGlobal = globalThis as unknown as {
      document: { fonts: { ready: Promise<unknown> } }
    }
    await browserGlobal.document.fonts.ready
  })
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-delay: 0ms !important;
        transition-duration: 0.01ms !important;
        caret-color: transparent !important;
      }
    `,
  })
}

async function expectStableScreenshot(
  page: Page,
  locator: Locator,
  name: string
) {
  await stabilize(page)
  await expect(locator).toBeVisible()
  await expect(locator).toHaveScreenshot(name, {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.01,
  })
}

async function expectSelectedDestination(page: Page, label: string) {
  await expect(
    page.getByRole('button', { name: label, exact: true })
  ).toHaveAttribute('aria-current', 'page')
}

async function expectTouchTarget(locator: Locator, minimumPixels = 24) {
  const box = await locator.boundingBox()
  expect(box, 'Expected a visible touch target').not.toBeNull()
  if (!box) throw new Error('Expected a visible touch target')
  expect(box.width).toBeGreaterThanOrEqual(minimumPixels)
  expect(box.height).toBeGreaterThanOrEqual(minimumPixels)
}

async function expectFontSize(locator: Locator, expectedPixels: number) {
  await expect(locator).toBeVisible()
  await expect(locator).toHaveCSS('font-size', `${expectedPixels}px`)
}

async function expectFontSizeBetween(
  locator: Locator,
  minimumPixels: number,
  maximumPixels: number
) {
  await expect(locator).toBeVisible()
  await expect
    .poll(async () => {
      const fontSize = await locator.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).fontSize)
      )
      return (
        Number.isFinite(fontSize) &&
        fontSize >= minimumPixels &&
        fontSize <= maximumPixels
      )
    })
    .toBe(true)
}

async function createExpense(page: Page, amount: string) {
  await page.locator('[data-onboarding-anchor="create-transaction"]').click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog
    .locator('[data-onboarding-anchor="transaction-form-amount"] input')
    .fill(amount)
  const submit = dialog.locator(
    'span[data-onboarding-anchor="transaction-form-submit"] button'
  )
  await expect(submit).toBeEnabled()
  await submit.click()
  await expect(dialog).toBeHidden()
}

async function expectPopulatedReportChartLayout(
  page: Page,
  viewportWidth: number
) {
  const categorySurface = page.getByTestId('category-breakdown-surface')
  const trendSurface = page.getByTestId('monthly-trend-surface')
  const chartWrappers = page.locator('[data-report-chart]')
  const expectedHeight = viewportWidth >= 640 ? 240 : 220

  await expect(categorySurface).toBeVisible()
  await expect(trendSurface).toBeVisible()
  await expect(chartWrappers).toHaveCount(2)
  await page.waitForTimeout(800)
  await expect(categorySurface).toContainText('2,810 TWD')
  await expect(trendSurface.getByRole('table')).toContainText('2026/08')

  for (const wrapper of await chartWrappers.all()) {
    const parent = wrapper.locator('..')
    await expect
      .poll(async () => {
        const [wrapperBox, parentBox] = await Promise.all([
          wrapper.boundingBox(),
          parent.boundingBox(),
        ])
        if (!wrapperBox || !parentBox) return null
        return {
          parentHeight: Math.round(parentBox.height),
          wrapperHeight: Math.round(wrapperBox.height),
        }
      })
      .toEqual({
        parentHeight: expectedHeight,
        wrapperHeight: expectedHeight,
      })
  }

  await expectTouchTarget(
    categorySurface.getByTitle('Click to exclude').first()
  )
  await expectTouchTarget(
    categorySurface
      .getByRole('button', { name: /View transactions for/i })
      .first()
  )
}

async function positionSurfaceAboveNavigation(page: Page, locator: Locator) {
  await locator.evaluate((element) =>
    element.scrollIntoView({ block: 'start', inline: 'nearest' })
  )
  await expect
    .poll(async () => {
      const [surfaceBox, navigationBox] = await Promise.all([
        locator.boundingBox(),
        page.getByTestId('bottom-navigation-surface').boundingBox(),
      ])
      if (!surfaceBox || !navigationBox) return false
      return surfaceBox.y + surfaceBox.height <= navigationBox.y
    })
    .toBe(true)
}

async function expectFinalControlAboveNavigation(page: Page) {
  const scaffold = page.locator('[data-ui="page-scaffold"]').first()
  const finalControl = scaffold
    .locator('button:visible, a:visible, input:visible, [tabindex="0"]:visible')
    .last()

  await finalControl.scrollIntoViewIfNeeded()
  const [controlBox, navigationBox] = await Promise.all([
    finalControl.boundingBox(),
    page.getByTestId('bottom-navigation-surface').boundingBox(),
  ])

  expect(controlBox, 'Expected a final interactive page control').not.toBeNull()
  expect(navigationBox, 'Expected the floating navigation').not.toBeNull()
  if (!controlBox || !navigationBox) {
    throw new Error('Expected final control and navigation bounds')
  }
  expect(controlBox.y + controlBox.height).toBeLessThanOrEqual(navigationBox.y)
}

async function expectTransactionHeroCalendarLayout(
  page: Page,
  viewportWidth: number
) {
  await stabilize(page)

  const hero = page.getByTestId('transaction-hero')
  const calendar = page.getByTestId('transaction-calendar-surface')
  const transactionContent = page
    .locator(
      '[data-testid="transaction-list"], [data-testid="transaction-history-empty"]'
    )
    .first()
  const refresh = page.getByRole('button', { name: 'Refresh transactions' })
  const recordCount = page.getByTestId('transaction-hero-record-count')
  const displayToggle = page.getByRole('button', {
    name: /Show (daily total amount|transaction indicator)/i,
  })
  const displayGlyph = displayToggle.locator('svg')
  const [
    heroBox,
    calendarBox,
    transactionContentBox,
    refreshBox,
    recordCountBox,
    displayToggleBox,
  ] = await Promise.all([
    hero.boundingBox(),
    calendar.boundingBox(),
    transactionContent.boundingBox(),
    refresh.boundingBox(),
    recordCount.boundingBox(),
    displayToggle.boundingBox(),
  ])

  expect(heroBox, 'Expected a visible transaction hero').not.toBeNull()
  expect(calendarBox, 'Expected a visible transaction calendar').not.toBeNull()
  expect(
    transactionContentBox,
    'Expected visible transaction content'
  ).not.toBeNull()
  expect(refreshBox, 'Expected a visible refresh action').not.toBeNull()
  expect(recordCountBox, 'Expected a visible record count').not.toBeNull()
  expect(
    displayToggleBox,
    'Expected a visible display-mode control'
  ).not.toBeNull()
  if (
    !heroBox ||
    !calendarBox ||
    !transactionContentBox ||
    !refreshBox ||
    !recordCountBox ||
    !displayToggleBox
  ) {
    throw new Error('Expected transaction hero layout bounds')
  }

  const expectedOverlap = viewportWidth < 360 ? 28 : 44
  const expectedHeroHeight = viewportWidth < 640 ? 200 : 220
  const minimumActionClearance = 8
  const heroRight = heroBox.x + heroBox.width
  const calendarRight = calendarBox.x + calendarBox.width
  const transactionContentRight =
    transactionContentBox.x + transactionContentBox.width
  const calendarTop = calendarBox.y

  expect(heroBox.height).toBe(expectedHeroHeight)
  expect(
    Math.abs(heroBox.y + heroBox.height - calendarTop - expectedOverlap)
  ).toBeLessThanOrEqual(1)
  expect(Math.abs(calendarBox.x - heroBox.x)).toBeLessThanOrEqual(1)
  expect(Math.abs(heroRight - calendarRight)).toBeLessThanOrEqual(1)
  expect(Math.abs(calendarBox.x - transactionContentBox.x)).toBeLessThanOrEqual(
    1
  )
  expect(Math.abs(calendarRight - transactionContentRight)).toBeLessThanOrEqual(
    1
  )
  expect(
    Math.abs(
      transactionContentBox.y - (calendarBox.y + calendarBox.height) - 16
    )
  ).toBeLessThanOrEqual(1)
  expect(displayToggleBox.width).toBe(24)
  expect(displayToggleBox.height).toBe(24)
  await expect(displayGlyph).toHaveAttribute('width', '24')
  await expect(displayGlyph).toHaveAttribute('height', '24')
  await expectTouchTarget(displayToggle)

  const initialDisplayLabel = await displayToggle.getAttribute('aria-label')
  expect(initialDisplayLabel).toBeTruthy()
  await displayToggle.click()
  await expect(displayToggle).not.toHaveAttribute(
    'aria-label',
    initialDisplayLabel ?? ''
  )
  await displayToggle.click()
  await expect(displayToggle).toHaveAttribute(
    'aria-label',
    initialDisplayLabel ?? ''
  )
  expect(refreshBox.y + refreshBox.height).toBeLessThanOrEqual(
    calendarTop - minimumActionClearance
  )
  expect(recordCountBox.y + recordCountBox.height).toBeLessThanOrEqual(
    calendarTop - minimumActionClearance
  )
}

async function expectExpandedCalendarAboveTransactionContent(page: Page) {
  const group = page.getByTestId('transaction-hero-calendar-group')
  const calendar = page.getByTestId('transaction-calendar-surface')
  const transactionContent = group.locator('xpath=following-sibling::*[1]')

  await page.getByRole('button', { name: 'Expand to month view' }).click()
  await expect(
    page.getByRole('button', { name: 'Collapse to week view' })
  ).toBeVisible()
  await expect(transactionContent).toBeVisible()
  await expect
    .poll(async () => {
      const [calendarBox, contentBox] = await Promise.all([
        calendar.boundingBox(),
        transactionContent.boundingBox(),
      ])
      if (!calendarBox || !contentBox) return false
      return contentBox.y >= calendarBox.y + calendarBox.height - 1
    })
    .toBe(true)
}

test.describe('responsive warm UI visual regression', () => {
  test.describe.configure({ mode: 'serial', timeout: 120_000 })

  test('narrow transaction hero and calendar overlap', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 })
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
    await page.clock.setFixedTime(FIXED_NOW)
    await page.addInitScript(() => {
      const browserGlobal = globalThis as unknown as {
        localStorage: { setItem: (key: string, value: string) => void }
      }
      browserGlobal.localStorage.setItem('duoji-theme', 'light')
    })
    await clearLocalData(page)
    await createAccountBookAndSkipOnboarding(page, 'Narrow journey')

    await expectTransactionHeroCalendarLayout(page, 320)
    await expectStableScreenshot(
      page,
      page.locator('[data-ui="app-shell"]'),
      'transaction-narrow-light.png'
    )
    await expectExpandedCalendarAboveTransactionContent(page)
  })

  for (const variant of variants) {
    test(`${variant.name} ${variant.theme} route family`, async ({ page }) => {
      await page.setViewportSize({
        width: variant.width,
        height: variant.height,
      })
      await page.emulateMedia({
        colorScheme: variant.theme,
        reducedMotion: 'reduce',
      })
      await page.clock.setFixedTime(FIXED_NOW)
      await page.addInitScript((theme) => {
        const browserGlobal = globalThis as unknown as {
          localStorage: { setItem: (key: string, value: string) => void }
        }
        browserGlobal.localStorage.setItem('duoji-theme', theme)
      }, variant.theme)
      await clearLocalData(page)

      await page.goto('/login')
      await expect(page.locator('html')).toHaveClass(
        new RegExp(`(^|\\s)${variant.theme}(\\s|$)`)
      )
      await expectFontSize(
        page.locator('[data-ui="entry-shell"] h1').first(),
        24
      )
      await expectStableScreenshot(
        page,
        page.locator('[data-ui="entry-shell"]'),
        `login-${variant.name}-${variant.theme}.png`
      )

      await page.goto('/')
      await expect(page).toHaveURL(/\/onboarding/)
      await expectFontSize(
        page.locator('[data-ui="entry-shell"] h1').first(),
        24
      )
      await expectStableScreenshot(
        page,
        page.locator('[data-ui="entry-shell"]'),
        `onboarding-${variant.name}-${variant.theme}.png`
      )

      await createAccountBookAndSkipOnboarding(
        page,
        `Reference journey ${variant.name}`
      )
      await expect(page.locator('[data-ui="app-shell"]')).toBeVisible()

      const scaffold = page.locator('[data-ui="page-scaffold"]').first()
      const scaffoldBox = await scaffold.boundingBox()
      expect(scaffoldBox).not.toBeNull()
      if (!scaffoldBox) throw new Error('Expected a visible page scaffold')
      expect(scaffoldBox.width).toBeLessThanOrEqual(768)

      const homeButton = page.getByRole('button', {
        name: 'Home',
        exact: true,
      })
      const createButton = page.getByRole('button', {
        name: 'New Transaction',
      })
      const transactionHero = page.getByTestId('transaction-hero')

      await expectSelectedDestination(page, 'Home')
      await expectFontSize(
        page.locator('[data-testid="app-header-frame"] > span').first(),
        18
      )
      await expectFontSize(
        homeButton.locator('span[aria-hidden="true"]').first(),
        20
      )
      await expect(createButton.locator('svg').first()).toHaveAttribute(
        'width',
        '24'
      )
      await expectFontSizeBetween(transactionHero.getByRole('heading'), 28, 48)
      await expectFontSize(
        transactionHero.getByText('Transactions', { exact: true }),
        12
      )
      await expectFontSize(
        page.getByRole('button', { name: 'Refresh transactions' }),
        14
      )
      await expectTouchTarget(
        page.getByRole('button', { name: 'Refresh transactions' }),
        44
      )
      await expectTouchTarget(
        page.getByRole('button', { name: 'Previous week' }),
        44
      )
      await expectTouchTarget(homeButton, 44)
      await expectTouchTarget(createButton, 44)
      await expectTransactionHeroCalendarLayout(page, variant.width)
      await expectStableScreenshot(
        page,
        page.locator('[data-ui="app-shell"]'),
        `transaction-${variant.name}-${variant.theme}.png`
      )
      await expectExpandedCalendarAboveTransactionContent(page)
      await page.getByRole('button', { name: 'Collapse to week view' }).click()
      await transactionHero.scrollIntoViewIfNeeded()

      if (variant.name === 'mobile' && variant.theme === 'light') {
        await page
          .locator('[data-testid^="transaction-hero-"]')
          .evaluateAll((images) => {
            const BrowserEvent = (
              globalThis as unknown as {
                Event: new (type: string) => unknown
              }
            ).Event
            for (const image of images as unknown as Array<{
              dispatchEvent: (event: unknown) => boolean
            }>) {
              image.dispatchEvent(new BrowserEvent('error'))
            }
          })
        await expect(
          page.getByRole('heading', {
            name: `Reference journey ${variant.name}`,
          })
        ).toBeVisible()
        await expect(
          page.getByRole('button', { name: 'Refresh transactions' })
        ).toBeEnabled()
      }

      await page.getByRole('button', { name: 'Reports', exact: true }).click()
      await expect(page).toHaveURL(/\/report/)
      await expectSelectedDestination(page, 'Reports')
      await expectFontSize(
        scaffold.getByRole('heading', { level: 1 }).first(),
        24
      )
      await expectStableScreenshot(
        page,
        page.locator('[data-ui="app-shell"]'),
        `report-${variant.name}-${variant.theme}.png`
      )

      await page
        .getByRole('button', { name: 'Settlement', exact: true })
        .click()
      await expect(page).toHaveURL(/\/settlement/)
      await expectSelectedDestination(page, 'Settlement')
      await expectFontSize(
        scaffold.getByRole('heading', { level: 1 }).first(),
        24
      )
      await expectStableScreenshot(
        page,
        page.locator('[data-ui="app-shell"]'),
        `settlement-${variant.name}-${variant.theme}.png`
      )

      await page.getByRole('button', { name: 'Settings', exact: true }).click()
      await expect(page).toHaveURL(/\/settings$/)
      await expectSelectedDestination(page, 'Settings')
      await expectFontSize(
        scaffold.getByRole('heading', { level: 1 }).first(),
        24
      )
      await expectFinalControlAboveNavigation(page)
      await expectStableScreenshot(
        page,
        page.locator('[data-ui="app-shell"]'),
        `settings-${variant.name}-${variant.theme}.png`
      )
    })
  }

  for (const variant of variants) {
    test(`populated report ${variant.name} ${variant.theme}`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: variant.width,
        height: variant.height,
      })
      await page.emulateMedia({
        colorScheme: variant.theme,
        reducedMotion: 'reduce',
      })
      await page.clock.setFixedTime(FIXED_NOW)
      await page.addInitScript((theme) => {
        const browserGlobal = globalThis as unknown as {
          localStorage: { setItem: (key: string, value: string) => void }
        }
        browserGlobal.localStorage.setItem('duoji-theme', theme)
      }, variant.theme)
      await clearLocalData(page)
      await createAccountBookAndSkipOnboarding(
        page,
        `Report journey ${variant.name}`
      )
      await createExpense(page, '2311')
      await createExpense(page, '499')
      const toastCloseButtons = page.getByRole('button', {
        name: 'closeButton',
      })
      await expect(toastCloseButtons).toHaveCount(2)
      await toastCloseButtons.last().click()
      await expect(toastCloseButtons).toHaveCount(1)
      await toastCloseButtons.first().click()
      await expect(toastCloseButtons).toHaveCount(0)

      await page.getByRole('button', { name: 'Reports', exact: true }).click()
      await expect(page).toHaveURL(/\/report/)
      await expectSelectedDestination(page, 'Reports')
      await expectPopulatedReportChartLayout(page, variant.width)
      await expectStableScreenshot(
        page,
        page.locator('[data-ui="app-shell"]'),
        `report-populated-${variant.name}-${variant.theme}.png`
      )
      const categorySurface = page.getByTestId('category-breakdown-surface')
      await positionSurfaceAboveNavigation(page, categorySurface)
      await expectStableScreenshot(
        page,
        categorySurface,
        `report-populated-category-${variant.name}-${variant.theme}.png`
      )
      const trendSurface = page.getByTestId('monthly-trend-surface')
      await positionSurfaceAboveNavigation(page, trendSurface)
      await expectStableScreenshot(
        page,
        trendSurface,
        `report-populated-trend-${variant.name}-${variant.theme}.png`
      )
    })
  }
})
