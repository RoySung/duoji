import { expect, test, type Page } from '@playwright/test'
import { createAccountBookAndSkipOnboarding } from './helpers/onboarding'

async function openCategorySettings(page: Page, bookName: string) {
  await page.getByRole('button', { name: bookName, exact: true }).click()
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Edit', exact: true })
    .click()
  await page.getByRole('button', { name: 'Manage categories' }).click()
  return page.getByRole('dialog', { name: `${bookName} — Categories` })
}

test('a new book renders built-in category icons with Iconify blocked', async ({
  page,
}) => {
  test.setTimeout(60_000)

  const iconifyRequests: string[] = []
  await page.route('https://api.iconify.design/**', async (route) => {
    iconifyRequests.push(route.request().url())
    await route.abort()
  })

  const bookName = 'Bundled category icons'
  await createAccountBookAndSkipOnboarding(page, bookName)

  const settings = await openCategorySettings(page, bookName)
  const foodGroup = settings.getByRole('button', {
    name: /^Food & Dining.*sub-categor/,
  })
  await expect(foodGroup.locator('svg.lucide-utensils')).toBeVisible()
  await foodGroup.click()
  const breakfastRow = settings
    .getByText('Breakfast', { exact: true })
    .locator('..')
  await expect(breakfastRow.locator('svg.lucide-coffee')).toBeVisible()
  await settings.getByRole('tab', { name: 'Income' }).click()
  await expect(
    settings
      .getByRole('button', { name: /^Salary.*sub-categor/ })
      .locator('svg.lucide-banknote')
  ).toBeVisible()
  await settings.getByRole('tab', { name: 'Expense' }).click()

  await settings.getByRole('button', { name: 'Add Expense Group' }).click()
  const editor = page.getByRole('dialog', { name: 'Add Expense Group' })
  await expect(
    editor
      .getByRole('button', { name: 'Utensils', exact: true })
      .locator('svg.lucide-utensils')
  ).toBeVisible()
  await editor.getByRole('button', { name: 'Cancel' }).click()
  await expect(editor).toBeHidden()
  await settings.getByRole('button', { name: 'Close', exact: true }).click()
  await expect(settings).toBeHidden()

  await page.getByRole('button', { name: 'Home', exact: true }).click()
  await page.getByRole('button', { name: 'New Transaction' }).click()
  const transaction = page.getByRole('dialog')
  const selector = transaction.locator(
    '[data-onboarding-anchor="transaction-form-category"]'
  )
  await expect(
    selector
      .getByRole('tab', { name: 'Food & Dining' })
      .locator('svg.lucide-utensils')
  ).toBeVisible()
  const breakfast = selector.getByRole('button', { name: 'Breakfast' })
  await expect(breakfast.locator('svg.lucide-coffee')).toBeVisible()
  await breakfast.click()
  await transaction
    .locator('[data-onboarding-anchor="transaction-form-amount"] input')
    .fill('150')
  await transaction
    .locator('[data-onboarding-anchor="transaction-form-submit"] button')
    .click()
  await expect(transaction).toBeHidden()
  await expect(
    page.getByTestId('transaction-list').locator('svg.lucide-coffee')
  ).toBeVisible()

  await page.getByRole('button', { name: 'Reports', exact: true }).click()
  const foodBreakdown = page.getByRole('button', {
    name: 'View Food & Dining breakdown',
  })
  await expect(foodBreakdown.locator('svg.lucide-utensils')).toBeVisible()
  await foodBreakdown.click()
  const breakfastBreakdown = page.getByRole('button', {
    name: 'Open Breakfast transactions',
  })
  await expect(breakfastBreakdown.locator('svg.lucide-coffee')).toBeVisible()
  await breakfastBreakdown.click()
  await expect(
    page.getByRole('dialog').locator('svg.lucide-coffee')
  ).toHaveCount(2)
  expect(iconifyRequests).toEqual([])
})

test('a new book retains a custom image URL and shows a fallback if it stops loading', async ({
  page,
}) => {
  const imageUrl = 'https://images.example.com/icon?id=coffee'
  const matchImage = (url: { href: string }) => url.href === imageUrl
  const pixel = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNgaGgAAAGEAQFWjyAjAAAAAElFTkSuQmCC',
    'base64'
  )
  await page.route(matchImage, async (route) => {
    await route.fulfill({
      contentType: 'image/png',
      body: pixel,
    })
  })

  const bookName = 'Custom category image'
  const categoryName = 'Weekend coffee'
  await createAccountBookAndSkipOnboarding(page, bookName)
  const settings = await openCategorySettings(page, bookName)
  await settings.getByRole('button', { name: 'Add Expense Group' }).click()
  const editor = page.getByRole('dialog', { name: 'Add Expense Group' })

  await editor.getByPlaceholder('e.g. Dining').fill(categoryName)
  await editor
    .getByRole('button', { name: 'Custom image', exact: true })
    .click()
  const urlInput = editor.getByRole('textbox', { name: 'Image URL' })
  const preview = editor.getByRole('img', { name: 'Custom image preview' })
  await urlInput.fill(imageUrl)
  await expect(preview).toHaveJSProperty('naturalWidth', 1)
  await expect(urlInput).toBeFocused()
  await editor.getByRole('button', { name: 'Add', exact: true }).click()
  await expect(editor).toBeHidden()
  await settings.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(settings.getByRole('button', { name: 'Discard' })).toBeHidden()

  const categoryRow = settings.getByRole('button', {
    name: /^Weekend coffee.*sub-categor/,
  })
  await expect(
    categoryRow.locator('img[data-category-icon="custom"]')
  ).toHaveJSProperty('naturalWidth', 1)

  await page.unroute(matchImage)
  await page.route(matchImage, (route) => route.abort())
  await page.goto('/')
  await expect(page).toHaveURL(/account-books\/[^/?]+$/)
  await openCategorySettings(page, bookName)

  await expect(
    categoryRow.locator('svg[data-category-icon="fallback"]')
  ).toBeVisible()
  await settings.getByRole('button', { name: `Edit: ${categoryName}` }).click()
  const edit = page.getByRole('dialog', { name: 'Edit Category' })
  await expect(
    edit.getByRole('button', { name: 'Custom image', pressed: true })
  ).toBeVisible()
  await expect(edit.getByRole('textbox', { name: 'Image URL' })).toHaveValue(
    imageUrl
  )
  await expect(edit.getByRole('status')).toContainText('Image could not load')
})
