import { TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { ReactEventHandler, useState } from 'react'
import { SendOutlined } from '@mui/icons-material'
import useFetch from '../hooks/useFetch'

const CreateUserForm = ({ submitCallback, csrfToken }: { submitCallback: any, csrfToken: string }) => {
  const [ name, setName ] = useState('')

  const onReset = () => {
    setName('')
  }

  const [ data, isLoading, doFetch ] = useFetch('/api/user', {
    body: JSON.stringify({
      name
    }),
    method: 'POST',
    csrfToken
  })

  const onSubmit: ReactEventHandler =  async e => {
    e.preventDefault()
    await doFetch()
    onReset()
    submitCallback()
  }

  return (
    <form onSubmit={ onSubmit } onReset={ onReset }>
      <TextField label="Name" name="name" type="text" required value={ name } onChange={ e => setName(e.target.value ) } variant="filled" />
      <LoadingButton variant="contained" type="submit" loading={ isLoading } endIcon={<SendOutlined />}>Submit</LoadingButton>
    </form>
  )
}

export default CreateUserForm
