import useAPI from '../../../hooks/useAPI'
import { User } from '../types'

export const useUsersRestore = (id: User['id']): [ boolean, () => Promise<void> ] => {
  const [ data, isLoading, doFetch ] = useAPI(`/user/${ id }/restore`, {
    method: 'PATCH',
  })

  return [ isLoading, doFetch ]
}
