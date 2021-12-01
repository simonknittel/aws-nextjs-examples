import { useCallback, useEffect, useState } from 'react'
import { User } from '../services/interfaces/user'

interface Options {
  url: string
}

const useUsers = (initialData: User[] = [], options: Options): [ User[], boolean, () => Promise<void> ] => {
  const [ data, setData ] = useState(initialData)
  const [ refreshInProgress, setRefreshInProgress ] = useState(false)

  const refresh = useCallback(async () => {
    setRefreshInProgress(true)

    try {
      const res = await fetch(options.url)
      const json = await res.json();
      setData(json)
    } catch (error) {
      console.error(error)
    }

    setRefreshInProgress(false)
  }, [ options.url ])

  useEffect(() => {
    const interval = setInterval(() => {
      refresh()
    }, 30_000)

    return () => clearInterval(interval)
  }, [ refresh ])

  return [
    data,
    refreshInProgress,
    refresh
  ]
}

export default useUsers
