import { z } from 'zod'
import { VirtualUser, VirtualUserSchema } from './user'

export const CurrencySchema = z.enum(['USD', 'JPY', 'TWD'])
export type Currency = z.infer<typeof CurrencySchema>

export const AccountBookSchema = z.object({
  id: z.string(),
  name: z.string(),
  currency: CurrencySchema,
  description: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  ownerId: z.string(),
  userIds: z.array(z.string()),
  virtualUsers: z.array(VirtualUserSchema).default([]),
})
export type AccountBook = z.infer<typeof AccountBookSchema>

export interface AccountBookRepo {
  create(accountBook: AccountBook): Promise<AccountBook>
  findById(id: string): Promise<AccountBook | null>
  findAll(): Promise<AccountBook[]>
  mutateVirtualUsers(
    id: string,
    mutate: (virtualUsers: VirtualUser[]) => VirtualUser[]
  ): Promise<AccountBook | null>
  update(
    id: string,
    accountBook: Partial<AccountBook>
  ): Promise<AccountBook | null>
  delete(id: string): Promise<boolean>
  clear(): Promise<void> // for local dev
}
