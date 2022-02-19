import { Typography } from "@mui/material";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import React from "react";
import { withCSRFToken } from "../modules/csrf";
import { withAuthentication } from "../utils/withAuthentication";

export const getServerSideProps: GetServerSideProps = withAuthentication(
  withCSRFToken(async () => {
    const props: { [key: string]: any } = {};

    return { props };
  }),
  { redirect: "/" }
);

const Welcome: NextPage = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  return (
    <>
      <Head>
        <title>Welcome - app-runner-oauth2-proxy-dynamodb</title>
      </Head>

      <main>
        <Typography variant="h4" component="h1">
          Welcome
        </Typography>

        {/* @TODO: Implement */}
      </main>
    </>
  );
};

export default Welcome;
