import { TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { ReactEventHandler, useContext, useState } from 'react'
import { SendOutlined } from '@mui/icons-material'
import useUsersCreate from '../hooks/useUsersCreate'

const CreateUserForm = ({ submitCallback }: { submitCallback: any }) => {
  const [ name, setName ] = useState('')

  const onReset = () => {
    setName('')
  }

  const [ isLoading, doCreate ] = useUsersCreate({ name })

  const onSubmit: ReactEventHandler =  async e => {
    e.preventDefault()
    await doCreate()
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
