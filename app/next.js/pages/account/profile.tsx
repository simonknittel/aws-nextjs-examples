import { SendOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, TextField, Typography } from "@mui/material";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import React, {
  ReactEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { withCSRFToken } from "../../modules/csrf";
import { withAuthentication } from "../../utils/withAuthentication";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useUserRead, useUserUpdate } from "../../modules/user/client";

export const getServerSideProps: GetServerSideProps = withAuthentication(
  withCSRFToken(async () => {
    return {
      props: {},
    };
  }),
  { redirect: "/account/profile" }
);

const Profile: NextPage = ({
  me,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [name, setName] = useState(me.user.name);
  const [dataRead, isLoadingRead, doRead] = useUserRead(me.user.id);
  const [isLoadingUpdate, doUpdate] = useUserUpdate(me.user.id, { name });

  const onReset: ReactEventHandler = useCallback(
    async (e) => {
      e.preventDefault();
      await doRead();
    },
    [doRead]
  );

  const onSubmit: ReactEventHandler = useCallback(
    async (e) => {
      e.preventDefault();
      await doUpdate();
      await doRead();
    },
    [doRead, doUpdate]
  );

  // TODO: Check if there is a better way to update `name` after `doRead`
  useEffect(() => {
    if (!dataRead) return;
    setName(dataRead.name);
  }, [dataRead]);

  return (
    <>
      <Head>
        <title>Profile - nextjs-oauth2-proxy-aws-app-runner</title>
      </Head>

      <main>
        <Typography variant="h4" component="h1">
          Profile
        </Typography>

        <Box sx={{ mt: 2 }}>
          <form onSubmit={onSubmit} onReset={onReset}>
            <TextField
              label="Name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="filled"
            />

            <Box sx={{ mt: 2 }}>
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isLoadingUpdate || isLoadingRead}
                endIcon={<SendOutlined />}
              >
                Submit
              </LoadingButton>
              <LoadingButton
                variant="outlined"
                type="reset"
                loading={isLoadingUpdate || isLoadingRead}
                endIcon={<CancelOutlinedIcon />}
                sx={{ ml: 1 }}
              >
                Reset
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </main>
    </>
  );
};

export default Profile;
