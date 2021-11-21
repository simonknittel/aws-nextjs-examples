import { ReactEventHandler, useState } from "react"

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
      method: 'PUT'
    })

    reset()
    submitCallback()
  }

  return (
    <form onSubmit={ submit } onReset={ reset }>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" type="text" required value={ name } onChange={ e => setName(e.target.value ) } />
      <button type="submit" disabled={ requestInProgress }>Submit</button>
    </form>
  )
}

export default CreateUserForm
