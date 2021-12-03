import './_app.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { CSRFContextProvider } from '../contexts/CSRFContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CSRFContextProvider pageProps={ pageProps }>
      <Layout>
        <Component { ...pageProps } />
      </Layout>
    </CSRFContextProvider>
  )
}

export default MyApp
