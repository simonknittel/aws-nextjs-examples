import { useEffect, useState } from 'react'
import { User } from '../services/user'

const useUsers = (initialUsers: User[] = []) => {
  const [ users, setUsers ] = useState(initialUsers)
  const [ requestInProgress, setRequestInProgress ] = useState(false)

  const refresh = async () => {
    setRequestInProgress(true)

    try {
      const res = await fetch('/api/user')
      const users = await res.json();
      setUsers(users)
    } catch (error) {
      console.error(error)
    }

    setRequestInProgress(false)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      refresh()
    }, 30_000)

    return () => clearInterval(interval)
  })

  return {
    users,
    usersRequestInProgress: requestInProgress,
    refreshUsers: refresh
  }
}

export default useUsers
