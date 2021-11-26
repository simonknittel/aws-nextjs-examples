import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import { userService } from '../services/user'
import React, { useState } from 'react'
import CreateUserForm from '../components/CreateUserForm'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { Box, Button, Typography } from '@mui/material'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { LoadingButton } from '@mui/lab'
import useUsers from '../hooks/useUsers'

export const getServerSideProps: GetServerSideProps = async () => {
  const users = await userService.findAll()

  return {
    props: {
      ssrUsers: users
    }
  }
}

const Home: NextPage = ({ ssrUsers }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { users, usersRequestInProgress, refreshUsers } = useUsers(ssrUsers)
  const [ deleteRequestInProgress, setDeleteRequestInProgress ] = useState(false)

  const onDelete = async (id: string) => {
    setDeleteRequestInProgress(true)

    try {
      await fetch(`/api/user/${ id }`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error(error)
    }

    setDeleteRequestInProgress(false)
    refreshUsers()
  }

  const dataGridColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 400 },
    { field: 'name', headerName: 'Name', width: 400 },
    {
      field: 'creationDate',
      headerName: 'Creation date',
      width: 400,
      type: 'dateTime',
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (<>
        <Button
          variant="contained"
          size="small"
          startIcon={<CreateOutlinedIcon />}
        >Edit</Button>

        <LoadingButton
          variant="outlined"
          size="small"
          startIcon={<DeleteOutlinedIcon />} sx={{ ml: 1 }}
          onClick={() => onDelete(params.getValue(params.id, 'id') as string) }
          loading={ deleteRequestInProgress }
        >Delete</LoadingButton>
      </>),
      flex: 1,
    }
  ]

  const dataGridRows: GridRowsProp = users

  return (
    <>
      <Head>
        <title>Users - aws-service</title>
      </Head>

      <main>
        <Typography variant="h4" component="h1">
          Users
        </Typography>

        <Box pt={ 2  }>
          <CreateUserForm submitCallback={ refreshUsers } />
        </Box>

        <Box pt={ 4 }>
          <DataGrid
            columns={ dataGridColumns }
            rows={ dataGridRows }
            autoHeight
            loading={ usersRequestInProgress }
          />
        </Box>
      </main>
    </>
  )
}

export default Home
