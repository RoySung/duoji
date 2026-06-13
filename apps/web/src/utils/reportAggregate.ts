import dayjs from 'dayjs'
import { AccountBook, Currency } from '@/entities/accountBook'
import { Category } from '@/entities/category'
import { Transaction, TransactionType } from '@/entities/transaction'
import {
  CategoryAggregateOptions,
  CategorySummary,
  CurrencyGroup,
  MonthlyTrendPoint,
  SummaryTotals,
} from '@/components/report/reportTypes'

export function formatAmount(amount: number): string {
  return Math.round(amount).toLocaleString()
}

export function extractReportTags(transactions: Transaction[]): string[] {
  const tags = new Set<string>()

  for (const transaction of transactions) {
    for (const tag of transaction.tags) {
      const trimmed = tag.trim()
      if (!trimmed) continue
      tags.add(trimmed)
    }
  }

  return Array.from(tags.values()).sort((left, right) =>
    left.localeCompare(right, undefined, { sensitivity: 'base' }) ||
    left.localeCompare(right)
  )
}

const UNCATEGORIZED_DISPLAY_NAME = 'Uncategorized'

export function groupByCurrency(
  transactions: Transaction[],
  accountBooks: AccountBook[]
): CurrencyGroup[] {
  const bookCurrencyById = new Map<string, Currency>(
    accountBooks.map((book) => [book.id, book.currency])
  )

  const byCurrency = new Map<Currency, Transaction[]>()

  for (const transaction of transactions) {
    const currency = bookCurrencyById.get(transaction.accountBookId)
    if (!currency) continue

    const existing = byCurrency.get(currency)
    if (existing) {
      existing.push(transaction)
    } else {
      byCurrency.set(currency, [transaction])
    }
  }

  return Array.from(byCurrency.entries())
    .map(([currency, currencyTransactions]) => ({
      currency,
      transactions: currencyTransactions,
    }))
    .sort((a, b) => b.transactions.length - a.transactions.length)
}

export function summarize(transactions: Transaction[]): SummaryTotals {
  let income = 0
  let expense = 0

  for (const transaction of transactions) {
    if (transaction.type === 'income') {
      income += transaction.amount
    } else if (transaction.type === 'expense') {
      expense += transaction.amount
    }
  }

  return { income, expense, net: income - expense }
}

export function groupByCategory(
  transactions: Transaction[],
  categories: Category[],
  type: TransactionType,
  options: CategoryAggregateOptions
): CategorySummary[] {
  const categoryById = new Map<string, Category>(
    categories.map((category) => [category.id, category])
  )

  type Bucket = {
    key: string
    displayName: string
    imageUrl: string | null
    totalAmount: number
    transactionCount: number
    transactions: Transaction[]
  }

  const buckets = new Map<string, Bucket>()
  let totalForType = 0

  for (const transaction of transactions) {
    if (transaction.type !== type) continue

    const category = categoryById.get(transaction.categoryId) ?? null
    const { key, displayName, imageUrl } = getCategoryBucketIdentity(
      transaction,
      category,
      options.mergeByName
    )

    const existing = buckets.get(key)
    if (existing) {
      existing.totalAmount += transaction.amount
      existing.transactionCount += 1
      existing.transactions.push(transaction)
    } else {
      buckets.set(key, {
        key,
        displayName,
        imageUrl,
        totalAmount: transaction.amount,
        transactionCount: 1,
        transactions: [transaction],
      })
    }
    totalForType += transaction.amount
  }

  const summaries: CategorySummary[] = Array.from(buckets.values()).map(
    (bucket) => ({
      ...bucket,
      percentage:
        totalForType > 0 ? (bucket.totalAmount / totalForType) * 100 : 0,
    })
  )

  summaries.sort((a, b) => b.totalAmount - a.totalAmount)
  return summaries
}

export function getCategoryBucketIdentity(
  transaction: Transaction,
  category: Category | null,
  mergeByName: boolean
): { key: string; displayName: string; imageUrl: string | null } {
  if (!category) {
    return {
      key: `uncategorized::${transaction.type}::${transaction.categoryId}`,
      displayName: UNCATEGORIZED_DISPLAY_NAME,
      imageUrl: null,
    }
  }

  if (mergeByName) {
    return {
      key: `name::${transaction.type}::${category.name}`,
      displayName: category.name,
      imageUrl: category.imageUrl,
    }
  }

  return {
    key: `id::${transaction.type}::${category.id}`,
    displayName: category.name,
    imageUrl: category.imageUrl,
  }
}

export function groupByMonth(transactions: Transaction[]): MonthlyTrendPoint[] {
  const byMonth = new Map<string, MonthlyTrendPoint>()

  for (const transaction of transactions) {
    const month = dayjs(transaction.date, 'YYYY/MM/DD').format('YYYY/MM')
    const existing = byMonth.get(month)

    if (existing) {
      if (transaction.type === 'income') {
        existing.income += transaction.amount
      } else if (transaction.type === 'expense') {
        existing.expense += transaction.amount
      }
    } else {
      byMonth.set(month, {
        month,
        income: transaction.type === 'income' ? transaction.amount : 0,
        expense: transaction.type === 'expense' ? transaction.amount : 0,
      })
    }
  }

  return Array.from(byMonth.values()).sort((a, b) =>
    a.month.localeCompare(b.month)
  )
}
