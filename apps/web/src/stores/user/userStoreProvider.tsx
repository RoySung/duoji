import { ReactNode, createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { UserStore, UserStoreApi } from './userStore'

const UserStoreContext = createContext<UserStoreApi | null>(null)

type UserStoreProviderProps = {
  children: ReactNode
  store: UserStoreApi
}

export function UserStoreProvider({
  children,
  store,
}: UserStoreProviderProps) {
  return (
    <UserStoreContext.Provider value={store}>
      {children}
    </UserStoreContext.Provider>
  )
}

export function useUserStore<T>(selector: (state: UserStore) => T): T {
  const store = useContext(UserStoreContext)

  if (!store) {
    throw new Error('useUserStore must be used within UserStoreProvider')
  }

  return useStore(store, selector)
}
