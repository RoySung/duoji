import { z } from 'zod'

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
})
export type SettlementRecord = z.infer<typeof SettlementRecordSchema>

export interface SettlementRepo {
  create(
    record: SettlementRecord,
    transactionIds?: string[]
  ): Promise<SettlementRecord>
  findById(id: string): Promise<SettlementRecord | null>
  findByAccountBookId(accountBookId: string): Promise<SettlementRecord[]>
  update(
    id: string,
    updates: Partial<SettlementRecord>
  ): Promise<SettlementRecord | null>
}
