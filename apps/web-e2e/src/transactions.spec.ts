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

  test('clears the amount when creating after editing a transaction', async ({
    page,
  }) => {
    await createAccountBookAndSkipOnboarding(page, 'Reset Amount Book')

    await page
      .locator('[data-onboarding-anchor="create-transaction"]')
      .click()

    const dialog = page.getByRole('dialog')
    const amountInput = dialog.locator(
      '[data-onboarding-anchor="transaction-form-amount"] input'
    )
    const submitButton = dialog.locator(
      'span[data-onboarding-anchor="transaction-form-submit"] button'
    )

    await amountInput.fill('150')
    await submitButton.click()
    await expect(dialog).toBeHidden()

    await page
      .getByTestId('transaction-list')
      .getByRole('button')
      .first()
      .click()
    await expect(dialog).toBeVisible()

    await amountInput.fill('275')
    await submitButton.click()
    await expect(dialog).toBeHidden()

    await page
      .locator('[data-onboarding-anchor="create-transaction"]')
      .click()
    await expect(dialog).toBeVisible()
    await expect(amountInput).toHaveValue('')
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

  test('scoped hero record count across day, week, and month', async ({
    page,
  }) => {
    await page.clock.setFixedTime(new Date('2026-09-12T12:00:00'))

    await createAccountBookAndSkipOnboarding(
      page,
      '測試帳本',
      { name: '測試者', email: 'test-zh@example.com' },
      'zh-TW'
    )

    const heroRecordCount = page.locator(
      '[data-testid="transaction-hero-record-count"]'
    )
    await expect(heroRecordCount).toBeVisible()

    // Derive the fixed calendar's visible ranges so every seeded boundary is
    // guaranteed to be represented by the UI under test.
    const dates = await page.evaluate(() => {
      function pad(n: number) {
        return n < 10 ? '0' + n : String(n)
      }
      function format(d: Date) {
        return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`
      }

      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth()
      const date = now.getDate()

      const dayOfWeek = now.getDay()
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      const monday = new Date(year, month, date + diffToMonday)

      const weekDateStrs: string[] = []
      for (let i = 0; i < 7; i++) {
        weekDateStrs.push(
          format(
            new Date(
              monday.getFullYear(),
              monday.getMonth(),
              monday.getDate() + i
            )
          )
        )
      }

      const todayStr = format(now)
      const otherDayInWeekStr = weekDateStrs.find((s) => s !== todayStr)!

      const nextWeekStart = new Date(
        monday.getFullYear(),
        monday.getMonth(),
        monday.getDate() + 7
      )
      const nextWeekEnd = new Date(
        nextWeekStart.getFullYear(),
        nextWeekStart.getMonth(),
        nextWeekStart.getDate() + 6
      )

      const monthStart = new Date(year, month, 1)
      const monthStartDay = monthStart.getDay()
      const diffToGridMonday = monthStartDay === 0 ? -6 : 1 - monthStartDay
      const adjacentMonthStr = format(
        new Date(year, month, 1 + diffToGridMonday)
      )

      return {
        todayStr,
        weekStartStr: weekDateStrs[0],
        weekEndStr: weekDateStrs[weekDateStrs.length - 1],
        otherDayInWeekStr,
        nextWeekStartStr: format(nextWeekStart),
        nextWeekEndStr: format(nextWeekEnd),
        otherDayInNextWeekStr: format(
          new Date(
            nextWeekStart.getFullYear(),
            nextWeekStart.getMonth(),
            nextWeekStart.getDate() + 1
          )
        ),
        adjacentMonthStr,
      }
    })

    const accountBookId = page
      .url()
      .split('/account-books/')[1]
      ?.split(/[?#]/)[0]
    expect(accountBookId).toBeTruthy()

    // Seed deterministic transactions directly into DuojiDB
    await page.evaluate(
      async ({
        accountBookId,
        todayStr,
        otherDayInWeekStr,
        nextWeekStartStr,
        otherDayInNextWeekStr,
        adjacentMonthStr,
      }) => {
        const req = indexedDB.open('DuojiDB')
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          req.onsuccess = () => resolve(req.result)
          req.onerror = () => reject(req.error)
        })

        const seedItems = [
          { date: todayStr, amount: 100, description: 'Today expense 1' },
          { date: todayStr, amount: 150, description: 'Today expense 2' },
          {
            date: otherDayInWeekStr,
            amount: 200,
            description: 'Other day in week',
          },
          {
            date: nextWeekStartStr,
            amount: 300,
            description: 'Next week expense 1',
          },
          {
            date: otherDayInNextWeekStr,
            amount: 350,
            description: 'Next week expense 2',
          },
          {
            date: adjacentMonthStr,
            amount: 400,
            description: 'Adjacent month expense',
          },
        ]

        const tx = db.transaction(['transactions'], 'readwrite')
        const store = tx.objectStore('transactions')
        for (const item of seedItems) {
          store.put({
            id: crypto.randomUUID(),
            type: 'expense',
            accountBookId,
            categoryId: '1-1',
            amount: item.amount,
            date: item.date,
            description: item.description,
            paymentMethod: 'Cash',
            receivedByUserId: null,
            settlementRecordId: '__unsettled__',
            tags: [],
            paidByDetail: [],
            splitDetail: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            deletedAt: null,
          })
        }

        await new Promise<void>((resolve, reject) => {
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        })
        db.close()
      },
      {
        accountBookId,
        todayStr: dates.todayStr,
        otherDayInWeekStr: dates.otherDayInWeekStr,
        nextWeekStartStr: dates.nextWeekStartStr,
        otherDayInNextWeekStr: dates.otherDayInNextWeekStr,
        adjacentMonthStr: dates.adjacentMonthStr,
      }
    )

    // Refresh the active range query without reloading the statically exported
    // dynamic route, which would restart onboarding on the test server.
    await page.getByRole('button', { name: '重新整理交易' }).click()

    // 1. On load, today is selected and the hero names that date.
    await expect(heroRecordCount).toHaveText(`${dates.todayStr} 共 2 筆`)

    // 2. Deselect the date in week view:
    const activeDayButton = page.locator('button[aria-pressed="true"]')
    await activeDayButton.click()

    // Now in week view without selection, the hero names both week boundaries.
    await expect(heroRecordCount).toHaveText(
      `${dates.weekStartStr}–${dates.weekEndStr} 共 3 筆`
    )

    // 3. Navigate to the next week and verify both boundaries and count update.
    await page.getByRole('button', { name: 'Next week', exact: true }).click()
    await expect(heroRecordCount).toHaveText(
      `${dates.nextWeekStartStr}–${dates.nextWeekEndStr} 共 2 筆`
    )

    // Return to the current week before expanding the current month.
    await page
      .getByRole('button', { name: 'Previous week', exact: true })
      .click()

    // 4. Switch to month view
    const viewToggle = page.locator('button[aria-expanded]')
    await viewToggle.click()

    // Now in month view without selection, the hero names the displayed month.
    // (Adjacent month transaction is excluded!)
    await expect(heroRecordCount).toHaveText(
      `${dates.todayStr.slice(0, 7)} 共 5 筆`
    )

    // 5. Select today while in month view: day selection overrides month view.
    const calendarSurface = page.getByTestId('transaction-calendar-surface')
    const todayDayNumber = String(parseInt(dates.todayStr.split('/')[2], 10))
    const todayBtn = calendarSurface
      .getByText(todayDayNumber, { exact: true })
      .locator('..')
    await todayBtn.click()
    await expect(heroRecordCount).toHaveText(`${dates.todayStr} 共 2 筆`)

    // 6. Select a known empty day in the fixed current month.
    const emptyDayCandidate = '6'

    const emptyDayBtn = calendarSurface
      .getByText(emptyDayCandidate, { exact: true })
      .locator('..')
    await emptyDayBtn.click()
    const emptyDate = `${dates.todayStr.slice(
      0,
      8
    )}${emptyDayCandidate.padStart(2, '0')}`
    await expect(heroRecordCount).toHaveText(`${emptyDate} 共 0 筆`)
  })
})
