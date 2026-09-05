import { expect, type Page } from '@playwright/test'

export async function clearLocalData(page: Page) {
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

export async function completeWelcomeModal(page: Page) {
  await expect(page).toHaveURL(/account-books\/[^/?]+\?onboarding=welcome/)
  await expect(
    page.getByRole('heading', { name: /Welcome to DuoJi!/ })
  ).toBeVisible()
  await page.getByRole('button', { name: /Log my first expense/ }).click()
  await expect(page).toHaveURL(/account-books\/[^/?]+$/)
}

export async function completeProfileStep(
  page: Page,
  profile: { name: string; email: string }
) {
  await expect(page).toHaveURL(/step=2/)
  await page
    .getByLabel(/name|名稱|姓名/i)
    .first()
    .fill(profile.name)
  await page.getByLabel(/email/i).first().fill(profile.email)
  await page.getByRole('button', { name: /下一步|Next/ }).click()
  await expect(page).toHaveURL(/step=3/)
}

export async function createFirstAccountBook(
  page: Page,
  accountBookName: string
) {
  const nameInput = page.getByLabel(/name|名稱/i).last()
  await expect(nameInput).toBeVisible()
  await nameInput.focus()
  await nameInput.clear()
  await page.keyboard.type(accountBookName)
  await expect(nameInput).toHaveValue(accountBookName)
  const createBtn = page.getByRole('button', { name: /建立|Create/ })
  await expect(createBtn).toBeEnabled()
  await createBtn.click()
}

export async function skipInitialOnboarding(page: Page) {
  for (const step of ['3', '4', '5', '6', '7', '8']) {
    await expect(page).toHaveURL(new RegExp(`onboarding=${step}`), {
      timeout: 15_000,
    })
    await page
      .getByRole('button', { name: /^Skip$/ })
      .last()
      .click()
  }
}

export async function createAccountBookAndSkipOnboarding(
  page: Page,
  accountBookName: string,
  profile: { name: string; email: string } = {
    name: 'Test User',
    email: 'test@example.com',
  }
) {
  await page.goto('/')
  // Select Language -> Next
  await page.getByRole('button', { name: /English/ }).click()
  await page.getByRole('button', { name: /Next/ }).click()

  await completeProfileStep(page, profile)
  await createFirstAccountBook(page, accountBookName)
  await expect(page).toHaveURL(/account-books\/.+\/settings\?onboarding=3/)
  await skipInitialOnboarding(page)
  await completeWelcomeModal(page)
}
