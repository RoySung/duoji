import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'
import { AccountBook, AccountBookRepo } from '@/entities/accountBook'
import { AccountBookLocalRepo } from '@/repositories/accountBookRepo'

type AccountBookStoreState = {
  accountBooks: AccountBook[]
  activeAccountBookId: string | null
  initialized: boolean
  isLoading: boolean
  error: string | null
}

type AccountBookStoreActions = {
  initialize: () => Promise<void>
  loadAccountBooks: () => Promise<AccountBook[]>
  ensureActiveAccountBook: (
    preferredAccountBookId?: string | null
  ) => string | null
  setActiveAccountBook: (accountBookId: string | null) => void
  createAccountBook: (accountBook: AccountBook) => Promise<AccountBook>
  updateAccountBook: (
    id: string,
    updates: Partial<AccountBook>
  ) => Promise<AccountBook | null>
  deleteAccountBook: (id: string) => Promise<boolean>
  resetInMemoryState: () => void
}

export type AccountBookStore = AccountBookStoreState & AccountBookStoreActions
export type AccountBookStoreApi = ReturnType<typeof createAccountBookStore>

const initialAccountBookStoreState: AccountBookStoreState = {
  accountBooks: [],
  activeAccountBookId: null,
  initialized: false,
  isLoading: false,
  error: null,
}

function hasAccountBookId(
  accountBooks: AccountBook[],
  accountBookId: string | null | undefined
): boolean {
  if (!accountBookId) {
    return false
  }

  return accountBooks.some((accountBook) => accountBook.id === accountBookId)
}

function resolveFallbackActiveAccountBookId(
  accountBooks: AccountBook[],
  currentActiveAccountBookId: string | null
): string | null {
  if (hasAccountBookId(accountBooks, currentActiveAccountBookId)) {
    return currentActiveAccountBookId
  }

  return accountBooks[0]?.id ?? null
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown account book error'
}

export function selectActiveAccountBook(
  state: Pick<AccountBookStoreState, 'accountBooks' | 'activeAccountBookId'>
): AccountBook | null {
  if (!state.activeAccountBookId) {
    return null
  }

  return (
    state.accountBooks.find(
      (accountBook) => accountBook.id === state.activeAccountBookId
    ) ?? null
  )
}

export function createAccountBookStore(
  accountBookRepo: AccountBookRepo = new AccountBookLocalRepo(),
  initialState: Partial<AccountBookStoreState> = {}
) {
  return createStore<AccountBookStore>()(
    devtools(
      (set, get) => ({
        ...initialAccountBookStoreState,
        ...initialState,

        initialize: async () => {
          await get().loadAccountBooks()
        },

        loadAccountBooks: async () => {
          set({ isLoading: true, error: null })

          try {
            const accountBooks = await accountBookRepo.findAll()

            set((state) => ({
              accountBooks,
              activeAccountBookId: resolveFallbackActiveAccountBookId(
                accountBooks,
                state.activeAccountBookId
              ),
              initialized: true,
              isLoading: false,
              error: null,
            }))

            return accountBooks
          } catch (error) {
            set({
              initialized: true,
              isLoading: false,
              error: toErrorMessage(error),
            })

            return []
          }
        },

        ensureActiveAccountBook: (preferredAccountBookId) => {
          const { accountBooks, activeAccountBookId } = get()
          const nextActiveAccountBookId = hasAccountBookId(
            accountBooks,
            preferredAccountBookId
          )
            ? preferredAccountBookId ?? null
            : resolveFallbackActiveAccountBookId(
                accountBooks,
                activeAccountBookId
              )

          if (nextActiveAccountBookId !== activeAccountBookId) {
            set({ activeAccountBookId: nextActiveAccountBookId })
          }

          return nextActiveAccountBookId
        },

        setActiveAccountBook: (accountBookId) => {
          if (accountBookId === null) {
            set({ activeAccountBookId: null })
            return
          }

          const { accountBooks, activeAccountBookId } = get()
          if (!hasAccountBookId(accountBooks, accountBookId)) {
            set({
              activeAccountBookId: resolveFallbackActiveAccountBookId(
                accountBooks,
                activeAccountBookId
              ),
            })
            return
          }

          set({ activeAccountBookId: accountBookId })
        },

        createAccountBook: async (accountBook) => {
          set({ isLoading: true, error: null })

          try {
            const createdAccountBook = await accountBookRepo.create(accountBook)
            const accountBooks = await accountBookRepo.findAll()
            const { activeAccountBookId } = get()

            set({
              accountBooks,
              activeAccountBookId: hasAccountBookId(
                accountBooks,
                activeAccountBookId
              )
                ? activeAccountBookId
                : createdAccountBook.id,
              initialized: true,
              isLoading: false,
              error: null,
            })

            return createdAccountBook
          } catch (error) {
            set({
              isLoading: false,
              error: toErrorMessage(error),
            })
            throw error
          }
        },

        updateAccountBook: async (id, updates) => {
          set({ isLoading: true, error: null })

          try {
            const updatedAccountBook = await accountBookRepo.update(id, updates)
            const accountBooks = await accountBookRepo.findAll()
            const { activeAccountBookId } = get()

            set({
              accountBooks,
              activeAccountBookId: resolveFallbackActiveAccountBookId(
                accountBooks,
                activeAccountBookId
              ),
              initialized: true,
              isLoading: false,
              error: null,
            })

            return updatedAccountBook
          } catch (error) {
            set({
              isLoading: false,
              error: toErrorMessage(error),
            })
            throw error
          }
        },

        deleteAccountBook: async (id) => {
          set({ isLoading: true, error: null })

          try {
            const deleted = await accountBookRepo.delete(id)
            const accountBooks = await accountBookRepo.findAll()
            const { activeAccountBookId } = get()

            set({
              accountBooks,
              activeAccountBookId:
                deleted && activeAccountBookId === id
                  ? resolveFallbackActiveAccountBookId(accountBooks, null)
                  : resolveFallbackActiveAccountBookId(
                      accountBooks,
                      activeAccountBookId
                    ),
              initialized: true,
              isLoading: false,
              error: null,
            })

            return deleted
          } catch (error) {
            set({
              isLoading: false,
              error: toErrorMessage(error),
            })

            return false
          }
        },

        resetInMemoryState: () => {
          set(initialAccountBookStoreState)
        },
      }),
      {
        name: 'account-book-store',
      }
    )
  )
}
