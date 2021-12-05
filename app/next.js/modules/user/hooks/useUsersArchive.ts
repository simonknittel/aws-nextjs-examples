import useAPI from '../../../hooks/useAPI'
import { User } from '../types'

export const useUsersArchive = (id: User['id']): [ boolean, () => Promise<void> ] => {
  const [ data, isLoading, doFetch ] = useAPI(`/user/${ id }/archive`, {
    method: 'PATCH',
  })

  return [ isLoading, doFetch ]
}
