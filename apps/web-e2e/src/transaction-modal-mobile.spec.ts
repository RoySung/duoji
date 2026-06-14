import { test, expect, devices, type Page } from '@playwright/test'

const { viewport, userAgent, deviceScaleFactor, hasTouch } =
  devices['iPhone 12']

test.use({
  viewport,
  userAgent,
  deviceScaleFactor,
  hasTouch,
})

async function clearLocalData(page: Page) {
  await page.addInitScript(() => {
    return new Promise<void>((resolve) => {
      const req = (
        globalThis as {
          indexedDB?: {
            deleteDatabase: (name: string) => {
              onsuccess: (() => void) | null
              onerror: (() => void) | null
              onblocked: (() => void) | null
            }
          }
        }
      ).indexedDB?.deleteDatabase('DuojiDB')

      if (!req) {
        resolve()
        return
      }

      req.onsuccess = () => resolve()
      req.onerror = () => resolve()
      req.onblocked = () => resolve()
    })
  })
}

async function completeWelcomeModal(page: Page) {
  await expect(page).toHaveURL(/account-books\/[^/?]+\?onboarding=welcome/)
  await expect(
    page.getByRole('heading', { name: /Welcome to DuoJi!/ })
  ).toBeVisible()
  await page.getByRole('button', { name: /Log my first expense/ }).click()
  await expect(page).toHaveURL(/account-books\/[^/?]+$/)
}

async function completeProfileStep(
  page: Page,
  profile: { name: string; email: string }
) {
  await expect(page).toHaveURL(/step=2/)
  await page.getByLabel(/name/i).first().fill(profile.name)
  await page.getByLabel(/email/i).first().fill(profile.email)
  await page.getByRole('button', { name: /Next/ }).click()
  await expect(page).toHaveURL(/step=3/)
}

async function createAccountBook(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: /English/ }).click()
  await page.getByRole('button', { name: /Next/ }).click()

  await completeProfileStep(page, {
    name: 'Mobile Modal User',
    email: 'mobile-modal@example.com',
  })

  await page.getByLabel(/name/i).last().fill('Mobile Modal Book')
  await page.getByRole('button', { name: /Create/ }).click()
  await expect(page).toHaveURL(/account-books\/.+\/settings\?onboarding=3/)
}

async function skipInitialOnboarding(page: Page) {
  for (const step of ['3', '4', '5', '6', '7', '8']) {
    await expect(page).toHaveURL(new RegExp(`onboarding=${step}`))
    await page.getByRole('button', { name: 'Skip' }).last().click()
  }

  await completeWelcomeModal(page)
}

test.describe('transaction modal mobile layout', () => {
  test.beforeEach(async ({ page }) => {
    await clearLocalData(page)
  })

  test('keeps the create sheet tall and preserves decimal keypad hints', async ({
    page,
  }) => {
    await createAccountBook(page)
    await skipInitialOnboarding(page)

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