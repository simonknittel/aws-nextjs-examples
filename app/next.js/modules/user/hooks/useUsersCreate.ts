import { CreateItem } from '../types'
import useAPI from '../../../hooks/useAPI'

export const useUsersCreate = ({ name }: CreateItem): [ boolean, () => Promise<void> ] => {
  const [ data, isLoading, doFetch ] =  useAPI('/user', {
    body: JSON.stringify({
      name
    }),
    method: 'POST',
  })

  return [ isLoading, doFetch ]
}
