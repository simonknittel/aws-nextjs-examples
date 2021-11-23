import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { userService } from '../services/user'
import React, { useCallback, useEffect } from 'react'
import CreateUserForm from '../components/CreateUserForm'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { Box, Button, Typography } from '@mui/material'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

export const getServerSideProps: GetServerSideProps = async () => {
  const allUsers = await userService.findAll()

  return {
    props: {
      allUsers
    }
  }
}

const Home: NextPage = ({ allUsers }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()

  const refreshPage = useCallback(() => {
    router.replace(router.asPath)
  }, [ router ])

  useEffect(() => {
    const interval = setInterval(() => {
      refreshPage()
    }, 30000)

    return () => clearInterval(interval)
  }, [ refreshPage ])

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
      renderCell: () => (<>
        <Button variant="contained" size="small" startIcon={<CreateOutlinedIcon />}>Edit</Button>
        <Button variant="outlined" size="small" startIcon={<DeleteOutlinedIcon />} sx={{ ml: 1 }}>Delete</Button>
      </>),
      flex: 1,
    }
  ]
  const dataGridRows: GridRowsProp = allUsers

  return (
    <>
      <Head>
        <title>aws-service</title>
      </Head>

      <main>
        <Typography variant="h4" component="h1">
          Users
        </Typography>

        <Box pt={ 2  }>
          <CreateUserForm submitCallback={ refreshPage } />
        </Box>

        <Box pt={ 4 }>
          <DataGrid
            columns={ dataGridColumns }
            rows={ dataGridRows }
            autoHeight
          />
        </Box>
      </main>
    </>
  )
}

export default Home
