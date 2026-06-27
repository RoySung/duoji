import { test, expect, type Page } from '@playwright/test'

import { clearLocalData, createAccountBookAndSkipOnboarding } from './helpers/onboarding'

test.describe('Transactions', () => {
  test.beforeEach(async ({ page }) => {
    await clearLocalData(page)
  })

  test('full flow of creating account book and adding transaction', async ({ page }) => {
    await createAccountBookAndSkipOnboarding(page, 'Test Account Book')

    // Click to create new transaction
    const createButton = page.locator('[data-onboarding-anchor="create-transaction"]')
    await expect(createButton).toBeVisible()
    await createButton.click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Fill amount
    const amountInput = dialog.locator('[data-onboarding-anchor="transaction-form-amount"] input')
    await amountInput.fill('150')

    // Submit transaction
    const submitButton = dialog.locator('span[data-onboarding-anchor="transaction-form-submit"] button')
    await expect(submitButton).toBeEnabled()
    await submitButton.click()

    // Dialog should close
    await expect(dialog).toBeHidden()

    // Transaction should appear in the list
    const transactionList = page.getByTestId('transaction-list')
    await expect(transactionList).toBeVisible()
    await expect(transactionList).toContainText('150')
  })

  test('browsing and filtering transaction history', async ({ page }) => {
    await createAccountBookAndSkipOnboarding(page, 'Test Account Book 2')

    // Create a transaction first
    await page.locator('[data-onboarding-anchor="create-transaction"]').click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.locator('[data-onboarding-anchor="transaction-form-amount"] input').fill('200')
    await dialog.locator('span[data-onboarding-anchor="transaction-form-submit"] button').click()
    await expect(dialog).toBeHidden()

    // Transaction list should contain the record
    const transactionList = page.getByTestId('transaction-list')
    await expect(transactionList).toBeVisible()
    await expect(transactionList).toContainText('200')

    // Go to previous week using the calendar navigation
    const prevWeekButton = page.getByRole('button', { name: 'Previous week' })
    await expect(prevWeekButton).toBeVisible()
    await prevWeekButton.click()

    // Click a date button in the previous week to filter transactions by that date
    // There are 7 buttons in the week grid for days
    const weekStripGrid = page.locator('.grid.flex-1.grid-cols-7')
    const anyDateButton = weekStripGrid.getByRole('button').nth(2) // Tuesday
    await expect(anyDateButton).toBeVisible()
    await anyDateButton.click()

    // Since the transaction was added today, viewing a date from last week should show no transactions
    const emptyState = page.getByTestId('transaction-history-empty')
    await expect(emptyState).toBeVisible()

    // Click it again to deselect the date, which will show all transactions for the display month
    await anyDateButton.click()

    // Go back to current week
    const nextWeekButton = page.getByRole('button', { name: 'Next week' })
    await nextWeekButton.click()

    // We still have no specific date selected, but the month includes today's transaction
    await expect(transactionList).toBeVisible()
    await expect(transactionList).toContainText('200')
  })
})
