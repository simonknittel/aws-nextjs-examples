import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import { userService } from '../services/user'
import React, { useState } from 'react'
import CreateUserForm from '../components/CreateUserForm'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { LoadingButton } from '@mui/lab'
import useUsers from '../hooks/useUsers'
import prettyDate from '../utils/prettyDate'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import copyToClipboard from '../utils/copyToClipboard'

export const getServerSideProps: GetServerSideProps = async () => {
  const users = await userService.findAll()

  return {
    props: {
      ssrUsers: users
    }
  }
}

const Home: NextPage = ({ ssrUsers }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [ users, usersRefreshInProgress, refreshUsers ] = useUsers(ssrUsers, { url: '/api/user'})
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
    {
      field: 'id',
      headerName: 'ID',
      width: 400,
      renderCell: ({ value }) => (
        <Stack
          direction="row"
          justifyContent="space-between"
        >
          <Box sx={{ width: '275px' }}>
            { value }
          </Box>

          <Box>
            <IconButton onClick={ () => copyToClipboard(value) }>
              <ContentCopyOutlinedIcon />
            </IconButton>
          </Box>
        </Stack>
      )
    },
    { field: 'name', headerName: 'Name', width: 400 },
    {
      field: 'creationDate',
      headerName: 'Creation date',
      width: 400,
      type: 'dateTime',
      valueGetter: ({ value }) => value && new Date(value),
      renderCell: ({ value }) => (
        <time dateTime={ value.toISOString() }>{ prettyDate(value) }</time>
      ),
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
    },
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
            loading={ usersRefreshInProgress }
            isRowSelectable={ () => false }
          />
        </Box>
      </main>
    </>
  )
}

export default Home
