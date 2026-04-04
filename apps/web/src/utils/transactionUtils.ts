import { parseDate } from '@internationalized/date'
import dayjs from 'dayjs'
import { AccountBook } from '@/entities/accountBook'
import {
  DefaultPaymentMethod,
  PaymentMethod,
  PaidByDetail,
  Transaction,
  TransactionType,
} from '@/entities/transaction'
import { Category } from '@/entities/category'
import { User } from '@/entities/user'

export const TransactionDateFormat = 'YYYY/MM/DD'

function toIsoTransactionDate(transactionDate: string): string {
  return transactionDate.replace(/\//g, '-')
}

function createDraftTransactionId(type: TransactionType): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return `draft-${type}-${crypto.randomUUID()}`
  }

  return `draft-${type}-${Date.now()}`
}

function cloneTransaction(transaction: Transaction): Transaction {
  return {
    ...transaction,
    tags: [...transaction.tags],
    paidByDetail: transaction.paidByDetail.map((item) => ({ ...item })),
    splitDetail: transaction.splitDetail.map((item) => ({ ...item })),
  }
}

function resolvePaymentMethod(paymentMethod?: PaymentMethod): PaymentMethod {
  return paymentMethod ?? DefaultPaymentMethod
}

export function resolveIncomeRecipientId(options: {
  users?: User[]
  accountBookId?: string | null
  receivedByUserId?: string | null
}): string | null {
  const users = options.users ?? []

  if (options.receivedByUserId) {
    if (users.length === 0) {
      return options.receivedByUserId
    }

    if (users.some((user) => user.id === options.receivedByUserId)) {
      return options.receivedByUserId
    }
  }

  return users[0]?.id ?? null
}

function buildIncomeRecipientDetails(
  receivedByUserId: string | null,
  users: User[],
  amount: number
): PaidByDetail {
  const recipient = users.find((p) => p.id === receivedByUserId)
  if (!recipient) return []

  return buildUserAmountDetails([recipient], amount)
}

export function applyIncomeRecipient(
  transaction: Transaction,
  receivedByUserId: string | null,
  users: User[] = []
): Transaction {
  if (transaction.type !== 'income') {
    return {
      ...transaction,
      receivedByUserId: null,
    }
  }

  const recipientDetails = buildIncomeRecipientDetails(
    receivedByUserId,
    users,
    transaction.amount
  )

  return {
    ...transaction,
    receivedByUserId,
    paidByDetail: recipientDetails,
    splitDetail: recipientDetails,
  }
}

export function buildUserAmountDetails(
  users: User[],
  amount: number
): PaidByDetail {
  const nextAmount = users.length > 0 ? amount / users.length : 0

  return users.map((person) => ({
    userId: person.id,
    userType: person.type,
    amount: nextAmount,
  }))
}

export function distributeDetailAmounts<T extends { amount: number }>(
  details: T[],
  amount: number
): T[] {
  if (details.length === 0) {
    return details
  }

  const nextAmount = amount / details.length

  return details.map((detail) => ({
    ...detail,
    amount: nextAmount,
  }))
}

export function distributeTransactionAmount(
  transaction: Transaction,
  amount: number
): Transaction {
  return {
    ...transaction,
    amount,
    paidByDetail: distributeDetailAmounts(transaction.paidByDetail, amount),
    splitDetail: distributeDetailAmounts(transaction.splitDetail, amount),
  }
}

export function getDefaultTransactionCategoryId(
  type: TransactionType,
  categories: Category[] = []
): string {
  return (
    categories.find(
      (category) => category.type === type && category.parentId !== null
    )?.id ??
    categories.find((category) => category.type === type)?.id ??
    ''
  )
}

