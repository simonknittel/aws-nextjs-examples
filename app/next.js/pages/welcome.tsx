import { Typography } from '@mui/material'
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import { withCSRFToken } from '../modules/csrf'

export const getServerSideProps: GetServerSideProps = withCSRFToken(async () => {
  const props: { [key: string]: any } = {}

  return { props }
})

const Welcome: NextPage = ({}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>aws-service</title>
      </Head>

      <main>
        <Typography variant="h4" component="h1">
          Welcome
        </Typography>

        {/* @TODO: Implement */}
      </main>
    </>
  )
}

export default Welcome
