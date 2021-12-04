import { useContext } from 'react'
import { CSRFContext } from '../../csrf'
import { DeleteItem } from '../types'
import useAPI from '../../../hooks/useAPI'

const useUsersDelete = (id: DeleteItem): [ boolean, () => Promise<void> ] => {
  const csrfToken = useContext(CSRFContext)

  const [ data, isLoading, doFetch ] = useAPI(`/user/${ id }`, {
    method: 'DELETE',
    csrfToken,
  })

  return [ isLoading, doFetch ]
}

export default useUsersDelete
