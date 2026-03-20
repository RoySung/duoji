import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'
import { AccountBook, AccountBookRepo } from '@/entities/accountBook'
import { AccountBookLocalRepo } from '@/repositories/accountBookRepo'

type AccountBookStoreState = {
  accountBooks: AccountBook[]
  currentAccountBookId: string | null
  initialized: boolean
  isLoading: boolean
  error: string | null
}

type AccountBookStoreActions = {
  initialize: () => Promise<void>
  loadAccountBooks: () => Promise<AccountBook[]>
  setCurrentAccountBook: (accountBookId: string | null) => void
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
  currentAccountBookId: null,
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

function resolveFallbackCurrentAccountBookId(
  accountBooks: AccountBook[],
  existingCurrentAccountBookId: string | null
): string | null {
  if (hasAccountBookId(accountBooks, existingCurrentAccountBookId)) {
    return existingCurrentAccountBookId
  }

  return accountBooks[0]?.id ?? null
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown account book error'
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
              currentAccountBookId: resolveFallbackCurrentAccountBookId(
                accountBooks,
                state.currentAccountBookId
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

        setCurrentAccountBook: (accountBookId) => {
          if (accountBookId === null) {
            set({ currentAccountBookId: null })
            return
          }

          const { accountBooks, currentAccountBookId } = get()
          if (!hasAccountBookId(accountBooks, accountBookId)) {
            set({
              currentAccountBookId: resolveFallbackCurrentAccountBookId(
                accountBooks,
                currentAccountBookId
              ),
            })
            return
          }

          set({ currentAccountBookId: accountBookId })
        },

        createAccountBook: async (accountBook) => {
          set({ isLoading: true, error: null })

          try {
            const createdAccountBook = await accountBookRepo.create(accountBook)
            const accountBooks = await accountBookRepo.findAll()
            const { currentAccountBookId } = get()

            set({
              accountBooks,
              currentAccountBookId: hasAccountBookId(
                accountBooks,
                currentAccountBookId
              )
                ? currentAccountBookId
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
            const { currentAccountBookId } = get()

            set({
              accountBooks,
              currentAccountBookId: resolveFallbackCurrentAccountBookId(
                accountBooks,
                currentAccountBookId
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
            const { currentAccountBookId } = get()

            set({
              accountBooks,
              currentAccountBookId:
                deleted && currentAccountBookId === id
                  ? resolveFallbackCurrentAccountBookId(accountBooks, null)
                  : resolveFallbackCurrentAccountBookId(
                      accountBooks,
                      currentAccountBookId
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
