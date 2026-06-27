import { test, expect, devices, type Page } from '@playwright/test'

const { viewport, userAgent, deviceScaleFactor, hasTouch } =
  devices['iPhone 12']

test.use({
  viewport,
  userAgent,
  deviceScaleFactor,
  hasTouch,
})

import { clearLocalData, createAccountBookAndSkipOnboarding } from './helpers/onboarding'

test.describe('transaction modal mobile layout', () => {
  test.beforeEach(async ({ page }) => {
    await clearLocalData(page)
  })

  test('keeps the create sheet tall and preserves decimal keypad hints', async ({
    page,
  }) => {
    await createAccountBookAndSkipOnboarding(page, 'Mobile Modal Book', {
      name: 'Mobile Modal User',
      email: 'mobile-modal@example.com',
    })

    const createButton = page.getByRole('button', { name: 'New Transaction' })
    await expect(createButton).toBeVisible()
    await createButton.click()

    const dialog = page.getByRole('dialog').first()
    const heading = page.getByRole('heading', { name: 'New Transaction' })
    const amountInput = dialog.locator(
      '[data-onboarding-anchor="transaction-form-amount"] input'
    )
    const viewport = page.viewportSize()

    await expect(dialog).toBeVisible()
    await expect(heading).toBeVisible()
    await expect(amountInput).toHaveAttribute('inputmode', 'decimal')

    const boxBeforeFocus = await dialog.boundingBox()

    expect(viewport).not.toBeNull()
    expect(boxBeforeFocus).not.toBeNull()
    expect(boxBeforeFocus?.height ?? 0).toBeGreaterThan((viewport?.height ?? 0) * 0.6)
    expect(boxBeforeFocus?.y ?? Number.POSITIVE_INFINITY).toBeLessThan(
      (viewport?.height ?? 0) * 0.3
    )

    await amountInput.click()
    await expect(amountInput).toBeFocused()

    const boxAfterFocus = await dialog.boundingBox()

    expect(boxAfterFocus).not.toBeNull()
    expect(
      Math.abs((boxAfterFocus?.height ?? 0) - (boxBeforeFocus?.height ?? 0))
    ).toBeLessThanOrEqual(2)
  })
})