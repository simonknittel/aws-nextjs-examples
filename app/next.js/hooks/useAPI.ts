import { useCallback, useState } from 'react'

interface Options extends RequestInit {
  csrfToken?: string
}

// @TODO: Implement error handling
const useAPI = (url: string, options: Options): [ any, boolean, () => Promise<void> ] => {
  const [ data, setData ] = useState()
  const [ isLoading, setIsLoading ] = useState(false)

  const doFetch = useCallback(async () => {
    setIsLoading(true)

    const init = { ...options }

    if (!init.headers) init.headers = new Headers()

    if (init.method && ['POST', 'PATCH'].includes(init.method)) {
      setHeader(init.headers, 'Content-Type', 'application/json; charset=utf-8')
    }

    if (init.method && ['POST', 'PATCH', 'DELETE'].includes(init.method) && options.csrfToken) {
      /**
       * We can't import the header name from the csrfService.ts file otherwise
       * the file would be fully included in the client bundle.
       */
      setHeader(init.headers, 'X-CSRF-Token', options.csrfToken)
    }

    const response = await fetch('/api' + url, init)

    if (response.headers.get('content-type') === 'application/json') {
      const json = await response.json()
      setData(json)
    }

    setIsLoading(false)
  }, [ url, options ])

  return [
    data,
    isLoading,
    doFetch,
  ]
}

export default useAPI

function setHeader(headers: HeadersInit, key: string, value: string) {
  if (headers instanceof Headers) {
    headers.set(key, value)
  } else if (Array.isArray(headers)) {
    headers.push([ key, value])
  } else if (typeof headers === 'object') {
    headers[key] = value
  }
}
