import dayjs from 'dayjs'
import { AccountBook } from '@/entities/accountBook'
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

  return Array.from(tags.values()).sort(
    (left, right) =>
      left.localeCompare(right, undefined, { sensitivity: 'base' }) ||
      left.localeCompare(right)
  )
}

const UNCATEGORIZED_DISPLAY_NAME = 'Uncategorized'

export function groupByCurrency(
  transactions: Transaction[],
  accountBooks: AccountBook[]
): CurrencyGroup[] {
  const bookCurrencyById = new Map<string, string>(
    accountBooks.map((book) => [book.id, book.currency])
  )

  const byCurrency = new Map<string, Transaction[]>()

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
    directAmount: number
    directTransactionCount: number
    directTransactions: Transaction[]
    transactions: Transaction[]
    children: Map<string, Bucket>
  }

  const rootBuckets = new Map<string, Bucket>()
  let totalForType = 0

  for (const transaction of transactions) {
    if (transaction.type !== type) continue

    const { root, assigned } = getCategoryHierarchyIdentity(
      transaction,
      categoryById,
      options.mergeByName
    )

    let rootBucket = rootBuckets.get(root.key)
    if (!rootBucket) {
      rootBucket = {
        ...root,
        totalAmount: 0,
        transactionCount: 0,
        directAmount: 0,
        directTransactionCount: 0,
        directTransactions: [],
        transactions: [],
        children: new Map(),
      }
      rootBuckets.set(root.key, rootBucket)
    }

    rootBucket.totalAmount += transaction.amount
    rootBucket.transactionCount += 1
    rootBucket.transactions.push(transaction)

    if (assigned.key === root.key) {
      rootBucket.directAmount += transaction.amount
      rootBucket.directTransactionCount += 1
      rootBucket.directTransactions.push(transaction)
    } else {
      let childBucket = rootBucket.children.get(assigned.key)
      if (!childBucket) {
        const childTransactions: Transaction[] = []
        childBucket = {
          ...assigned,
          totalAmount: 0,
          transactionCount: 0,
          directAmount: 0,
          directTransactionCount: 0,
          directTransactions: childTransactions,
          transactions: childTransactions,
          children: new Map(),
        }
        rootBucket.children.set(assigned.key, childBucket)
      }

      childBucket.totalAmount += transaction.amount
      childBucket.transactionCount += 1
      childBucket.directAmount += transaction.amount
      childBucket.directTransactionCount += 1
      childBucket.transactions.push(transaction)
    }

    totalForType += transaction.amount
  }

  const toSummary = (bucket: Bucket): CategorySummary => ({
    key: bucket.key,
    displayName: bucket.displayName,
    imageUrl: bucket.imageUrl,
    totalAmount: bucket.totalAmount,
    transactionCount: bucket.transactionCount,
    directAmount: bucket.directAmount,
    directTransactionCount: bucket.directTransactionCount,
    directTransactions: bucket.directTransactions,
    percentage:
      totalForType > 0 ? (bucket.totalAmount / totalForType) * 100 : 0,
    transactions: bucket.transactions,
    children: Array.from(bucket.children.values())
      .map(toSummary)
      .sort((left, right) => right.totalAmount - left.totalAmount),
  })

  return Array.from(rootBuckets.values())
    .map(toSummary)
    .sort((left, right) => right.totalAmount - left.totalAmount)
}

type CategoryBucketIdentity = {
  key: string
  displayName: string
  imageUrl: string | null
}

function encodeCategoryKeySegment(value: string): string {
  return encodeURIComponent(value)
}

function getMergedDescendantBucketKey(
  type: TransactionType,
  rootCategory: Category,
  category: Category
): string {
  return [
    'name',
    type,
    encodeCategoryKeySegment(rootCategory.name),
    encodeCategoryKeySegment(category.name),
  ].join('::')
}

function getMalformedCategoryBucketIdentity(
  transaction: Transaction,
  category: Category
): CategoryBucketIdentity {
  return {
    key: `malformed::${transaction.type}::${encodeCategoryKeySegment(
      category.id
    )}`,
    displayName: category.name,
    imageUrl: category.imageUrl,
  }
}

export type CategoryHierarchyIdentity = {
  root: CategoryBucketIdentity
  assigned: CategoryBucketIdentity
}

function resolveCategoryRoot(
  category: Category,
  categoryById: ReadonlyMap<string, Category>
): Category | null {
  let current = category
  const visitedIds = new Set([category.id])

  while (current.parentId) {
    const parent = categoryById.get(current.parentId)
    if (!parent || visitedIds.has(parent.id)) return null

    visitedIds.add(parent.id)
    current = parent
  }

  return current
}

export function getCategoryBucketKey(
  type: TransactionType,
  category: Category,
  mergeByName: boolean
): string {
  return mergeByName
    ? `name::${type}::${encodeCategoryKeySegment(category.name)}`
    : `id::${type}::${category.id}`
}

export function getCategoryHierarchyIdentity(
  transaction: Transaction,
  categoryById: ReadonlyMap<string, Category>,
  mergeByName: boolean
): CategoryHierarchyIdentity {
  const category = categoryById.get(transaction.categoryId) ?? null
  if (!category) {
    const uncategorized = getCategoryBucketIdentity(
      transaction,
      null,
      mergeByName
    )
    return { root: uncategorized, assigned: uncategorized }
  }

  const rootCategory = resolveCategoryRoot(category, categoryById)
  if (!rootCategory) {
    const fallback = getMalformedCategoryBucketIdentity(transaction, category)
    return { root: fallback, assigned: fallback }
  }

  const root = getCategoryBucketIdentity(transaction, rootCategory, mergeByName)
  if (rootCategory.id === category.id) {
    return { root, assigned: root }
  }

  const assigned = mergeByName
    ? {
        key: getMergedDescendantBucketKey(
          transaction.type,
          rootCategory,
          category
        ),
        displayName: category.name,
        imageUrl: category.imageUrl,
      }
    : getCategoryBucketIdentity(transaction, category, false)

  return { root, assigned }
}

export function getCategoryDescendantKeysByRoot(
  categories: Category[],
  mergeByName: boolean
): Map<string, Set<string>> {
  const categoryById = new Map(
    categories.map((category) => [category.id, category])
  )
  const descendantKeysByRoot = new Map<string, Set<string>>()

  for (const category of categories) {
    const rootCategory = resolveCategoryRoot(category, categoryById)
    if (!rootCategory || rootCategory.id === category.id) continue

    const rootKey = getCategoryBucketKey(
      category.type,
      rootCategory,
      mergeByName
    )
    const descendantKey = mergeByName
      ? getMergedDescendantBucketKey(category.type, rootCategory, category)
      : getCategoryBucketKey(category.type, category, false)
    const existingKeys = descendantKeysByRoot.get(rootKey)

    if (existingKeys) existingKeys.add(descendantKey)
    else descendantKeysByRoot.set(rootKey, new Set([descendantKey]))
  }

  return descendantKeysByRoot
}

export function getCategoryBucketIdentity(
  transaction: Transaction,
  category: Category | null,
  mergeByName: boolean
): CategoryBucketIdentity {
  if (!category) {
    return {
      key: `uncategorized::${transaction.type}`,
      displayName: UNCATEGORIZED_DISPLAY_NAME,
      imageUrl: null,
    }
  }

  if (mergeByName) {
    return {
      key: getCategoryBucketKey(transaction.type, category, true),
      displayName: category.name,
      imageUrl: category.imageUrl,
    }
  }

  return {
    key: getCategoryBucketKey(transaction.type, category, false),
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
