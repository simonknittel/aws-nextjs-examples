import { useContext } from 'react'
import { CSRFContext } from '../../csrf'
import { CreateItem } from '../types'
import useAPI from '../../../hooks/useAPI'

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
