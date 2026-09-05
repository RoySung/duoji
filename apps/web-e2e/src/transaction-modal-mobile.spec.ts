import { test, expect, devices } from '@playwright/test'

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
    const submitButton = dialog.locator(
      '[data-onboarding-anchor="transaction-form-submit"] button'
    )
    const viewport = page.viewportSize()

    await expect(dialog).toBeVisible()
    await expect(heading).toBeVisible()
    await expect(amountInput).toHaveAttribute('inputmode', 'decimal')
    await expect(submitButton).toHaveCSS('color', 'rgb(255, 255, 255)')

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

  test('keeps solid transaction actions white in their computed foreground', async ({
    page,
  }) => {
    await createAccountBookAndSkipOnboarding(page, 'Button Foreground Book', {
      name: 'Button Foreground User',
      email: 'button-foreground@example.com',
    })

    await page.getByRole('button', { name: 'New Transaction' }).click()

    const createDialog = page.getByRole('dialog').first()
    const amountInput = createDialog.locator(
      '[data-onboarding-anchor="transaction-form-amount"] input'
    )
    const submitButton = createDialog.locator(
      '[data-onboarding-anchor="transaction-form-submit"] button'
    )

    await expect(submitButton).toBeDisabled()
    await expect(submitButton).toHaveCSS('color', 'rgb(255, 255, 255)')

    await amountInput.fill('150')
    await expect(submitButton).toBeEnabled()
    await submitButton.click()
    await expect(createDialog).toBeHidden()

    const transactionRow = page
      .getByTestId('transaction-list')
      .getByRole('button')
      .first()
    await transactionRow.click()

    const editDialog = page.getByRole('dialog').first()
    const deleteButton = editDialog.getByRole('button', { name: 'Delete' })

    await expect(deleteButton).toBeVisible()
    await expect(deleteButton).toHaveCSS('color', 'rgb(255, 255, 255)')
  })
})
