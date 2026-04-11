import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect h1 to contain a substring.
  // ignore case
  // expect(await page.locator('body').innerText()).toMatch(/home/i)
})
