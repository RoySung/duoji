import { ReactNode, createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { AccountBookStore, AccountBookStoreApi } from './accountBookStore'

const AccountBookStoreContext = createContext<AccountBookStoreApi | null>(null)

type AccountBookStoreProviderProps = {
  children: ReactNode
  store: AccountBookStoreApi
}

export function AccountBookStoreProvider({
  children,
  store,
}: AccountBookStoreProviderProps) {
  return (
    <AccountBookStoreContext.Provider value={store}>
      {children}
    </AccountBookStoreContext.Provider>
  )
}

export function useAccountBookStore<T>(
  selector: (state: AccountBookStore) => T
): T {
  const store = useContext(AccountBookStoreContext)

  if (!store) {
    throw new Error(
      'useAccountBookStore must be used within AccountBookStoreProvider'
    )
  }

  return useStore(store, selector)
}
