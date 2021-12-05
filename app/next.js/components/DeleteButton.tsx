import { LoadingButton } from '@mui/lab'
import React, { ReactEventHandler } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useUserDelete } from '../modules/user/client'

interface Props {
  params: any;
  callback(): any;
  [key: string]: any; // @TODO: Properly extend LoadingButton's props
}

const DeleteButton = ({ params, callback, ...other }: Props) => {
  const [ isLoading, doDelete ] = useUserDelete(params.id)

  const onClick: ReactEventHandler = async e => {
    e.preventDefault()
    await doDelete()
    callback()
  }

  return (
    <LoadingButton
      variant="outlined"
      size="small"
      startIcon={<DeleteOutlinedIcon />}
      onClick={ onClick }
      loading={ isLoading }
      { ...other }
    >Delete</LoadingButton>
  )
}

export default DeleteButton
