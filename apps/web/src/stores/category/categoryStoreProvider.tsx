import { ReactNode, createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { CategoryStore, CategoryStoreApi } from './categoryStore'

const CategoryStoreContext = createContext<CategoryStoreApi | null>(null)

type CategoryStoreProviderProps = {
  children: ReactNode
  store: CategoryStoreApi
}

export function CategoryStoreProvider({
  children,
  store,
}: CategoryStoreProviderProps) {
  return (
    <CategoryStoreContext.Provider value={store}>
      {children}
    </CategoryStoreContext.Provider>
  )
}

export function useCategoryStore<T>(selector: (state: CategoryStore) => T): T {
  const store = useContext(CategoryStoreContext)

  if (!store) {
    throw new Error(
      'useCategoryStore must be used within CategoryStoreProvider'
    )
  }

  return useStore(store, selector)
}
