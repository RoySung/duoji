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
  initialize: (accountBook: AccountBook | AccountBook[] | null) => Promise<void>
  createRegisteredUser: (
    name: string,
    email: string
  ) => Promise<RegisteredUser | null>
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

function dedupeUsersById(users: User[]): User[] {
  const seen = new Map<string, User>()
  for (const user of users) {
    if (!seen.has(user.id)) {
      seen.set(user.id, user)
    }
  }
  return Array.from(seen.values())
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

type VirtualUserMutationOutcome<T> = {
  nextVirtualUsers: VirtualUser[]
  result: T
}

async function applyVirtualUserMutation<T>(
  accountBookRepo: AccountBookRepo,
  userRepo: UserRepo,
  accountBookId: string,
  buildOutcome: (
    virtualUsers: VirtualUser[]
  ) => VirtualUserMutationOutcome<T>
): Promise<{ allUsers: User[]; result: T } | null> {
  let outcome: VirtualUserMutationOutcome<T> | null = null

  const updatedAccountBook = await accountBookRepo.mutateVirtualUsers(
    accountBookId,
    (virtualUsers) => {
      outcome = buildOutcome(virtualUsers)
      return outcome.nextVirtualUsers
    }
  )

  if (!updatedAccountBook || !outcome) {
    return null
  }

  const allUsers = await resolveUsers(updatedAccountBook, userRepo)

  return {
    allUsers,
    result: outcome.result,
  }
}

export function createUserStore(
  accountBookRepo: AccountBookRepo = new AccountBookLocalRepo(),
  userRepo: UserRepo = new UserLocalRepo(),
  initialState: Partial<UserStoreState> = {}
) {
  let initializeRunId = 0
  let successfulWriteVersion = 0
  const virtualUserMutationQueues = new Map<string, Promise<unknown>>()

  function enqueueVirtualUserMutation<T>(
    accountBookId: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const previous = virtualUserMutationQueues.get(accountBookId) ?? Promise.resolve()
    const next = previous.catch(() => undefined).then(operation)

    virtualUserMutationQueues.set(accountBookId, next)

    return next.finally(() => {
      if (virtualUserMutationQueues.get(accountBookId) === next) {
        virtualUserMutationQueues.delete(accountBookId)
      }
    }) as Promise<T>
  }

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

          const nextScopedAccountBookId = Array.isArray(accountBook)
            ? 'all'
            : accountBook.id
          const initializeId = ++initializeRunId
          const writeVersionAtStart = successfulWriteVersion

          set((state) => ({
            allUsers:
              state.scopedAccountBookId === nextScopedAccountBookId
                ? state.allUsers
                : [],
            activeUsers:
              state.scopedAccountBookId === nextScopedAccountBookId
                ? state.activeUsers
                : [],
            scopedAccountBookId: nextScopedAccountBookId,
            isLoading: true,
            error: null,
          }))

          try {
            if (Array.isArray(accountBook)) {
              const resolved = await Promise.all(
                accountBook.map((ab) => resolveUsers(ab, userRepo))
              )
              if (
                initializeId !== initializeRunId ||
                writeVersionAtStart !== successfulWriteVersion
              ) {
                return
              }
              const allUsers = dedupeUsersById(resolved.flat())
              set({
                allUsers,
                activeUsers: computeActiveUsers(allUsers),
                scopedAccountBookId: nextScopedAccountBookId,
                isLoading: false,
                error: null,
              })
              return
            }

            const allUsers = await resolveUsers(accountBook, userRepo)
            if (
              initializeId !== initializeRunId ||
              writeVersionAtStart !== successfulWriteVersion
            ) {
              return
            }
            set({
              allUsers,
              activeUsers: computeActiveUsers(allUsers),
              scopedAccountBookId: nextScopedAccountBookId,
              isLoading: false,
              error: null,
            })
          } catch (error) {
            if (
              initializeId !== initializeRunId ||
              writeVersionAtStart !== successfulWriteVersion
            ) {
              return
            }
            set({ isLoading: false, error: toErrorMessage(error) })
          }
        },

        createRegisteredUser: async (name, email) => {
          set({ isLoading: true, error: null })

          try {
            const now = Date.now()
            const newUser: RegisteredUser = {
              id: genUuid(),
              name,
              email,
              avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&bold=true`,
              createdAt: now,
              updatedAt: now,
            }
            await userRepo.create(newUser)
            const newUserAsUser: User = { ...newUser, type: 'registered' as const }
            successfulWriteVersion += 1
            set((state) => {
              const allUsers = dedupeUsersById([...state.allUsers, newUserAsUser])
              return {
                allUsers,
                activeUsers: computeActiveUsers(allUsers),
                isLoading: false,
                error: null,
              }
            })
            return newUser
          } catch (error) {
            set({ isLoading: false, error: toErrorMessage(error) })
            return null
          }
        },

        addVirtualUser: async (accountBookId, name) => {
          return enqueueVirtualUserMutation(accountBookId, async () => {
            set({ isLoading: true, error: null })

            try {
              const now = Date.now()
              const newVirtualUser: VirtualUser = {
                id: genUuid(),
                name,
                accountBookId,
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&bold=true`,
                createdAt: now,
                updatedAt: now,
              }

              const mutation = await applyVirtualUserMutation(
                accountBookRepo,
                userRepo,
                accountBookId,
                (virtualUsers) => ({
                  nextVirtualUsers: [...virtualUsers, newVirtualUser],
                  result: newVirtualUser,
                })
              )

              if (!mutation) {
                set({ isLoading: false, error: null })
                return null
              }

              successfulWriteVersion += 1
              set({
                allUsers: mutation.allUsers,
                activeUsers: computeActiveUsers(mutation.allUsers),
                isLoading: false,
                error: null,
              })

              return mutation.result
            } catch (error) {
              set({ isLoading: false, error: toErrorMessage(error) })
              return null
            }
          })
        },

        renameVirtualUser: async (accountBookId, virtualUserId, newName) => {
          return enqueueVirtualUserMutation(accountBookId, async () => {
            set({ isLoading: true, error: null })

            try {
              const mutation = await applyVirtualUserMutation(
                accountBookRepo,
                userRepo,
                accountBookId,
                (virtualUsers) => ({
                  nextVirtualUsers: virtualUsers.map((v) =>
                    v.id === virtualUserId
                      ? { ...v, name: newName, updatedAt: Date.now() }
                      : v
                  ),
                  result: true,
                })
              )

              if (!mutation) {
                set({ isLoading: false, error: null })
                return false
              }

              successfulWriteVersion += 1
              set({
                allUsers: mutation.allUsers,
                activeUsers: computeActiveUsers(mutation.allUsers),
                isLoading: false,
                error: null,
              })

              return mutation.result
            } catch (error) {
              set({ isLoading: false, error: toErrorMessage(error) })
              return false
            }
          })
        },

        softDeleteVirtualUser: async (accountBookId, virtualUserId) => {
          return enqueueVirtualUserMutation(accountBookId, async () => {
            set({ isLoading: true, error: null })

            try {
              const now = Date.now()
              const mutation = await applyVirtualUserMutation(
                accountBookRepo,
                userRepo,
                accountBookId,
                (virtualUsers) => ({
                  nextVirtualUsers: virtualUsers.map((v) =>
                    v.id === virtualUserId
                      ? { ...v, deletedAt: now, updatedAt: now }
                      : v
                  ),
                  result: true,
                })
              )

              if (!mutation) {
                set({ isLoading: false, error: null })
                return false
              }

              successfulWriteVersion += 1
              set({
                allUsers: mutation.allUsers,
                activeUsers: computeActiveUsers(mutation.allUsers),
                isLoading: false,
                error: null,
              })

              return mutation.result
            } catch (error) {
              set({ isLoading: false, error: toErrorMessage(error) })
              return false
            }
          })
        },

        resetInMemoryState: () => {
          set(initialUserStoreState)
        },
      }),
      { name: 'user-store' }
    )
  )
}
