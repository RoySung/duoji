import type { AccountBook } from '@/entities/accountBook'
import type { User, UserRepo } from '@/entities/user'

export { default as UserLocalRepo } from './userLocalRepo'

export async function resolveAccountBookUsers(
  accountBook: AccountBook,
  userRepo: UserRepo
): Promise<User[]> {
  const registered = await userRepo.findByIds(accountBook.userIds)
  return [
    ...registered.map((user) => ({ ...user, type: 'registered' as const })),
    ...(accountBook.virtualUsers ?? []).map((user) => ({
      ...user,
      type: 'virtual' as const,
    })),
  ]
}
