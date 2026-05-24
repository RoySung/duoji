import { ReactNode, createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { SettingsStore, SettingsStoreApi } from './settingsStore'

const SettingsStoreContext = createContext<SettingsStoreApi | null>(null)

type SettingsStoreProviderProps = {
  children: ReactNode
  store: SettingsStoreApi
}

export function SettingsStoreProvider({
  children,
  store,
}: SettingsStoreProviderProps) {
  return (
    <SettingsStoreContext.Provider value={store}>
      {children}
    </SettingsStoreContext.Provider>
  )
}

export function useSettingsStore<T>(selector: (state: SettingsStore) => T): T {
  const store = useContext(SettingsStoreContext)
  if (!store) {
    throw new Error(
      'useSettingsStore must be used within SettingsStoreProvider'
    )
  }
  return useStore(store, selector)
}
