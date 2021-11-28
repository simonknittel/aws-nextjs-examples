import { TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { ReactEventHandler, useState } from 'react'
import { SendOutlined } from '@mui/icons-material'

const CreateUserForm = ({ submitCallback, csrfToken }: { submitCallback: any, csrfToken: string }) => {
  const [ name, setName ] = useState('')
  const [ requestInProgress, setRequestInProgress ] = useState(false)

  const reset = () => {
    setName('')
    setRequestInProgress(false)
  }

  const submit: ReactEventHandler = async e => {
    e.preventDefault()

    setRequestInProgress(true)

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    /**
     * We can't import the header name from the csrfService.ts file otherwise
     * the file would be fully included in the client bundle.
     */
    if (csrfToken) headers['x-csrf-token'] = csrfToken

    await fetch('/api/user', {
      body: JSON.stringify({
        name
      }),
      method: 'POST',
      headers,
    })

    reset()
    submitCallback()
  }

  return (
    <form onSubmit={ submit } onReset={ reset }>
      <TextField label="Name" name="name" type="text" required value={ name } onChange={ e => setName(e.target.value ) } variant="filled" />
      <LoadingButton variant="contained" type="submit" loading={ requestInProgress } endIcon={<SendOutlined />}>Submit</LoadingButton>
    </form>
  )
}

export default CreateUserForm
