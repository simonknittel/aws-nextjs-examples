import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>aws-service</title>
      </Head>

      <main>
        <Typography variant="h4" component="h1">
          Home
        </Typography>
      </main>
    </>
  )
}

export default Home
