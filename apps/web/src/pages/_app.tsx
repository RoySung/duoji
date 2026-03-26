import { AppProps } from 'next/app'
import Head from 'next/head'
import './styles.css'
import Layout from '@/components/layout/layout'
import { NextPage } from 'next'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import {
  AccountBookStoreProvider,
  createAccountBookStore,
} from '@/stores/accountBook/index'
import { initializeDB } from '@/lib/dexie'
import {
  TransactionStoreProvider,
  createTransactionStore,
} from '@/stores/transaction'
import { CategoryStoreProvider, createCategoryStore } from '@/stores/category'

// 擴展 AppProps 類型以包含 getLayout
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

// 定義包含 getLayout 的頁面組件類型
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const [accountBookStore] = useState(createAccountBookStore)
  const [transactionStore] = useState(createTransactionStore)
  const [categoryStore] = useState(createCategoryStore)

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
    <AccountBookStoreProvider store={accountBookStore}>
      <TransactionStoreProvider store={transactionStore}>
        <CategoryStoreProvider store={categoryStore}>
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
        </CategoryStoreProvider>
      </TransactionStoreProvider>
    </AccountBookStoreProvider>
  )
}

export default CustomApp
