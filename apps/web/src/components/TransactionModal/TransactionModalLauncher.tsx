import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'

type CreateTransactionHandler = () => void

type TransactionModalLauncherValue = {
  openCreateTransaction: () => boolean
  registerCreateTransactionHandler: (
    handler: CreateTransactionHandler
  ) => () => void
}

const fallbackLauncher: TransactionModalLauncherValue = {
  openCreateTransaction: () => false,
  registerCreateTransactionHandler: () => () => undefined,
}

const TransactionModalLauncherContext =
  createContext<TransactionModalLauncherValue>(fallbackLauncher)

export function TransactionModalLauncherProvider({
  children,
}: {
  children: ReactNode
}) {
  const createTransactionHandlerRef = useRef<CreateTransactionHandler | null>(
    null
  )

  const registerCreateTransactionHandler = useCallback(
    (handler: CreateTransactionHandler) => {
      createTransactionHandlerRef.current = handler

      return () => {
        if (createTransactionHandlerRef.current === handler) {
          createTransactionHandlerRef.current = null
        }
      }
    },
    []
  )

  const openCreateTransaction = useCallback(() => {
    const handler = createTransactionHandlerRef.current

    if (!handler) {
      return false
    }

    handler()
    return true
  }, [])

  const value = useMemo(
    () => ({
      openCreateTransaction,
      registerCreateTransactionHandler,
    }),
    [openCreateTransaction, registerCreateTransactionHandler]
  )

  return (
    <TransactionModalLauncherContext.Provider value={value}>
      {children}
    </TransactionModalLauncherContext.Provider>
  )
}

export function useOpenCreateTransaction() {
  return useContext(TransactionModalLauncherContext).openCreateTransaction
}

export function useRegisterCreateTransactionHandler(
  handler: CreateTransactionHandler
) {
  const { registerCreateTransactionHandler } = useContext(
    TransactionModalLauncherContext
  )

  useEffect(
    () => registerCreateTransactionHandler(handler),
    [handler, registerCreateTransactionHandler]
  )
}
