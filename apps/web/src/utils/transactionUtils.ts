import { parseDate } from '@internationalized/date'
import dayjs from 'dayjs'
import { AccountBook } from '@/entities/accountBook'
import {
  DefaultPaymentMethod,
  PaymentMethod,
  SplitDetail,
  Transaction,
  TransactionType,
} from '@/entities/transaction'
import { userList } from '@/mocks'
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

function getUserById(userId: string | null | undefined): User | null {
  if (!userId) {
    return null
  }

  return userList.find((user) => user.id === userId) ?? null
}

function getAccountBookById(
  accountBooks: AccountBook[],
  accountBookId: string | null | undefined
): AccountBook | null {
  if (!accountBookId) {
    return null
  }

  return (
    accountBooks.find((accountBook) => accountBook.id === accountBookId) ?? null
  )
}

function getAccountBookParticipantIds(
  accountBook: AccountBook | null
): string[] {
  if (!accountBook) {
    return []
  }

  return Array.from(new Set([accountBook.ownerId, ...accountBook.userIds]))
}

export function getAccountBookParticipantUsers(
  accountBooks: AccountBook[],
  accountBookId: string | null | undefined
): User[] {
  const accountBook = getAccountBookById(accountBooks, accountBookId)

  return getAccountBookParticipantIds(accountBook)
    .map((participantId) => getUserById(participantId))
    .filter((participant): participant is User => participant !== null)
}

function resolveDefaultIncomeRecipientId(
  accountBooks: AccountBook[],
  accountBookId: string | null | undefined
): string | null {
  const accountBook = getAccountBookById(accountBooks, accountBookId)

  if (!accountBook) {
    return null
  }

  const participants = getAccountBookParticipantUsers(
    accountBooks,
    accountBookId
  )

  if (
    participants.some((participant) => participant.id === accountBook.ownerId)
  ) {
    return accountBook.ownerId
  }

  return participants[0]?.id ?? null
}

export function resolveIncomeRecipientId(options: {
  accountBooks?: AccountBook[]
  accountBookId?: string | null
  receivedByUserId?: string | null
}): string | null {
  const accountBooks = options.accountBooks ?? []
  const participants = getAccountBookParticipantUsers(
    accountBooks,
    options.accountBookId
  )

  if (options.receivedByUserId) {
    if (participants.length === 0) {
      return options.receivedByUserId
    }

    if (
      participants.some(
        (participant) => participant.id === options.receivedByUserId
      )
    ) {
      return options.receivedByUserId
    }
  }

  return resolveDefaultIncomeRecipientId(accountBooks, options.accountBookId)
}

function buildIncomeRecipientDetails(
  receivedByUserId: string | null,
  amount: number
) {
  const recipient = getUserById(receivedByUserId)

  if (!recipient) {
    return []
  }

  return buildUserAmountDetails([recipient], amount)
}

export function applyIncomeRecipient(
  transaction: Transaction,
  receivedByUserId: string | null
): Transaction {
  if (transaction.type !== 'income') {
    return {
      ...transaction,
      receivedByUserId: null,
    }
  }

  const recipientDetails = buildIncomeRecipientDetails(
    receivedByUserId,
    transaction.amount
  )

  return {
    ...transaction,
    receivedByUserId,
    paidByDetail: recipientDetails,
    splitDetail: recipientDetails,
  }
}

function getDefaultSplitUsers(type: TransactionType): User[] {
  if (type === 'expense') {
    return userList
  }

  return userList[0] ? [userList[0]] : []
}

export function buildUserAmountDetails(users: User[], amount: number) {
  const nextAmount = users.length > 0 ? amount / users.length : 0

  return users.map((user) => ({
    user,
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

function buildDefaultSplitDetail(
  type: TransactionType,
  amount: number
): SplitDetail {
  return buildUserAmountDetails(getDefaultSplitUsers(type), amount)
}

export function createTransactionDraft(options?: {
  type?: TransactionType
  accountBookId?: string
  accountBooks?: AccountBook[]
  baseTransaction?: Transaction | null
  categories?: Category[]
}): Transaction {
  const baseTransaction = options?.baseTransaction
  const type = options?.type ?? baseTransaction?.type ?? 'expense'
  const accountBooks = options?.accountBooks ?? []
  const categories = options?.categories ?? []

  if (baseTransaction) {
    const clonedTransaction = cloneTransaction(baseTransaction)
    const nextAccountBookId =
      options?.accountBookId ?? clonedTransaction.accountBookId
    const receivedByUserId =
      type === 'income'
        ? resolveIncomeRecipientId({
            accountBooks,
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
          ? buildIncomeRecipientDetails(
              receivedByUserId,
              clonedTransaction.amount
            )
          : clonedTransaction.paidByDetail.length > 0
          ? clonedTransaction.paidByDetail
          : buildUserAmountDetails(
              userList[0] ? [userList[0]] : [],
              clonedTransaction.amount
            ),
      splitDetail:
        type === 'income'
          ? buildIncomeRecipientDetails(
              receivedByUserId,
              clonedTransaction.amount
            )
          : clonedTransaction.splitDetail.length > 0
          ? clonedTransaction.splitDetail
          : buildDefaultSplitDetail(type, clonedTransaction.amount),
    }

    return type === 'income'
      ? applyIncomeRecipient(nextDraft, receivedByUserId)
      : nextDraft
  }

  const timestamp = Date.now()
  const receivedByUserId =
    type === 'income'
      ? resolveIncomeRecipientId({
          accountBooks,
          accountBookId: options?.accountBookId,
        })
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
    paidByDetail: buildUserAmountDetails(userList[0] ? [userList[0]] : [], 0),
    splitDetail: buildDefaultSplitDetail(type, 0),
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
  }

  return type === 'income'
    ? applyIncomeRecipient(nextDraft, receivedByUserId)
    : nextDraft
}

export function changeTransactionDraftType(
  transaction: Transaction,
  type: TransactionType,
  accountBooks: AccountBook[] = [],
  categories: Category[] = []
): Transaction {
  return createTransactionDraft({
    type,
    accountBookId: transaction.accountBookId,
    accountBooks,
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
