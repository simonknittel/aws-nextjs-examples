import { createContext, FunctionComponent, useState } from 'react'

export const CSRFContext = createContext(undefined)

interface CSRFContextProviderProps {
  pageProps: { [key: string]: any; };
}

export const CSRFContextProvider: FunctionComponent<CSRFContextProviderProps> = ({ children, pageProps }) => {
  const [ csrfToken ] = useState(pageProps.csrfToken)

  return (
    <CSRFContext.Provider value={ csrfToken }>
      { children }
    </CSRFContext.Provider>
  )
}
