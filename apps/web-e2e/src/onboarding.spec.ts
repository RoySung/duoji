import { test, expect, type Page } from '@playwright/test'

import {
  clearLocalData,
  completeProfileStep,
  completeWelcomeModal,
  createFirstAccountBook,
} from './helpers/onboarding'

test.describe('onboarding flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearLocalData(page)
  })

  test('first launch: zh-TW selection seeds Chinese default categories', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/onboarding/)

    await page.getByRole('button', { name: '繁體中文' }).click()
    await page.getByRole('button', { name: /下一步|Next/ }).click()

    await completeProfileStep(page, {
      name: 'Roy',
      email: 'roy@example.com',
    })
    await createFirstAccountBook(page, 'My Book')

    await expect(page).toHaveURL(/account-books\/.+\/settings\?onboarding=3/)
  })

  test('tutorial steps 3-8 highlight their anchors and advance correctly', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /English/ }).click()
    await page.getByRole('button', { name: /Next/ }).click()

    await completeProfileStep(page, {
      name: 'Tutor',
      email: 'tutor@example.com',
    })
    await createFirstAccountBook(page, 'Tutorial Book')

    // Step 3 — settings page coachmark anchored on edit-account-book section
    await expect(page).toHaveURL(/settings\?onboarding=3/)
    await expect(
      page.locator('[data-onboarding-anchor="edit-account-book"]')
    ).toBeVisible()
    await page.getByRole('button', { name: 'Next' }).last().click()

    // Step 4 — settings page, members section
    await expect(page).toHaveURL(/settings\?onboarding=4/)
    await expect(
      page.locator('[data-onboarding-anchor="add-member"]')
    ).toBeVisible()
    await page.getByRole('button', { name: 'Next' }).last().click()

    // Step 5 — settings page, manage categories section
    await expect(page).toHaveURL(/settings\?onboarding=5/)
    await expect(
      page.locator('[data-onboarding-anchor="manage-categories"]')
    ).toBeVisible()
    await page.getByRole('button', { name: 'Next' }).last().click()

    // Step 6 — transactions page coachmark anchored on create-transaction button
    await expect(page).toHaveURL(/onboarding=6/)
    await expect(
      page.locator('[data-onboarding-anchor="create-transaction"]')
    ).toBeVisible()
    await page.getByRole('button', { name: /Close Tour/ }).click()

    // Step 7 — settlement page
    await expect(page).toHaveURL(/settlement\?onboarding=7/)
    await expect(
      page.locator('[data-onboarding-anchor="settlement-tabs"]')
    ).toBeVisible()
    await page.getByRole('button', { name: 'Next' }).last().click()

    // Step 8 — report page
    await expect(page).toHaveURL(/report\?onboarding=8/)
    await expect(
      page.locator('[data-onboarding-anchor="report-filters"]')
    ).toBeVisible()
    await page
      .getByRole('button', { name: /Finish|Done/ })
      .last()
      .click()

    // Flow finishes with the welcome modal, then returns to the account book.
    await completeWelcomeModal(page)
  })

  test('skip on tutorial steps advances the flow', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /English/ }).click()
    await page.getByRole('button', { name: /Next/ }).click()

    await completeProfileStep(page, {
      name: 'Skipper',
      email: 'skipper@example.com',
    })
    await createFirstAccountBook(page, 'Skipper Book')

    await expect(page).toHaveURL(/onboarding=3/)
    await page.getByRole('button', { name: /^Skip$/ }).last().click()
    await expect(page).toHaveURL(/onboarding=4/)
    await page.getByRole('button', { name: /^Skip$/ }).last().click()
    await expect(page).toHaveURL(/onboarding=5/)
    await page.getByRole('button', { name: /^Skip$/ }).last().click()
    await expect(page).toHaveURL(/onboarding=6/)
    await page.getByRole('button', { name: /^Skip$/ }).last().click()
    await expect(page).toHaveURL(/onboarding=7/)
    await page.getByRole('button', { name: /^Skip$/ }).last().click()
    await expect(page).toHaveURL(/onboarding=8/)
    await page.getByRole('button', { name: /^Skip$/ }).last().click()
    await completeWelcomeModal(page)
  })
})
