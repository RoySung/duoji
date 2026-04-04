import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'
import { AccountBook, AccountBookRepo } from '@/entities/accountBook'
import { AccountBookLocalRepo } from '@/repositories/accountBookRepo'
import { UserLocalRepo } from '@/repositories/userRepo'
import { User, VirtualUser, RegisteredUser, UserRepo, isDeletedUser } from '@/entities/user'
import { genUuid } from '@/utils/genUuid'

type UserStoreState = {
  allUsers: User[]
  activeUsers: User[]
  scopedAccountBookId: string | null
  isLoading: boolean
  error: string | null
}

type UserStoreActions = {
  initialize: (accountBook: AccountBook | null) => Promise<void>
  addVirtualUser: (
    accountBookId: string,
    name: string
  ) => Promise<VirtualUser | null>
  renameVirtualUser: (
    accountBookId: string,
    virtualUserId: string,
    newName: string
  ) => Promise<boolean>
  softDeleteVirtualUser: (
    accountBookId: string,
    virtualUserId: string
  ) => Promise<boolean>
  resetInMemoryState: () => void
}

export type UserStore = UserStoreState & UserStoreActions
export type UserStoreApi = ReturnType<typeof createUserStore>

const initialUserStoreState: UserStoreState = {
  allUsers: [],
  activeUsers: [],
  scopedAccountBookId: null,
  isLoading: false,
  error: null,
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'Unknown user store error'
}

function computeActiveUsers(allUsers: User[]): User[] {
  return allUsers.filter((u) => !isDeletedUser(u))
}

async function resolveUsers(
  accountBook: AccountBook,
  userRepo: UserRepo
): Promise<User[]> {
  const registeredUsers = await userRepo.findByIds(accountBook.userIds)

  const registeredUserList: User[] = registeredUsers.map((user: RegisteredUser) => ({
    ...user,
    type: 'registered' as const,
  }))

  const virtualUserList: User[] = (accountBook.virtualUsers ?? []).map(
    (v: VirtualUser) => ({
      ...v,
      type: 'virtual' as const,
    })
  )

  return [...registeredUserList, ...virtualUserList]
}

export function createUserStore(
  accountBookRepo: AccountBookRepo = new AccountBookLocalRepo(),
  userRepo: UserRepo = new UserLocalRepo(),
  initialState: Partial<UserStoreState> = {}
) {
  return createStore<UserStore>()(
    devtools(
      (set) => ({
        ...initialUserStoreState,
        ...initialState,

        initialize: async (accountBook) => {
          if (!accountBook) {
            set({ allUsers: [], activeUsers: [], scopedAccountBookId: null, isLoading: false, error: null })
            return
          }

          set({ isLoading: true, error: null })

          try {
            const allUsers = await resolveUsers(accountBook, userRepo)
            set({
              allUsers,
              activeUsers: computeActiveUsers(allUsers),
              scopedAccountBookId: accountBook.id,
              isLoading: false,
              error: null,
            })
          } catch (error) {
            set({ isLoading: false, error: toErrorMessage(error) })
          }
        },

        addVirtualUser: async (accountBookId, name) => {
          set({ isLoading: true, error: null })

          try {
            const accountBook = await accountBookRepo.findById(accountBookId)
            if (!accountBook) return null

            const now = Date.now()
            const newVirtualUser: VirtualUser = {
              id: genUuid(),
              name,
              accountBookId,
              avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&bold=true`,
              createdAt: now,
              updatedAt: now,
            }

            const updatedVirtualUsers = [
              ...(accountBook.virtualUsers ?? []),
              newVirtualUser,
            ]
            await accountBookRepo.update(accountBookId, {
              virtualUsers: updatedVirtualUsers,
            })

            const updatedAccountBook = { ...accountBook, virtualUsers: updatedVirtualUsers }
            const allUsers = await resolveUsers(updatedAccountBook, userRepo)
            set({ allUsers, activeUsers: computeActiveUsers(allUsers), isLoading: false, error: null })

            return newVirtualUser
          } catch (error) {
            set({ isLoading: false, error: toErrorMessage(error) })
            return null
          }
        },

        renameVirtualUser: async (accountBookId, virtualUserId, newName) => {
          set({ isLoading: true, error: null })

          try {
            const accountBook = await accountBookRepo.findById(accountBookId)
            if (!accountBook) return false

            const updatedVirtualUsers = (accountBook.virtualUsers ?? []).map(
              (v) =>
                v.id === virtualUserId
                  ? { ...v, name: newName, updatedAt: Date.now() }
                  : v
            )
            await accountBookRepo.update(accountBookId, {
              virtualUsers: updatedVirtualUsers,
            })

            const updatedAccountBook = { ...accountBook, virtualUsers: updatedVirtualUsers }
            const allUsers = await resolveUsers(updatedAccountBook, userRepo)
            set({ allUsers, activeUsers: computeActiveUsers(allUsers), isLoading: false, error: null })

            return true
          } catch (error) {
            set({ isLoading: false, error: toErrorMessage(error) })
            return false
          }
        },

        softDeleteVirtualUser: async (accountBookId, virtualUserId) => {
          set({ isLoading: true, error: null })

          try {
            const accountBook = await accountBookRepo.findById(accountBookId)
            if (!accountBook) return false

            const now = Date.now()
            const updatedVirtualUsers = (accountBook.virtualUsers ?? []).map(
              (v) =>
                v.id === virtualUserId
                  ? { ...v, deletedAt: now, updatedAt: now }
                  : v
            )
            await accountBookRepo.update(accountBookId, {
              virtualUsers: updatedVirtualUsers,
            })

            const updatedAccountBook = { ...accountBook, virtualUsers: updatedVirtualUsers }
            const allUsers = await resolveUsers(updatedAccountBook, userRepo)
            set({ allUsers, activeUsers: computeActiveUsers(allUsers), isLoading: false, error: null })

            return true
          } catch (error) {
            set({ isLoading: false, error: toErrorMessage(error) })
            return false
          }
        },

        resetInMemoryState: () => {
          set(initialUserStoreState)
        },
      }),
      { name: 'user-store' }
    )
  )
}
