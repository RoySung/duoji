import { z } from 'zod'
import { UserSchema } from './user'

export const CurrencySchema = z.enum(['USD', 'JPY', 'TWD'])
export type Currency = z.infer<typeof CurrencySchema>

export const AccountBookSchema = z.object({
  id: z.string(),
  name: z.string(),
  currency: CurrencySchema,
  description: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  users: z.array(UserSchema),
})
export type AccountBook = z.infer<typeof AccountBookSchema>

export interface AccountBookRepo {
  create(accountBook: AccountBook): Promise<AccountBook>
  findById(id: string): Promise<AccountBook | null>
  findAll(): Promise<AccountBook[]>
  update(
    id: string,
    accountBook: Partial<AccountBook>
  ): Promise<AccountBook | null>
  delete(id: string): Promise<boolean>
}
