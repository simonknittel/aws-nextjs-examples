import { useCallback, useEffect, useState } from 'react'
import { User } from '../services/interfaces/user'

const useUsers = (initialData: User[] = []): [ User[], boolean, () => Promise<void> ] => {
  const [ data, setData ] = useState(initialData)
  const [ refreshInProgress, setRefreshInProgress ] = useState(false)

  const refresh = useCallback(async () => {
    setRefreshInProgress(true)

    try {
      const res = await fetch('/api/user')
      const json = await res.json();
      setData(json)
    } catch (error) {
      console.error(error)
    }

    setRefreshInProgress(false)
  }, [])

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
