import { LoadingButton } from '@mui/lab'
import React, { ReactEventHandler } from 'react'
import RestoreFromTrashOutlinedIcon from '@mui/icons-material/RestoreFromTrashOutlined'
import { useUsersRestore } from '../modules/user/client'

interface Props {
  params: any;
  callback(): any;
  [key: string]: any; // @TODO: Properly extend LoadingButton's props
}

const RestoreButton = ({ params, callback, ...other }: Props) => {
  const [ isLoading, doRestore ] = useUsersRestore(params.id)

  const onClick: ReactEventHandler = async e => {
    e.preventDefault()
    await doRestore()
    callback()
  }

  return (
    <LoadingButton
      variant="outlined"
      size="small"
      startIcon={<RestoreFromTrashOutlinedIcon />}
      onClick={ onClick }
      loading={ isLoading }
      { ...other }
    >Restore</LoadingButton>
  )
}

export default RestoreButton
