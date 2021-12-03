import { LoadingButton } from '@mui/lab'
import React, { ReactEventHandler } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import useUsersDelete from '../hooks/useUsersDelete'

interface DeleteButtonProps {
  params: any;
  csrfToken: string;
  deleteCallback(): any;
}

const DeleteButton = ({ params, csrfToken, deleteCallback }: DeleteButtonProps) => {
  const [ isLoading, doDelete ] = useUsersDelete(params.id, csrfToken)

  const onDelete: ReactEventHandler = async e => {
    e.preventDefault()
    await doDelete()
    deleteCallback()
  }

  return (
    <LoadingButton
      variant="outlined"
      size="small"
      startIcon={<DeleteOutlinedIcon />} sx={{ ml: 1 }}
      onClick={ onDelete }
      loading={ isLoading }
    >Delete</LoadingButton>
  )
}

export default DeleteButton
