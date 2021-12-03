import { DeleteItem } from '../services/interfaces/user'
import useAPI from './useAPI'

const useUsersDelete = (id: DeleteItem, csrfToken: string): [ boolean, () => Promise<void> ] => {
  const [ data, isLoading, doFetch ] = useAPI(`/user/${ id }`, {
    method: 'DELETE',
    csrfToken,
  })

  return [ isLoading, doFetch ]
}

export default useUsersDelete
