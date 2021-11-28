import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import { userService } from '../services/user'
import React, { useState } from 'react'
import CreateUserForm from '../components/CreateUserForm'
import { DataGrid, GridColDef, GridRowsProp, GridSortDirection } from '@mui/x-data-grid'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import useUsers from '../hooks/useUsers'
import prettyDate from '../utils/prettyDate'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import copyToClipboard from '../utils/copyToClipboard'
import { csrfService } from '../services/csrfService'
import DeleteButton from '../components/DeleteButton'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const props: { [key: string]: any } = {}

  const users = await userService.findAll()
  props.ssrUsers = users

  const csrfToken = csrfService.generateToken(req)
  if (csrfToken) props.csrfToken = csrfToken

  return { props }
}

const Home: NextPage = ({ ssrUsers, csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [ users, usersRefreshInProgress, refreshUsers ] = useUsers(ssrUsers, { url: '/api/user' })

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
      field: 'lastEditDate',
      headerName: 'Last edit',
      width: 250,
      type: 'dateTime',
      valueGetter: ({ value }) => value && new Date(value),
      renderCell: ({ value }) => {
        if (!value) return null
        return (
          <time dateTime={ value.toISOString() } title={ value.toLocaleString() }>{ prettyDate(value) }</time>
        )
      },
    },
    {
      field: 'creationDate',
      headerName: 'Creation',
      width: 250,
      type: 'dateTime',
      valueGetter: ({ value }) => value && new Date(value),
      renderCell: ({ value }) => (
        <time dateTime={ value.toISOString() } title={ value.toLocaleString() }>{ prettyDate(value) }</time>
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

        <DeleteButton
          params={ params }
          csrfToken={ csrfToken }
          deleteCallback={ refreshUsers }
        />
      </>),
      flex: 1,
    },
  ]

  const dataGridRows: GridRowsProp = users

  const [ sortModel, setSortModel ] = useState([
    {
      field: 'lastEditDate',
      sort: 'desc' as GridSortDirection, // @TODO: Not sure why this assertion is necessary
    },
    {
      field: 'creationDate',
      sort: 'desc' as GridSortDirection, // @TODO: Not sure why this assertion is necessary
    },
  ])

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
          <CreateUserForm submitCallback={ refreshUsers } csrfToken={ csrfToken } />
        </Box>

        <Box pt={ 4 }>
          <DataGrid
            columns={ dataGridColumns }
            rows={ dataGridRows }
            autoHeight
            loading={ usersRefreshInProgress }
            isRowSelectable={ () => false }
            sortModel={ sortModel }
            onSortModelChange={ model => setSortModel(model) }
          />
        </Box>
      </main>
    </>
  )
}

export default Home
