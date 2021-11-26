import { TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { ReactEventHandler, useState } from 'react'
import { SendOutlined } from '@mui/icons-material'

const CreateUserForm = ({ submitCallback }: { submitCallback: any }) => {
  const [ name, setName ] = useState('')
  const [ requestInProgress, setRequestInProgress ] = useState(false)

  const reset = () => {
    setName('')
    setRequestInProgress(false)
  }

  const submit: ReactEventHandler = async e => {
    e.preventDefault()

    setRequestInProgress(true)

    await fetch('/api/user', {
      body: JSON.stringify({
        name
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
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
