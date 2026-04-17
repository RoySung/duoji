import { z } from 'zod'
import { UserTypeSchema } from '@/entities/user'

export type TransactionModalMode = 'create' | 'edit' | 'view'

export const TransactionTypeSchema = z.enum(['expense', 'income'])
export type TransactionType = z.infer<typeof TransactionTypeSchema>
export const PaymentMethodValues = [
  'Cash',
  'Line Pay',
  'JKO Pay',
  'Credit Card',
] as const
export const PaymentMethodSchema = z.enum(PaymentMethodValues)
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>
export const DefaultPaymentMethod: PaymentMethod = PaymentMethodValues[0]

export const PaidByDetailItemSchema = z.object({
  userId: z.string(),
  userType: UserTypeSchema,
  amount: z.number().positive(),
})

export const PaidByDetailSchema = z.array(PaidByDetailItemSchema)

export const SplitDetailItemSchema = z.object({
  userId: z.string(),
  userType: UserTypeSchema,
  amount: z.number().positive(),
})

export const SplitDetailSchema = z.array(SplitDetailItemSchema)

export const UNSETTLED_SETTLEMENT_RECORD_ID = '__unsettled__'

export function isUnsettledSettlementRecordId(
  settlementRecordId: string | null | undefined
): boolean {
  return settlementRecordId === UNSETTLED_SETTLEMENT_RECORD_ID
}

export function hasLinkedSettlementRecordId(
  settlementRecordId: string | null | undefined
): settlementRecordId is string {
  return (
    settlementRecordId != null &&
    settlementRecordId !== UNSETTLED_SETTLEMENT_RECORD_ID
  )
}

const TransactionFieldsSchema = z.object({
  amount: z.number().positive(),
  categoryId: z.string(),
  date: z
    .string()
    .regex(/^\d{4}\/\d{2}\/\d{2}$/, 'Date must be in YYYY/MM/DD format'),
  description: z.string(),
  paymentMethod: PaymentMethodSchema,
  receivedByUserId: z.string().nullable(),
  tags: z.array(z.string()),
  paidByDetail: PaidByDetailSchema,
  splitDetail: SplitDetailSchema,
})

export const TransactionSchema = TransactionFieldsSchema.extend({
  id: z.string(),
  type: TransactionTypeSchema,
  accountBookId: z.string(),
  settlementRecordId: z.string().default(UNSETTLED_SETTLEMENT_RECORD_ID),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
  deletedAt: z.number().int().nonnegative().nullable().default(null),
}).superRefine((transaction, context) => {
  if (transaction.type === 'income' && !transaction.receivedByUserId) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Income transactions must include a recipient.',
      path: ['receivedByUserId'],
    })
  }

  if (transaction.type === 'expense' && transaction.receivedByUserId !== null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Expense transactions must not include an income recipient.',
      path: ['receivedByUserId'],
    })
  }
})

export type Transaction = z.infer<typeof TransactionSchema>
export type PaidByDetail = z.infer<typeof PaidByDetailSchema>
export type SplitDetail = z.infer<typeof SplitDetailSchema>

export type TransactionCalendarSummary = {
  date: string
  totalAmount: number
  transactionCount: number
  hasTransactions: boolean
}

export type TransactionDateQuery = {
  date: string
  accountBookId?: string
}

export type TransactionDateRangeQuery = {
  startDate: string
  endDate: string
  accountBookId?: string
}

export interface TransactionRepo {
  create(transaction: Transaction): Promise<Transaction>
  findById(id: string): Promise<Transaction | null>
  findAll(): Promise<Transaction[]>
  findByDate(query: TransactionDateQuery): Promise<Transaction[]>
  findByAccountBookId(accountBookId: string): Promise<Transaction[]>
  findByDateRange(
    query: TransactionDateRangeQuery
  ): Promise<Transaction[]>
  findUnsettledExpenseByAccountBookId(
    accountBookId: string
  ): Promise<Transaction[]>
  findBySettlementRecordId(recordId: string): Promise<Transaction[]>
  update(
    id: string,
    transaction: Partial<Transaction>
  ): Promise<Transaction | null>
  delete(id: string): Promise<boolean>
  clear(): Promise<void>
}

// Category Repository 介面定義已移至 entities/category.ts
