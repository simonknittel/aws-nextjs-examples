import './_app.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { CSRFContext } from '../contexts/CsrfContext'
import { useState } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const [ csrfToken ] = useState(pageProps.csrfToken)

  return (
    <CSRFContext.Provider value={ csrfToken }>
      <Layout>
        <Component { ...pageProps } />
      </Layout>
    </CSRFContext.Provider>
  )
}

export default MyApp
