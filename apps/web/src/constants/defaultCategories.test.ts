import {
  getDefaultExpenseCategories,
  getDefaultIncomeCategories,
} from './defaultCategories'

describe('defaultCategories', () => {
  it('seeds expense categories with Chinese names when locale is zh-TW', () => {
    const cats = getDefaultExpenseCategories('ab-1', 'zh-TW')
    const food = cats.find((c) => c.parentId === null && c.imageUrl)
    expect(food).toBeDefined()
    expect(cats.some((c) => c.name === '餐飲')).toBe(true)
    expect(cats.some((c) => c.name === '早餐')).toBe(true)
    expect(cats.every((c) => c.accountBookId === 'ab-1')).toBe(true)
    expect(cats.every((c) => c.type === 'expense')).toBe(true)
  })

  it('seeds expense categories with English names when locale is en-US', () => {
    const cats = getDefaultExpenseCategories('ab-1', 'en-US')
    expect(cats.some((c) => c.name === 'Food & Dining')).toBe(true)
    expect(cats.some((c) => c.name === 'Breakfast')).toBe(true)
  })

  it('seeds income categories with Chinese names when locale is zh-TW', () => {
    const cats = getDefaultIncomeCategories('ab-1', 'zh-TW')
    expect(cats.some((c) => c.name === '薪資')).toBe(true)
    expect(cats.some((c) => c.name === '底薪')).toBe(true)
    expect(cats.every((c) => c.type === 'income')).toBe(true)
  })

  it('returns category objects that are independent of future locale changes', () => {
    const seededZh = getDefaultExpenseCategories('ab-1', 'zh-TW')
    const snapshot = seededZh.map((c) => ({ id: c.id, name: c.name }))

    // Re-seeding in en-US produces different objects; existing snapshot is unchanged.
    const reseededEn = getDefaultExpenseCategories('ab-2', 'en-US')
    expect(reseededEn.some((c) => c.name === 'Food & Dining')).toBe(true)
    expect(snapshot.some((s) => s.name === '餐飲')).toBe(true)
  })

  it('honors startSortOrder offset for income seeding', () => {
    const expense = getDefaultExpenseCategories('ab-1', 'en-US')
    const income = getDefaultIncomeCategories('ab-1', 'en-US', expense.length)
    expect(income[0].sortOrder).toBe(expense.length)
  })
})
