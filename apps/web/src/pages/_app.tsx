import { AppProps } from 'next/app'
import Head from 'next/head'
import './styles.css'
import Layout from '@/components/layout'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'

// 擴展 AppProps 類型以包含 getLayout
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

// 定義包含 getLayout 的頁面組件類型
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  // 使用頁面的 getLayout 或使用默認布局
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)

  return getLayout(
    <>
      <Head>
        <title>Welcome to Duoji!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default CustomApp
