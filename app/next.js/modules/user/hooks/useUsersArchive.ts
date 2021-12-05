import { useContext } from 'react'
import { CSRFContext } from '../../csrf'
import useAPI from '../../../hooks/useAPI'
import { User } from '../types'

export const useUsersArchive = (id: User['id']): [ boolean, () => Promise<void> ] => {
  const csrfToken = useContext(CSRFContext)

  const [ data, isLoading, doFetch ] = useAPI(`/user/${ id }/archive`, {
    method: 'PATCH',
    csrfToken,
  })

  return [ isLoading, doFetch ]
}
