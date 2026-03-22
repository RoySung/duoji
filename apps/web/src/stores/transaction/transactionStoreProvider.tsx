import { ReactNode, createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { TransactionStore, TransactionStoreApi } from './transactionStore'

const TransactionStoreContext = createContext<TransactionStoreApi | null>(null)

type TransactionStoreProviderProps = {
  children: ReactNode
  store: TransactionStoreApi
}

export function TransactionStoreProvider({
  children,
  store,
}: TransactionStoreProviderProps) {
  return (
    <TransactionStoreContext.Provider value={store}>
      {children}
    </TransactionStoreContext.Provider>
  )
}

export function useTransactionStore<T>(
  selector: (state: TransactionStore) => T
): T {
  const store = useContext(TransactionStoreContext)

  if (!store) {
    throw new Error(
      'useTransactionStore must be used within TransactionStoreProvider'
    )
  }

  return useStore(store, selector)
}