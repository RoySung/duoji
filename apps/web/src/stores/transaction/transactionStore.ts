import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'
import { Transaction, TransactionRepo } from '@/entities/transaction'
import { TransactionLocalRepo } from '@/repositories/transactionRepo'

export type TransactionModalMode = 'create' | 'edit'

type TransactionStoreState = {
  transactions: Transaction[]
  scopedAccountBookId: string | null
  pendingScopedAccountBookId: string | null
  selectedTransactionId: string | null
  modalMode: TransactionModalMode
  isModalOpen: boolean
  initialized: boolean
  isLoading: boolean
  error: string | null
}

type TransactionStoreActions = {
  initialize: (accountBookId: string | null) => Promise<void>
  loadTransactions: (accountBookId: string | null) => Promise<Transaction[]>
  createTransaction: (transaction: Transaction) => Promise<Transaction>
  updateTransaction: (
    id: string,
    updates: Partial<Transaction>
  ) => Promise<Transaction | null>
  deleteTransaction: (id: string) => Promise<boolean>
  openCreateModal: () => void
  openEditModal: (transactionId: string) => void
  closeModal: () => void
  resetInMemoryState: () => void
}

export type TransactionStore = TransactionStoreState & TransactionStoreActions
export type TransactionStoreApi = ReturnType<typeof createTransactionStore>

const initialTransactionStoreState: TransactionStoreState = {
  transactions: [],
  scopedAccountBookId: null,
  pendingScopedAccountBookId: null,
  selectedTransactionId: null,
  modalMode: 'create',
  isModalOpen: false,
  initialized: false,
  isLoading: false,
  error: null,
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown transaction error'
}

function sortTransactions(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((left, right) => {
    if (left.date !== right.date) {
      return right.date.localeCompare(left.date)
    }

    if (left.updatedAt !== right.updatedAt) {
      return right.updatedAt - left.updatedAt
    }

    return right.createdAt - left.createdAt
  })
}

function upsertTransaction(
  transactions: Transaction[],
  transaction: Transaction
): Transaction[] {
  const existingIndex = transactions.findIndex(
    (existingTransaction) => existingTransaction.id === transaction.id
  )

  if (existingIndex === -1) {
    return sortTransactions([...transactions, transaction])
  }

  const nextTransactions = [...transactions]
  nextTransactions[existingIndex] = transaction
  return sortTransactions(nextTransactions)
}

export function createTransactionStore(
  transactionRepo: TransactionRepo = new TransactionLocalRepo(),
  initialState: Partial<TransactionStoreState> = {}
) {
  return createStore<TransactionStore>()(
    devtools(
      (set, get) => ({
        ...initialTransactionStoreState,
        ...initialState,

        initialize: async (accountBookId) => {
          await get().loadTransactions(accountBookId)
        },

        loadTransactions: async (accountBookId) => {
          set({
            isLoading: true,
            error: null,
            pendingScopedAccountBookId: accountBookId,
          })

          if (!accountBookId) {
            set({
              transactions: [],
              scopedAccountBookId: null,
              pendingScopedAccountBookId: null,
              initialized: true,
              isLoading: false,
              error: null,
            })

            return []
          }

          try {
            const transactions = await transactionRepo.findByAccountBookId(
              accountBookId
            )

            set((state) => {
              if (state.pendingScopedAccountBookId !== accountBookId) {
                return {}
              }

              return {
                transactions: sortTransactions(transactions),
                scopedAccountBookId: accountBookId,
                pendingScopedAccountBookId: null,
                initialized: true,
                isLoading: false,
                error: null,
              }
            })

            return transactions
          } catch (error) {
            set((state) => {
              if (state.pendingScopedAccountBookId !== accountBookId) {
                return {}
              }

              return {
                transactions: [],
                scopedAccountBookId: accountBookId,
                pendingScopedAccountBookId: null,
                initialized: true,
                isLoading: false,
                error: toErrorMessage(error),
              }
            })

            return []
          }
        },

        createTransaction: async (transaction) => {
          set({ isLoading: true, error: null })

          try {
            const createdTransaction = await transactionRepo.create(transaction)

            set((state) => ({
              transactions:
                createdTransaction.accountBookId === state.scopedAccountBookId
                  ? upsertTransaction(state.transactions, createdTransaction)
                  : state.transactions,
              isLoading: false,
              error: null,
            }))

            return createdTransaction
          } catch (error) {
            set({
              isLoading: false,
              error: toErrorMessage(error),
            })
            throw error
          }
        },

        updateTransaction: async (id, updates) => {
          set({ isLoading: true, error: null })

          try {
            const updatedTransaction = await transactionRepo.update(id, updates)

            set((state) => {
              if (!updatedTransaction) {
                return {
                  isLoading: false,
                  error: null,
                }
              }

              const nextTransactions =
                updatedTransaction.accountBookId === state.scopedAccountBookId
                  ? upsertTransaction(state.transactions, updatedTransaction)
                  : state.transactions.filter(
                      (transaction) => transaction.id !== updatedTransaction.id
                    )

              return {
                transactions: nextTransactions,
                isLoading: false,
                error: null,
              }
            })

            return updatedTransaction
          } catch (error) {
            set({
              isLoading: false,
              error: toErrorMessage(error),
            })
            throw error
          }
        },

        deleteTransaction: async (id) => {
          set({ isLoading: true, error: null })

          try {
            const deleted = await transactionRepo.delete(id)

            set((state) => ({
              transactions: deleted
                ? state.transactions.filter(
                    (transaction) => transaction.id !== id
                  )
                : state.transactions,
              selectedTransactionId:
                state.selectedTransactionId === id
                  ? null
                  : state.selectedTransactionId,
              modalMode:
                state.selectedTransactionId === id ? 'create' : state.modalMode,
              isModalOpen:
                state.selectedTransactionId === id ? false : state.isModalOpen,
              isLoading: false,
              error: null,
            }))

            return deleted
          } catch (error) {
            set({
              isLoading: false,
              error: toErrorMessage(error),
            })

            return false
          }
        },

        openCreateModal: () => {
          set({
            isModalOpen: true,
            modalMode: 'create',
            selectedTransactionId: null,
          })
        },

        openEditModal: (transactionId) => {
          set({
            isModalOpen: true,
            modalMode: 'edit',
            selectedTransactionId: transactionId,
          })
        },

        closeModal: () => {
          set({
            isModalOpen: false,
            modalMode: 'create',
            selectedTransactionId: null,
          })
        },

        resetInMemoryState: () => {
          set(initialTransactionStoreState)
        },
      }),
      {
        name: 'transaction-store',
      }
    )
  )
}
