import { useContext } from 'react'
import { CSRFContext } from '../modules/csrf/context'
import { DeleteItem } from '../services/interfaces/user'
import useAPI from './useAPI'

const useUsersDelete = (id: DeleteItem): [ boolean, () => Promise<void> ] => {
  const csrfToken = useContext(CSRFContext)

  const [ data, isLoading, doFetch ] = useAPI(`/user/${ id }`, {
    method: 'DELETE',
    csrfToken,
  })

  return [ isLoading, doFetch ]
}

export default useUsersDelete
