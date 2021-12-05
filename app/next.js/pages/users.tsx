import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import { userService } from '../modules/user/service'
import React, { useState } from 'react'
import CreateUserForm from '../components/CreateUserForm'
import { DataGrid, GridColDef, GridRowsProp, GridSortDirection } from '@mui/x-data-grid'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, IconButton, Stack, Typography } from '@mui/material'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useUsers } from '../modules/user/client'
import prettyDate from '../utils/prettyDate'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import copyToClipboard from '../utils/copyToClipboard'
import DeleteButton from '../components/DeleteButton'
import { withCSRFToken } from '../modules/csrf'
import ArchiveButton from '../components/ArchiveButton'
import RestoreButton from '../components/RestoreButton'

export const getServerSideProps: GetServerSideProps = withCSRFToken(async () => {
  const props: { [key: string]: any } = {}

  const users = await userService.findAll()
  props.ssrUsers = users

  return { props }
})

const Home: NextPage = ({ ssrUsers }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [ users, usersRefreshInProgress, refreshUsers ] = useUsers(ssrUsers)

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
      width: 200,
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
      width: 200,
      type: 'dateTime',
      valueGetter: ({ value }) => value && new Date(value),
      renderCell: ({ value }) => (
        <time dateTime={ value.toISOString() } title={ value.toLocaleString() }>{ prettyDate(value) }</time>
      ),
    },
    {
      field: 'archivedDate',
      headerName: 'Archived',
      width: 200,
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
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (<>
        { params.row.archivedDate && <>
          <RestoreButton
            params={ params }
            callback={ refreshUsers }
          />

          <DeleteButton
            params={ params }
            callback={ refreshUsers }
            sx={{ ml: 1 }}
          />
        </> }

        { !params.row.archivedDate && <>
          <Button
            variant="contained"
            size="small"
            startIcon={<CreateOutlinedIcon />}
          >Edit</Button>

          <ArchiveButton
            params={ params }
            callback={ refreshUsers }
            sx={{ ml: 1 }}
          />
        </> }
      </>),
      flex: 1,
    },
  ]

  const dataGridRows: GridRowsProp = users.filter(user => !user.archivedDate)
  const dataGridRowsArchived: GridRowsProp = users.filter(user => user.archivedDate)

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

  const [ showArchivedUsers, setShowArchivedUsers ] = useState(false)

  return (
    <>
      <Head>
        <title>Users - aws-service</title>
      </Head>

      <main>
        <Typography variant="h4" component="h1">
          Users
        </Typography>

        <Box pt={ 2 }>
          <CreateUserForm submitCallback={ refreshUsers } />
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

        <Box pt={ 4 }>
          {/* @TODO: Customize https://mui.com/components/accordion/#customization */}
          <Accordion expanded={ showArchivedUsers } onChange={ () => setShowArchivedUsers(!showArchivedUsers) }>
            <AccordionSummary aria-controls="archived-users-content" id="archived-users-header">
              <Typography variant="h5" component="h2">
                Archived users
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <DataGrid
                columns={ dataGridColumns }
                rows={ dataGridRowsArchived }
                autoHeight
                loading={ usersRefreshInProgress }
                isRowSelectable={ () => false }
                sortModel={ sortModel }
                onSortModelChange={ model => setSortModel(model) }
              />
            </AccordionDetails>
          </Accordion>
        </Box>
      </main>
    </>
  )
}

export default Home
