import { z } from 'zod'

export const RegisteredUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  avatarUrl: z.url(),
  createdAt: z.number(),
  updatedAt: z.number(),
  deletedAt: z.number().optional(),
})
export type RegisteredUser = z.infer<typeof RegisteredUserSchema>

export const VirtualUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  accountBookId: z.string(),
  avatarUrl: z.url().optional(),
  isSharedWallet: z.boolean().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
  deletedAt: z.number().optional(),
})
export type VirtualUser = z.infer<typeof VirtualUserSchema>

export const UserTypeSchema = z.enum(['registered', 'virtual'])
export type UserType = z.infer<typeof UserTypeSchema>

export const UserSchema = z.discriminatedUnion('type', [
  RegisteredUserSchema.extend({ type: z.literal('registered') }),
  VirtualUserSchema.extend({ type: z.literal('virtual') }),
])
export type User = z.infer<typeof UserSchema>

export function isDeletedUser(user: User): boolean {
  return !!user.deletedAt
}

export function isSharedWalletUser(user: User): boolean {
  return user.type === 'virtual' && !!user.isSharedWallet
}

export interface UserRepo {
  findByIds(ids: string[]): Promise<RegisteredUser[]>
  create(user: RegisteredUser): Promise<void>
}
