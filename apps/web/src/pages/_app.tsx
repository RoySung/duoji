import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import Layout from '@/components/layout';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>Welcome to web!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </Layout>
  );
}

export default CustomApp;
