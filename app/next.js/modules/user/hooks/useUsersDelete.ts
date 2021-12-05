import { DeleteItem } from '../types'
import useAPI from '../../../hooks/useAPI'

export const useUsersDelete = (id: DeleteItem): [ boolean, () => Promise<void> ] => {
  const [ data, isLoading, doFetch ] = useAPI(`/user/${ id }`, {
    method: 'DELETE',
  })

  return [ isLoading, doFetch ]
}
