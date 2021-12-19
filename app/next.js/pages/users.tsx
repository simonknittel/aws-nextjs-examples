import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import { userService } from '../modules/user/service'
import React, { useState } from 'react'
import CreateUserForm from '../components/CreateUserForm'
import { DataGrid, GridColDef, GridRowsProp, GridSortDirection } from '@mui/x-data-grid'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, IconButton, Stack, Typography } from '@mui/material'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useUserGetAll } from '../modules/user/client'
import prettyDate from '../utils/prettyDate'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import copyToClipboard from '../utils/copyToClipboard'
import DeleteButton from '../components/DeleteButton'
import { withCSRFToken } from '../modules/csrf'
import ArchiveButton from '../components/ArchiveButton'
import RestoreButton from '../components/RestoreButton'
import { withAuthentication } from '../utils/withAuthentication'

export const getServerSideProps: GetServerSideProps = withAuthentication(withCSRFToken(async () => {
  const props: { [key: string]: any } = {}

  const users = await userService.findAll()
  props.ssrUsers = users

  return { props }
}), { redirect: '/users' })

const Home: NextPage = ({ ssrUsers, me }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [ disableAutomaticRefresh, setDisableAutomaticRefresh ] = useState(false)
  const [ users, usersRefreshInProgress, refreshUsers ] = useUserGetAll(ssrUsers, { disableAutomaticRefresh })

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
      valueGetter: ({ value, row }) => {
        if (!value) return new Date(row.creationDate)
        return new Date(value)
      },
      renderCell: ({ value, row }) => {
        if (!row.lastEditDate) return ''
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
      renderCell: (params) => {
        if (params.row.id === me.user.id) {
          return (
            <>
              <Button
                variant="contained"
                size="small"
                startIcon={<CreateOutlinedIcon />}
              >Edit</Button>

              <Typography color="grey.500" sx={{ ml: 1 }} variant="body2">
                You can&apos;t archive or delete yourself.
              </Typography>
            </>
          )
        }

        if (params.row.archivedDate) {
          return (
            <>
              <RestoreButton
                params={ params }
                callback={ refreshUsers }
              />

              <DeleteButton
                params={ params }
                callback={ refreshUsers }
                sx={{ ml: 1 }}
              />
            </>
          )
        }

        if (!params.row.archivedDate) {
          return (
            <>
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
            </>
          )
        }
      },
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

        <Box mt={ 2 }>
          <CreateUserForm submitCallback={ refreshUsers } />
        </Box>

        <Box mt={ 4 }>
          <Button
            onClick={ () => setDisableAutomaticRefresh(!disableAutomaticRefresh) }
            variant="outlined"
          >
            { disableAutomaticRefresh ? 'Enable' : 'Disable' } automatic refresh
          </Button>
        </Box>

        <Box pt={ 2 }>
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

        <Box mt={ 4 }>
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
