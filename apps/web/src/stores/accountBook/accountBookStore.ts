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
  createAccountBook: (accountBook: AccountBook) => Promise<AccountBook>
  updateAccountBook: (
    id: AccountBook['id'],
    updates: Partial<AccountBook>
  ) => Promise<AccountBook | null>
  deleteAccountBook: (id: AccountBook['id']) => Promise<boolean>
  setCurrentAccountBookId: (id: AccountBook['id'] | null) => void
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

            set({
              accountBooks,
              initialized: true,
              isLoading: false,
              error: null,
            })

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

        createAccountBook: async (accountBook) => {
          set({ isLoading: true, error: null })

          try {
            const createdAccountBook = await accountBookRepo.create(accountBook)
            const accountBooks = await accountBookRepo.findAll()

            set({
              accountBooks,
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

            set({
              accountBooks,
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

            const updates: Partial<AccountBookStoreState> = {
              accountBooks,
              initialized: true,
              isLoading: false,
              error: null,
            }
            if (id === get().currentAccountBookId) {
              updates.currentAccountBookId = null
            }
            set(updates)

            return deleted
          } catch (error) {
            set({
              isLoading: false,
              error: toErrorMessage(error),
            })

            return false
          }
        },

        setCurrentAccountBookId: (id) => {
          set({ currentAccountBookId: id })
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
