import { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import './styles.css'
import Layout from '@/components/layout/layout'
import { NextPage } from 'next'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { THEME_STORAGE_KEY } from '@/constants/theme'
import {
  AccountBookStoreProvider,
  createAccountBookStore,
  useAccountBookStore,
} from '@/stores/accountBook/index'
import { initializeDB } from '@/lib/dexie'
import {
  TransactionStoreProvider,
  createTransactionStore,
} from '@/stores/transaction'
import { CategoryStoreProvider, createCategoryStore } from '@/stores/category'
import {
  UserStoreProvider,
  createUserStore,
  useUserStore,
} from '@/stores/user'

// 擴展 AppProps 類型以包含 getLayout
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

// 定義包含 getLayout 的頁面組件類型
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

// Wires userStore to reload whenever the active account book changes
function UserStoreWatcher() {
  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const currentAccountBookId = useAccountBookStore(
    (state) => state.currentAccountBookId
  )
  const initializeUsers = useUserStore((state) => state.initialize)

  const currentAccountBook =
    accountBooks.find((ab) => ab.id === currentAccountBookId) ?? null

  useEffect(() => {
    void initializeUsers(currentAccountBook)
  }, [currentAccountBook, initializeUsers])

  return null
}

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const [accountBookStore] = useState(createAccountBookStore)
  const [transactionStore] = useState(createTransactionStore)
  const [categoryStore] = useState(createCategoryStore)
  const [userStore] = useState(createUserStore)

  // 初始化資料庫
  useEffect(() => {
    let isMounted = true

    async function bootstrap() {
      await initializeDB()

      if (!isMounted) {
        return
      }

      await accountBookStore.getState().initialize()
    }

    void bootstrap()

    return () => {
      isMounted = false
    }
  }, [accountBookStore])

  // 使用頁面的 getLayout 或使用默認布局
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      enableSystem={false}
      storageKey={THEME_STORAGE_KEY}
      themes={['light', 'dark']}
    >
      <AccountBookStoreProvider store={accountBookStore}>
        <TransactionStoreProvider store={transactionStore}>
          <CategoryStoreProvider store={categoryStore}>
            <UserStoreProvider store={userStore}>
              <UserStoreWatcher />
              {getLayout(
                <>
                  <Head>
                    <title>Welcome to Duoji!</title>
                    <meta
                      name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                    />
                  </Head>
                  <Component {...pageProps} />
                </>
              )}
            </UserStoreProvider>
          </CategoryStoreProvider>
        </TransactionStoreProvider>
      </AccountBookStoreProvider>
    </ThemeProvider>
  )
}

export default CustomApp
