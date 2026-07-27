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

/**
 * 過濾並計算特定成員的實際收支：
 * 1. 移除與該成員無關的交易。
 * 2. 針對留下的交易，將 amount 覆寫為「個人直接負擔/獲得」加上「公積金平攤」的金額總和。
 * 3. 若 selectedMemberId 為 null，則不進行過濾，回傳原始所有交易。
 */
export function filterTransactionsByMember(
  transactions: Transaction[],
  selectedMemberId: string | null,
  realMembersCountMap: Map<string, number>,
  sharedWalletIds: Set<string>
): Transaction[] {
  if (!selectedMemberId) return transactions

  return transactions
    .map((tx) => {
      const realMembersCount = realMembersCountMap.get(tx.accountBookId) || 0

      if (tx.type === 'expense') {
        const directSplit = tx.splitDetail.find(
          (item) => item.userId === selectedMemberId
        )
        const directAmount = directSplit?.amount ?? 0

        const sharedWalletSplit = tx.splitDetail.find((item) =>
          sharedWalletIds.has(item.userId)
        )
        const sharedWalletAmount = sharedWalletSplit?.amount ?? 0
        const sharedWalletShare =
          realMembersCount > 0 ? sharedWalletAmount / realMembersCount : 0

        const effectiveAmount = directAmount + sharedWalletShare

        if (effectiveAmount === 0) return null

        return {
          ...tx,
          amount: effectiveAmount,
        }
      } else if (tx.type === 'income') {
        let effectiveIncome = 0
        if (tx.receivedByUserId === selectedMemberId) {
          effectiveIncome = tx.amount
        } else if (
          tx.receivedByUserId &&
          sharedWalletIds.has(tx.receivedByUserId)
        ) {
          effectiveIncome =
            realMembersCount > 0 ? tx.amount / realMembersCount : 0
        }

        if (effectiveIncome === 0) return null

        return { ...tx, amount: effectiveIncome }
      }
      return null
    })
    .filter((tx): tx is Transaction => tx !== null)
}
