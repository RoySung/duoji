import { z } from 'zod'
import type { Transaction } from './transaction'
import type { User } from './user'

export const SettlementMemberStatusSchema = z.object({
  userId: z.string(),
  paidAmount: z.number().nonnegative(),
  splitAmount: z.number().nonnegative(),
  netAmount: z.number(),
})
export type SettlementMemberStatus = z.infer<
  typeof SettlementMemberStatusSchema
>

export const SettlementTransferStatusSchema = z.enum(['pending', 'completed'])
export type SettlementTransferStatus = z.infer<
  typeof SettlementTransferStatusSchema
>

export const SettlementTransferSchema = z.object({
  id: z.string(),
  fromUserId: z.string(),
  toUserId: z.string(),
  suggestedAmount: z.number().nonnegative(),
  actualAmount: z.number().nonnegative().nullable().default(null),
  note: z.string().default(''),
  status: SettlementTransferStatusSchema.default('pending'),
  completedAt: z.number().int().nonnegative().nullable().default(null),
})
export type SettlementTransfer = z.infer<typeof SettlementTransferSchema>

export const SettlementRecordSchema = z.object({
  id: z.string(),
  accountBookId: z.string(),
  memberStatuses: z.array(SettlementMemberStatusSchema),
  transfers: z.array(SettlementTransferSchema),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
  deletedAt: z.number().int().nonnegative().nullable().optional(),
})
export type SettlementRecord = z.infer<typeof SettlementRecordSchema>

export class StaleSettlementReviewError extends Error {
  constructor() {
    super('The reviewed settlement data changed')
    this.name = 'StaleSettlementReviewError'
  }
}

export type SettlementReviewMembers = {
  sharedWalletIds: string[]
  activeMemberCount: number
}

export type SettlementCreateTransactions =
  | string[]
  | {
      reviewedExpenses: readonly Transaction[]
      reviewedMembers: SettlementReviewMembers
    }

export interface SettlementRepo {
  create(
    record: SettlementRecord,
    transactionIdsOrReview?: SettlementCreateTransactions
  ): Promise<SettlementRecord>
  findReviewUsers?(accountBookId: string): Promise<User[] | null>
  findById(id: string): Promise<SettlementRecord | null>
  findByAccountBookId(accountBookId: string): Promise<SettlementRecord[]>
  cancel(accountBookId: string, id: string): Promise<void>
  update(
    id: string,
    updates: Partial<SettlementRecord>
  ): Promise<SettlementRecord | null>
}
