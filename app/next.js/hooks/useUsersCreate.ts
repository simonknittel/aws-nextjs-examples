import { CreateItem } from '../services/interfaces/user'
import useAPI from './useAPI'

const useUsersCreate = ({ name }: CreateItem, csrfToken: string): [ boolean, () => Promise<void> ] => {
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