function resolveTransactionCategoryId(
  type: TransactionType,
  currentCategoryId: string,
  categories: Category[] = []
): string {
  const currentCategory = categories.find(
    (category) => category.id === currentCategoryId
  )

  // Category not found at all (deleted) → return empty to signal "uncategorized"
  if (!currentCategory) {
    return ''
  }

  // Category exists and type matches → keep it
  if (currentCategory.type === type) {
    return currentCategoryId
  }

  // Category exists but type mismatch (type switch expense↔income) → use default for new type
  return getDefaultTransactionCategoryId(type, categories)
}

export function createTransactionDraft(options?: {
  type?: TransactionType
  accountBookId?: string
  accountBooks?: AccountBook[]
  users?: User[]
  baseTransaction?: Transaction | null
  categories?: Category[]
}): Transaction {
  const baseTransaction = options?.baseTransaction
  const type = options?.type ?? baseTransaction?.type ?? 'expense'
  const users = options?.users ?? []
  const categories = options?.categories ?? []

  if (baseTransaction) {
    const clonedTransaction = cloneTransaction(baseTransaction)
    const nextAccountBookId =
      options?.accountBookId ?? clonedTransaction.accountBookId
    const receivedByUserId =
      type === 'income'
        ? resolveIncomeRecipientId({
            users,
            accountBookId: nextAccountBookId,
            receivedByUserId: clonedTransaction.receivedByUserId,
          })
        : null

    const nextDraft = {
      ...clonedTransaction,
      type,
      accountBookId: nextAccountBookId,
      categoryId: resolveTransactionCategoryId(
        type,
        clonedTransaction.categoryId,
        categories
      ),
      paymentMethod: resolvePaymentMethod(clonedTransaction.paymentMethod),
      receivedByUserId,
      paidByDetail:
        type === 'income'
          ? buildIncomeRecipientDetails(receivedByUserId, users, clonedTransaction.amount)
          : clonedTransaction.paidByDetail.length > 0
          ? clonedTransaction.paidByDetail
          : buildUserAmountDetails(users.slice(0, 1), clonedTransaction.amount),
      splitDetail:
        type === 'income'
          ? buildIncomeRecipientDetails(receivedByUserId, users, clonedTransaction.amount)
          : clonedTransaction.splitDetail.length > 0
          ? clonedTransaction.splitDetail
          : buildUserAmountDetails(users, clonedTransaction.amount),
    }

    return type === 'income'
      ? applyIncomeRecipient(nextDraft, receivedByUserId, users)
      : nextDraft
  }

  const timestamp = Date.now()
  const receivedByUserId =
    type === 'income'
      ? resolveIncomeRecipientId({ users, accountBookId: options?.accountBookId })
      : null

  const nextDraft = {
    id: createDraftTransactionId(type),
    type,
    amount: 0,
    accountBookId: options?.accountBookId ?? '',
    categoryId: getDefaultTransactionCategoryId(type, categories),
    date: dayjs(timestamp).format(TransactionDateFormat),
    description: '',
    paymentMethod: DefaultPaymentMethod,
    receivedByUserId,
    tags: [],
    paidByDetail: buildUserAmountDetails(users.slice(0, 1), 0),
    splitDetail: buildUserAmountDetails(
      type === 'expense' ? users : users.slice(0, 1),
      0
    ),
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
  }

  return type === 'income'
    ? applyIncomeRecipient(nextDraft, receivedByUserId, users)
    : nextDraft
}

export function changeTransactionDraftType(
  transaction: Transaction,
  type: TransactionType,
  accountBooks: AccountBook[] = [],
  users: User[] = [],
  categories: Category[] = []
): Transaction {
  return createTransactionDraft({
    type,
    accountBookId: transaction.accountBookId,
    accountBooks,
    users,
    baseTransaction: transaction,
    categories,
  })
}

export function parseTransactionDateValue(transactionDate: string) {
  return parseDate(toIsoTransactionDate(transactionDate))
}

export function formatTransactionDateValue(
  dateValue: { toString(): string } | null,
  fallbackDate: Date = new Date()
): string {
  if (!dateValue) {
    return dayjs(fallbackDate).format(TransactionDateFormat)
  }

  return dateValue.toString().replace(/-/g, '/')
}
