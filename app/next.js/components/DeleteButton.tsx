import { LoadingButton } from '@mui/lab'
import React, { useState } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

interface DeleteButtonProps {
  params: any;
  csrfToken: string;
  deleteCallback(): void;
}

const DeleteButton = ({ params, csrfToken, deleteCallback }: DeleteButtonProps) => {
  const [ requestInProgress, setRequestInProgress ] = useState(false)

  const onDelete = async (id: string) => {
    setRequestInProgress(true)

    const headers: HeadersInit = {}
    /**
     * We can't import the header name from the csrfService.ts file otherwise
     * the file would be fully included in the client bundle.
     */
    if (csrfToken) headers['x-csrf-token'] = csrfToken

    try {
      await fetch(`/api/user/${ id }`, {
        method: 'DELETE',
        headers,
      })
    } catch (error) {
      console.error(error)
    }

    setRequestInProgress(false)
    deleteCallback()
  }

  return (
    <LoadingButton
      variant="outlined"
      size="small"
      startIcon={<DeleteOutlinedIcon />} sx={{ ml: 1 }}
      onClick={() => onDelete(params.getValue(params.id, 'id') as string) }
      loading={ requestInProgress }
    >Delete</LoadingButton>
  )
}

export default DeleteButton
