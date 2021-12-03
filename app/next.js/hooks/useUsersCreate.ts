import { useContext } from 'react'
import { CSRFContext } from '../modules/csrf/context'
import { CreateItem } from '../services/interfaces/user'
import useAPI from './useAPI'

const useUsersCreate = ({ name }: CreateItem): [ boolean, () => Promise<void> ] => {
  const csrfToken = useContext(CSRFContext)

  const [ data, isLoading, doFetch ] =  useAPI('/user', {
    body: JSON.stringify({
      name
    }),
    method: 'POST',
    csrfToken
  })

  return [ isLoading, doFetch ]
}

export default useUsersCreate
